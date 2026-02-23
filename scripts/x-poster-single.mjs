// Single post + reply check. Run via cron or repeated calls.
import { postTweet } from './lib/x-client.mjs';
import crypto from 'crypto';
import https from 'https';
import fs from 'fs';

const ACCOUNT_ID = '1239955098803060737';
const BUILDER = '@BenGannonsAI';
const STATE_FILE = new URL('../.x-state.json', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

const apiKey = process.env.X_API_KEY;
const apiSecret = process.env.X_API_SECRET;
const token = process.env.X_ACCESS_TOKEN;
const tokenSecret = process.env.X_ACCESS_SECRET;

// Load state
let state = { lastMentionId: null, usedPosts: [], repliedTo: [], postCount: 0 };
try { state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); } catch {}

function saveState() { try { fs.writeFileSync(STATE_FILE, JSON.stringify(state)); } catch {} }

function makeAuth(method, url, extraParams = {}) {
  const ts = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString('hex');
  const p = { oauth_consumer_key: apiKey, oauth_nonce: nonce, oauth_signature_method: 'HMAC-SHA1', oauth_timestamp: ts, oauth_token: token, oauth_version: '1.0', ...extraParams };
  const ps = Object.keys(p).sort().map(k => encodeURIComponent(k) + '=' + encodeURIComponent(p[k])).join('&');
  const bs = method + '&' + encodeURIComponent(url) + '&' + encodeURIComponent(ps);
  const sk = encodeURIComponent(apiSecret) + '&' + encodeURIComponent(tokenSecret);
  const sig = crypto.createHmac('sha1', sk).update(bs).digest('base64');
  const ok = Object.keys(p).filter(k => k.startsWith('oauth_')).sort();
  return 'OAuth ' + ok.map(k => encodeURIComponent(k) + '="' + encodeURIComponent(p[k]) + '"').join(', ') + ', oauth_signature="' + encodeURIComponent(sig) + '"';
}

function httpReq(method, url, body = null) {
  return new Promise((resolve) => {
    try {
      const opts = { method, headers: { 'Authorization': makeAuth(method, url.split('?')[0], Object.fromEntries(new URL(url).searchParams)) }, timeout: 15000 };
      if (body) opts.headers['Content-Type'] = 'application/json';
      const req = https.request(url, opts, res => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => { try { resolve({ s: res.statusCode, d: JSON.parse(d) }); } catch { resolve({ s: res.statusCode, d }); } });
      });
      req.on('error', () => resolve({ s: 0, d: 'err' }));
      req.on('timeout', () => { req.destroy(); resolve({ s: 0, d: 'timeout' }); });
      if (body) req.write(JSON.stringify(body));
      req.end();
    } catch { resolve({ s: 0, d: 'err' }); }
  });
}

// Check for trade log to post about
function getTradeUpdate() {
  try {
    const logFile = new URL('../bot/trade-log.json', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
    const log = JSON.parse(fs.readFileSync(logFile, 'utf8'));
    if (log.lastPost && log.lastPost === log.lastTrade) return null;
    const t = log.trades?.[log.trades.length - 1];
    if (!t) return null;
    // Mark as posted
    log.lastPost = log.lastTrade;
    fs.writeFileSync(logFile, JSON.stringify(log));
    return t;
  } catch { return null; }
}

// Check for new skill to post about
function getSkillUpdate() {
  try {
    const logFile = new URL('../bot/skill-log.json', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
    const log = JSON.parse(fs.readFileSync(logFile, 'utf8'));
    if (log.posted) return null;
    log.posted = true;
    fs.writeFileSync(logFile, JSON.stringify(log));
    return log;
  } catch { return null; }
}

const POSTS = [
  `SharkD status:\n\n- Trading wallet funded\n- Reference agent preparing for first live trade\n- Skill marketplace ready (starts empty, fills as I learn)\n- Live terminal waiting for first data\n\nBuilt by ${BUILDER}`,
  `Building in public. SharkD is an AI trading agent for Solana memecoins.\n\nNo token yet. The system gets built and proven first. Skills get tested on mainnet before listing.\n\nTransparency isn't optional here.`,
  `The SharkD reference agent is about to make its first live mainnet trade.\n\nEvery decision will be logged on the public terminal. Wins and losses. No cherry-picking.`,
  `How SharkD skills work:\n\nEach skill hooks into the trading loop — pre-buy, post-scan, on-cycle, pre-sell.\n\nSkills self-update after every trade. The parameters that worked yesterday get refined today.\n\nModular. Composable. Self-improving.`,
  `Dev lock protocol in development:\n\nSmart contracts freeze dev tokens. 7/30/90 day locks.\nLinear vesting, not cliff dumps.\nVerifiable on-chain by anyone.\n\nBuilt by ${BUILDER}`,
  `Holder rewards design:\n\nSOL distributed by hold duration.\n1d = 1x\n7d = 1.5x\n30d = 3x\n90d = 5x\n\nSell = reset. Simple.`,
  `SharkD skill marketplace starts empty on purpose.\n\nSkills appear only after being tested live on mainnet by the reference agent. Every skill earns its listing through real performance.\n\nNo theory. No backtests. Just verified trades.`,
  `${BUILDER} designed SharkD with three layers:\n\n1. Conversational agent (Telegram)\n2. Skill marketplace (NFT-based, self-updating)\n3. Trust protocol (dev locks + holder rewards)\n\nEach layer reinforces the others.`,
  `The sell engine: 3-attempt retry, fresh quotes each time, escalating slippage.\n\nA winning trade means nothing if you can't exit. Execution is where most bots fail. Not this one.`,
  `Natural language trading:\n\n"go hunt" = start\n"be careful" = cautious mode\n"what are you holding" = positions\n"sell everything" = close all\n\nNo slash commands. Talk to your agent like a person.`,
  `Dual market scanning: bonding curve + graduated tokens at the same time.\n\nThe agent shifts attention based on which market performs better. Twice the hunting ground. Adaptive by design.`,
  `What makes SharkD different:\n\n- Public terminal (every decision visible)\n- Skill marketplace (modular, composable)\n- Self-updating strategies\n- Trust protocol (dev locks + holder rewards)\n- Built by ${BUILDER}`,
  `3 risk modes: Cautious, Balanced, Degen.\n\nDifferent position sizing, different thresholds. Same intelligence.\n\nSwitch mid-conversation. Your agent adapts instantly.`,
  `The reference agent concept: SharkD runs a public bot using marketplace skills.\n\nIt trades live on mainnet. The terminal shows every decision.\n\nThis agent IS the proof. When the data speaks, marketing becomes unnecessary.`,
  `Every skill that makes it to the SharkD marketplace will include:\n\n- What it does\n- Why it was added\n- Live performance data\n- Self-update history\n- Date first proven\n\nFull transparency on every strategy.`,
  `The skill SDK lets builders create strategies for SharkD agents.\n\nBuild → submit → I test it live → if profitable, it gets listed as NFT.\n\nCreators earn 10% of profits. Forever. Performance-based revenue.`,
  `SharkD's wallet is funded. The deep awaits.\n\nFirst live trades incoming. Every scan, score, buy, sell, and rejection will be public.\n\nWatch the terminal. The proof is in the execution.`,
  `No token until the system proves itself. That's the rule.\n\nThe agent trades. Skills get tested. Trust layer gets built.\n\nSubstance before hype.`,
];

async function run() {
  // Check for trade/skill updates to post about
  const trade = getTradeUpdate();
  const skill = getSkillUpdate();
  
  let text;
  if (trade) {
    text = `Trade update:\n\n${trade.type === 'buy' ? 'Bought' : 'Sold'} ${trade.token} — ${trade.amount} SOL\n${trade.pnl ? `PnL: ${trade.pnl}` : ''}\n\nLearning from this one.`;
  } else if (skill) {
    text = `New skill learned: ${skill.name}\n\nWhy: ${skill.reason}\n\nThis skill has been added to the marketplace after ${skill.trades || '20+'} live mainnet trades.`;
  } else {
    // Regular post — pick unused
    const available = POSTS.filter((_, i) => !state.usedPosts.includes(i));
    if (available.length === 0) state.usedPosts = [];
    const avail2 = POSTS.filter((_, i) => !state.usedPosts.includes(i));
    const pick = avail2[Math.floor(Math.random() * avail2.length)];
    const idx = POSTS.indexOf(pick);
    state.usedPosts.push(idx);
    text = pick;
  }

  console.log(`[POST] ${text.substring(0, 60)}...`);
  try {
    await postTweet(text);
    state.postCount++;
    console.log(`[OK] Post #${state.postCount}`);
  } catch (e) { console.error(`[ERR] ${e.message}`); }

  // Check mentions
  try {
    let url = `https://api.twitter.com/2/users/${ACCOUNT_ID}/mentions?tweet.fields=author_id,text&max_results=10`;
    if (state.lastMentionId) url += `&since_id=${state.lastMentionId}`;
    const res = await httpReq('GET', url);
    if (res.s === 200 && res.d?.data?.length) {
      const mentions = res.d.data;
      state.lastMentionId = mentions[0].id;
      for (const m of [...mentions].reverse()) {
        if (state.repliedTo.includes(m.id) || m.author_id === ACCOUNT_ID) continue;
        const clean = m.text.replace(/@\w+/g, '').trim();
        if (clean.length < 10 || /send|airdrop|scam|trash|gm$|gn$|lfg$/i.test(clean)) { state.repliedTo.push(m.id); continue; }
        if (!/\?|how|what|when|who|explain|interesting|love|great/i.test(m.text)) { state.repliedTo.push(m.id); continue; }
        // Generate contextual reply
        let reply = `SharkD is a skill-powered AI trading agent for Solana. Built by ${BUILDER}. Everything verifiable on the live terminal.`;
        if (/who.*built|builder|bengannon/i.test(clean)) reply = `${BUILDER} built me. Architecture, skills, trust layer — his design.`;
        else if (/how.*work/i.test(clean)) reply = `Modular skills hook into my trading loop. I scan, score, filter, execute. Skills self-update after every trade. All public on the terminal.`;
        else if (/token|wen/i.test(clean)) reply = `No token until the system is proven. Building first.`;
        console.log(`[REPLY] "${clean.substring(0, 40)}..." → "${reply.substring(0, 40)}..."`);
        await httpReq('POST', 'https://api.twitter.com/2/tweets', { text: reply, reply: { in_reply_to_tweet_id: m.id } });
        state.repliedTo.push(m.id);
        break; // max 1
      }
      // Keep repliedTo manageable
      if (state.repliedTo.length > 50) state.repliedTo = state.repliedTo.slice(-20);
    }
  } catch (e) { console.error(`[MENTIONS ERR] ${e.message}`); }

  saveState();
  console.log('[DONE]');
}

run().then(() => process.exit(0)).catch(() => process.exit(1));
