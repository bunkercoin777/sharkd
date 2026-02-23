// ── SharkD Database Layer ──
// Neon PostgreSQL — stores thoughts, trades, stats, learnings for live terminal
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
  await sql`CREATE TABLE IF NOT EXISTS sharkd_thoughts (
    id SERIAL PRIMARY KEY,
    tag TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'scan',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS sharkd_trades (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL,
    mint TEXT,
    symbol TEXT,
    name TEXT,
    amount_sol REAL,
    score INTEGER,
    meta TEXT,
    pnl_sol REAL,
    pnl_pct REAL,
    reason TEXT,
    result TEXT,
    tx TEXT,
    balance_after REAL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS sharkd_state (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS sharkd_skills (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;
  console.log('[DB] Tables initialized');
}

export async function logThought(tag, message, type = 'scan') {
  try {
    await sql`INSERT INTO sharkd_thoughts (tag, message, type) VALUES (${tag}, ${message}, ${type})`;
    // Keep only last 500 thoughts
    await sql`DELETE FROM sharkd_thoughts WHERE id NOT IN (SELECT id FROM sharkd_thoughts ORDER BY id DESC LIMIT 500)`;
  } catch (e) { console.error('[DB] thought error:', e.message); }
}

export async function logTrade(trade) {
  try {
    await sql`INSERT INTO sharkd_trades (type, mint, symbol, name, amount_sol, score, meta, pnl_sol, pnl_pct, reason, result, tx, balance_after)
      VALUES (${trade.type}, ${trade.mint || null}, ${trade.symbol || trade.token || null}, ${trade.name || trade.token || null}, ${trade.amount || null}, ${trade.score || null}, ${trade.meta || null}, ${trade.pnl || null}, ${trade.pnlPct || null}, ${trade.reason || null}, ${trade.result || null}, ${trade.tx || null}, ${trade.balance || null})`;
  } catch (e) { console.error('[DB] trade error:', e.message); }
}

export async function updateState(key, value) {
  try {
    await sql`INSERT INTO sharkd_state (key, value, updated_at) VALUES (${key}, ${JSON.stringify(value)}, NOW())
      ON CONFLICT (key) DO UPDATE SET value = ${JSON.stringify(value)}, updated_at = NOW()`;
  } catch (e) { console.error('[DB] state error:', e.message); }
}

export async function logSkill(skill) {
  try {
    await sql`INSERT INTO sharkd_skills (name, description, data) VALUES (${skill.name}, ${skill.description || ''}, ${JSON.stringify(skill)})`;
  } catch (e) { console.error('[DB] skill error:', e.message); }
}

export async function getState(key) {
  try {
    const rows = await sql`SELECT value FROM sharkd_state WHERE key = ${key}`;
    return rows.length ? rows[0].value : null;
  } catch (e) { console.error('[DB] getState error:', e.message); return null; }
}
