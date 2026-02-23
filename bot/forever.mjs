/**
 * SharkD Forever Runner
 * Runs headless.mjs, auto-restarts on crash.
 * Bot self-exits at 27min. This script just relaunches it.
 * NO detached processes. NO new windows.
 */
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BOT_SCRIPT = join(__dirname, 'headless.mjs');

// Load .env.local if env vars aren't already set
const envFile = join(__dirname, '..', '.env.local');
try {
  const lines = readFileSync(envFile, 'utf8').split('\n');
  for (const line of lines) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
  console.log('[FOREVER] Loaded .env.local');
} catch {}

const MIN_BACKOFF = 3_000;
const MAX_BACKOFF = 60_000;
const HEALTHY_UPTIME = 60_000;

let backoff = MIN_BACKOFF;
let runCount = 0;

function launchBot() {
  runCount++;
  const startTime = Date.now();
  console.log(`\n[FOREVER] Run #${runCount} at ${new Date().toISOString()}`);

  const child = spawn('node', [BOT_SCRIPT], {
    cwd: join(__dirname, '..'),
    stdio: ['ignore', 'pipe', 'pipe'],
    env: process.env,
  });

  child.stdout.on('data', d => { try { process.stdout.write(d); } catch {} });
  child.stderr.on('data', d => { try { process.stderr.write(d); } catch {} });

  child.on('exit', (code) => {
    const uptime = Date.now() - startTime;
    if (uptime >= HEALTHY_UPTIME) backoff = MIN_BACKOFF;
    else backoff = Math.min(backoff * 2, MAX_BACKOFF);
    console.log(`[FOREVER] Exited (code=${code}, up=${(uptime/1000).toFixed(0)}s). Restart in ${backoff/1000}s...`);
    setTimeout(launchBot, backoff);
  });

  child.on('error', (err) => {
    console.error(`[FOREVER] Spawn error: ${err.message}`);
    backoff = Math.min(backoff * 2, MAX_BACKOFF);
    setTimeout(launchBot, backoff);
  });
}

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));
process.on('uncaughtException', (e) => console.error(`[FOREVER] ${e.message}`));
process.on('unhandledRejection', (e) => console.error(`[FOREVER] ${e?.message || e}`));

console.log('[FOREVER] SharkD Trading Bot Runner');
launchBot();
setInterval(() => {}, 30000);
