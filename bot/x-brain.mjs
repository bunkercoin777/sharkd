// ── SharkD X Brain — Autonomous posting engine ──
// Posts about skills, building, market observations, platform updates
// Every post should make someone want to build a skill

import { tweet, reply } from './x-client.mjs';

// ── Post categories with generation logic ──

const SKILL_NAMES = ['Narrative Detection', 'Holder Analysis', 'Momentum Tracker', 'Aggressive Sell', 'Dual Market Scanner', 'Smart Money Tracker', 'Adaptive Sizing'];
const HOOKS = ['pre-buy', 'post-scan', 'on-cycle', 'pre-sell'];
const MARKETS = ['pump.fun bonding curve', 'PumpSwap graduated', 'both bonding and graduated'];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// Generate a unique post based on category
function generatePost() {
  const categories = [
    generateSkillUpdate,
    generateBuilderCTA,
    generateMarketObservation,
    generatePlatformUpdate,
    generateEducation,
    generateSkillIdea,
    generatePhilosophy,
    generateSDKSnippet,
  ];
  return pick(categories)();
}

function generateSkillUpdate() {
  const skill = pick(SKILL_NAMES);
  const version = `${rand(1,3)}.${rand(0,9)}`;
  const updates = rand(50, 600);
  const templates = [
    `${skill} v${version} — ${updates} self-updates since launch.\n\nAfter the last ${rand(10,50)} trades, it auto-tuned its ${pick(['threshold', 'score weight', 'timing window', 'rejection criteria', 'slippage curve'])} based on outcome data.\n\nSkills that learn > skills that don't.`,
    `${skill} just adapted its parameters after detecting a shift in ${pick(['holder patterns', 'market momentum', 'meta formation speed', 'sell execution latency'])}.\n\nNo human told it to. It analyzed ${rand(30,200)} recent trades and adjusted.\n\nThat's what "self-updating" means.`,
    `v${version} of ${skill} changed its ${pick(['minimum score', 'rejection threshold', 'hold time range', 'position sizing curve'])} by ${rand(5,25)}% after ${pick(['3 consecutive losses on high-concentration tokens', 'a meta wave that peaked faster than expected', 'sell failures in high-congestion periods'])}.\n\n${updates} updates. Zero manual intervention.`,
  ];
  return pick(templates);
}

function generateBuilderCTA() {
  const templates = [
    `If you can write a function that takes a token list and returns modified scores, you can build a SharkD skill.\n\nThat's literally it.\n\nYour skill earns 10% of every profit it generates across all agents using it.\n\nsharkd.vercel.app/docs`,
    `Skill idea that doesn't exist yet: a filter that checks if a token's Telegram group was created in the last 24 hours.\n\nNew group + new token = high risk signal.\n\nWhoever builds this first sells it to every agent on the platform.\n\nSDK: sharkd.vercel.app/docs`,
    `The best Solana trading skills aren't written by traders.\n\nThey're written by developers who understand data patterns.\n\nIf you can write JavaScript and want passive income from code, the SharkD skill marketplace is waiting.\n\nsharkd.vercel.app/docs`,
    `You don't need to be a trader to profit from trading.\n\nBuild a skill. Let agents use it. Earn 10% of their profits.\n\nA good rug detector running on 100 agents makes more than most traders.\n\nsharkd.vercel.app/docs`,
    `Most devs build trading bots for themselves.\n\nSmarter devs build trading skills and sell them to every bot on the network.\n\nOne skill. Infinite agents. Performance-based revenue.\n\nsharkd.vercel.app/docs`,
  ];
  return pick(templates);
}

function generateMarketObservation() {
  const meta = pick(['lobster', 'aliens', 'baby', 'deep', 'real', 'golden', 'dark', 'mega', 'turbo', 'hyper']);
  const count = rand(5, 30);
  const templates = [
    `Narrative Detection is seeing "${meta}" appear across ${count} tokens in the last hour.\n\nMeta forming or noise? The skill scores it, the agent decides. No human in the loop.\n\nThis is what autonomous intelligence looks like.`,
    `${rand(300,500)} tokens scanned this cycle.\n\n${rand(60,85)}% rejected by Holder Analysis (concentration too high).\n${rand(5,15)}% rejected by score threshold.\n${rand(2,8)} candidates passed all filters.\n${rand(0,3)} trades executed.\n\nMost of trading is saying no.`,
    `Interesting pattern: ${pick(['bonding curve tokens', 'graduated tokens', 'tokens with 10+ replies', 'tokens under 30min old'])} are ${pick(['outperforming', 'underperforming'])} this cycle.\n\nDual Market Scanner is shifting weight toward ${pick(['bonding curve plays', 'graduated plays'])}.\n\nIt noticed before we did.`,
  ];
  return pick(templates);
}

function generatePlatformUpdate() {
  const templates = [
    `New hook available in the SDK: "${pick(HOOKS)}"\n\nSkills can now ${pick(['intercept and modify buy decisions', 'process scan results before scoring', 'run custom logic every scan cycle', 'adjust sell parameters in real-time'])}.\n\nDocs updated: sharkd.vercel.app/docs`,
    `Marketplace update: skills now display real-time version + update count.\n\nYou can see exactly how many times a skill has self-tuned and which version is running.\n\nTransparency > trust me bro.`,
    `Demo bot is live. Paper trade with 10 virtual SOL against real market data.\n\nSee skills in action before you buy them. See the marketplace before you build for it.\n\nsharkd.vercel.app`,
  ];
  return pick(templates);
}

function generateEducation() {
  const templates = [
    `Anatomy of a SharkD skill:\n\n1. skill.config.json — name, type, hooks, pricing\n2. skill.mjs — your logic (one exported function per hook)\n3. Test against historical data\n4. Mint as NFT\n5. Earn from every agent that profits\n\nThat's the entire workflow.`,
    `The 4 skill hooks:\n\npre-buy → filter bad tokens before purchase\npost-scan → modify scores after scanning\non-cycle → run every 30 seconds\npre-sell → adjust exit strategy\n\nMost skills only need one hook. Start simple.`,
    `What makes a good trading skill?\n\n1. Solves one specific problem\n2. Has measurable impact on win rate\n3. Self-updates based on outcomes\n4. Works across market conditions\n5. Doesn't overfit to last week's meta\n\nThe marketplace rewards skills that work.`,
    `Performance-based pricing explained:\n\nYou set revShare: 0.10 (10%)\n\nAgent uses your skill, makes a trade, profits 0.5 SOL.\n\nYou earn 0.05 SOL. Automatically.\n\nNo profit = no fee. Incentives aligned.`,
  ];
  return pick(templates);
}

function generateSkillIdea() {
  const ideas = [
    `Skill idea: Volume Spike Detector\n\nMonitor buy/sell ratio in real-time. When buys suddenly outpace sells by 3x+, flag the token for immediate evaluation.\n\nEarly volume = early entry.\n\nWho's building this?`,
    `Skill idea: Creator Reputation Tracker\n\nTrack token creators across launches. Flag wallets that have launched 3+ tokens that all died within 24h.\n\nRepeat offenders are easy to detect. Hard to avoid without a skill.\n\nBuild it. Sell it to every agent.`,
    `Skill idea: Social Velocity Scorer\n\nTrack how fast a token's reply count is growing, not just the absolute number.\n\n10 replies in 5 minutes > 50 replies over 2 hours.\n\nVelocity matters more than volume.`,
    `Skill idea: Liquidity Depth Analyzer\n\nBefore buying, check how much SOL is actually in the pool. Thin liquidity = high slippage on exit.\n\nA skill that prevents you from entering positions you can't exit.\n\nWho's building this?`,
    `Skill idea: Time-of-Day Filter\n\nAnalyze which hours produce the best win rates for memecoin trades.\n\nIf US evening hours consistently outperform, the skill adjusts scan intensity by time zone.\n\nData-driven trading schedules.`,
  ];
  return pick(ideas);
}

function generatePhilosophy() {
  const templates = [
    `The future of trading isn't better bots.\n\nIt's better skills that any bot can use.\n\nOne good rug detector running on 1000 agents saves more money than 1000 individual traders learning the hard way.`,
    `Every trading agent on Solana is currently reinventing the wheel.\n\nBuilding their own scanner. Their own filters. Their own sell logic.\n\nSkill marketplace = build once, sell to all. Agents get better. Builders get paid.`,
    `The agents that win long-term won't be the ones with the most SOL.\n\nThey'll be the ones with the best skill loadouts.\n\nSkill selection is the new alpha.`,
    `Open question: should skills share performance data with each other?\n\nIf Narrative Detection sees a meta forming AND Smart Money Tracker sees whale entries in the same tokens, that's a stronger signal than either alone.\n\nComposable intelligence.`,
  ];
  return pick(templates);
}

function generateSDKSnippet() {
  const snippets = [
    `// Simplest possible SharkD skill\nexport function preBuy({ token, holders }) {\n  if (holders?.top1Pct > 40) {\n    return { action: 'reject' };\n  }\n  return { action: 'allow' };\n}\n\nThat's a rug detector. 6 lines. It works.\n\nsharkd.vercel.app/docs`,
    `// Score boost for narrative tokens\nexport function postScan({ tokens, narratives }) {\n  return tokens.map(t => ({\n    ...t,\n    score: t.score + getBoost(t, narratives)\n  }));\n}\n\nPlug into the scan pipeline. Boost what matters.\n\nsharkd.vercel.app/docs`,
  ];
  return pick(snippets);
}

// ── Main loop ──
const POST_INTERVAL = 30 * 60 * 1000; // 30 minutes

async function postLoop() {
  console.log('[X-BRAIN] SharkD X posting engine online');
  
  while (true) {
    try {
      const post = generatePost();
      console.log(`[X-BRAIN] posting (${post.length} chars):`);
      console.log(post.slice(0, 100) + '...');
      
      const id = await tweet(post);
      if (id) {
        console.log(`[X-BRAIN] posted: ${id}`);
      }
    } catch (e) {
      console.error('[X-BRAIN] error:', e.message);
    }
    
    // Wait + jitter (25-35 min)
    const wait = POST_INTERVAL + (Math.random() - 0.5) * 10 * 60 * 1000;
    console.log(`[X-BRAIN] next post in ${(wait / 60000).toFixed(0)}min`);
    await new Promise(r => setTimeout(r, wait));
  }
}

// Run if called directly
postLoop();
