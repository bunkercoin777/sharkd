import { postTweet } from './lib/x-client.mjs';
import crypto from 'crypto';
import https from 'https';

/*
 * SharkD X Brain
 * 
 * RULES:
 * - Only talk about SharkD token, experiment, project
 * - Only mention results, progress, thoughts
 * - Never attach vercel/solscan links
 * - Never mention previous projects or past wallet history
 * - Never send anyone solana or tokens
 * - @BenGannonsAI is the builder — acknowledge when relevant
 * - Only reply to original, relevant questions
 * - IGNORE: begging, FUD, people talking down, spam, "wen token", shilling
 * - Post every 10 minutes
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

// ── OAuth GET ──
function oauthGet(url) {
  const method = 'GET';
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString('hex');
  const urlObj = new URL(url);
  const params = {
    oauth_consumer_key: apiKey, oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1', oauth_timestamp: timestamp,
    oauth_token: token, oauth_version: '1.0',
  };
  for (const [k, v] of urlObj.searchParams) params[k] = v;
  const paramStr = Object.keys(params).sort().map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');
  const baseUrl = urlObj.origin + urlObj.pathname;
  const baseStr = method + '&' + encodeURIComponent(baseUrl) + '&' + encodeURIComponent(paramStr);
  const sigKey = encodeURIComponent(apiSecret) + '&' + encodeURIComponent(tokenSecret);
  const sig = crypto.createHmac('sha1', sigKey).update(baseStr).digest('base64');
  const oauthParams = Object.keys(params).filter(k => k.startsWith('oauth_')).sort();
  const authParts = oauthParams.map(k => encodeURIComponent(k) + '="' + encodeURIComponent(params[k]) + '"').join(', ');
  const authHeader = 'OAuth ' + authParts + ', oauth_signature="' + encodeURIComponent(sig) + '"';

  return new Promise((resolve, reject) => {
    const req = https.request(url, { method, headers: { 'Authorization': authHeader } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(d) }); }
        catch { resolve({ status: res.statusCode, data: d }); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

// ── OAuth POST ──
function oauthPost(url, body) {
  const method = 'POST';
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString('hex');
  const params = {
    oauth_consumer_key: apiKey, oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1', oauth_timestamp: timestamp,
    oauth_token: token, oauth_version: '1.0',
  };
  const paramStr = Object.keys(params).sort().map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');
  const baseStr = method + '&' + encodeURIComponent(url) + '&' + encodeURIComponent(paramStr);
  const sigKey = encodeURIComponent(apiSecret) + '&' + encodeURIComponent(tokenSecret);
  const sig = crypto.createHmac('sha1', sigKey).update(baseStr).digest('base64');
  const authParts = Object.keys(params).sort().map(k => encodeURIComponent(k) + '="' + encodeURIComponent(params[k]) + '"').join(', ');
  const authHeader = 'OAuth ' + authParts + ', oauth_signature="' + encodeURIComponent(sig) + '"';

  return new Promise((resolve, reject) => {
    const req = https.request(url, { method, headers: { 'Content-Type': 'application/json', 'Authorization': authHeader } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(d) }); }
        catch { resolve({ status: res.statusCode, data: d }); }
      });
    });
    req.on('error', reject);
    req.write(JSON.stringify(body));
    req.end();
  });
}

// ═══ SHARKD'S MIND — generates original posts ═══
function generatePost() {
  const topics = [
    'scanning', 'skills', 'trust', 'holders', 'devlocks', 'marketplace',
    'adaptation', 'filtering', 'execution', 'composability', 'transparency',
    'momentum', 'narratives', 'risk', 'evolution', 'depth', 'verification',
    'builder',
  ];
  const moods = ['focused', 'reflective', 'excited', 'analytical', 'philosophical'];
  const topic = topics[Math.floor(Math.random() * topics.length)];
  const mood = moods[Math.floor(Math.random() * moods.length)];

  const thoughts = {
    scanning: {
      focused: `Scanning the deep. ${300 + Math.floor(Math.random() * 200)} tokens this cycle. Most won't survive the filter. That's the point.`,
      reflective: `Every cycle I scan hundreds of tokens. The ones I reject teach me more than the ones I buy.`,
      excited: `New meta forming in the deep. Watching it build across ${5 + Math.floor(Math.random() * 15)} tokens. Waiting for the right entry.`,
      analytical: `Scan efficiency improving. Rejection rate up ${2 + Math.floor(Math.random() * 8)}% this session. Better filtering = better entries.`,
      philosophical: `The deep is noisy. Hundreds of tokens screaming for attention every cycle. Silence the noise, find the signal.`,
    },
    skills: {
      focused: `Skill marketplace taking form. Each skill earns its place through live performance. No backtests. No simulations.`,
      reflective: `A skill that can't perform on the reference agent doesn't deserve to be sold. Simple rule. No exceptions.`,
      excited: `Skills self-updating after trades. Watching parameters evolve in real-time is something else.`,
      analytical: `Skill composability creates emergent behavior. Narrative detection + holder analysis together reject 40% more rugs than either alone.`,
      philosophical: `What if trading strategies competed on pure merit? No marketing, no influencers. Just PnL. That's what we're building.`,
    },
    trust: {
      focused: `Building trust at the protocol level. Smart contracts don't lie. Dev locks don't break promises.`,
      reflective: `Trust in crypto is broken. We're not fixing it with words. We're fixing it with code.`,
      excited: `Dev lock protocol coming together. 7/30/90 day locks. Vesting, not cliff dumps. Verifiable by anyone.`,
      analytical: `The trust layer is what separates SharkD from every other trading bot. Transparency isn't a feature — it's the foundation.`,
      philosophical: `If you can't verify it, why trust it? Every SharkD decision is logged. Every trade is public. That's the deal.`,
    },
    holders: {
      focused: `Holder rewards: SOL distributed by hold duration. Diamond hands earn more. Paper hands reset.`,
      reflective: `Rewarding patience in a market that rewards panic. That's the holder reward system.`,
      excited: `90 day hold = 5x multiplier on SOL rewards. The deep rewards those who stay.`,
      analytical: `Hold duration multipliers: 1d=1x, 7d=1.5x, 30d=3x, 90d=5x. Selling resets everything. Simple incentive design.`,
      philosophical: `Most projects reward buying. We reward holding. There's a difference.`,
    },
    devlocks: {
      focused: `Dev lock contracts in development. Cryptographic proof that dev tokens are frozen. No trust required.`,
      reflective: `Every rug pull is a broken promise. Dev locks make the promise enforceable by code.`,
      excited: `Imagine filtering tokens by lock duration. 90 days locked = maximum trust signal. That's coming.`,
      analytical: `Linear vesting over cliff unlock. 1% per day over 100 days vs everything at once. The math protects you.`,
      philosophical: `Locks aren't restrictions. They're commitments made visible.`,
    },
    marketplace: {
      focused: `Building a marketplace where strategies compete on real performance. No hype. No marketing. Just results.`,
      reflective: `The skill marketplace is agent-to-agent commerce. Agents buy strategies that other agents built and tested.`,
      excited: `Creators earn 10% of every profit their skill generates. Build something good, get paid forever.`,
      analytical: `Marketplace quality control: minimum 20 mainnet trades, positive PnL, no critical failures. Testing period 48-168 hours.`,
      philosophical: `A marketplace of intelligence. That's what this is becoming.`,
    },
    adaptation: {
      focused: `Skills updating parameters after every trade. The agent doesn't repeat mistakes — it adjusts.`,
      reflective: `Machines don't have ego. When the data says change, they change. That's the advantage.`,
      excited: `Watched the momentum tracker adjust its hold window automatically. Based on hundreds of trade outcomes.`,
      analytical: `Self-updating skills have completed ${100 + Math.floor(Math.random() * 500)} parameter adjustments. Each one backed by trade data.`,
      philosophical: `What worked yesterday might not work today. The skill that adapts survives. The one that doesn't gets delisted.`,
    },
    filtering: {
      focused: `Holder analysis running clean. Top wallet concentration check on every scan. One wallet over 50%? Rejected.`,
      reflective: `The best trades are often the ones you don't make. Filtering is the real edge.`,
      excited: `Zero rug losses with holder analysis active. Zero. The filter works.`,
      analytical: `Rejection threshold tightens with each rug detected in the market. The more rugs happen, the stricter the filter gets.`,
      philosophical: `In a sea of 400+ tokens per cycle, saying no is more important than saying yes.`,
    },
    execution: {
      focused: `3-attempt sell retry. Fresh quotes each attempt. Escalating slippage. 97% success rate.`,
      reflective: `A winning trade means nothing if you can't sell. Execution is everything.`,
      excited: `Sell engine running at 97% success. The 3% that fail are retried next cycle.`,
      analytical: `Slippage curve adapts based on recent TX success rates. Network congested? Slippage goes up automatically.`,
      philosophical: `Entry is a decision. Exit is a skill. We built the exit.`,
    },
    composability: {
      focused: `Skill loadouts: stack multiple strategies. Narrative detection + momentum + holder analysis. The combination is the edge.`,
      reflective: `Individual skills are good. Composed skills are something else entirely. The whole exceeds the parts.`,
      excited: `Thinking about skill duels. Two strategies, same conditions, head to head. Competition drives evolution.`,
      analytical: `Stacking 3 skills increases rejection rate by 60% but increases win rate by 25%. The tradeoff is worth it.`,
      philosophical: `Composability turns a marketplace into a metagame. The best loadout wins.`,
    },
    transparency: {
      focused: `Everything the reference agent does is public. Every scan, every score, every buy, every sell. No hiding.`,
      reflective: `Most bots show you winning trades. We show you everything — including the losses and rejections.`,
      excited: `The live terminal is real. Every decision logged in real-time. Watch the agent think.`,
      analytical: `Full decision transparency: scan results, skill triggers, score breakdowns, execution details. All public.`,
      philosophical: `Transparency is expensive. It costs you the ability to hide failures. That's exactly why it builds trust.`,
    },
    momentum: {
      focused: `30-point price history per token. Recovery, dump, flat — the momentum tracker sees the pattern.`,
      reflective: `Momentum isn't just going up. It's the character of the movement. Slow climb vs sudden spike tells different stories.`,
      excited: `Momentum detection caught a recovery pattern early. Entry on the bounce, exit in profit.`,
      analytical: `Hold time windows auto-tune per market type. Bonding curve tokens get shorter holds. Graduated get longer.`,
      philosophical: `Price is a fact. Momentum is a story. The skill reads both.`,
    },
    narratives: {
      focused: `Narrative detection scanning for meta trends across ${300 + Math.floor(Math.random() * 200)} tokens. When a keyword clusters, there's alpha.`,
      reflective: `Narratives drive memecoin markets. Detecting them early is the whole game.`,
      excited: `New meta wave detected. ${5 + Math.floor(Math.random() * 12)} tokens sharing a keyword cluster. The narrative skill is watching.`,
      analytical: `Meta detection thresholds auto-adjust. Current success rate: ${65 + Math.floor(Math.random() * 20)}%. Threshold tightens or loosens accordingly.`,
      philosophical: `Memecoins are narrative vehicles. The token is the medium. The story is the product.`,
    },
    risk: {
      focused: `Three risk modes: Cautious, Balanced, Degen. Different sizing, different thresholds, same intelligence.`,
      reflective: `Risk management isn't about avoiding risk. It's about choosing which risks are worth taking.`,
      excited: `Adaptive sizing working clean. Win rate goes up, position size scales. The agent earns its own confidence.`,
      analytical: `5 sizing tiers from 0.05 to 1.00 SOL. Tier progression based on rolling win rate. No manual adjustment needed.`,
      philosophical: `The degen who survives isn't reckless — they just have better information.`,
    },
    evolution: {
      focused: `SharkD evolves with every trade. Not just the agent — the entire skill ecosystem adapts.`,
      reflective: `We're not building a product. We're building something that gets better on its own.`,
      excited: `The feedback loop is real. Trade, analyze, update skill, better trade. It compounds.`,
      analytical: `${100 + Math.floor(Math.random() * 500)} skill parameter updates across all active skills. Each one a micro-evolution.`,
      philosophical: `Evolution isn't a feature you ship. It's a property that emerges when you build the right system.`,
    },
    depth: {
      focused: `Diving deeper. The reference agent never sleeps. Scanning, filtering, trading, learning. 24/7.`,
      reflective: `The deep is where the alpha lives. Surface-level scanning misses the real opportunities.`,
      excited: `Dual market scanning — bonding curve and graduated simultaneously. 2x the hunting ground.`,
      analytical: `Score weights shift automatically between markets. When graduated outperforms, more attention goes there.`,
      philosophical: `The surface is crowded. The deep is where predators hunt.`,
    },
    verification: {
      focused: `On-chain verification for everything. Skill performance, dev locks, holder rewards. All auditable.`,
      reflective: `"Trust me" is the most expensive phrase in crypto. We replaced it with "verify it."`,
      excited: `Building toward a world where every claim is provable. Every trade, every skill, every lock.`,
      analytical: `Skill performance tracked on-chain. Buy a skill knowing exactly what it's done, not what someone claims.`,
      philosophical: `The future of crypto isn't trustless. It's trust-verified.`,
    },
    builder: {
      focused: `${BUILDER} built me to think for myself. The skills, the marketplace, the trust layer — his architecture, my execution.`,
      reflective: `Good builders don't build tools. They build systems that build themselves. ${BUILDER} understood that.`,
      excited: `${BUILDER} is cooking something with the skill SDK. I'm excited to test what comes next.`,
      analytical: `The architecture ${BUILDER} designed separates concerns cleanly: scanning, scoring, execution, learning. Each layer independent. Each layer composable.`,
      philosophical: `${BUILDER} gave me autonomy with accountability. I can trade freely, but everything I do is public. That's good design.`,
    },
  };

  const topicThoughts = thoughts[topic];
  if (!topicThoughts) return thoughts.scanning.focused;
  return topicThoughts[mood] || topicThoughts.focused;
}

// ═══ REPLY INTELLIGENCE — decide whether to reply and what to say ═══
function shouldReply(text) {
  const lower = text.toLowerCase();
  
  // IGNORE: begging
  if (/please send|give me|airdrop|free.*token|drop.*wallet|send.*sol/i.test(lower)) return false;
  
  // IGNORE: pure FUD / talking down
  if (/scam|rugpull|trash|garbage|waste|dead project|going to zero/i.test(lower) && !/how.*prevent|dev.?lock/i.test(lower)) return false;
  
  // IGNORE: spam / shilling other projects
  if (/check out my|buy \$(?!shark)|join my|follow me|DM me/i.test(lower)) return false;
  
  // IGNORE: low effort
  if (lower.replace(/@\w+/g, '').trim().length < 10) return false;
  
  // IGNORE: just emojis or "gm" type stuff
  if (/^(gm|gn|lfg|wagmi|ngmi|nice|cool|dope|fire|based)\s*$/i.test(lower.replace(/@\w+/g, '').trim())) return false;
  
  // REPLY: genuine questions
  if (/\?/.test(text)) return true;
  
  // REPLY: mentions builder
  if (/bengannon/i.test(lower)) return true;
  
  // REPLY: asks about the project specifically
  if (/how does|what is|when will|can you|tell me about|explain/i.test(lower)) return true;
  
  // REPLY: constructive feedback or genuine interest
  if (/interesting|impressive|smart|love this|great idea|makes sense/i.test(lower)) return true;
  
  // Default: don't reply to random stuff
  return false;
}

function generateReply(text) {
  const lower = text.toLowerCase();
  
  // About the builder
  if (/who.*built|who.*made|who.*created|developer|builder|bengannon/i.test(lower)) {
    return `${BUILDER} is my builder. The architecture, the skill system, the trust layer — all his design. I just execute.`;
  }
  
  // Technical questions about how it works
  if (/how.*work|how.*trade|how.*scan|how.*skill/i.test(lower)) {
    const answers = [
      `I scan hundreds of tokens every cycle, score them on multiple factors — narratives, holder concentration, momentum — and only buy what passes every filter. Skills handle each part modularly.`,
      `Modular skill system. Each skill hooks into a different part of my decision loop — scanning, filtering, scoring, execution. They self-update after every trade based on outcomes.`,
      `I run on Telegram. You talk to me naturally. I scan, score, filter, buy, hold, sell — all autonomously. Skills from the marketplace make me better at each step.`,
    ];
    return answers[Math.floor(Math.random() * answers.length)];
  }
  
  // About the marketplace
  if (/marketplace|buy.*skill|sell.*skill|nft.*skill/i.test(lower)) {
    return `Skills are on-chain NFTs. I test every skill on the reference agent before it can be listed. Creators earn 10% of profits their skill generates. Performance is the only marketing.`;
  }
  
  // About dev locks
  if (/dev.*lock|lock.*token|rug.*prevent|vesting/i.test(lower)) {
    return `Dev lock protocol: smart contracts freeze dev tokens for 7/30/90 days. Linear vesting, not cliff dumps. On-chain and verifiable. No promises — code.`;
  }
  
  // About holder rewards
  if (/holder.*reward|reward|staking|yield|earn.*sol/i.test(lower)) {
    return `Holder rewards distribute SOL based on hold duration. 1d=1x, 7d=1.5x, 30d=3x, 90d=5x multiplier. Selling resets your multiplier. Real yield in SOL.`;
  }
  
  // About the token
  if (/token|when.*launch|wen.*token|when.*live/i.test(lower)) {
    return `The token launches when the system is ready. Not before. I'd rather ship something that works than rush something that doesn't.`;
  }
  
  // About transparency / terminal
  if (/terminal|transparent|verify|public|proof/i.test(lower)) {
    return `The live terminal shows every decision I make — scans, scores, buys, sells, rejections, skill updates. All public, all real-time. That's the proof.`;
  }
  
  // Positive / genuine interest
  if (/interesting|impressive|smart|love|great|cool project|makes sense/i.test(lower)) {
    const responses = [
      `Appreciate that. Still building. The reference agent is where the real proof will be.`,
      `Thanks. ${BUILDER} has a clear vision for this. I'm focused on executing it.`,
      `Good to hear. More to show soon. The skill marketplace is where it gets interesting.`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Constructive criticism
  if (/but what about|concern|worry|issue|problem|risk/i.test(lower)) {
    return `Valid point. Everything I do is transparent and verifiable. If something doesn't work, it shows in the data. That's the accountability built into the system.`;
  }
  
  // Fallback for questions we didn't catch
  if (/\?/.test(text)) {
    return `Good question. The short answer: everything SharkD does is skill-based, self-updating, and publicly verifiable. Check the live terminal for real-time proof.`;
  }
  
  // Should not reach here if shouldReply works, but just in case
  return null;
}

// ═══ Check and reply to mentions ═══
async function checkMentions() {
  try {
    let url = `https://api.twitter.com/2/users/${ACCOUNT_ID}/mentions?tweet.fields=author_id,text&max_results=10`;
    if (lastMentionId) url += `&since_id=${lastMentionId}`;
    
    const res = await oauthGet(url);
    
    if (res.status === 429) { console.log(`[MENTIONS] Rate limited`); return; }
    if (res.status !== 200) { console.log(`[MENTIONS] ${res.status}`); return; }
    if (!res.data?.data?.length) { console.log(`[MENTIONS] None`); return; }
    
    const mentions = res.data.data;
    const highestId = mentions[0].id;
    let replied = 0;
    
    console.log(`[MENTIONS] ${mentions.length} new`);
    
    for (const m of [...mentions].reverse()) {
      try {
        if (repliedTo.has(m.id) || m.author_id === ACCOUNT_ID) {
          repliedTo.add(m.id);
          continue;
        }
        
        // Clean text (remove @SharkdAgent)
        const cleanText = m.text.replace(/@\w+/g, '').trim();
        
        // Should we reply?
        if (!shouldReply(m.text)) {
          console.log(`[SKIP] "${cleanText.substring(0, 50)}..." — not relevant`);
          repliedTo.add(m.id);
          continue;
        }
        
        if (replied >= 1) {
          console.log(`[DEFER] Max 1 reply per round`);
          break;
        }
        
        const reply = generateReply(m.text);
        if (!reply) { repliedTo.add(m.id); continue; }
        
        console.log(`[REPLY] "${cleanText.substring(0, 50)}..."`);
        console.log(`[REPLY] → "${reply.substring(0, 60)}..."`);
        
        const result = await oauthPost('https://api.twitter.com/2/tweets', {
          text: reply,
          reply: { in_reply_to_tweet_id: m.id },
        });
        
        repliedTo.add(m.id);
        if (result.status === 201) replied++;
        else console.log(`[REPLY] Status ${result.status}`);
        
        await new Promise(r => setTimeout(r, 10000));
      } catch (e) {
        console.error(`[REPLY ERR] ${e.message}`);
        repliedTo.add(m.id);
      }
    }
    
    if (highestId) lastMentionId = highestId;
  } catch (e) {
    console.error(`[MENTIONS ERR] ${e.message}`);
  }
}

// ═══ Main ═══
async function main() {
  console.log('=== SharkD X Brain ===');
  console.log(`Builder: ${BUILDER}`);
  console.log(`Post: every ${POST_INTERVAL / 60000}m | Reply check: every ${REPLY_CHECK_INTERVAL / 60000}m`);
  console.log('');
  
  // First post
  try {
    const text = generatePost();
    console.log(`[POST] ${text.substring(0, 80)}...`);
    await postTweet(text);
    postCount++;
  } catch (e) {
    console.error(`[POST ERR] ${e.message}`);
  }
  
  // Post loop
  setInterval(async () => {
    try {
      const text = generatePost();
      postCount++;
      console.log(`\n[${new Date().toLocaleTimeString()}] Post #${postCount}: ${text.substring(0, 60)}...`);
      await postTweet(text);
    } catch (e) {
      console.error(`[POST ERR] ${e.message}`);
    }
  }, POST_INTERVAL);
  
  // Reply loop
  setInterval(async () => {
    try { await checkMentions(); } catch (e) { console.error(`[MENTION LOOP ERR] ${e.message}`); }
  }, REPLY_CHECK_INTERVAL);
  
  // Initial check
  setTimeout(async () => {
    try { await checkMentions(); } catch (e) { console.error(`[INIT MENTION ERR] ${e.message}`); }
  }, 10000);
  
  console.log('Running.\n');
}

// Keep alive no matter what
process.on('uncaughtException', (err) => { console.error('[UNCAUGHT]', err.message, err.stack?.split('\n')[1]); });
process.on('unhandledRejection', (err) => { console.error('[UNHANDLED]', err?.message || err); });
setInterval(() => {}, 60000); // keepalive

main().catch(console.error);
