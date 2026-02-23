import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const [stateRows, thoughtRows, tradeRows, skillRows, leaderboardRows] = await Promise.all([
      sql`SELECT value FROM sharkd_state WHERE key = 'agent' LIMIT 1`,
      sql`SELECT tag, message, type, created_at FROM sharkd_thoughts ORDER BY id DESC LIMIT 60`,
      sql`SELECT type, symbol, amount_sol, score, meta, pnl_sol, pnl_pct, reason, result, tx, balance_after, created_at FROM sharkd_trades ORDER BY id DESC LIMIT 30`,
      sql`SELECT name, description, data, created_at FROM sharkd_skills ORDER BY id DESC LIMIT 10`,
      sql`SELECT symbol, pnl_sol, pnl_pct, amount_sol, result, reason, created_at FROM sharkd_trades WHERE type = 'sell' AND result IS NOT NULL ORDER BY pnl_pct DESC LIMIT 20`,
    ]);

    const agent = stateRows.length > 0 ? stateRows[0].value : null;
    const thoughts = thoughtRows.reverse(); // oldest first for feed
    const trades = tradeRows;
    const skills = skillRows;

    const leaderboard = leaderboardRows;

    return NextResponse.json({ agent, thoughts, trades, skills, leaderboard, ts: Date.now() });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
