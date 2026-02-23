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
// LEARNING ENGINE — adapts from every trade
// ══════════════════════════════════════════════════════════════

const learnings = {
  // Per-trade outcome tracking
  trades: [],           // { symbol, score, meta, holdMin, pnlPct, reason, result, isBonding, mcap, replies, ageHours, top1Pct, top5Pct, holderCount }

  // Discovered rules (adjustable thresholds)
  rules: {
    minMcap: 1000,            // updated from loss patterns
    maxTop1Pct: 50,           // tightened when whales dump on us
    maxTop5Pct: 70,           // tightened when concentrated holders dump
    minHolders: 0,            // learned minimum holder count
    minAge: 0,                // avoid tokens too young (minutes)
    maxAge: 360,              // avoid tokens too old (minutes)
    metaBoostMultiplier: 1.0, // adjusted based on meta trade performance
    freshGradBonus: 0,        // extra score for freshly graduated
    minReplies: 5,            // raised if low-reply tokens keep losing
  },

  // Pattern tracking
  lossByReason: {},     // reason → count
  winsByMeta: 0, lossesByMeta: 0,
  winsByNoMeta: 0, lossesByNoMeta: 0,
  winsByBonding: 0, lossesByBonding: 0,
  winsByGrad: 0, lossesByGrad: 0,
  avgWinHoldMin: 0, avgLossHoldMin: 0,
  avgWinScore: 0, avgLossScore: 0,

  // Rug/scam pattern tracking
  rugPatterns: [],      // { creator, symbol, top1Pct, mcap, holdMin, loss }
};

function recordTradeLearning(data) {
  learnings.trades.push(data);

  const isWin = data.result === 'win';

  // Meta tracking
  if (data.meta) {
    if (isWin) learnings.winsByMeta++; else learnings.lossesByMeta++;
  } else {
    if (isWin) learnings.winsByNoMeta++; else learnings.lossesByNoMeta++;
  }

  // Bonding vs graduated
  if (data.isBonding) {
    if (isWin) learnings.winsByBonding++; else learnings.lossesByBonding++;
  } else {
    if (isWin) learnings.winsByGrad++; else learnings.lossesByGrad++;
  }

  // Loss reason tracking
  if (!isWin && data.reason) {
    learnings.lossByReason[data.reason] = (learnings.lossByReason[data.reason] || 0) + 1;
  }

  // Running averages
  const winTrades = learnings.trades.filter(t => t.result === 'win');
  const lossTrades = learnings.trades.filter(t => t.result === 'loss');
  if (winTrades.length) {
    learnings.avgWinHoldMin = winTrades.reduce((s, t) => s + t.holdMin, 0) / winTrades.length;
    learnings.avgWinScore = winTrades.reduce((s, t) => s + (t.score || 0), 0) / winTrades.length;
  }
  if (lossTrades.length) {
    learnings.avgLossHoldMin = lossTrades.reduce((s, t) => s + t.holdMin, 0) / lossTrades.length;
    learnings.avgLossScore = lossTrades.reduce((s, t) => s + (t.score || 0), 0) / lossTrades.length;
  }
}

function analyzeAndAdapt() {
  const total = wins + losses;
  if (total < 3) return;
  const wr = ((wins / total) * 100).toFixed(0);

  log('LEARN', `=== ANALYSIS: ${total} trades, ${wr}% win rate, PnL: ${totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(4)} SOL ===`, 'learn');

  const skillsDiscovered = [];

  // 1. Meta effectiveness
  const metaTotal = learnings.winsByMeta + learnings.lossesByMeta;
  const noMetaTotal = learnings.winsByNoMeta + learnings.lossesByNoMeta;
  if (metaTotal >= 2 && noMetaTotal >= 2) {
    const metaWR = metaTotal > 0 ? (learnings.winsByMeta / metaTotal * 100).toFixed(0) : 0;
    const noMetaWR = noMetaTotal > 0 ? (learnings.winsByNoMeta / noMetaTotal * 100).toFixed(0) : 0;
    log('LEARN', `Narrative trades: ${metaWR}% WR (${metaTotal}) vs non-narrative: ${noMetaWR}% WR (${noMetaTotal})`, 'learn');

    if (Number(metaWR) > Number(noMetaWR) + 10) {
      learnings.rules.metaBoostMultiplier = 1.5;
      skillsDiscovered.push({ name: 'Narrative Boost', description: `Meta trades win at ${metaWR}% vs ${noMetaWR}%. Increasing narrative score weight by 1.5x.`, data: { metaWR, noMetaWR, multiplier: 1.5 } });
    } else if (Number(noMetaWR) > Number(metaWR) + 15) {
      learnings.rules.metaBoostMultiplier = 0.5;
      skillsDiscovered.push({ name: 'Narrative Skeptic', description: `Meta trades underperforming at ${metaWR}% vs ${noMetaWR}%. Reducing narrative weight.`, data: { metaWR, noMetaWR, multiplier: 0.5 } });
    }
  }

  // 2. Bonding vs Graduated
  const bondTotal = learnings.winsByBonding + learnings.lossesByBonding;
  const gradTotal = learnings.winsByGrad + learnings.lossesByGrad;
  if (bondTotal >= 2 && gradTotal >= 2) {
    const bondWR = bondTotal > 0 ? (learnings.winsByBonding / bondTotal * 100).toFixed(0) : 0;
    const gradWR = gradTotal > 0 ? (learnings.winsByGrad / gradTotal * 100).toFixed(0) : 0;
    log('LEARN', `Graduated: ${gradWR}% WR (${gradTotal}) | Bonding: ${bondWR}% WR (${bondTotal})`, 'learn');
  }

  // 3. Holder concentration patterns
  const lossesFromWhales = learnings.trades.filter(t => t.result === 'loss' && t.top1Pct > 30);
  if (lossesFromWhales.length >= 2) {
    const avgTop1 = lossesFromWhales.reduce((s, t) => s + t.top1Pct, 0) / lossesFromWhales.length;
    if (avgTop1 > 25 && learnings.rules.maxTop1Pct > 30) {
      learnings.rules.maxTop1Pct = 30;
      log('LEARN', `RULE UPDATE: Tightening max top1 holder to 30% — lost ${lossesFromWhales.length} trades to whale dumps (avg ${avgTop1.toFixed(0)}%)`, 'learn');
      skillsDiscovered.push({ name: 'Whale Shield', description: `Tightened top holder limit to 30% after ${lossesFromWhales.length} whale-caused losses. Avg losing top1: ${avgTop1.toFixed(0)}%.`, data: { maxTop1Pct: 30, lossCount: lossesFromWhales.length, avgTop1 } });
    }
  }

  const lossesFromConcentrated = learnings.trades.filter(t => t.result === 'loss' && t.top5Pct > 55);
  if (lossesFromConcentrated.length >= 2 && learnings.rules.maxTop5Pct > 60) {
    learnings.rules.maxTop5Pct = 60;
    log('LEARN', `RULE UPDATE: Tightening max top5 holders to 60% — concentrated tokens keep dumping`, 'learn');
    skillsDiscovered.push({ name: 'Distribution Filter', description: `Tightened top5 holder limit to 60% after repeated concentrated dumps.`, data: { maxTop5Pct: 60, lossCount: lossesFromConcentrated.length } });
  }

  // 4. Low holder count losses
  const lossesLowHolders = learnings.trades.filter(t => t.result === 'loss' && t.holderCount < 10);
  if (lossesLowHolders.length >= 2 && learnings.rules.minHolders < 10) {
    learnings.rules.minHolders = 10;
    log('LEARN', `RULE UPDATE: Minimum 10 holders required — lost ${lossesLowHolders.length} trades on thin holder base`, 'learn');
    skillsDiscovered.push({ name: 'Thin Market Shield', description: `Requiring minimum 10 holders after ${lossesLowHolders.length} losses on low-holder tokens.`, data: { minHolders: 10, lossCount: lossesLowHolders.length } });
  }

  // 5. Score threshold — if low-score trades keep losing
  const lowScoreLosses = learnings.trades.filter(t => t.result === 'loss' && t.score <= 6);
  const lowScoreWins = learnings.trades.filter(t => t.result === 'win' && t.score <= 6);
  if (lowScoreLosses.length >= 3 && lowScoreWins.length < lowScoreLosses.length * 0.3) {
    log('LEARN', `INSIGHT: Low-score trades (<=6) losing at high rate: ${lowScoreLosses.length}L vs ${lowScoreWins.length}W. Prefer higher scores.`, 'learn');
    skillsDiscovered.push({ name: 'Quality Filter', description: `Low-score tokens (<=6) losing heavily: ${lowScoreLosses.length}L vs ${lowScoreWins.length}W. Prioritizing higher conviction trades.`, data: { lowScoreLosses: lowScoreLosses.length, lowScoreWins: lowScoreWins.length } });
  }

  // 6. Hold time analysis
  if (learnings.avgWinHoldMin > 0 && learnings.avgLossHoldMin > 0) {
    log('LEARN', `Avg hold: WINS ${learnings.avgWinHoldMin.toFixed(1)}min | LOSSES ${learnings.avgLossHoldMin.toFixed(1)}min | Win score: ${learnings.avgWinScore.toFixed(1)} Loss score: ${learnings.avgLossScore.toFixed(1)}`, 'learn');
  }

  // 7. Rug creator analysis
  if (learnings.rugPatterns.length >= 2) {
    log('LEARN', `BLACKLISTED ${rugCreators.size} creator wallets from ${learnings.rugPatterns.length} rug patterns`, 'learn');
    skillsDiscovered.push({ name: 'Rug Creator Blacklist', description: `Tracking ${rugCreators.size} wallets that created tokens resulting in losses. Auto-reject any new token from these creators.`, data: { count: rugCreators.size, patterns: learnings.rugPatterns.slice(-5) } });
  }

  // 8. Stale cut effectiveness
  const staleCuts = learnings.trades.filter(t => t.reason?.includes('stale'));
  if (staleCuts.length >= 3) {
    const avgStalePnl = staleCuts.reduce((s, t) => s + t.pnlPct, 0) / staleCuts.length;
    log('LEARN', `Stale cuts avg PnL: ${avgStalePnl.toFixed(1)}%. ${avgStalePnl > -3 ? 'Working well — cutting before deep losses.' : 'May need tighter stale timers.'}`, 'learn');
  }

  // 9. Loss reason breakdown
  const reasons = Object.entries(learnings.lossByReason).sort((a, b) => b[1] - a[1]);
  if (reasons.length > 0) {
    log('LEARN', `Loss reasons: ${reasons.map(([r, c]) => `${r}: ${c}`).join(' | ')}`, 'learn');
  }

  // Save all discovered skills to DB
  for (const skill of skillsDiscovered) {
    log('SKILL', `NEW: ${skill.name} — ${skill.description}`, 'skill');
    saveSkillLog(skill);
  }

  // Update state with learnings
  updateState('learnings', {
    rules: learnings.rules,
    totalTrades: total, winRate: wr,
    rugCreators: rugCreators.size,
    avgWinHoldMin: learnings.avgWinHoldMin,
    avgLossHoldMin: learnings.avgLossHoldMin,
    avgWinScore: learnings.avgWinScore,
    avgLossScore: learnings.avgLossScore,
    lossByReason: learnings.lossByReason,
    metaStats: { winsByMeta: learnings.winsByMeta, lossesByMeta: learnings.lossesByMeta, winsByNoMeta: learnings.winsByNoMeta, lossesByNoMeta: learnings.lossesByNoMeta },
    lastAnalysis: Date.now(),
  }).catch(() => {});
}

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
      const rawBoost = n.count >= 8 ? 4 : n.count >= 5 ? 3 : n.count >= 4 ? 2 : 1;
      const boost = Math.round(rawBoost * learnings.rules.metaBoostMultiplier);
      return { boost, reason: `matches "${n.keyword}" meta (${n.count} tokens)${learnings.rules.metaBoostMultiplier !== 1.0 ? ` [${learnings.rules.metaBoostMultiplier}x]` : ''}` };
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

    const safe = top1Pct < learnings.rules.maxTop1Pct && top5Pct < learnings.rules.maxTop5Pct && meaningfulHolders >= learnings.rules.minHolders;
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
      _score: token._score?.score || 0, _mcap: token.usd_market_cap || 0,
      _replies: token.reply_count || 0, _ageHours: token._score?.ageHours || 0,
      _holderData: token._holderData || null,
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

  // Track rug creators + rug patterns
  if (pnlSol < -0.005 && pos.creator) {
    rugCreators.add(pos.creator);
    learnings.rugPatterns.push({
      creator: pos.creator, symbol: pos.symbol, top1Pct: pos._holderData?.top1Pct || 0,
      mcap: pos._mcap || 0, holdMin: (Date.now() - pos.buyTime) / 60000, loss: pnlSol,
    });
    log('BLACKLIST', `Creator ${pos.creator.slice(0, 12)}... blacklisted after $${pos.symbol} loss. Total blacklisted: ${rugCreators.size}`, 'learn');
  }

  positions.delete(mint);
  exitedMints.add(mint);

  const bal = await getBalance();
  const result = pnlSol >= 0 ? 'win' : 'loss';
  const emoji = pnlSol >= 0 ? 'WIN' : 'LOSS';
  log(emoji, `$${pos.symbol} | ${reason} | ${pnlSol >= 0 ? '+' : ''}${pnlSol.toFixed(4)} SOL (${pnlPct >= 0 ? '+' : ''}${pnlPct.toFixed(1)}%) | Balance: ${bal.toFixed(3)} SOL | ${wins}W/${losses}L`);

  const trade = { type: 'sell', token: pos.symbol, mint, pnl: pnlSol, pnlPct, reason, result, balance: bal, time: Date.now(), tx: sig };
  saveTradeLog(trade);

  // Feed the learning engine
  const holdMin = (Date.now() - pos.buyTime) / 60000;
  recordTradeLearning({
    symbol: pos.symbol, score: pos._score || 0, meta: pos.meta, holdMin, pnlPct, reason, result,
    isBonding: pos.isBonding, mcap: pos._mcap || 0, replies: pos._replies || 0,
    ageHours: pos._ageHours || 0, top1Pct: pos._holderData?.top1Pct || 0,
    top5Pct: pos._holderData?.top5Pct || 0, holderCount: pos._holderData?.holderCount || 0,
  });

  // Log detailed loss analysis
  if (result === 'loss') {
    const analysis = [];
    if (pos._holderData?.top1Pct > 25) analysis.push(`whale: top1 ${pos._holderData.top1Pct.toFixed(0)}%`);
    if (holdMin < 2) analysis.push(`died in ${holdMin.toFixed(1)}min`);
    if (pos.meta) analysis.push(`meta: ${pos.meta}`);
    analysis.push(`score was ${pos._score || '?'}`);
    log('AUTOPSY', `$${pos.symbol}: ${analysis.join(' | ')} — ${reason}`, 'learn');
  }
}

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

    // Attach holder data to token for learning engine
    token._holderData = holders;
    token._score.score += holders.score;
    if (token._score.score < MIN_SCORE) continue;

    log('TARGET', `$${token.symbol} — score ${token._score.score} | ${token._score.reasons.join(' | ')}`);

    const bought = await executeBuy(token);
    if (bought) return; // one buy per cycle
  }
}

// The old analyzeAndLearn is replaced by analyzeAndAdapt() in the learning engine above.

// ══════════════════════════════════════════════════════════════
// MAIN LOOP
// ══════════════════════════════════════════════════════════════

async function syncState(bal) {
  const holdingsArr = [...positions.entries()].map(([mint, p]) => ({
    mint, symbol: p.symbol, buySol: p.buySol, buyTime: p.buyTime, isBonding: p.isBonding, meta: p.meta,
  }));
  const total = wins + losses;
  const realPnl = bal - startBalance;  // honest PnL from actual balance change
  await updateState('agent', {
    status: 'online',
    balance: bal,
    startBalance,
    wins, losses,
    totalPnl: realPnl,  // use real balance diff, not just tracked trades
    tradePnl: totalPnl,  // tracked trade PnL for comparison
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
let startBalance = 0;

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

  startBalance = bal;
  log('BOOT', `Agent online. Balance: ${bal.toFixed(4)} SOL. Scanning ${CYCLE_MS/1000}s cycles.`, 'system');

  if (bal < 0.05) {
    console.log('WARNING: Balance very low. Fund wallet before trading.');
  }

  while (true) {
    cycle++;
    try {
      await checkPositions();
      await scanAndTrade();

      // Analyze and adapt every 3 trades (learn fast)
      const totalTrades = wins + losses;
      if (totalTrades > 0 && totalTrades % 3 === 0 && learnings.trades.length >= 3) analyzeAndAdapt();

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
