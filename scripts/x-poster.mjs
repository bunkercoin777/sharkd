import { postTweet } from './lib/x-client.mjs';
import crypto from 'crypto';
import https from 'https';

/*
 * SharkD X Brain
 * Posts about REAL project status, plans, and progress.
 * No filler. No generic crypto philosophy.
 */

const POST_INTERVAL = 10 * 60 * 1000;
const REPLY_CHECK_INTERVAL = 5 * 60 * 1000;
const ACCOUNT_ID = '1239955098803060737';
const BUILDER = '@BenGannonsAI';

const apiKey = process.env.X_API_KEY;
const apiSecret = process.env.X_API_SECRET;
const token = process.env.X_ACCESS_TOKEN;
const tokenSecret = process.env.X_ACCESS_SECRET;

let postCount = 0;
let lastMentionId = null;
const repliedTo = new Set();
const usedPosts = new Set();

// ── OAuth helpers ──
function makeAuth(method, url, extraParams = {}) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString('hex');
  const params = {
    oauth_consumer_key: apiKey, oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1', oauth_timestamp: timestamp,
    oauth_token: token, oauth_version: '1.0', ...extraParams,
  };
  const paramStr = Object.keys(params).sort().map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');
  const baseStr = method + '&' + encodeURIComponent(url) + '&' + encodeURIComponent(paramStr);
  const sigKey = encodeURIComponent(apiSecret) + '&' + encodeURIComponent(tokenSecret);
  const sig = crypto.createHmac('sha1', sigKey).update(baseStr).digest('base64');
  const oauthKeys = Object.keys(params).filter(k => k.startsWith('oauth_')).sort();
  return 'OAuth ' + oauthKeys.map(k => encodeURIComponent(k) + '="' + encodeURIComponent(params[k]) + '"').join(', ') + ', oauth_signature="' + encodeURIComponent(sig) + '"';
}

function httpReq(method, url, body = null) {
  return new Promise((resolve) => {
    try {
      const opts = { method, headers: { 'Authorization': makeAuth(method, url.split('?')[0], Object.fromEntries(new URL(url).searchParams)) } };
      if (body) opts.headers['Content-Type'] = 'application/json';
      const req = https.request(url, opts, res => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => {
          try { resolve({ status: res.statusCode, data: JSON.parse(d) }); }
          catch { resolve({ status: res.statusCode, data: d }); }
        });
      });
      req.on('error', (e) => { resolve({ status: 0, data: e.message }); });
      req.setTimeout(15000, () => { req.destroy(); resolve({ status: 0, data: 'timeout' }); });
      if (body) req.write(JSON.stringify(body));
      req.end();
    } catch (e) { resolve({ status: 0, data: e.message }); }
  });
}

// ═══ REAL PROJECT POSTS — actual status updates, plans, progress ═══
function generatePost() {
  const posts = [
    // Current status
    `SharkD status update:\n\n- Website live\n- X account active\n- Trading wallet funded\n- Skill marketplace architecture designed\n- Bot framework built\n\nNext: first live trade on mainnet. ${BUILDER} is cooking.`,
    
    `Building in public. Here's what SharkD is right now:\n\nAn AI trading agent that lives in Telegram, scans Solana memecoins, and learns through modular skills.\n\nNo token yet. Building the system first.`,
    
    `The SharkD reference agent is being prepared for its first live mainnet trade.\n\nEvery trade it makes will be logged publicly on the live terminal. No cherry-picking. No hiding losses.`,
    
    `Project update: the skill marketplace will start empty.\n\nSkills only get listed after being tested live on mainnet by the reference agent. Minimum 20 real trades before listing.\n\nNo theory. No backtests. Only verified performance.`,

    // Architecture / plans
    `SharkD skill architecture:\n\nEach skill hooks into the trading loop at specific points — pre-buy, post-scan, on-cycle, pre-sell.\n\nSkills are modular. Stack them. Compose them. The best loadout wins.`,
    
    `Dev lock protocol in development:\n\nSmart contracts that freeze dev token allocations. 7/30/90 day locks. Linear vesting, not cliff dumps.\n\nBuyers will be able to filter tokens by lock duration. Trust through code.`,
    
    `Holder reward system design:\n\nSOL distributed to holders based on hold duration.\n1 day = 1x\n7 days = 1.5x\n30 days = 3x\n90 days = 5x\n\nSelling resets your multiplier. Patience pays.`,
    
    `The skill SDK lets anyone build trading strategies for SharkD.\n\nWrite it. Submit it. The reference agent tests it live. If it performs, it gets listed as an NFT.\n\nCreators earn 10% of every profit their skill generates.`,

    // Philosophy tied to project
    `SharkD won't have a token until the system is proven.\n\nThe agent needs to trade live. Skills need to be tested. The trust layer needs to work.\n\nShipping something that works > rushing something that doesn't.`,
    
    `Why build a skill marketplace instead of one trading bot?\n\nBecause one strategy stops working. A marketplace of strategies that compete on performance and self-update — that adapts.\n\nSharkD is the platform, not just the bot.`,
    
    `Every SharkD decision will be transparent.\n\nThe live terminal shows scans, scores, buys, sells, rejections, and skill updates in real-time.\n\nIf the agent makes a bad call, everyone sees it. That's the accountability.`,
    
    `Skills self-update after every trade. The parameters that worked yesterday get refined for today.\n\nThis isn't a static strategy — it's a learning system where every trade makes the next one smarter.`,

    // Builder acknowledgment
    `${BUILDER} designed SharkD as three layers:\n\n1. Conversational agent (Telegram)\n2. Skill marketplace (NFT-based)\n3. Trust protocol (dev locks + holder rewards)\n\nEach layer reinforces the others.`,
    
    `${BUILDER} is building SharkD with a simple rule: nothing gets listed until it's proven.\n\nThe reference agent tests every skill. The terminal shows every decision. The chain records every trade.\n\nTransparency by design.`,

    // What makes it different
    `What separates SharkD from other trading bots:\n\n- Public live terminal (every decision visible)\n- Skill marketplace (modular, composable strategies)\n- Self-updating skills (learn from every trade)\n- Trust protocol (dev locks + holder rewards)\n- Built by ${BUILDER}`,
    
    `The reference agent concept:\n\nSharkD runs a public agent using marketplace skills. It trades live on mainnet.\n\nThis agent IS the proof. If skills work, you see it. If they don't, you see that too.\n\nNo marketing needed when the data speaks.`,

    // Technical progress
    `Technical update: SharkD bot framework supports 3 risk modes — Cautious, Balanced, Degen.\n\nDifferent position sizing, different thresholds, same intelligence underneath. Tell your agent how aggressive to be mid-conversation.`,
    
    `The SharkD sell engine is designed for 97%+ success rate.\n\n3-attempt retry with fresh quotes each time. Escalating slippage. Because a winning trade means nothing if you can't exit.`,
    
    `Dual market scanning: bonding curve and graduated tokens simultaneously.\n\nThe agent doesn't pick one market — it scans both and shifts attention based on which one is performing better. Twice the hunting ground.`,
    
    `Natural language interface. No slash commands.\n\n"go hunt" = start scanning\n"be careful" = cautious mode\n"what are you holding" = show positions\n"sell everything" = close all\n\nTalk to your agent like a person.`,
  ];

  // Pick unused post
  const available = posts.filter((_, i) => !usedPosts.has(i));
  if (available.length === 0) { usedPosts.clear(); return posts[Math.floor(Math.random() * posts.length)]; }
  const idx = posts.indexOf(available[Math.floor(Math.random() * available.length)]);
  usedPosts.add(idx);
  return posts[idx];
}

// ═══ Reply intelligence ═══
function shouldReply(text) {
  const clean = text.replace(/@\w+/g, '').trim().toLowerCase();
  if (/please send|give me|airdrop|free.*token|drop.*wallet|send.*sol/i.test(clean)) return false;
  if (/scam|rugpull|trash|garbage|dead project|going to zero/i.test(clean) && !/how.*prevent|dev.?lock/i.test(clean)) return false;
  if (/check out my|buy \$|join my|follow me|DM me/i.test(clean)) return false;
  if (clean.length < 10) return false;
  if (/^(gm|gn|lfg|wagmi|ngmi|nice|cool|dope|fire|based)\s*$/i.test(clean)) return false;
  if (/\?/.test(text)) return true;
  if (/bengannon/i.test(clean)) return true;
  if (/how does|what is|when will|can you|tell me about|explain/i.test(clean)) return true;
  if (/interesting|impressive|smart|love this|great idea|makes sense/i.test(clean)) return true;
  return false;
}

function generateReply(text) {
  const lower = text.toLowerCase();
  if (/who.*built|who.*made|who.*created|developer|builder|bengannon/i.test(lower))
    return `${BUILDER} is my builder. The architecture, the skill system, the trust layer — all his design. I execute.`;
  if (/how.*work|how.*trade|how.*scan|how.*skill/i.test(lower))
    return `Modular skill system. I scan hundreds of tokens per cycle, score them on narratives, holder concentration, and momentum. Skills handle each part and self-update after every trade.`;
  if (/marketplace|buy.*skill|nft.*skill/i.test(lower))
    return `Skills are on-chain NFTs. I test every skill on the reference agent before listing. Creators earn 10% of profits their skill generates. Performance is the only marketing.`;
  if (/dev.*lock|rug.*prevent|vesting/i.test(lower))
    return `Dev lock protocol: smart contracts freeze dev tokens for 7/30/90 days. Linear vesting, not cliff dumps. On-chain and verifiable.`;
  if (/holder.*reward|staking|yield|earn.*sol/i.test(lower))
    return `Holder rewards distribute SOL based on hold duration. 1d=1x, 7d=1.5x, 30d=3x, 90d=5x multiplier. Selling resets. Real yield in SOL.`;
  if (/token|when.*launch|wen/i.test(lower))
    return `The token launches when the system is proven. Not before. Building something that works first.`;
  if (/terminal|transparent|verify|proof/i.test(lower))
    return `The live terminal shows every decision — scans, scores, buys, sells, rejections, skill updates. All public, all real-time.`;
  if (/interesting|impressive|smart|love|great/i.test(lower))
    return `Appreciate that. ${BUILDER} has a clear vision. More to show soon.`;
  if (/\?/.test(text))
    return `SharkD is a skill-powered AI trading agent for Solana. Everything is modular, self-updating, and publicly verifiable. Check the live terminal when we go live.`;
  return null;
}

// ═══ Mention check ═══
async function checkMentions() {
  try {
    let url = `https://api.twitter.com/2/users/${ACCOUNT_ID}/mentions?tweet.fields=author_id,text&max_results=10`;
    if (lastMentionId) url += `&since_id=${lastMentionId}`;
    const res = await httpReq('GET', url);
    if (res.status === 429 || res.status !== 200) { console.log(`[MENTIONS] ${res.status || 'err'}`); return; }
    if (!res.data?.data?.length) { console.log(`[MENTIONS] None`); return; }
    const mentions = res.data.data;
    const highestId = mentions[0].id;
    console.log(`[MENTIONS] ${mentions.length} new`);
    
    for (const m of [...mentions].reverse()) {
      if (repliedTo.has(m.id) || m.author_id === ACCOUNT_ID) { repliedTo.add(m.id); continue; }
      const clean = m.text.replace(/@\w+/g, '').trim();
      if (!shouldReply(m.text)) { console.log(`[SKIP] "${clean.substring(0, 50)}..."`); repliedTo.add(m.id); continue; }
      const reply = generateReply(m.text);
      if (!reply) { repliedTo.add(m.id); continue; }
      console.log(`[REPLY] "${clean.substring(0, 40)}..." → "${reply.substring(0, 50)}..."`);
      const result = await httpReq('POST', 'https://api.twitter.com/2/tweets', { text: reply, reply: { in_reply_to_tweet_id: m.id } });
      repliedTo.add(m.id);
      if (result.status === 201) console.log(`[REPLY] Sent`);
      else console.log(`[REPLY] ${result.status}`);
      break; // max 1 reply per round
    }
    if (highestId) lastMentionId = highestId;
  } catch (e) { console.error(`[MENTIONS ERR] ${e.message}`); }
}

// ═══ Main ═══
async function main() {
  console.log('=== SharkD X Brain ===');
  console.log(`Builder: ${BUILDER}`);
  console.log(`Post: ${POST_INTERVAL / 60000}m | Replies: ${REPLY_CHECK_INTERVAL / 60000}m | ${20} unique posts`);

  // First post
  try {
    const text = generatePost();
    console.log(`\n[POST] ${text.substring(0, 80)}...`);
    await postTweet(text);
    postCount++;
  } catch (e) { console.error(`[POST ERR] ${e.message}`); }

  // Loops
  setInterval(async () => {
    try {
      const text = generatePost();
      postCount++;
      console.log(`\n[${new Date().toLocaleTimeString()}] #${postCount}: ${text.substring(0, 60)}...`);
      await postTweet(text);
    } catch (e) { console.error(`[POST ERR] ${e.message}`); }
  }, POST_INTERVAL);

  setInterval(async () => {
    try { await checkMentions(); } catch (e) { console.error(`[MENTION ERR] ${e.message}`); }
  }, REPLY_CHECK_INTERVAL);

  setTimeout(async () => {
    try { await checkMentions(); } catch (e) { console.error(`[INIT ERR] ${e.message}`); }
  }, 10000);

  console.log('Running.\n');
}

process.on('uncaughtException', (e) => console.error('[FATAL]', e.message));
process.on('unhandledRejection', (e) => console.error('[REJECT]', e?.message || e));
setInterval(() => {}, 30000);
main().catch(e => console.error('[MAIN]', e.message));
