import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);
const r = await sql`SELECT key, value FROM sharkd_state WHERE key IN ('learnings','exitedMints','rugCreators')`;
for (const row of r) {
  console.log('---', row.key, '---');
  const s = JSON.stringify(row.value, null, 2);
  console.log(s.slice(0, 3000));
  if (s.length > 3000) console.log('...(truncated)');
}
