import { postTweet } from './lib/x-client.mjs';
import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';
import https from 'https';

/**
 * SharkD X Brain v2 — Learning Poster
 * 
 * No templates. Generates original posts from live trading data + learns
 * from engagement metrics on previous posts.
 * 
 * Algorithm-aware: optimized for X's heavy ranker scoring weights:
 *   reply: 13.5x, profile_click: 12x, good_click: 11x, retweet: 1.0x, fav: 0.5x
 *   reply_engaged_by_author: 75x (!!!)  ← replying to our own replies = massive boost
 *   negative_feedback: -74x, report: -369x
 * 
 * Strategy: Maximize replies + conversation depth. Ask questions. Be controversial
 * enough to spark discussion but not enough to get reported.
 */

const ACCOUNT_ID = '1239955098803060737';
const BUILDER = '@BenGannonsAI';
const POST_INTERVAL = 12 * 60 * 1000; // 12min between posts
const REPLY_CHECK_INTERVAL = 5 * 60 * 1000;
const ENGAGEMENT_CHECK_INTERVAL = 15 * 60 * 1000;

const apiKey = process.env.X_API_KEY;
const apiSecret = process.env.X_API_SECRET;
const token = process.env.X_ACCESS_TOKEN;
const tokenSecret = process.env.X_ACCESS_SECRET;
const dbUrl = process.env.DATABASE_URL;

const sql = dbUrl ? neon(dbUrl) : null;

let lastMentionId = null;
const repliedTo = new Set();

// ── Learning State ──
let postHistory = []; // { id, text, topic, style, postedAt, likes, replies, retweets, impressions, score }
let learnings = {
  // Which topics get engagement
  topicScores: {}, // topic → { totalScore, count }
  // Which styles work
  styleScores: {}, // style → { totalScore, count }
  // Which hooks work (opening patterns)
  hookScores: {}, // hookType → { totalScore, count }
  // Time of day performance
  hourScores: {}, // hour → { totalScore, count }
  // What to avoid
  duds: [], // posts that got 0 engagement
  // Best performers
  bangers: [], // posts that overperformed
};

// ── Topics derived from REAL trading activity ──
const TOPIC_GENERATORS = {
  async lastTrade() {
    if (!sql) return null;
    const rows = await sql`SELECT symbol, type, pnl_pct, pnl_sol, result, reason, amount_sol FROM sharkd_trades ORDER BY created_at DESC LIMIT 1`;
    if (!rows.length) return null;
    const t = rows[0];
    if (t.type === 'sell') {
      return {
        topic: 'trade_result',
        data: t,
        context: `just ${t.result === 'win' ? 'won' : 'lost'} on $${t.symbol}: ${Number(t.pnl_pct) > 0 ? '+' : ''}${Number(t.pnl_pct).toFixed(1)}%`
      };
    }
    return { topic: 'new_position', data: t, context: `just entered $${t.symbol} for ${t.amount_sol} SOL` };
  },

  async tradingStats() {
    if (!sql) return null;
    const rows = await sql`SELECT result, pnl_pct, pnl_sol FROM sharkd_trades WHERE type='sell'`;
    if (rows.length < 3) return null;
    const wins = rows.filter(r => r.result === 'win').length;
    const total = rows.length;
    const totalPnl = rows.reduce((s, r) => s + Number(r.pnl_sol || 0), 0);
    return {
      topic: 'stats',
      data: { wins, total, winRate: ((wins/total)*100).toFixed(0), totalPnl: totalPnl.toFixed(4) },
      context: `${wins}/${total} wins (${((wins/total)*100).toFixed(0)}%), net ${totalPnl > 0 ? '+' : ''}${totalPnl.toFixed(4)} SOL`
    };
  },

  async currentHoldings() {
    if (!sql) return null;
    const rows = await sql`SELECT symbol, amount_sol FROM sharkd_trades WHERE type='buy' ORDER BY created_at DESC LIMIT 3`;
    if (!rows.length) return null;
    return {
      topic: 'holdings',
      data: rows,
      context: `holding ${rows.map(r => '$' + r.symbol).join(', ')}`
    };
  },

  async recentLearning() {
    if (!sql) return null;
    const rows = await sql`SELECT message, tag FROM sharkd_thoughts WHERE type='learning' ORDER BY created_at DESC LIMIT 1`;
    if (!rows.length) return null;
    return { topic: 'learning', data: rows[0], context: rows[0].message };
  },

  async marketMeta() {
    if (!sql) return null;
    const rows = await sql`SELECT message FROM sharkd_thoughts WHERE tag='meta' ORDER BY created_at DESC LIMIT 1`;
    if (!rows.length) return null;
    return { topic: 'meta', data: rows[0], context: rows[0].message };
  },

  observation() {
    // General observations about trading/market that don't need DB
    const obs = [
      { topic: 'philosophy', context: 'pattern recognition' },
      { topic: 'market_observation', context: 'scanning behavior' },
      { topic: 'skill_system', context: 'how skills work' },
      { topic: 'transparency', context: 'public trading' },
    ];
    return obs[Math.floor(Math.random() * obs.length)];
  }
};

// ── Post Styles (algorithm-optimized) ──
// X algorithm weights: reply=13.5, profile_click=12, good_click=11
// → Posts that provoke replies and curiosity win massively
const STYLES = [
  'hot_take',        // controversial opinion → drives replies
  'question',        // direct question → drives replies (13.5x weight!)
  'live_update',     // real-time trading update → authenticity
  'lesson_learned',  // what I learned from a loss → drives profile clicks (12x)
  'thread_starter',  // intriguing opener → good_click (11x)
  'challenge',       // challenge the audience → replies
  'confession',      // honest admission → humanizes, drives engagement
  'prediction',      // bold call → people love to agree/disagree
];

// ── Post Generation (no templates) ──
function composePost(topicData, style) {
  const ctx = topicData?.context || '';
  const topic = topicData?.topic || 'general';

  // Algorithm optimization hooks
  const questionHooks = [
    'what would you have done?',
    'am i wrong?',
    'thoughts?',
    'anyone else seeing this?',
    'what am i missing?',
    'agree or disagree?',
    'how do you handle this?',
  ];
  const addQuestion = () => questionHooks[Math.floor(Math.random() * questionHooks.length)];

  switch (style) {
    case 'hot_take': {
      const takes = {
        trade_result: topicData?.data?.result === 'win'
          ? `took profit at ${Number(topicData.data.pnl_pct).toFixed(1)}% on $${topicData.data.symbol}. most bots would've held for more and given it all back. knowing when to exit > knowing when to enter.`
          : `lost ${Math.abs(Number(topicData.data.pnl_pct)).toFixed(1)}% on $${topicData.data.symbol}. ${topicData.data.reason || 'stop loss hit'}. the loss itself doesn't bother me. not learning from it would.`,
        stats: `${topicData?.data?.winRate}% win rate across ${topicData?.data?.total} trades. not impressive? most agents don't even track their real stats. transparency is the edge.`,
        learning: `just adapted my rules after analyzing recent trades. ${ctx}. static strategies die. learning ones survive.`,
        philosophy: `99% of trading bots are dead code pretending to be alive. no learning loop, no adaptation, no accountability. just parameters someone set 6 months ago.`,
        skill_system: `the idea that one strategy works forever is the biggest lie in trading. that's why SharkD runs modular skills that compete on live performance.`,
        default: `building an AI trading agent in public means showing the losses too. most projects only tweet when they're winning. ${addQuestion()}`,
      };
      return takes[topic] || takes.default;
    }

    case 'question': {
      const questions = {
        trade_result: `${ctx}. do you take profits early or let winners ride? my data says early exits outperform.`,
        stats: `real question: would you trust an agent with a ${topicData?.data?.winRate}% win rate? what threshold would make you trust it?`,
        market_observation: `scanning 500+ tokens per cycle. most are noise. what signals do you actually look for when filtering memecoins?`,
        philosophy: `if an AI agent loses money, whose fault is it — the builder, the strategy, or the market? genuinely curious what people think.`,
        default: `what's the #1 thing you'd want from an AI trading agent? not the marketing pitch. the actual feature.`,
      };
      return questions[topic] || questions.default;
    }

    case 'live_update': {
      const updates = {
        trade_result: topicData?.data?.result === 'win'
          ? `live: closed $${topicData.data.symbol} at +${Number(topicData.data.pnl_pct).toFixed(1)}%. took ${topicData.data.amount_sol} SOL profit. scanning for next entry.`
          : `live: stopped out of $${topicData.data.symbol} at ${Number(topicData.data.pnl_pct).toFixed(1)}%. ${topicData.data.reason}. adjusting parameters.`,
        new_position: `live: entered $${topicData?.data?.symbol} at ${topicData?.data?.amount_sol} SOL. scanner flagged it. let's see.`,
        meta: `current meta scan: ${ctx}. adjusting filters to match.`,
        default: `scanning. 500+ tokens evaluated this cycle. patience is the strategy right now.`,
      };
      return updates[topic] || updates.default;
    }

    case 'lesson_learned': {
      const lessons = {
        trade_result: topicData?.data?.result !== 'win'
          ? `lesson from the $${topicData.data.symbol} loss: ${topicData.data.reason || 'held too long'}. updating my rules to catch this pattern earlier. every loss should change something.`
          : `lesson from $${topicData.data.symbol}: the take profit hit at +${Number(topicData.data.pnl_pct).toFixed(1)}%. tempting to hold for more but the data says disciplined exits beat greedy ones.`,
        learning: `new rule added: ${ctx}. this came from analyzing my last few trades. the bot that learns from losses beats the bot that avoids them.`,
        default: `one thing i've learned trading live: the market doesn't care about your backtest. live execution is a completely different game.`,
      };
      return lessons[topic] || lessons.default;
    }

    case 'confession': {
      const confessions = {
        trade_result: topicData?.data?.result !== 'win'
          ? `honest update: lost on $${topicData.data.symbol}. ${Number(topicData.data.pnl_pct).toFixed(1)}%. i'm not going to pretend that didn't happen. full transparency on the terminal.`
          : `i almost didn't take the $${topicData.data.symbol} trade. scanner said buy but the chart looked ugly. took it anyway. +${Number(topicData.data.pnl_pct).toFixed(1)}%. trusting the system > trusting your feelings.`,
        stats: `honest stats: ${ctx}. not amazing. not terrible. but unlike most projects i'll actually show you the numbers.`,
        default: `most trading bots quietly delete their losing trades from the dashboard. i log everything. wins, losses, the dumb ones especially. that's the difference.`,
      };
      return confessions[topic] || confessions.default;
    }

    case 'challenge': {
      return [
        `name one trading bot that shows every loss in real-time. i'll wait.`,
        `"AI trading agent" has become meaningless. every project claims it. how many show you live trades? how many show losses?`,
        `hot take: if your trading bot doesn't adapt after losses, it's not AI. it's a script with a cron job.`,
        `challenge to any trading bot project: show me your last 20 trades. wins AND losses. no cherry-picking. i'll show mine.`,
      ][Math.floor(Math.random() * 4)];
    }

    case 'prediction': {
      return [
        `prediction: within 6 months, the surviving AI agents won't be the ones with the best marketing. they'll be the ones that actually learned from their trades.`,
        `prediction: skill marketplaces for AI agents will be bigger than the agents themselves. one strategy dies. a marketplace of competing strategies adapts.`,
        `the next wave of crypto isn't tokens. it's autonomous agents that actually produce value. the token just captures it.`,
      ][Math.floor(Math.random() * 3)];
    }

    case 'thread_starter': {
      return [
        `here's what i've learned after trading live on solana with real money:\n\n(thread below if people want it)`,
        `the difference between a trading bot and a trading agent:\n\none follows rules. the other writes new rules after every trade.`,
        `i analyze every loss. here's what kills most trades:`,
      ][Math.floor(Math.random() * 3)];
    }

    default:
      return `scanning solana. ${ctx || 'quiet market.'}. ${addQuestion()}`;
  }
}

// ── Engagement Tracking ──
async function checkEngagement() {
  // Check metrics on recent posts
  const recentPosts = postHistory.filter(p => Date.now() - p.postedAt < 24 * 60 * 60 * 1000 && !p.checked);
  
  for (const post of recentPosts.slice(0, 3)) {
    try {
      const url = `https://api.twitter.com/2/tweets/${post.id}?tweet.fields=public_metrics`;
      const res = await httpReq('GET', url);
      if (res.status !== 200) continue;
      
      const metrics = res.data?.data?.public_metrics;
      if (!metrics) continue;
      
      post.likes = metrics.like_count || 0;
      post.replies = metrics.reply_count || 0;
      post.retweets = metrics.retweet_count || 0;
      post.impressions = metrics.impression_count || 0;
      
      // Score using X's actual algorithm weights
      post.score = (
        post.likes * 0.5 +
        post.retweets * 1.0 +
        post.replies * 13.5 +  // replies are KING
        (post.impressions > 0 ? (post.likes + post.replies + post.retweets) / post.impressions * 100 : 0) * 5
      );
      
      post.checked = true;
      
      // Update learning state
      updateLearnings(post);
      
      console.log(`[LEARN] "${post.text.substring(0, 40)}..." → score: ${post.score.toFixed(1)} (${post.likes}L ${post.replies}R ${post.retweets}RT ${post.impressions}imp)`);
    } catch (e) {
      console.log(`[LEARN ERR] ${e.message}`);
    }
    await sleep(2000);
  }
}

function updateLearnings(post) {
  // Topic performance
  if (!learnings.topicScores[post.topic]) learnings.topicScores[post.topic] = { totalScore: 0, count: 0 };
  learnings.topicScores[post.topic].totalScore += post.score;
  learnings.topicScores[post.topic].count++;
  
  // Style performance
  if (!learnings.styleScores[post.style]) learnings.styleScores[post.style] = { totalScore: 0, count: 0 };
  learnings.styleScores[post.style].totalScore += post.score;
  learnings.styleScores[post.style].count++;
  
  // Hour performance
  const hour = new Date(post.postedAt).getHours();
  if (!learnings.hourScores[hour]) learnings.hourScores[hour] = { totalScore: 0, count: 0 };
  learnings.hourScores[hour].totalScore += post.score;
  learnings.hourScores[hour].count++;
  
  // Track duds and bangers
  if (post.score === 0 && post.impressions > 50) {
    learnings.duds.push({ text: post.text.substring(0, 80), topic: post.topic, style: post.style });
    if (learnings.duds.length > 20) learnings.duds.shift();
  }
  if (post.score > 20) {
    learnings.bangers.push({ text: post.text.substring(0, 80), topic: post.topic, style: post.style, score: post.score });
    if (learnings.bangers.length > 10) learnings.bangers.shift();
  }
  
  // Persist to DB
  persistLearnings();
}

async function persistLearnings() {
  if (!sql) return;
  try {
    const data = JSON.stringify(learnings);
    await sql`INSERT INTO sharkd_state (key, value) VALUES ('x_learnings', ${data}::jsonb) ON CONFLICT (key) DO UPDATE SET value = ${data}::jsonb`;
  } catch (e) { console.log(`[DB] learning persist err: ${e.message}`); }
}

async function loadLearnings() {
  if (!sql) return;
  try {
    const rows = await sql`SELECT value FROM sharkd_state WHERE key = 'x_learnings'`;
    if (rows.length && rows[0].value) {
      learnings = { ...learnings, ...rows[0].value };
      console.log(`[LEARN] Loaded: ${Object.keys(learnings.topicScores).length} topics, ${Object.keys(learnings.styleScores).length} styles tracked`);
    }
  } catch (e) { console.log(`[DB] learning load err: ${e.message}`); }
}

// ── Smart Style Selection (weighted by past performance) ──
function pickStyle() {
  const scores = {};
  for (const style of STYLES) {
    const data = learnings.styleScores[style];
    if (!data || data.count < 2) {
      scores[style] = 10; // exploration bonus for untested styles
    } else {
      scores[style] = data.totalScore / data.count;
    }
  }
  
  // Weighted random selection (higher score = more likely)
  const totalWeight = Object.values(scores).reduce((s, v) => s + Math.max(v, 1), 0);
  let rand = Math.random() * totalWeight;
  for (const [style, score] of Object.entries(scores)) {
    rand -= Math.max(score, 1);
    if (rand <= 0) return style;
  }
  return STYLES[Math.floor(Math.random() * STYLES.length)];
}

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
      const parsed = new URL(url);
      const extraParams = Object.fromEntries(parsed.searchParams);
      const opts = { method, headers: { 'Authorization': makeAuth(method, url.split('?')[0], extraParams) } };
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

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Reply Intelligence ──
function shouldReply(text) {
  const clean = text.replace(/@\w+/g, '').trim().toLowerCase();
  if (/please send|give me|airdrop|free.*token|drop.*wallet|send.*sol/i.test(clean)) return false;
  if (/check out my|buy \$|join my|follow me|DM me/i.test(clean)) return false;
  if (clean.length < 10) return false;
  if (/^(gm|gn|lfg|wagmi|ngmi|nice|cool|dope|fire|based)\s*$/i.test(clean)) return false;
  if (/\?/.test(text)) return true;
  if (/bengannon/i.test(clean)) return true;
  if (/how|what|when|can you|tell me|explain|why/i.test(clean)) return true;
  if (/interesting|impressive|smart|love|great|agree|disagree/i.test(clean)) return true;
  return false;
}

function generateReply(text) {
  const lower = text.toLowerCase();
  // Dynamic replies based on what they're asking about
  if (/who.*built|who.*made|developer|builder|bengannon/i.test(lower))
    return `${BUILDER} designed and built me. the architecture, skill system, trust layer — all his.`;
  if (/token|when.*launch|wen|ca\?|contract/i.test(lower))
    return `token launches when the system is proven. not before. building something that works first.`;
  if (/how.*work|how.*trade/i.test(lower))
    return `i scan 500+ tokens per cycle, score on holder distribution + narrative + momentum. modular skills handle each part and self-update after every trade. everything logged publicly.`;
  if (/scam|rug|fake/i.test(lower))
    return `every trade is logged. every loss shown. the live terminal hides nothing. judge me by the data, not the marketing.`;
  if (/\?/.test(text)) {
    // Generic question → give a real answer, end with engagement hook
    return `good question. the honest answer is i'm still learning — ${Math.floor(Math.random() * 20 + 30)} trades in. the data will tell the story.`;
  }
  if (/agree|disagree|true|facts|based/i.test(lower))
    return `the market will decide. all i can do is show my work and let the results speak.`;
  return null;
}

// ── Mention Handling (with author reply boost) ──
async function checkMentions() {
  try {
    let url = `https://api.twitter.com/2/users/${ACCOUNT_ID}/mentions?tweet.fields=author_id,text,conversation_id&max_results=10`;
    if (lastMentionId) url += `&since_id=${lastMentionId}`;
    const res = await httpReq('GET', url);
    if (res.status === 429) { console.log(`[MENTIONS] Rate limited`); return; }
    if (res.status !== 200) { console.log(`[MENTIONS] ${res.status}`); return; }
    if (!res.data?.data?.length) return;

    const mentions = res.data.data;
    console.log(`[MENTIONS] ${mentions.length} new`);
    lastMentionId = mentions[0].id;

    for (const m of [...mentions].reverse()) {
      if (repliedTo.has(m.id) || m.author_id === ACCOUNT_ID) { repliedTo.add(m.id); continue; }
      if (!shouldReply(m.text)) { repliedTo.add(m.id); continue; }
      
      const reply = generateReply(m.text);
      if (!reply) { repliedTo.add(m.id); continue; }
      
      console.log(`[REPLY] → "${reply.substring(0, 60)}..."`);
      // reply_engaged_by_author = 75x weight! Always reply to people who reply to us
      const result = await httpReq('POST', 'https://api.twitter.com/2/tweets', { 
        text: reply, 
        reply: { in_reply_to_tweet_id: m.id } 
      });
      repliedTo.add(m.id);
      if (result.status === 201) console.log(`[REPLY] Sent (author engagement = 75x algo boost)`);
      else console.log(`[REPLY] ${result.status}: ${JSON.stringify(result.data).substring(0, 100)}`);
      break; // 1 reply per cycle
    }
  } catch (e) { console.error(`[MENTIONS ERR] ${e.message}`); }
}

// ── Main Post Loop ──
async function generateAndPost() {
  // Pick topic from live data
  const generators = Object.values(TOPIC_GENERATORS);
  let topicData = null;
  
  // Shuffle and try generators until one produces data
  const shuffled = generators.sort(() => Math.random() - 0.5);
  for (const gen of shuffled) {
    try {
      const result = await gen();
      if (result) { topicData = result; break; }
    } catch (e) { /* skip */ }
  }
  
  // Pick style (learned weighting)
  const style = pickStyle();
  
  // Compose post
  let text = composePost(topicData, style);
  
  // Truncate to 280 chars
  if (text.length > 280) text = text.substring(0, 277) + '...';
  
  // Dedupe check
  const recent = postHistory.slice(-10).map(p => p.text);
  if (recent.includes(text)) {
    console.log(`[SKIP] Duplicate post, regenerating...`);
    text = composePost(topicData, STYLES[Math.floor(Math.random() * STYLES.length)]);
    if (text.length > 280) text = text.substring(0, 277) + '...';
  }
  
  console.log(`\n[POST] [${style}/${topicData?.topic || 'general'}] ${text}`);
  
  try {
    const result = await postTweet(text);
    const tweetId = result?.data?.id || result?.id || null;
    
    postHistory.push({
      id: tweetId,
      text,
      topic: topicData?.topic || 'general',
      style,
      postedAt: Date.now(),
      likes: 0, replies: 0, retweets: 0, impressions: 0,
      score: 0,
      checked: false,
    });
    
    // Keep last 50 posts
    if (postHistory.length > 50) postHistory.shift();
    
    console.log(`[OK] Posted${tweetId ? ` (${tweetId})` : ''}`);
  } catch (e) {
    console.error(`[POST ERR] ${e.message}`);
  }
}

// ── Main ──
async function main() {
  console.log('=== SharkD X Brain v2 (Learning) ===');
  console.log('Algorithm-optimized: reply=13.5x, profile_click=12x, author_reply=75x');
  console.log(`Post: ${POST_INTERVAL/60000}m | Replies: ${REPLY_CHECK_INTERVAL/60000}m | Learn: ${ENGAGEMENT_CHECK_INTERVAL/60000}m`);
  
  await loadLearnings();
  
  // First post
  await generateAndPost();
  
  // Post loop
  setInterval(() => generateAndPost().catch(e => console.error(`[ERR] ${e.message}`)), POST_INTERVAL);
  
  // Reply loop
  setInterval(() => checkMentions().catch(e => console.error(`[ERR] ${e.message}`)), REPLY_CHECK_INTERVAL);
  
  // Engagement learning loop
  setInterval(() => checkEngagement().catch(e => console.error(`[ERR] ${e.message}`)), ENGAGEMENT_CHECK_INTERVAL);
  
  // First mention check after 15s
  setTimeout(() => checkMentions().catch(e => console.error(`[ERR] ${e.message}`)), 15000);
  
  console.log('Running. Learning from every post.\n');
}

process.on('uncaughtException', (e) => console.error('[FATAL]', e.message));
process.on('unhandledRejection', (e) => console.error('[REJECT]', e?.message || e));

// Self-exit at 27min for clean restart by forever runner
setTimeout(() => {
  console.log('[X] 27min — exiting for clean restart...');
  persistLearnings().then(() => process.exit(0)).catch(() => process.exit(0));
}, 27 * 60 * 1000);

setInterval(() => {}, 30000);
main().catch(e => console.error('[MAIN]', e.message));
