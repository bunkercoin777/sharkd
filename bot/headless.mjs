// ── SharkD Headless Trading Agent v2 ──
// Battle-tested trading logic from 72+ Crubs trades.
// Graduated (PumpSwap via Jupiter) + Bonding Curve (PumpPortal).
// Narrative detection, holder analysis, momentum tracking, dynamic stale cuts.
// Trade log → trade-log.json for X posting. Skill log → skill-log.json.
// All state → Neon PostgreSQL for live terminal at sharkd.fun/terminal.

import { Connection, Keypair, PublicKey, VersionedTransaction } from '@solana/web3.js';
import bs58 from 'bs58';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB, logThought, logTrade as dbLogTrade, updateState, logSkill as dbLogSkill } from './db.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RPC = process.env.RPC_URL;
const conn = new Connection(RPC, 'confirmed');

// ── Wallet ──
const SECRET_B58 = process.env.WALLET_SECRET_B58;
const SECRET_B64 = process.env.WALLET_SECRET;
let wallet;
if (SECRET_B58) {
  wallet = Keypair.fromSecretKey(bs58.decode(SECRET_B58));
} else if (SECRET_B64) {
  const bytes = Buffer.from(SECRET_B64, 'base64');
  wallet = bytes.length === 64 ? Keypair.fromSecretKey(bytes) : Keypair.fromSecretKey(bs58.decode(SECRET_B64));
} else {
  throw new Error('No wallet secret (WALLET_SECRET_B58 or WALLET_SECRET)');
}
const WALLET = wallet.publicKey.toBase58();

// ══════════════════════════════════════════════════════════════
// PARAMETERS — tuned from 72+ Crubs mainnet trades
// ══════════════════════════════════════════════════════════════

// Graduated (PumpSwap) — proven params
const GRAD_TP = 15;            // take profit %
const GRAD_SL = -8;            // stop loss %
const GRAD_STALE_MIN = 3;     // min hold (dumping)
const GRAD_STALE_MAX = 10;    // max hold (recovering)
const GRAD_BASE_BUY = 0.02;   // start micro, scale with performance
const GRAD_MAX_BUY = 0.20;    // earned through win rate

// Bonding Curve — pump.fun pre-graduation
const BOND_TP = 25;            // higher TP — bonding tokens can 2-5x fast
const BOND_SL = -12;           // wider SL — more volatile
const BOND_STALE_MIN = 1;     // cut fast — bonding tokens die quick
const BOND_STALE_MAX = 4;
const BOND_BASE_BUY = 0.015;
const BOND_MAX_BUY = 0.10;
const BOND_MIN_BONDING_PCT = 60;  // only buy 60%+ bonded (close to graduation)
const BOND_MIN_REPLIES = 8;

const MAX_POSITIONS = 3;
const CYCLE_MS = 30_000;       // scan every 30s
const MIN_SCORE = 5;

// ══════════════════════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════════════════════

const positions = new Map();    // mint → position data
const exitedMints = new Set();  // never re-enter
const failedMints = new Set();  // skip broken tokens
const rugCreators = new Set();  // track rug creators
let wins = 0, losses = 0, totalPnl = 0, cycle = 0;

// ══════════════════════════════════════════════════════════════
// LOGGING
// ══════════════════════════════════════════════════════════════

function log(tag, msg, dbType = 'scan') {
  const t = new Date().toLocaleTimeString('en-AU', { timeZone: 'Australia/Sydney', hour12: true });
  console.log(`[${t}] [${tag}] ${msg}`);
  logThought(tag, msg, dbType).catch(() => {});
}

function saveTradeLog(trade) {
  const file = path.join(__dirname, 'trade-log.json');
  let data = { trades: [], lastTrade: null };
  try { data = JSON.parse(fs.readFileSync(file, 'utf8')); } catch {}
  data.trades.push(trade);
  data.lastTrade = Date.now();
  if (data.trades.length > 200) data.trades = data.trades.slice(-100);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  dbLogTrade(trade).catch(() => {});
}

function saveSkillLog(skill) {
  const file = path.join(__dirname, 'skill-log.json');
  let data = { skills: [] };
  try { data = JSON.parse(fs.readFileSync(file, 'utf8')); } catch {}
  data.skills.push({ ...skill, time: Date.now() });
  if (data.skills.length > 50) data.skills = data.skills.slice(-25);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  dbLogSkill(skill).catch(() => {});
}

// ══════════════════════════════════════════════════════════════
// SCANNING — multiple sort strategies for coverage
// ══════════════════════════════════════════════════════════════

async function fetchGraduated() {
  const results = [];
  const sorts = ['last_trade_timestamp', 'created_timestamp', 'market_cap'];
  const offsets = [0, 50, Math.floor(Math.random() * 150) + 100];
  for (const sort of sorts) {
    for (const offset of offsets) {
      try {
        const r = await fetch(`https://frontend-api-v3.pump.fun/coins?offset=${offset}&limit=50&sort=${sort}&order=DESC&includeNsfw=false&complete=true`);
        if (r.ok) results.push(...(await r.json()).map(t => ({ ...t, _type: 'graduated' })));
      } catch {}
    }
  }
  const seen = new Set();
  return results.filter(t => { if (!t.mint || seen.has(t.mint)) return false; seen.add(t.mint); return true; });
}

async function fetchBonding() {
  const results = [];
  for (const sort of ['bump_order', 'last_trade_timestamp', 'created_timestamp']) {
    for (const offset of [0, 50]) {
      try {
        const r = await fetch(`https://frontend-api-v3.pump.fun/coins?offset=${offset}&limit=50&sort=${sort}&order=DESC&includeNsfw=false&complete=false`);
        if (r.ok) results.push(...(await r.json()).map(t => ({ ...t, _type: 'bonding' })));
      } catch {}
    }
  }
  const seen = new Set();
  return results.filter(t => { if (!t.mint || seen.has(t.mint)) return false; seen.add(t.mint); return true; });
}

// ══════════════════════════════════════════════════════════════
// NARRATIVE DETECTION — find trending metas across token names
// ══════════════════════════════════════════════════════════════

const STOP_WORDS = new Set(['the','of','a','to','in','is','and','for','on','it','ai','sol','token','coin','inu','doge','pepe','pump','fun','meme','moon','rocket','diamond','hands','based','chad','gm','wagmi','lol','wtf','bruh','my','we','no','do','go','so','up','be','by','at','if']);

function detectNarratives(tokens) {
  const wordCount = {};
  const wordTokens = {};
  for (const t of tokens) {
    const text = `${t.name || ''} ${t.symbol || ''}`.toLowerCase();
    const words = text.split(/[^a-z0-9]+/).filter(w => w.length >= 3 && !STOP_WORDS.has(w));
    const seen = new Set();
    for (const w of words) {
      if (seen.has(w)) continue;
      seen.add(w);
      wordCount[w] = (wordCount[w] || 0) + 1;
      if (!wordTokens[w]) wordTokens[w] = [];
      wordTokens[w].push(t.symbol || t.name);
    }
  }
  return Object.entries(wordCount)
    .filter(([, c]) => c >= 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([keyword, count]) => ({ keyword, count, tokens: wordTokens[keyword].slice(0, 5) }));
}

function getMetaBoost(token, narratives) {
  if (!narratives.length) return { boost: 0, reason: null };
  const text = `${token.name || ''} ${token.symbol || ''}`.toLowerCase();
  for (const n of narratives) {
    if (text.includes(n.keyword)) {
      const boost = n.count >= 8 ? 4 : n.count >= 5 ? 3 : n.count >= 4 ? 2 : 1;
      return { boost, reason: `matches "${n.keyword}" meta (${n.count} tokens)` };
    }
  }
  return { boost: 0, reason: null };
}

// ══════════════════════════════════════════════════════════════
// SCORING — battle-tested from Crubs 72+ trades
// ══════════════════════════════════════════════════════════════

function scoreToken(token, narratives) {
  const replies = token.reply_count || 0;
  const hasTelegram = !!token.telegram;
  const mcap = token.usd_market_cap || 0;
  const lastTradeAgo = (Date.now() - (token.last_trade_timestamp || 0)) / 60000;
  const ageHours = (Date.now() - (token.created_timestamp || 0)) / 3600000;
  const isBonding = token._type === 'bonding';

  let score = 0;
  let reasons = [];
  let risks = [];

  // Hard filters
  if (hasTelegram) return { score: -1, reasons: ['has telegram — coordinated dump risk'] };
  if (token.creator && rugCreators.has(token.creator)) return { score: -1, reasons: ['known rugger creator'] };
  if (lastTradeAgo > 30) return { score: -1, reasons: [`dead — no trades in ${lastTradeAgo.toFixed(0)}min`] };
  if (mcap < 1000) return { score: -1, reasons: ['mcap too low'] };

  if (isBonding) {
    // ── BONDING CURVE SCORING ──
    const bondingPct = (token.real_sol_reserves || 0) / 1e9 / 85 * 100;
    if (bondingPct < BOND_MIN_BONDING_PCT) return { score: -1, reasons: [`${bondingPct.toFixed(0)}% bonded (need ${BOND_MIN_BONDING_PCT}%+)`] };
    if (replies < BOND_MIN_REPLIES) return { score: -1, reasons: [`${replies} replies (need ${BOND_MIN_REPLIES}+)`] };

    if (bondingPct >= 85) { score += 5; reasons.push(`${bondingPct.toFixed(0)}% — about to graduate`); }
    else if (bondingPct >= 75) { score += 3; reasons.push(`${bondingPct.toFixed(0)}% — approaching graduation`); }
    else { score += 1; reasons.push(`${bondingPct.toFixed(0)}% bonded`); }

    if (lastTradeAgo < 2) { score += 3; reasons.push('actively trading'); }
    else if (lastTradeAgo < 5) { score += 1; reasons.push('recent activity'); }

    if (replies >= 30) { score += 2; reasons.push(`${replies} replies — strong`); }
    else if (replies >= 15) { score += 1; reasons.push(`${replies} replies`); }

    if (ageHours < 0.5) { score += 2; reasons.push(`${(ageHours * 60).toFixed(0)}min old — fresh`); }
    else if (ageHours < 2) { score += 1; }
    else if (ageHours > 6) { score -= 1; risks.push('old, still not graduated'); }

    reasons.unshift('[BONDING]');
  } else {
    // ── GRADUATED (PumpSwap) SCORING ──
    if (ageHours < 1) { score += 4; reasons.push(`freshly graduated: ${(ageHours * 60).toFixed(0)}min`); }
    else if (ageHours < 3) { score += 2; reasons.push(`recently graduated: ${ageHours.toFixed(1)}h`); }

    if (lastTradeAgo < 2) { score += 3; reasons.push('actively trading now'); }
    else if (lastTradeAgo < 10) { score += 1; reasons.push('recent activity'); }

    if (mcap >= 5000 && mcap <= 100000) { score += 3; reasons.push(`sweet spot mcap: $${(mcap / 1000).toFixed(1)}K`); }
    else if (mcap > 100000 && mcap <= 500000) { score += 2; reasons.push(`mid mcap: $${(mcap / 1000).toFixed(0)}K`); }
    else if (mcap > 1000000) { score += 1; reasons.push(`large mcap: $${(mcap / 1000000).toFixed(2)}M`); }

    if (replies >= 15) { score += 1; reasons.push(`${replies} replies`); }
    if (replies >= 50) { score += 1; reasons.push('high engagement'); }

    reasons.unshift('[GRADUATED]');
  }

  // Narrative / meta boost
  const meta = getMetaBoost(token, narratives);
  if (meta.boost > 0) { score += meta.boost; reasons.push(meta.reason); }

  return { score, reasons, risks, mcap, replies, ageHours, lastTradeAgo, isBonding, bondingPct: isBonding ? (token.real_sol_reserves || 0) / 1e9 / 85 * 100 : 0, meta: meta.reason };
}

// ══════════════════════════════════════════════════════════════
// HOLDER ANALYSIS — reject whale-concentrated tokens
// ══════════════════════════════════════════════════════════════

async function analyzeHolders(mint, symbol) {
  try {
    const resp = await conn.getTokenLargestAccounts(new PublicKey(mint));
    const holders = resp.value || [];
    if (!holders.length) return { score: 0, reasons: [], risks: [], safe: true };

    const total = holders.reduce((s, h) => s + Number(h.uiAmount || 0), 0);
    if (total === 0) return { score: 0, reasons: [], risks: [], safe: true };

    const top1Pct = (Number(holders[0]?.uiAmount || 0) / total) * 100;
    const top5Pct = holders.slice(0, 5).reduce((s, h) => s + Number(h.uiAmount || 0), 0) / total * 100;
    const meaningfulHolders = holders.filter(h => Number(h.uiAmount || 0) > 0).length;

    let score = 0;
    const reasons = [];
    const risks = [];

    if (top1Pct > 30) { score -= 3; risks.push(`top holder ${top1Pct.toFixed(0)}%`); }
    else if (top1Pct > 15) { score -= 1; risks.push(`top holder ${top1Pct.toFixed(0)}%`); }
    else { score += 2; reasons.push(`top holder only ${top1Pct.toFixed(0)}%`); }

    if (top5Pct > 60) { score -= 2; risks.push(`top 5 hold ${top5Pct.toFixed(0)}%`); }
    else if (top5Pct < 40) { score += 1; reasons.push(`healthy distribution`); }

    if (meaningfulHolders >= 15) { score += 2; reasons.push(`${meaningfulHolders} holders`); }
    else if (meaningfulHolders >= 8) { score += 1; }
    else { score -= 1; risks.push(`only ${meaningfulHolders} holders`); }

    const safe = top1Pct < 50 && top5Pct < 70;
    log('HOLDER', `$${symbol}: ${meaningfulHolders} holders | top1: ${top1Pct.toFixed(1)}% | top5: ${top5Pct.toFixed(1)}% | ${safe ? 'OK' : 'RISKY'}`);
    return { score, reasons, risks, safe, top1Pct, top5Pct, holderCount: meaningfulHolders };
  } catch {
    return { score: 0, reasons: [], risks: [], safe: true };
  }
}

// ══════════════════════════════════════════════════════════════
// POSITION SIZING — scales with win rate (proven in Crubs)
// ══════════════════════════════════════════════════════════════

function getBuyAmount(isBonding) {
  const base = isBonding ? BOND_BASE_BUY : GRAD_BASE_BUY;
  const max = isBonding ? BOND_MAX_BUY : GRAD_MAX_BUY;
  const total = wins + losses;
  if (total < 5) return base;
  const wr = wins / total;
  const range = max - base;
  if (wr >= 0.7 && total >= 20) return max;
  if (wr >= 0.6 && total >= 15) return Math.round((base + range * 0.7) * 100) / 100;
  if (wr >= 0.5 && total >= 10) return Math.round((base + range * 0.4) * 100) / 100;
  if (wr >= 0.4 && total >= 5) return Math.round((base + range * 0.15) * 100) / 100;
  return base;
}

// ══════════════════════════════════════════════════════════════
// EXECUTION — PumpPortal (bonding) + Jupiter (graduated)
// ══════════════════════════════════════════════════════════════

async function confirmTx(sig, timeout = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const { value } = await conn.getSignatureStatus(sig);
      if (value?.confirmationStatus === 'confirmed' || value?.confirmationStatus === 'finalized') return !value.err;
      if (value?.err) return false;
    } catch {}
    await sleep(2000);
  }
  return false;
}

async function buyViaPumpPortal(mint, solAmount) {
  const res = await fetch('https://pumpportal.fun/api/trade-local', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicKey: WALLET, action: 'buy', mint, amount: solAmount, denominatedInSol: 'true', slippage: 25, priorityFee: 0.0005, pool: 'pump' }),
  });
  if (!res.ok) throw new Error(`PumpPortal buy ${res.status}: ${await res.text()}`);
  const tx = VersionedTransaction.deserialize(new Uint8Array(await res.arrayBuffer()));
  tx.sign([wallet]);
  return conn.sendRawTransaction(tx.serialize(), { skipPreflight: true, maxRetries: 3 });
}

async function buyViaJupiter(mint, solAmount) {
  const lamports = Math.floor(solAmount * 1e9);
  const SOL = 'So11111111111111111111111111111111111111112';
  const qr = await fetch(`https://lite-api.jup.ag/swap/v1/quote?inputMint=${SOL}&outputMint=${mint}&amount=${lamports}&slippageBps=500`);
  if (!qr.ok) throw new Error('Jupiter quote fail');
  const quote = await qr.json();
  const sr = await fetch('https://lite-api.jup.ag/swap/v1/swap', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quoteResponse: quote, userPublicKey: WALLET, wrapAndUnwrapSol: true, dynamicComputeUnitLimit: true, prioritizationFeeLamports: 'auto' }),
  });
  if (!sr.ok) throw new Error('Jupiter swap fail');
  const { swapTransaction } = await sr.json();
  const tx = VersionedTransaction.deserialize(Buffer.from(swapTransaction, 'base64'));
  tx.sign([wallet]);
  return conn.sendRawTransaction(tx.serialize(), { skipPreflight: true, maxRetries: 3 });
}

async function sellViaJupiter(mint, baseAmount, slippageBps = 1500) {
  const SOL = 'So11111111111111111111111111111111111111112';
  const qr = await fetch(`https://lite-api.jup.ag/swap/v1/quote?inputMint=${mint}&outputMint=${SOL}&amount=${baseAmount}&slippageBps=${slippageBps}`);
  if (!qr.ok) throw new Error('Jupiter sell quote fail');
  const quote = await qr.json();
  const sr = await fetch('https://lite-api.jup.ag/swap/v1/swap', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quoteResponse: quote, userPublicKey: WALLET, wrapAndUnwrapSol: true, dynamicComputeUnitLimit: true, prioritizationFeeLamports: 200000 }),
  });
  if (!sr.ok) throw new Error('Jupiter sell swap fail');
  const { swapTransaction } = await sr.json();
  const tx = VersionedTransaction.deserialize(Buffer.from(swapTransaction, 'base64'));
  tx.sign([wallet]);
  const sig = await conn.sendRawTransaction(tx.serialize(), { skipPreflight: true, maxRetries: 5 });
  // Spam re-send for faster landing
  for (let r = 0; r < 3; r++) { conn.sendRawTransaction(tx.serialize(), { skipPreflight: true }).catch(() => {}); await sleep(500); }
  return sig;
}

async function sellViaPumpPortal(mint, uiAmount) {
  const res = await fetch('https://pumpportal.fun/api/trade-local', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicKey: WALLET, action: 'sell', mint, amount: uiAmount, denominatedInSol: 'false', slippage: 25, priorityFee: 0.0005, pool: 'pump' }),
  });
  if (!res.ok) throw new Error(`PumpPortal sell ${res.status}`);
  const tx = VersionedTransaction.deserialize(new Uint8Array(await res.arrayBuffer()));
  tx.sign([wallet]);
  return conn.sendRawTransaction(tx.serialize(), { skipPreflight: true, maxRetries: 3 });
}

async function getBalance() { return (await conn.getBalance(wallet.publicKey)) / 1e9; }

async function getTokenBalance(mint) {
  try {
    const resp = await conn.getParsedTokenAccountsByOwner(wallet.publicKey, { mint: new PublicKey(mint) });
    if (!resp.value.length) return { base: 0n, ui: 0 };
    const info = resp.value[0].account.data.parsed.info;
    return { base: BigInt(info.tokenAmount.amount), ui: Number(info.tokenAmount.uiAmountString) };
  } catch { return { base: 0n, ui: 0 }; }
}

// ══════════════════════════════════════════════════════════════
// BUY EXECUTION
// ══════════════════════════════════════════════════════════════

async function executeBuy(token) {
  const mint = token.mint;
  const symbol = token.symbol || '???';
  const isBonding = token._type === 'bonding';
  const amount = getBuyAmount(isBonding);
  const label = isBonding ? 'BONDING' : 'PUMPSWAP';

  const balance = await getBalance();
  if (balance < amount + 0.02) {
    log('BUY', `Insufficient balance: ${balance.toFixed(3)} SOL (need ${(amount + 0.02).toFixed(3)})`);
    return false;
  }

  log('BUY', `$${symbol} [${label}] — ${amount} SOL | score ${token._score?.score || '?'}/10`);

  try {
    let sig;
    if (isBonding) {
      sig = await buyViaPumpPortal(mint, amount);
    } else {
      try { sig = await buyViaJupiter(mint, amount); }
      catch { sig = await buyViaPumpPortal(mint, amount); }  // fallback
    }
    log('BUY', `TX sent: ${sig}`);

    const confirmed = await confirmTx(sig);
    if (!confirmed) { failedMints.add(mint); throw new Error('TX not confirmed'); }

    await sleep(3000);
    const { base, ui } = await getTokenBalance(mint);

    positions.set(mint, {
      symbol, name: token.name || symbol, buySol: amount, buyTime: Date.now(),
      tokens: base.toString(), uiTokens: ui, isBonding, priceHistory: [],
      creator: token.creator || null, meta: token._score?.meta || null,
    });

    const trade = { type: 'buy', token: symbol, mint, amount, score: token._score?.score, meta: token._score?.meta, time: Date.now(), tx: sig };
    saveTradeLog(trade);
    log('BOUGHT', `$${symbol} for ${amount} SOL | tokens: ${ui} | TX: ${sig.slice(0, 16)}...`);
    return true;
  } catch (e) {
    log('BUY', `FAILED $${symbol}: ${e.message}`);
    failedMints.add(mint);
    return false;
  }
}

// ══════════════════════════════════════════════════════════════
// SELL EXECUTION — aggressive retry with escalating slippage
// ══════════════════════════════════════════════════════════════

async function executeSell(mint, reason) {
  const pos = positions.get(mint);
  if (!pos) return;

  const { base } = await getTokenBalance(mint);
  if (base === 0n) { positions.delete(mint); exitedMints.add(mint); return; }

  let confirmed = false;
  let sig;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { base: freshBal } = await getTokenBalance(mint);
      if (freshBal === 0n) { confirmed = true; break; }

      if (pos.isBonding) {
        sig = await sellViaPumpPortal(mint, pos.uiTokens || Number(freshBal));
      } else {
        const slippage = 1000 + attempt * 500;  // 1500, 2000, 2500
        sig = await sellViaJupiter(mint, freshBal.toString(), slippage);
      }

      log('SELL', `Attempt ${attempt} TX: ${sig}`);
      confirmed = await confirmTx(sig, 30000);
      if (confirmed) break;
    } catch (e) {
      log('SELL', `Attempt ${attempt} error: ${e.message}`);
      await sleep(2000);
    }
  }

  if (!confirmed) {
    log('SELL', `FAILED to sell $${pos.symbol} after 3 attempts`);
    return;
  }

  // Calculate PnL
  let currentSol = 0;
  try {
    const SOL = 'So11111111111111111111111111111111111111112';
    const qr = await fetch(`https://lite-api.jup.ag/swap/v1/quote?inputMint=${mint}&outputMint=${SOL}&amount=${base.toString()}&slippageBps=1500`);
    if (qr.ok) currentSol = Number((await qr.json()).outAmount) / 1e9;
  } catch {}

  const pnlSol = currentSol - pos.buySol;
  const pnlPct = ((currentSol - pos.buySol) / pos.buySol) * 100;
  if (pnlSol >= 0) wins++; else losses++;
  totalPnl += pnlSol;

  // Track rug creators
  if (pnlSol < -0.01 && pos.creator) rugCreators.add(pos.creator);

  positions.delete(mint);
  exitedMints.add(mint);

  const bal = await getBalance();
  const emoji = pnlSol >= 0 ? 'WIN' : 'LOSS';
  log(emoji, `$${pos.symbol} | ${reason} | ${pnlSol >= 0 ? '+' : ''}${pnlSol.toFixed(4)} SOL (${pnlPct >= 0 ? '+' : ''}${pnlPct.toFixed(1)}%) | Balance: ${bal.toFixed(3)} SOL | ${wins}W/${losses}L`);

  const trade = { type: 'sell', token: pos.symbol, mint, pnl: pnlSol, pnlPct, reason, result: pnlSol >= 0 ? 'win' : 'loss', balance: bal, time: Date.now(), tx: sig };
  saveTradeLog(trade);

  // Skill learning
  const holdMin = (Date.now() - pos.buyTime) / 60000;
  const learning = { token: pos.symbol, pnl: pnlSol, pnlPct, holdMin, reason, meta: pos.meta, score: pos._score };
  state_learnings.push(learning);
}

const state_learnings = [];

// ══════════════════════════════════════════════════════════════
// POSITION MONITORING — momentum tracking + dynamic exits
// ══════════════════════════════════════════════════════════════

async function checkPositions() {
  for (const [mint, pos] of positions) {
    try {
      const { base, ui } = await getTokenBalance(mint);
      if (base === 0n) { positions.delete(mint); exitedMints.add(mint); continue; }
      pos.tokens = base.toString();
      pos.uiTokens = ui;

      // Price via Jupiter
      let currentSol;
      try {
        const SOL = 'So11111111111111111111111111111111111111112';
        const qr = await fetch(`https://lite-api.jup.ag/swap/v1/quote?inputMint=${mint}&outputMint=${SOL}&amount=${base.toString()}&slippageBps=1500`);
        if (!qr.ok) { log('HOLD', `Can't price $${pos.symbol} — skip`); continue; }
        currentSol = Number((await qr.json()).outAmount) / 1e9;
      } catch { continue; }

      const pnlPct = ((currentSol - pos.buySol) / pos.buySol) * 100;
      const holdMin = (Date.now() - pos.buyTime) / 60000;
      const TP = pos.isBonding ? BOND_TP : GRAD_TP;
      const SL = pos.isBonding ? BOND_SL : GRAD_SL;
      const STALE_MIN = pos.isBonding ? BOND_STALE_MIN : GRAD_STALE_MIN;
      const STALE_MAX = pos.isBonding ? BOND_STALE_MAX : GRAD_STALE_MAX;
      const label = pos.isBonding ? 'BOND' : 'GRAD';

      // Momentum tracking
      pos.priceHistory.push({ time: Date.now(), pnlPct, sol: currentSol });
      if (pos.priceHistory.length > 30) pos.priceHistory = pos.priceHistory.slice(-30);
      const recent = pos.priceHistory.slice(-5);
      const momentum = recent.length >= 2 ? recent[recent.length - 1].pnlPct - recent[0].pnlPct : 0;
      const isRecovering = momentum > 2;
      const isDumping = momentum < -5;
      const isFlat = Math.abs(momentum) < 1;

      // Dynamic stale timeout
      let staleMin = STALE_MAX;
      if (isDumping) staleMin = STALE_MIN;
      else if (isFlat && pnlPct < 0) staleMin = (STALE_MIN + STALE_MAX) / 2;
      else if (isRecovering) staleMin = STALE_MAX;

      const momLabel = isRecovering ? 'recovering' : isDumping ? 'dumping' : isFlat ? 'flat' : 'moving';

      if (pnlPct >= TP) {
        log('TP', `$${pos.symbol} [${label}] +${pnlPct.toFixed(1)}% (${currentSol.toFixed(4)} SOL)`);
        await executeSell(mint, 'take profit');
      } else if (pnlPct <= SL) {
        if (isRecovering && pnlPct > SL * 1.5) {
          log('HOLD', `$${pos.symbol} [${label}] ${pnlPct.toFixed(1)}% but recovering — patience`);
        } else {
          log('SL', `$${pos.symbol} [${label}] ${pnlPct.toFixed(1)}%`);
          await executeSell(mint, 'stop loss');
        }
      } else if (holdMin > staleMin && pnlPct < 10) {
        log('STALE', `$${pos.symbol} [${label}] ${pnlPct.toFixed(1)}% after ${holdMin.toFixed(0)}min (${momLabel})`);
        await executeSell(mint, `stale cut — ${momLabel}`);
      } else {
        const patience = staleMin - holdMin;
        log('HOLD', `$${pos.symbol} [${label}] ${pnlPct >= 0 ? '+' : ''}${pnlPct.toFixed(1)}% | ${holdMin.toFixed(0)}min | ${momLabel} | ${patience.toFixed(0)}min left`);
      }
    } catch (e) {
      log('ERROR', `Position check ${pos.symbol}: ${e.message}`);
    }
  }
}

// ══════════════════════════════════════════════════════════════
// SCAN & TRADE — the main intelligence loop
// ══════════════════════════════════════════════════════════════

async function scanAndTrade() {
  if (positions.size >= MAX_POSITIONS) {
    log('SCAN', `Max positions (${MAX_POSITIONS}). Monitoring only.`);
    return;
  }

  const [graduated, bonding] = await Promise.all([fetchGraduated(), fetchBonding()]);
  const allTokens = [...graduated, ...bonding];
  log('SCAN', `${allTokens.length} tokens found (${graduated.length} graduated, ${bonding.length} bonding)`);

  if (!allTokens.length) return;

  const narratives = detectNarratives(allTokens);
  if (narratives.length) {
    log('META', narratives.slice(0, 3).map(n => `"${n.keyword}" (${n.count})`).join(', '));
  }

  // Score all
  const scored = allTokens
    .filter(t => !exitedMints.has(t.mint) && !failedMints.has(t.mint) && !positions.has(t.mint))
    .map(t => { const s = scoreToken(t, narratives); t._score = s; return t; })
    .filter(t => t._score.score >= MIN_SCORE)
    .sort((a, b) => b._score.score - a._score.score);

  log('SCORE', `${scored.length} candidates above score ${MIN_SCORE}`);

  // Try top 5 with holder check
  for (const token of scored.slice(0, 5)) {
    const holders = await analyzeHolders(token.mint, token.symbol || '???');
    if (!holders.safe) {
      log('REJECT', `$${token.symbol} — holder concentration unsafe (top1: ${holders.top1Pct?.toFixed(0)}%)`);
      exitedMints.add(token.mint);
      continue;
    }

    // Adjust score with holder data
    token._score.score += holders.score;
    if (token._score.score < MIN_SCORE) continue;

    log('TARGET', `$${token.symbol} — score ${token._score.score} | ${token._score.reasons.join(' | ')}`);

    const bought = await executeBuy(token);
    if (bought) return; // one buy per cycle
  }
}

// ══════════════════════════════════════════════════════════════
// SKILL LEARNING — periodic analysis of trade patterns
// ══════════════════════════════════════════════════════════════

function analyzeAndLearn() {
  const total = wins + losses;
  if (total < 5) return;
  const wr = ((wins / total) * 100).toFixed(0);

  log('LEARN', `Analyzing ${total} trades — ${wr}% win rate`);

  // Meta trades vs non-meta
  const metaTrades = state_learnings.filter(l => l.meta);
  const noMeta = state_learnings.filter(l => !l.meta);
  if (metaTrades.length >= 3) {
    const metaWR = metaTrades.filter(l => l.pnl > 0).length / metaTrades.length;
    const noMetaWR = noMeta.length ? noMeta.filter(l => l.pnl > 0).length / noMeta.length : 0;
    if (metaWR > noMetaWR + 0.1) {
      log('SKILL', `Narrative detection: meta WR ${(metaWR * 100).toFixed(0)}% vs ${(noMetaWR * 100).toFixed(0)}%`);
      saveSkillLog({ name: 'Narrative Detection', metaWR: (metaWR * 100).toFixed(0), noMetaWR: (noMetaWR * 100).toFixed(0), trades: total });
    }
  }

  // Rug-free check
  const bigLosses = state_learnings.filter(l => l.pnlPct < -15);
  if (total >= 10 && bigLosses.length === 0) {
    log('SKILL', `Holder analysis keeping us rug-free across ${total} trades`);
  }

  log('LEARN', `Total PnL: ${totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(4)} SOL`);
}

// ══════════════════════════════════════════════════════════════
// MAIN LOOP
// ══════════════════════════════════════════════════════════════

async function syncState(bal) {
  const holdingsArr = [...positions.entries()].map(([mint, p]) => ({
    mint, symbol: p.symbol, buySol: p.buySol, buyTime: p.buyTime, isBonding: p.isBonding, meta: p.meta,
  }));
  const total = wins + losses;
  await updateState('agent', {
    status: 'online',
    balance: bal,
    wins, losses, totalPnl,
    winRate: total > 0 ? Math.round((wins / total) * 100) : 0,
    holdings: holdingsArr,
    cycle,
    exitedCount: exitedMints.size,
    riskMode: 'balanced',
    gradBuy: getBuyAmount(false),
    bondBuy: getBuyAmount(true),
    uptime: Date.now() - startTime,
    lastUpdate: Date.now(),
  });
}

const startTime = Date.now();

async function main() {
  console.log('=== SharkD Headless Trading Agent v2 ===');
  console.log(`Wallet: ${WALLET}`);

  await initDB();
  console.log('[DB] Connected to Neon PostgreSQL');

  const bal = await getBalance();
  console.log(`Balance: ${bal.toFixed(4)} SOL`);
  console.log(`Params: GRAD TP=${GRAD_TP}% SL=${GRAD_SL}% | BOND TP=${BOND_TP}% SL=${BOND_SL}%`);
  console.log(`Max positions: ${MAX_POSITIONS} | Cycle: ${CYCLE_MS / 1000}s`);
  console.log(`Buy sizes: GRAD ${GRAD_BASE_BUY}-${GRAD_MAX_BUY} SOL | BOND ${BOND_BASE_BUY}-${BOND_MAX_BUY} SOL`);
  console.log('');

  log('BOOT', `Agent online. Balance: ${bal.toFixed(4)} SOL. Scanning ${CYCLE_MS/1000}s cycles.`, 'system');

  if (bal < 0.05) {
    console.log('WARNING: Balance very low. Fund wallet before trading.');
  }

  while (true) {
    cycle++;
    try {
      await checkPositions();
      await scanAndTrade();

      // Learn every 10 trades
      if ((wins + losses) > 0 && (wins + losses) % 10 === 0) analyzeAndLearn();

      // Sync state to DB for live terminal
      const bal = await getBalance();
      await syncState(bal);
    } catch (e) {
      log('ERROR', `Cycle ${cycle}: ${e.message}`, 'error');
    }
    await sleep(CYCLE_MS);
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

process.on('uncaughtException', e => log('FATAL', e.message));
process.on('unhandledRejection', e => log('REJECT', e?.message || String(e)));

main().catch(e => { log('MAIN', e.message); process.exit(1); });
