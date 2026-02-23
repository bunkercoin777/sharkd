// ── Trading Brain — the decision engine ──
import { scanGraduated, scanBondingCurve, analyzeHolders, detectNarratives, scoreToken } from './scanner.mjs';
import { buyToken, sellToken, getTokenPrice } from './trading.mjs';
import { getBalance, getTokenBalance, getWalletAddress } from './wallet.mjs';

// ── Config (adjustable via chat) ──
let config = {
  mode: 'active',           // active | paused | manual
  riskLevel: 'balanced',    // cautious | balanced | degen
  maxPositions: 1,
  // Graduated params
  gradTP: 15, gradSL: -8, gradStaleMin: 3, gradStaleMax: 10,
  gradMinBuy: 0.10, gradMaxBuy: 0.50,
  // Bonding params
  bondTP: 25, bondSL: -12, bondStaleMin: 1, bondStaleMax: 4,
  bondMinBuy: 0.05, bondMaxBuy: 0.20,
  bondMinProgress: 60, bondMinReplies: 8,
  // Scan
  scanIntervalMs: 30000,
  minScore: 5
};

// ── State ──
let positions = new Map();     // mint → { symbol, name, buySol, buyTime, tokens, isBonding, priceHistory, ... }
let exitedMints = new Set();   // never re-enter
let wins = 0, losses = 0;
let totalPnl = 0;
let lastScan = 0;
let paused = false;
let notify = null;  // function(msg) — set by bot.mjs

export function setNotify(fn) { notify = fn; }
export function getConfig() { return { ...config }; }
export function getState() {
  return {
    mode: config.mode,
    risk: config.riskLevel,
    positions: [...positions.entries()].map(([mint, p]) => ({
      mint, symbol: p.symbol, name: p.name,
      buySol: p.buySol, buyTime: p.buyTime,
      isBonding: p.isBonding
    })),
    wins, losses, totalPnl,
    exitedCount: exitedMints.size,
    wallet: getWalletAddress()
  };
}

export function updateConfig(updates) {
  Object.assign(config, updates);
}

export function setRisk(level) {
  config.riskLevel = level;
  if (level === 'cautious') {
    Object.assign(config, { gradTP: 10, gradSL: -5, gradMaxBuy: 0.20, bondMaxBuy: 0.10, minScore: 6 });
  } else if (level === 'degen') {
    Object.assign(config, { gradTP: 20, gradSL: -12, gradMaxBuy: 1.00, bondMaxBuy: 0.30, minScore: 4 });
  } else {
    Object.assign(config, { gradTP: 15, gradSL: -8, gradMaxBuy: 0.50, bondMaxBuy: 0.20, minScore: 5 });
  }
}

function say(msg) {
  if (notify) notify(msg);
}

function getBuyAmount(isBonding) {
  const tier = Math.floor(wins / 3);
  if (isBonding) {
    const sizes = [config.bondMinBuy, 0.10, 0.15, config.bondMaxBuy];
    return sizes[Math.min(tier, sizes.length - 1)];
  } else {
    const sizes = [config.gradMinBuy, 0.15, 0.30, config.gradMaxBuy];
    return sizes[Math.min(tier, sizes.length - 1)];
  }
}

// ── Main Loop ──
let running = false;

export async function start() {
  if (running) return;
  running = true;
  config.mode = 'active';
  say('🟢 Brain online. Scanning for trades...');
  loop();
}

export function stop() {
  running = false;
  config.mode = 'paused';
  say('⏸️ Trading paused.');
}

async function loop() {
  while (running) {
    try {
      // Check existing positions first
      await checkPositions();
      
      // Then scan for new entries
      if (positions.size < config.maxPositions) {
        await scanAndTrade();
      }
    } catch (e) {
      console.error('[BRAIN] loop error:', e.message);
    }
    
    await sleep(config.scanIntervalMs);
  }
}

// ── Position Management ──
async function checkPositions() {
  for (const [mint, pos] of positions) {
    try {
      const tokenBal = await getTokenBalance(mint);
      if (!tokenBal.balance || tokenBal.balance === 0) {
        // Token gone — orphan cleanup
        positions.delete(mint);
        exitedMints.add(mint);
        continue;
      }
      
      const priceData = await getTokenPrice(mint, tokenBal.balance);
      if (!priceData) {
        say(`⚠️ Can't price $${pos.symbol} — will retry`);
        continue;
      }
      
      const currentSol = priceData.solValue;
      const pnlPct = ((currentSol - pos.buySol) / pos.buySol) * 100;
      const holdMins = (Date.now() - pos.buyTime) / 60000;
      const isBonding = !!pos.isBonding;
      
      const TP = isBonding ? config.bondTP : config.gradTP;
      const SL = isBonding ? config.bondSL : config.gradSL;
      const STALE_MIN = isBonding ? config.bondStaleMin : config.gradStaleMin;
      const STALE_MAX = isBonding ? config.bondStaleMax : config.gradStaleMax;
      
      // Momentum tracking
      if (!pos.priceHistory) pos.priceHistory = [];
      pos.priceHistory.push({ time: Date.now(), pnlPct, sol: currentSol });
      if (pos.priceHistory.length > 30) pos.priceHistory = pos.priceHistory.slice(-30);
      
      const recent = pos.priceHistory.slice(-5);
      const momentum = recent.length >= 2 ? recent[recent.length - 1].pnlPct - recent[0].pnlPct : 0;
      const isRecovering = momentum > 2;
      const isDumping = momentum < -5;
      const isFlat = Math.abs(momentum) < 1;
      
      let staleMinutes = STALE_MAX;
      if (isDumping) staleMinutes = STALE_MIN;
      else if (isFlat && pnlPct < 0) staleMinutes = (STALE_MIN + STALE_MAX) / 2;
      else if (isRecovering) staleMinutes = STALE_MAX;
      
      // Decision
      let shouldSell = false;
      let reason = '';
      
      if (pnlPct >= TP) {
        shouldSell = true;
        reason = `take profit`;
        say(`🎯 Taking profit on $${pos.symbol}: +${pnlPct.toFixed(1)}% (${currentSol.toFixed(4)} SOL)`);
      } else if (pnlPct <= SL) {
        if (isRecovering && pnlPct > SL * 1.5) {
          // Give it more time if recovering
        } else {
          shouldSell = true;
          reason = 'stop loss';
          say(`🛑 Stop loss on $${pos.symbol}: ${pnlPct.toFixed(1)}%`);
        }
      } else if (holdMins >= staleMinutes) {
        shouldSell = true;
        reason = 'stale cut';
        say(`⏰ Cutting stale $${pos.symbol} after ${holdMins.toFixed(0)}min: ${pnlPct.toFixed(1)}%`);
      }
      
      if (shouldSell) {
        try {
          const sig = await sellToken(mint, tokenBal.balance, isBonding);
          const pnlSol = currentSol - pos.buySol;
          
          if (pnlSol >= 0) wins++;
          else losses++;
          totalPnl += pnlSol;
          
          const bal = await getBalance();
          const emoji = pnlSol >= 0 ? '✅' : '❌';
          say(`${emoji} Sold $${pos.symbol} — ${pnlSol >= 0 ? '+' : ''}${pnlSol.toFixed(4)} SOL (${pnlPct >= 0 ? '+' : ''}${pnlPct.toFixed(1)}%)\n💰 Balance: ${bal.toFixed(2)} SOL | Record: ${wins}W/${losses}L\n🔗 solscan.io/tx/${sig}`);
          
          positions.delete(mint);
          exitedMints.add(mint);
        } catch (e) {
          say(`⚠️ Sell failed on $${pos.symbol}: ${e.message} — will retry`);
          // Don't delete position on sell failure — retry next cycle
        }
      }
    } catch (e) {
      console.error(`[BRAIN] position check error ${mint}:`, e.message);
    }
  }
}

// ── Scan & Trade ──
async function scanAndTrade() {
  const [graduated, bonding] = await Promise.all([
    scanGraduated(200),
    scanBondingCurve(100)
  ]);
  
  const allTokens = [...graduated, ...bonding];
  const narratives = detectNarratives(allTokens);
  
  // Score and filter
  const candidates = allTokens
    .filter(t => !exitedMints.has(t.mint) && !positions.has(t.mint))
    .map(t => ({ ...t, ...scoreToken(t, narratives) }))
    .filter(t => t.score >= config.minScore)
    .sort((a, b) => b.score - a.score);
  
  // Try top 5 candidates with holder check
  const rpcUrl = process.env.RPC_URL;
  
  for (const token of candidates.slice(0, 5)) {
    // Holder analysis gate
    const holders = await analyzeHolders(token.mint, rpcUrl);
    if (holders?.risky) {
      exitedMints.add(token.mint);
      continue;
    }
    
    // Bonding curve gate
    if (token.isBonding) {
      if (token.bondingPct < config.bondMinProgress) continue;
      if (token.replies < config.bondMinReplies) continue;
    }
    
    const amount = getBuyAmount(token.isBonding);
    const bal = await getBalance();
    if (bal < amount + 0.01) {
      say(`💸 Low balance (${bal.toFixed(2)} SOL). Need at least ${(amount + 0.01).toFixed(2)} to trade.`);
      return;
    }
    
    try {
      const holderInfo = holders ? ` | top1: ${holders.top1Pct}%` : '';
      const metaInfo = token.score > 5 ? ' 🔥' : '';
      say(`🔍 Buying $${token.symbol} — score: ${token.score}/10, ${token.isBonding ? 'bonding' : 'graduated'}${holderInfo}${metaInfo}\n💰 ${amount} SOL`);
      
      const sig = await buyToken(token.mint, amount);
      
      // Get token balance after buy
      await sleep(3000);
      const tokenBal = await getTokenBalance(token.mint);
      
      positions.set(token.mint, {
        symbol: token.symbol || '???',
        name: token.name || '???',
        buySol: amount,
        buyTime: Date.now(),
        tokens: tokenBal.balance,
        isBonding: token.isBonding,
        priceHistory: [],
        creator: token.creator
      });
      
      say(`✅ Bought $${token.symbol} for ${amount} SOL\n🔗 solscan.io/tx/${sig}`);
      return; // One buy per cycle
      
    } catch (e) {
      say(`⚠️ Failed to buy $${token.symbol}: ${e.message}`);
      exitedMints.add(token.mint);
    }
  }
}

// ── Manual Commands ──
export async function manualBuy(mint, amount) {
  if (positions.has(mint)) return 'Already holding this token.';
  if (positions.size >= config.maxPositions) return 'Max positions reached. Sell first.';
  
  try {
    const sig = await buyToken(mint, amount);
    await sleep(3000);
    const tokenBal = await getTokenBalance(mint);
    
    positions.set(mint, {
      symbol: mint.slice(0, 6),
      name: 'manual buy',
      buySol: amount,
      buyTime: Date.now(),
      tokens: tokenBal.balance,
      isBonding: false,
      priceHistory: []
    });
    
    return `Bought for ${amount} SOL ✅\nTX: solscan.io/tx/${sig}`;
  } catch (e) {
    return `Buy failed: ${e.message}`;
  }
}

export async function manualSellAll() {
  if (positions.size === 0) return 'No positions to sell.';
  
  const results = [];
  for (const [mint, pos] of positions) {
    try {
      const tokenBal = await getTokenBalance(mint);
      if (!tokenBal.balance) {
        positions.delete(mint);
        exitedMints.add(mint);
        results.push(`$${pos.symbol}: no balance, cleared`);
        continue;
      }
      const sig = await sellToken(mint, tokenBal.balance, !!pos.isBonding);
      positions.delete(mint);
      exitedMints.add(mint);
      results.push(`$${pos.symbol}: sold ✅`);
    } catch (e) {
      results.push(`$${pos.symbol}: sell failed — ${e.message}`);
    }
  }
  
  return results.join('\n');
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
