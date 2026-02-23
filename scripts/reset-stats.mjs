import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

// Reset all trade history
await sql`DELETE FROM sharkd_trades`;
console.log('Cleared sharkd_trades');

// Reset all thoughts
await sql`DELETE FROM sharkd_thoughts`;
console.log('Cleared sharkd_thoughts');

// Reset counters
await sql`INSERT INTO sharkd_state (key, value) VALUES ('tradeCounters', '{"wins":0,"losses":0,"totalPnl":0}'::jsonb) ON CONFLICT (key) DO UPDATE SET value = '{"wins":0,"losses":0,"totalPnl":0}'::jsonb, updated_at = now()`;
console.log('Reset tradeCounters');

// Reset trade history learnings
await sql`INSERT INTO sharkd_state (key, value) VALUES ('tradeHistory', '[]'::jsonb) ON CONFLICT (key) DO UPDATE SET value = '[]'::jsonb, updated_at = now()`;
console.log('Reset tradeHistory');

// Keep exitedMints (don't re-buy losers) and rugCreators (blacklist)
// Keep learnings rules (hard-earned knowledge)
// Keep tracked_wallets (copy-trade discovery)

// Reset agent state for terminal display
await sql`INSERT INTO sharkd_state (key, value) VALUES ('agent', '{"status":"online","wins":0,"losses":0,"totalPnl":0,"tradePnl":0,"winRate":0,"cycle":0}'::jsonb) ON CONFLICT (key) DO UPDATE SET value = '{"status":"online","wins":0,"losses":0,"totalPnl":0,"tradePnl":0,"winRate":0,"cycle":0}'::jsonb, updated_at = now()`;
console.log('Reset agent state');

console.log('\nStats reset. Kept: exitedMints, rugCreators, learnings rules, tracked wallets.');
console.log('Fresh start with all the knowledge intact.');
