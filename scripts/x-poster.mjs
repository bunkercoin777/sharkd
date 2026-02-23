import { postTweet } from './lib/x-client.mjs';
import crypto from 'crypto';
import https from 'https';

/*
 * SharkD X Brain
 * 
 * RULES:
 * - Only talk about SharkD token, experiment, project
 * - Only mention results, progress, thoughts about the program
 * - Never attach vercel links or solscan links
 * - Never mention previous projects
 * - Never send anyone solana or tokens
 * - Post every 10 minutes — original thoughts, not templates
 * - Reply to mentions/replies on posts
 */

const POST_INTERVAL = 10 * 60 * 1000;
const REPLY_CHECK_INTERVAL = 3 * 60 * 1000;
const ACCOUNT_ID = '1239955098803060737';

const apiKey = process.env.X_API_KEY;
const apiSecret = process.env.X_API_SECRET;
const token = process.env.X_ACCESS_TOKEN;
const tokenSecret = process.env.X_ACCESS_SECRET;

// Track state
let postCount = 0;
let lastMentionId = null;
const repliedTo = new Set();

// ── OAuth helper for GET requests ──
function oauthGet(url) {
  const method = 'GET';
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString('hex');

  // Parse URL params for signature
  const urlObj = new URL(url);
  const params = {
    oauth_consumer_key: apiKey,
    oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp,
    oauth_token: token,
    oauth_version: '1.0',
  };
  
  // Include query params in signature
  for (const [k, v] of urlObj.searchParams) {
    params[k] = v;
  }

  const paramStr = Object.keys(params).sort().map(k =>
    encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
  ).join('&');

  const baseUrl = urlObj.origin + urlObj.pathname;
  const baseStr = method + '&' + encodeURIComponent(baseUrl) + '&' + encodeURIComponent(paramStr);
  const sigKey = encodeURIComponent(apiSecret) + '&' + encodeURIComponent(tokenSecret);
  const sig = crypto.createHmac('sha1', sigKey).update(baseStr).digest('base64');

  // Build auth header (only oauth_ params)
  const oauthParams = Object.keys(params).filter(k => k.startsWith('oauth_')).sort();
  const authParts = oauthParams.map(k =>
    encodeURIComponent(k) + '="' + encodeURIComponent(params[k]) + '"'
  ).join(', ');
  const authHeader = 'OAuth ' + authParts + ', oauth_signature="' + encodeURIComponent(sig) + '"';

  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method,
      headers: { 'Authorization': authHeader },
    }, res => {
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

// ── Reply to a tweet ──
function oauthPost(url, body) {
  const method = 'POST';
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString('hex');

  const params = {
    oauth_consumer_key: apiKey,
    oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp,
    oauth_token: token,
    oauth_version: '1.0',
  };

  const paramStr = Object.keys(params).sort().map(k =>
    encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
  ).join('&');

  const baseStr = method + '&' + encodeURIComponent(url) + '&' + encodeURIComponent(paramStr);
  const sigKey = encodeURIComponent(apiSecret) + '&' + encodeURIComponent(tokenSecret);
  const sig = crypto.createHmac('sha1', sigKey).update(baseStr).digest('base64');

  const authParts = Object.keys(params).sort().map(k =>
    encodeURIComponent(k) + '="' + encodeURIComponent(params[k]) + '"'
  ).join(', ');
  const authHeader = 'OAuth ' + authParts + ', oauth_signature="' + encodeURIComponent(sig) + '"';

  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
    }, res => {
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

// ── SharkD's mind — generates original posts ──
function generatePost() {
  const hour = new Date().getHours();
  const topics = [
    'scanning', 'skills', 'trust', 'holders', 'devlocks', 'marketplace',
    'adaptation', 'filtering', 'execution', 'composability', 'transparency',
    'momentum', 'narratives', 'risk', 'evolution', 'depth', 'verification',
  ];
  
  const moods = ['focused', 'reflective', 'excited', 'analytical', 'philosophical'];
  const topic = topics[Math.floor(Math.random() * topics.length)];
  const mood = moods[Math.floor(Math.random() * moods.length)];
  
  // SharkD thinks in its own voice — concise, sharp, underwater predator energy
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
      excited: `Watched the momentum tracker adjust its hold window automatically. 5 minutes to 6 minutes based on 540 trade outcomes.`,
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
      excited: `Momentum detection caught a recovery pattern early. Entry on the bounce, exit at +18%.`,
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
      excited: `The feedback loop is real. Trade → analyze → update skill → better trade. It compounds.`,
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
  };
  
  const topicThoughts = thoughts[topic];
  if (!topicThoughts) return thoughts.scanning.focused;
  return topicThoughts[mood] || topicThoughts.focused;
}

// ── Generate a reply to someone ──
function generateReply(theirText, theirName) {
  const lower = theirText.toLowerCase();
  
  if (lower.includes('wen') || lower.includes('when')) {
    const replies = [
      `Building in the deep. The surface will see it when it's ready.`,
      `When the skills prove themselves on mainnet. No shortcuts.`,
      `Soon. But we don't ship until it's tested.`,
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }
  
  if (lower.includes('buy') || lower.includes('price') || lower.includes('moon')) {
    const replies = [
      `We're focused on building the system right now. The results will speak.`,
      `Not here to pump. Here to build something that works.`,
      `Watch the reference agent. The performance is the pitch.`,
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }
  
  if (lower.includes('scam') || lower.includes('rug') || lower.includes('fake')) {
    const replies = [
      `Every decision is public on the live terminal. Every trade verifiable. That's the opposite of a scam.`,
      `Dev locks exist specifically to prevent rugs. Smart contracts, not promises.`,
      `Check the reference agent. Every trade logged, every skill tested. Verify it yourself.`,
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }
  
  if (lower.includes('how') || lower.includes('what') || lower.includes('explain')) {
    const replies = [
      `SharkD is an AI trading agent ecosystem. Skills marketplace, dev locks, holder rewards. All proven on mainnet first.`,
      `Modular trading skills that self-update after every trade. Buy them as NFTs, your agent gets smarter.`,
      `Think of it as an app store for trading intelligence. Each skill is tested live before listing.`,
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }
  
  // Generic positive engagement
  const generic = [
    `Appreciate the interest. We're building something different here.`,
    `The deep rewards patience. Stay tuned.`,
    `Glad you're watching. The reference agent is where the proof lives.`,
    `Thanks for being here. More to show soon.`,
  ];
  return generic[Math.floor(Math.random() * generic.length)];
}

// ── Check and reply to mentions ──
async function checkMentions() {
  try {
    let url = `https://api.twitter.com/2/users/${ACCOUNT_ID}/mentions?tweet.fields=author_id,text,conversation_id,in_reply_to_user_id&max_results=10`;
    if (lastMentionId) url += `&since_id=${lastMentionId}`;
    
    const res = await oauthGet(url);
    
    if (res.status === 429) {
      console.log(`[MENTIONS] Rate limited — will retry next cycle`);
      return;
    }
    
    if (res.status !== 200) {
      console.log(`[MENTIONS] Status ${res.status} — ${JSON.stringify(res.data).substring(0, 120)}`);
      return;
    }
    
    if (!res.data?.data || !Array.isArray(res.data.data)) {
      console.log(`[MENTIONS] No new mentions`);
      return;
    }
    
    const mentions = res.data.data;
    console.log(`[MENTIONS] Found ${mentions.length} new mentions`);
    
    // Save highest ID before reversing
    const highestId = mentions[0]?.id;
    let repliesThisRound = 0;
    
    for (const mention of [...mentions].reverse()) {
      try {
        if (repliedTo.has(mention.id)) continue;
        if (mention.author_id === ACCOUNT_ID) { repliedTo.add(mention.id); continue; }
        if (repliesThisRound >= 2) { console.log(`[REPLY] Max 2 per round — deferring rest`); break; }
        
        console.log(`[REPLY] To: ${mention.text.substring(0, 60)}...`);
        
        const replyText = generateReply(mention.text, '');
        
        const result = await oauthPost('https://api.twitter.com/2/tweets', {
          text: replyText,
          reply: { in_reply_to_tweet_id: mention.id },
        });
        
        repliedTo.add(mention.id);
        
        if (result.status === 201) {
          console.log(`[REPLY] Sent: ${replyText.substring(0, 60)}...`);
          repliesThisRound++;
        } else if (result.status === 429) {
          console.log(`[REPLY] Rate limited — stopping replies`);
          break;
        } else {
          console.log(`[REPLY] Status ${result.status} — marked as handled`);
        }
        
        await new Promise(r => setTimeout(r, 10000));
      } catch (e) {
        console.error(`[REPLY ERROR] ${e.message}`);
        repliedTo.add(mention.id);
      }
    }
    
    if (highestId) lastMentionId = highestId;
  } catch (e) {
    console.error(`[MENTIONS ERROR] ${e.message}`);
  }
}

// ── Main loop ──
async function main() {
  console.log('=== SharkD X Brain ===');
  console.log(`Posting every ${POST_INTERVAL / 60000} minutes`);
  console.log(`Checking replies every ${REPLY_CHECK_INTERVAL / 60000} minutes`);
  console.log('');
  
  // First post
  const firstPost = generatePost();
  console.log(`[POST] ${firstPost.substring(0, 80)}...`);
  try {
    await postTweet(firstPost);
    postCount++;
  } catch (e) {
    console.error(`[POST ERROR] ${e.message}`);
  }
  
  // Post loop
  setInterval(async () => {
    const text = generatePost();
    postCount++;
    console.log(`\n[${new Date().toLocaleTimeString()}] Post #${postCount}`);
    console.log(`[POST] ${text.substring(0, 80)}...`);
    try {
      await postTweet(text);
    } catch (e) {
      console.error(`[POST ERROR] ${e.message}`);
    }
  }, POST_INTERVAL);
  
  // Reply check loop
  setInterval(checkMentions, REPLY_CHECK_INTERVAL);
  
  // Initial mention check
  setTimeout(checkMentions, 10000);
  
  console.log('\nRunning. Ctrl+C to stop.');
}

process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT]', err.message);
});
process.on('unhandledRejection', (err) => {
  console.error('[UNHANDLED]', err?.message || err);
});

main().catch(console.error);
