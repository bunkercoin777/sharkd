// Crash-proof scheduler. Spawns a fresh process every 10 min.
import { execFile } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const script = join(__dirname, 'x-poster-single.mjs');
const INTERVAL = 10 * 60 * 1000;

function runPost() {
  console.log(`\n[${new Date().toLocaleTimeString()}] Running poster...`);
  const child = execFile('node', ['--env-file=.env.local', script], { cwd: join(__dirname, '..'), timeout: 60000 }, (err, stdout, stderr) => {
    if (stdout) console.log(stdout.trim());
    if (stderr) console.error(stderr.trim());
    if (err && err.killed) console.error('[TIMEOUT] Post script killed after 60s');
    else if (err) console.error(`[EXIT] code ${err.code}`);
  });
}

console.log('=== SharkD X Scheduler ===');
console.log(`Posting every ${INTERVAL / 60000} minutes via fresh subprocess`);
console.log('This process stays alive. Child crashes don\'t kill it.\n');

// First post now
runPost();

// Then every 10 min
setInterval(runPost, INTERVAL);

// Keepalive
setInterval(() => {}, 30000);
