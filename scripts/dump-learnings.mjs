import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

const [trades, learnings, agent, xlearn] = await Promise.all([
  sql`SELECT type, symbol, amount_sol, pnl_sol, pnl_pct, result, reason FROM sharkd_trades WHERE type='sell' ORDER BY created_at DESC LIMIT 40`,
  sql`SELECT value FROM sharkd_state WHERE key = 'learnings'`,
  sql`SELECT value FROM sharkd_state WHERE key = 'agent'`,
  sql`SELECT value FROM sharkd_state WHERE key = 'x_learnings'`,
]);

console.log('=== SELL TRADES (recent 40) ===');
let w = 0, l = 0, totalPnl = 0;
trades.reverse().forEach(t => {
  if (t.result === 'win') w++;
  if (t.result === 'loss') l++;
  totalPnl += Number(t.pnl_sol || 0);
  console.log(`${t.result?.padEnd(4) || '    '} $${(t.symbol || '???').padEnd(12)} ${(t.amount_sol || 0).toFixed(3)} SOL  ${t.pnl_pct ? (t.pnl_pct > 0 ? '+' : '') + t.pnl_pct.toFixed(1) + '%' : ''}  ${t.reason || ''}`);
});
console.log(`\nTotal: ${w}W/${l}L (${((w/(w+l))*100).toFixed(0)}%) | Net: ${totalPnl.toFixed(4)} SOL`);

console.log('\n=== LEARNINGS ===');
const learn = learnings[0]?.value;
if (learn) {
  console.log('Rules:', JSON.stringify(learn.rules, null, 2));
  console.log('Win rate:', learn.winRate + '%');
  console.log('Avg win hold:', learn.avgWinHoldMin?.toFixed(1), 'min');
  console.log('Avg loss hold:', learn.avgLossHoldMin?.toFixed(1), 'min');
  console.log('Avg win score:', learn.avgWinScore?.toFixed(1));
  console.log('Avg loss score:', learn.avgLossScore?.toFixed(1));
  console.log('Loss reasons:', JSON.stringify(learn.lossByReason));
  console.log('Meta stats:', JSON.stringify(learn.metaStats));
  console.log('Rug creators:', learn.rugCreators);
}

console.log('\n=== AGENT STATE ===');
const ag = agent[0]?.value;
if (ag) {
  console.log('Balance:', ag.balance);
  console.log('Start:', ag.startBalance);
  console.log('Real PnL:', ag.totalPnl);
  console.log('W/L:', ag.wins + '/' + ag.losses);
}

console.log('\n=== X LEARNINGS ===');
const xl = xlearn[0]?.value;
if (xl) {
  console.log('Topic scores:', JSON.stringify(xl.topicScores));
  console.log('Style scores:', JSON.stringify(xl.styleScores));
  console.log('Bangers:', JSON.stringify(xl.bangers));
  console.log('Duds:', xl.duds?.length || 0);
}
