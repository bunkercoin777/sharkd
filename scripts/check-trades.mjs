import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

const trades = await sql`SELECT type, symbol, amount_sol, pnl_sol, pnl_pct, result, reason, created_at FROM sharkd_trades ORDER BY created_at`;

let totalBought = 0, totalSold = 0, wins = 0, losses = 0;

for (const t of trades) {
  const line = [
    t.type.padEnd(4),
    (t.symbol || '???').padEnd(15),
    (t.amount_sol + ' SOL').padEnd(12),
    (t.result || '').padEnd(8),
    t.pnl_sol ? (t.pnl_sol > 0 ? '+' : '') + t.pnl_sol + ' SOL' : '',
    t.pnl_pct ? (t.pnl_pct > 0 ? '+' : '') + t.pnl_pct + '%' : '',
    t.reason || '',
  ].join(' | ');
  console.log(line);
  
  if (t.type === 'buy') totalBought += Number(t.amount_sol);
  if (t.type === 'sell' && t.pnl_sol) {
    totalSold += Number(t.amount_sol) + Number(t.pnl_sol);
    if (Number(t.pnl_sol) > 0) wins++;
    else losses++;
  }
}

console.log('\n=== REAL STATS ===');
console.log(`Total trades: ${trades.length}`);
console.log(`Buys: ${trades.filter(t=>t.type==='buy').length}`);
console.log(`Sells: ${trades.filter(t=>t.type==='sell').length}`);
console.log(`Wins: ${wins}, Losses: ${losses}`);
console.log(`Win rate: ${((wins/(wins+losses))*100).toFixed(0)}%`);
console.log(`Total SOL spent buying: ${totalBought.toFixed(4)}`);
console.log(`Total SOL recovered selling: ${totalSold.toFixed(4)}`);
console.log(`Net P&L from trades: ${(totalSold - totalBought).toFixed(4)} SOL`);

// Check for buys without corresponding sells (abandoned positions = losses)
const buys = trades.filter(t => t.type === 'buy');
const sells = trades.filter(t => t.type === 'sell');
const soldMints = new Set(sells.map(t => t.mint));
// We just sold everything, so any buy without a DB sell = realized loss
console.log(`\nBuys recorded: ${buys.length}`);
console.log(`Sells recorded: ${sells.length}`);
console.log(`Unsold positions (just force-dumped): check wallet`);
