// Seed the learning engine with actual trade history from DB
// This gives the bot a starting point to learn from
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

// Count actual wins/losses from DB
const trades = await sql`SELECT type, symbol, amount_sol, pnl_sol, pnl_pct, reason, result FROM sharkd_trades ORDER BY created_at`;

let wins = 0, losses = 0, totalPnl = 0;
const sellTrades = trades.filter(t => t.type === 'sell' && t.result);

for (const t of sellTrades) {
  const pnlPct = Number(t.pnl_pct) || 0;
  const pnlSol = Number(t.pnl_sol) || 0;
  // Same neutral logic: only count if >1% move
  if (Math.abs(pnlPct) > 1) {
    if (pnlSol >= 0) wins++; else losses++;
  }
  totalPnl += pnlSol;
}

console.log(`From DB: ${wins}W / ${losses}L = ${((wins/(wins+losses))*100).toFixed(0)}% win rate | Net PnL: ${totalPnl.toFixed(4)} SOL`);

// Save counters
await sql`INSERT INTO sharkd_state (key, value) VALUES ('tradeCounters', ${JSON.stringify({ wins, losses, totalPnl })}) ON CONFLICT (key) DO UPDATE SET value = ${JSON.stringify({ wins, losses, totalPnl })}, updated_at = now()`;
console.log('Saved tradeCounters to DB');

// Build trade learnings from sell data (limited info but better than nothing)
const tradeHistory = sellTrades.map(t => ({
  symbol: t.symbol || '???',
  score: 0,
  meta: null,
  holdMin: 3, // estimate
  pnlPct: Number(t.pnl_pct) || 0,
  reason: t.reason || 'unknown',
  result: t.result || 'loss',
  isBonding: false,
  mcap: 0,
  replies: 0,
  ageHours: 0,
  top1Pct: 0,
  top5Pct: 0,
  holderCount: 0,
})).slice(-100);

await sql`INSERT INTO sharkd_state (key, value) VALUES ('tradeHistory', ${JSON.stringify(tradeHistory)}) ON CONFLICT (key) DO UPDATE SET value = ${JSON.stringify(tradeHistory)}, updated_at = now()`;
console.log(`Saved ${tradeHistory.length} trade learnings to DB`);

// Set tighter initial rules based on observed losses
const rules = {
  minMcap: 5000,          // was 1000 — too many dust tokens
  maxTop1Pct: 30,         // was 50 — tighten from whale dumps  
  maxTop5Pct: 55,         // was 70 — too concentrated
  minHolders: 8,          // was 0 — need some distribution
  minAge: 0,
  maxAge: 360,
  metaBoostMultiplier: 1.0,
  freshGradBonus: 0,
  minReplies: 5,
};

const learningsState = {
  rules,
  totalTrades: wins + losses,
  winRate: ((wins/(wins+losses))*100).toFixed(0),
  rugCreators: 0,
  avgWinHoldMin: 0,
  avgLossHoldMin: 0,
  avgWinScore: 0,
  avgLossScore: 0,
  lossByReason: {},
  metaStats: { winsByMeta: 0, lossesByMeta: 0, winsByNoMeta: 0, lossesByNoMeta: 0 },
  lastAnalysis: Date.now(),
};

await sql`INSERT INTO sharkd_state (key, value) VALUES ('learnings', ${JSON.stringify(learningsState)}) ON CONFLICT (key) DO UPDATE SET value = ${JSON.stringify(learningsState)}, updated_at = now()`;
console.log('Saved tightened learnings rules to DB');
console.log('Rules:', JSON.stringify(rules, null, 2));
