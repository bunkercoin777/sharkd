/**
 * SharkD Forever Runner — X Bot
 * NO detached processes. NO new windows.
 */
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BOT_SCRIPT = join(__dirname, '..', 'scripts', 'x-poster.mjs');

// Load .env.local if env vars aren't already set
try {
  const lines = readFileSync(join(__dirname, '..', '.env.local'), 'utf8').split('\n');
  for (const line of lines) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
  console.log('[FOREVER-X] Loaded .env.local');
} catch {}

const MIN_BACKOFF = 5_000;
const MAX_BACKOFF = 120_000;
const HEALTHY_UPTIME = 60_000;

let backoff = MIN_BACKOFF;
let runCount = 0;

function launch() {
  runCount++;
  console.log(`\n[FOREVER-X] Run #${runCount} at ${new Date().toISOString()}`);

  const child = spawn('node', [BOT_SCRIPT], {
    cwd: join(__dirname, '..'),
    stdio: ['ignore', 'pipe', 'pipe'],
    env: process.env,
  });

  child.stdout.on('data', d => { try { process.stdout.write(d); } catch {} });
  child.stderr.on('data', d => { try { process.stderr.write(d); } catch {} });

  child.on('exit', (code) => {
    const up = Date.now() - Date.now();
    backoff = MIN_BACKOFF;
    console.log(`[FOREVER-X] Exited (code=${code}). Restart in ${backoff/1000}s...`);
    setTimeout(launch, backoff);
  });

  child.on('error', (err) => {
    console.error(`[FOREVER-X] ${err.message}`);
    setTimeout(launch, backoff);
  });
}

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));
process.on('uncaughtException', (e) => console.error(`[FOREVER-X] ${e.message}`));

console.log('[FOREVER-X] SharkD X Bot Runner');
launch();
setInterval(() => {}, 30000);
