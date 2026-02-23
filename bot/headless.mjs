// ── SharkD Headless Trading Agent ──
// Runs without Telegram. Scans, trades, learns, logs everything.
// Trade results written to trade-log.json for X posting.
// Skill learnings written to skill-log.json for marketplace updates.

import { initWallet, getBalance, getWalletAddress } from './wallet.mjs';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RPC = process.env.RPC_URL;
const conn = new Connection(RPC);

// ── State ──
const state = {
  mode: 'balanced', // cautious, balanced, degen
  running: true,
  cycle: 0,
  trades: [],
  wins: 0,
  losses: 0,
  totalPnl: 0,
  holdings: [],
  skills: [],
  learnings: [],
};

// Risk profiles
const RISK = {
  cautious: { minScore: 6, minSize: 0.03, maxSize: 0.10, tp: 0.10, sl: -0.05 },
  balanced: { minScore: 5, minSize: 0.05, maxSize: 0.25, tp: 0.15, sl: -0.08 },
  degen:    { minScore: 4, minSize: 0.08, maxSize: 0.50, tp: 0.20, sl: -0.12 },
};

// ── Logging ──
function log(tag, msg, color = '') {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] [${tag}] ${msg}`);
}

function saveTradeLog(trade) {
  const file = path.join(__dirname, 'trade-log.json');
  let data = { trades: [], lastTrade: null, lastPost: null };
  try { data = JSON.parse(fs.readFileSync(file, 'utf8')); } catch {}
  data.trades.push(trade);
  data.lastTrade = Date.now();
  if (data.trades.length > 100) data.trades = data.trades.slice(-50);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function saveSkillLog(skill) {
  const file = path.join(__dirname, 'skill-log.json');
  fs.writeFileSync(file, JSON.stringify({ ...skill, posted: false }, null, 2));
}

// ── Pump.fun Scanner ──
async function scanTokens() {
  try {
    const res = await fetch('https://frontend-api-v3.pump.fun/coins?offset=0&limit=50&sort=created_timestamp&order=DESC&includeNsfw=false');
    if (!res.ok) return [];
    const tokens = await res.json();
    return tokens.filter(t => t && t.mint);
  } catch (e) {
    log('SCAN', `Error: ${e.message}`);
    return [];
  }
}

async function scanGraduated() {
  try {
    const res = await fetch('https://frontend-api-v3.pump.fun/coins?offset=0&limit=50&sort=created_timestamp&order=DESC&complete=true');
    if (!res.ok) return [];
    return (await res.json()).filter(t => t && t.mint);
  } catch { return []; }
}

// ── Scoring ──
function scoreToken(token, allTokens) {
  let score = 5; // base
  const name = (token.name || '').toLowerCase();
  const symbol = (token.symbol || '').toLowerCase();
  
  // Narrative detection — find keyword clusters
  const keywords = {};
  for (const t of allTokens) {
    const words = ((t.name || '') + ' ' + (t.symbol || '')).toLowerCase().split(/\s+/);
    for (const w of words) {
      if (w.length > 2) keywords[w] = (keywords[w] || 0) + 1;
    }
  }
  
  // Meta boost — if this token matches a trending keyword
  let metaMatch = null;
  for (const [word, count] of Object.entries(keywords)) {
    if (count >= 5 && (name.includes(word) || symbol.includes(word))) {
      score += 2;
      metaMatch = { word, count };
      break;
    }
  }
  
  // Age penalty — too old tokens less interesting
  const ageMinutes = (Date.now() - (token.created_timestamp || 0)) / 60000;
  if (ageMinutes > 30) score -= 1;
  if (ageMinutes > 120) score -= 2;
  if (ageMinutes < 5) score += 1; // fresh mint bonus
  
  // Market cap check
  const mcap = token.usd_market_cap || 0;
  if (mcap > 10000 && mcap < 500000) score += 1;
  if (mcap > 1000000) score -= 1;
  
  return { score: Math.max(0, Math.min(10, score)), metaMatch, ageMinutes: Math.round(ageMinutes) };
}

// ── Holder Analysis ──
async function checkHolders(mint) {
  try {
    const res = await fetch(`${RPC}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 1, method: 'getTokenLargestAccounts',
        params: [mint],
      }),
    });
    const data = await res.json();
    const accounts = data?.result?.value || [];
    if (accounts.length === 0) return { safe: true, top1Pct: 0 };
    
    const total = accounts.reduce((s, a) => s + Number(a.amount || 0), 0);
    if (total === 0) return { safe: true, top1Pct: 0 };
    
    const top1Pct = (Number(accounts[0].amount || 0) / total) * 100;
    const top5Pct = accounts.slice(0, 5).reduce((s, a) => s + Number(a.amount || 0), 0) / total * 100;
    
    // SKILL LEARNING: track rejection thresholds
    const safe = top1Pct < 50 && top5Pct < 70;
    
    return { safe, top1Pct: Math.round(top1Pct), top5Pct: Math.round(top5Pct) };
  } catch (e) {
    log('HOLDER', `Check failed: ${e.message}`);
    return { safe: true, top1Pct: 0 };
  }
}

// ── Trade Execution via PumpPortal ──
async function executeBuy(mint, solAmount) {
  try {
    const wallet = getWalletAddress();
    const secretB58 = process.env.WALLET_SECRET_B58;
    
    const res = await fetch('https://pumpportal.fun/api/trade-local', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        publicKey: wallet,
        action: 'buy',
        mint,
        amount: solAmount,
        denominatedInSol: 'true',
        slippage: 25,
        priorityFee: 0.0005,
      }),
    });
    
    if (!res.ok) {
      log('BUY', `PumpPortal error: ${res.status}`);
      return null;
    }
    
    // Get the transaction
    const data = await res.arrayBuffer();
    const txBuf = Buffer.from(data);
    
    // Sign and send
    const { Keypair, VersionedTransaction } = await import('@solana/web3.js');
    const bs58 = (await import('bs58')).default;
    const kp = Keypair.fromSecretKey(bs58.decode(secretB58));
    const tx = VersionedTransaction.deserialize(txBuf);
    tx.sign([kp]);
    
    const sig = await conn.sendRawTransaction(tx.serialize(), { skipPreflight: true, maxRetries: 3 });
    log('BUY', `TX sent: ${sig}`);
    
    // Confirm
    const confirmed = await confirmTx(sig);
    return confirmed ? sig : null;
  } catch (e) {
    log('BUY', `Failed: ${e.message}`);
    return null;
  }
}

async function executeSell(mint, tokenAmount) {
  try {
    const wallet = getWalletAddress();
    const secretB58 = process.env.WALLET_SECRET_B58;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      const slippage = 25 + (attempt - 1) * 15; // escalate: 25, 40, 55
      
      const res = await fetch('https://pumpportal.fun/api/trade-local', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey: wallet,
          action: 'sell',
          mint,
          amount: tokenAmount,
          denominatedInSol: 'false',
          slippage,
          priorityFee: 0.0005,
        }),
      });
      
      if (!res.ok) {
        log('SELL', `Attempt ${attempt} — PumpPortal error: ${res.status}`);
        continue;
      }
      
      const data = await res.arrayBuffer();
      const txBuf = Buffer.from(data);
      const { Keypair, VersionedTransaction } = await import('@solana/web3.js');
      const bs58 = (await import('bs58')).default;
      const kp = Keypair.fromSecretKey(bs58.decode(secretB58));
      const tx = VersionedTransaction.deserialize(txBuf);
      tx.sign([kp]);
      
      const sig = await conn.sendRawTransaction(tx.serialize(), { skipPreflight: true, maxRetries: 3 });
      log('SELL', `Attempt ${attempt} TX: ${sig}`);
      
      const confirmed = await confirmTx(sig);
      if (confirmed) return sig;
      
      log('SELL', `Attempt ${attempt} failed, retrying...`);
      await sleep(3000);
    }
    return null;
  } catch (e) {
    log('SELL', `Failed: ${e.message}`);
    return null;
  }
}

async function confirmTx(sig) {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await conn.getSignatureStatus(sig);
      const status = res?.value;
      if (status?.confirmationStatus === 'confirmed' || status?.confirmationStatus === 'finalized') return true;
      if (status?.err) return false;
    } catch {}
    await sleep(2000);
  }
  return false;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Position sizing based on win rate ──
function getPositionSize() {
  const risk = RISK[state.mode];
  const totalTrades = state.wins + state.losses;
  if (totalTrades < 3) return risk.minSize;
  
  const winRate = state.wins / totalTrades;
  const range = risk.maxSize - risk.minSize;
  const size = risk.minSize + range * Math.min(1, winRate);
  return Math.round(size * 100) / 100;
}

// ── Main trading cycle ──
async function tradingCycle() {
  state.cycle++;
  const risk = RISK[state.mode];
  
  const balance = await getBalance();
  log('CYCLE', `#${state.cycle} | ${balance.toFixed(3)} SOL | ${state.wins}W/${state.losses}L | Mode: ${state.mode}`);
  
  if (balance < 0.1) {
    log('CYCLE', 'Balance too low. Waiting.');
    return;
  }
  
  // Check holdings for TP/SL
  for (let i = state.holdings.length - 1; i >= 0; i--) {
    const h = state.holdings[i];
    try {
      // Get current price via pump.fun
      const res = await fetch(`https://frontend-api-v3.pump.fun/coins/${h.mint}`);
      if (!res.ok) continue;
      const data = await res.json();
      const currentMcap = data.usd_market_cap || 0;
      const pnlPct = h.entryMcap > 0 ? (currentMcap - h.entryMcap) / h.entryMcap : 0;
      const holdMin = (Date.now() - h.entryTime) / 60000;
      
      log('HOLD', `${data.symbol || h.mint.slice(0, 8)} | ${(pnlPct * 100).toFixed(1)}% | ${holdMin.toFixed(0)}m`);
      
      if (pnlPct >= risk.tp) {
        log('SELL', `TP hit! ${(pnlPct * 100).toFixed(1)}% on ${data.symbol}`);
        const sig = await executeSell(h.mint, h.tokenAmount);
        if (sig) {
          state.wins++;
          state.totalPnl += h.solAmount * pnlPct;
          const trade = { type: 'sell', token: data.symbol || h.mint.slice(0, 8), amount: h.solAmount, pnl: `+${(pnlPct * 100).toFixed(1)}%`, time: Date.now(), result: 'win' };
          state.trades.push(trade);
          saveTradeLog(trade);
          log('WIN', `+${(h.solAmount * pnlPct).toFixed(4)} SOL on ${data.symbol}`);
          
          // LEARNING: record what worked
          state.learnings.push({ type: 'tp_hit', token: data.symbol, pnl: pnlPct, holdMin, score: h.score, meta: h.meta });
        }
        state.holdings.splice(i, 1);
      } else if (pnlPct <= risk.sl) {
        log('SELL', `SL hit! ${(pnlPct * 100).toFixed(1)}% on ${data.symbol}`);
        const sig = await executeSell(h.mint, h.tokenAmount);
        if (sig) {
          state.losses++;
          state.totalPnl += h.solAmount * pnlPct;
          const trade = { type: 'sell', token: data.symbol || h.mint.slice(0, 8), amount: h.solAmount, pnl: `${(pnlPct * 100).toFixed(1)}%`, time: Date.now(), result: 'loss' };
          state.trades.push(trade);
          saveTradeLog(trade);
          log('LOSS', `${(h.solAmount * pnlPct).toFixed(4)} SOL on ${data.symbol}`);
          
          // LEARNING: record what failed
          state.learnings.push({ type: 'sl_hit', token: data.symbol, pnl: pnlPct, holdMin, score: h.score, meta: h.meta });
        }
        state.holdings.splice(i, 1);
      }
    } catch (e) {
      log('HOLD', `Check error: ${e.message}`);
    }
  }
  
  // Don't buy if we have 3+ positions
  if (state.holdings.length >= 3) {
    log('SCAN', 'Max positions held. Skipping scan.');
    return;
  }
  
  // Scan
  log('SCAN', 'Scanning bonding curve + graduated...');
  const [bonding, graduated] = await Promise.all([scanTokens(), scanGraduated()]);
  const allTokens = [...bonding, ...graduated];
  log('SCAN', `${allTokens.length} tokens found`);
  
  if (allTokens.length === 0) return;
  
  // Score and filter
  const scored = allTokens.map(t => {
    const s = scoreToken(t, allTokens);
    return { ...t, ...s };
  }).filter(t => t.score >= risk.minScore).sort((a, b) => b.score - a.score);
  
  log('SCORE', `${scored.length} tokens passed minimum score (${risk.minScore})`);
  
  // Try top candidates
  for (const token of scored.slice(0, 3)) {
    // Holder analysis
    const holders = await checkHolders(token.mint);
    if (!holders.safe) {
      log('REJECT', `${token.symbol} — top1 wallet ${holders.top1Pct}% (unsafe)`);
      continue;
    }
    
    // Skip if we already hold this
    if (state.holdings.find(h => h.mint === token.mint)) continue;
    
    const size = getPositionSize();
    if (size > balance * 0.3) continue; // never more than 30% of balance
    
    log('BUY', `${token.symbol} — score ${token.score}/10 | ${token.metaMatch ? `meta: "${token.metaMatch.word}" (${token.metaMatch.count})` : 'no meta'} | holders: top1=${holders.top1Pct}% | ${size} SOL`);
    
    const sig = await executeBuy(token.mint, size);
    if (sig) {
      // Get token balance after buy
      // For now estimate based on mcap
      state.holdings.push({
        mint: token.mint,
        symbol: token.symbol,
        solAmount: size,
        tokenAmount: 0, // will need to fetch
        entryMcap: token.usd_market_cap || 0,
        entryTime: Date.now(),
        score: token.score,
        meta: token.metaMatch?.word || null,
      });
      
      const trade = { type: 'buy', token: token.symbol, amount: size, score: token.score, meta: token.metaMatch?.word || null, time: Date.now() };
      state.trades.push(trade);
      saveTradeLog(trade);
      
      log('BOUGHT', `${token.symbol} for ${size} SOL | TX: ${sig.slice(0, 12)}...`);
      break; // one buy per cycle
    }
  }
  
  // SKILL LEARNING — after every 10 trades, analyze and learn
  const totalTrades = state.wins + state.losses;
  if (totalTrades > 0 && totalTrades % 10 === 0) {
    analyzeAndLearn();
  }
}

function analyzeAndLearn() {
  const total = state.wins + state.losses;
  const winRate = total > 0 ? (state.wins / total * 100).toFixed(0) : 0;
  
  log('LEARN', `Analyzing ${total} trades... Win rate: ${winRate}%`);
  
  // Check if meta trades perform better
  const metaTrades = state.learnings.filter(l => l.meta);
  const noMetaTrades = state.learnings.filter(l => !l.meta);
  const metaWinRate = metaTrades.length > 0 ? metaTrades.filter(l => l.type === 'tp_hit').length / metaTrades.length : 0;
  const noMetaWinRate = noMetaTrades.length > 0 ? noMetaTrades.filter(l => l.type === 'tp_hit').length / noMetaTrades.length : 0;
  
  if (metaTrades.length >= 3 && metaWinRate > noMetaWinRate + 0.1) {
    log('SKILL', `Narrative detection proving valuable! Meta win rate: ${(metaWinRate * 100).toFixed(0)}% vs ${(noMetaWinRate * 100).toFixed(0)}%`);
    saveSkillLog({
      name: 'Narrative Detection',
      reason: `Meta trades winning at ${(metaWinRate * 100).toFixed(0)}% vs ${(noMetaWinRate * 100).toFixed(0)}% for non-meta. Boosting score for tokens that match trending keywords.`,
      trades: total,
      winRate: `${winRate}%`,
      dateAdded: new Date().toISOString().split('T')[0],
    });
  }
  
  // Check holder analysis effectiveness  
  const rugCount = state.learnings.filter(l => l.pnl < -0.15).length;
  if (total >= 10 && rugCount === 0) {
    log('SKILL', 'Holder analysis keeping us rug-free');
  }
  
  log('LEARN', `Analysis complete. Total PnL: ${state.totalPnl.toFixed(4)} SOL`);
}

// ── Main ──
async function main() {
  console.log('=== SharkD Headless Trading Agent ===');
  
  const wallet = initWallet();
  console.log(`Wallet: ${wallet}`);
  
  const balance = await getBalance();
  console.log(`Balance: ${balance.toFixed(4)} SOL`);
  console.log(`Mode: ${state.mode}`);
  console.log(`Max positions: 3`);
  console.log('');
  
  const CYCLE_INTERVAL = 60000; // 1 minute between cycles
  
  // Trading loop
  while (state.running) {
    try {
      await tradingCycle();
    } catch (e) {
      log('ERROR', `Cycle failed: ${e.message}`);
    }
    await sleep(CYCLE_INTERVAL);
  }
}

process.on('uncaughtException', (e) => log('FATAL', e.message));
process.on('unhandledRejection', (e) => log('REJECT', e?.message || String(e)));

main().catch(e => { log('MAIN', e.message); process.exit(1); });
