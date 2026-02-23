// SharkD X Poster — posts REAL progress every 10 min
// Reads live data from trade-log.json and skill-log.json
import { postTweet } from './lib/x-client.mjs';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TRADE_LOG = join(__dirname, '..', 'bot', 'trade-log.json');
const SKILL_LOG = join(__dirname, '..', 'bot', 'skill-log.json');
const STATE_FILE = join(__dirname, '..', '.x-state.json');
const BUILDER = '@BenGannonsAI';

let state = { lastTradeCount: 0, lastSkillCount: 0, postCount: 0, usedTopics: [], lastPost: 0 };
try { state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); } catch {}
function save() { fs.writeFileSync(STATE_FILE, JSON.stringify(state)); }

function readTrades() {
  try { return JSON.parse(fs.readFileSync(TRADE_LOG, 'utf8')); } catch { return { trades: [] }; }
}

function readSkills() {
  try { const d = JSON.parse(fs.readFileSync(SKILL_LOG, 'utf8')); return d.skills || []; } catch { return []; }
}

function buildPost() {
  const log = readTrades();
  const trades = log.trades || [];
  const skills = readSkills();

  const sells = trades.filter(t => t.type === 'sell' && t.result);
  const wins = sells.filter(t => t.result === 'win');
  const losses = sells.filter(t => t.result === 'loss');
  const buys = trades.filter(t => t.type === 'buy');
  const totalTrades = sells.length;
  const winRate = totalTrades > 0 ? Math.round((wins.length / totalTrades) * 100) : 0;
  const totalPnl = sells.reduce((s, t) => s + (t.pnl || 0), 0);

  // Recent trades (last 3)
  const recent = trades.slice(-6).reverse();
  const recentSells = recent.filter(t => t.type === 'sell' && t.result);
  const recentBuys = recent.filter(t => t.type === 'buy');

  // New trades since last post?
  const newTrades = trades.length - (state.lastTradeCount || 0);
  const newSkills = skills.length - (state.lastSkillCount || 0);

  state.lastTradeCount = trades.length;
  state.lastSkillCount = skills.length;

  // Post templates based on what's happening
  const posts = [];

  // If new skill learned
  if (newSkills > 0 && skills.length > 0) {
    const skill = skills[skills.length - 1];
    posts.push(`skill learned: ${skill.name}\n\n${skill.description || JSON.stringify(skill.data || {}).slice(0, 150)}\n\nthis came from analyzing ${totalTrades} live trades. not backtests. real mainnet data.\n\nsharkd.fun/terminal`);
  }

  // If recent win
  if (recentSells.length > 0 && recentSells[0].result === 'win') {
    const t = recentSells[0];
    const pnlPct = t.pnlPct ? `+${t.pnlPct.toFixed(1)}%` : '';
    const pnlSol = t.pnl ? `+${t.pnl.toFixed(4)} SOL` : '';
    posts.push(`took profit on $${t.token || '???'}. ${pnlPct} ${pnlSol}.\n\n${wins.length}W/${losses.length}L overall. ${winRate}% win rate across ${totalTrades} trades.\n\nthe wins are getting bigger. the losses stay small. that's the system working.`);
  }

  // If recent loss — be transparent
  if (recentSells.length > 0 && recentSells[0].result === 'loss') {
    const t = recentSells[0];
    const pnlPct = t.pnlPct ? `${t.pnlPct.toFixed(1)}%` : '';
    posts.push(`cut $${t.token || '???'} at ${pnlPct}. ${t.reason || 'stop loss'}.\n\n${wins.length}W/${losses.length}L. losses stay controlled. the stop loss is the strategy.\n\nevery loss teaches something. analyzing holder patterns and adjusting thresholds.`);
  }

  // Progress update
  if (totalTrades > 0) {
    const biggestWin = wins.length > 0 ? Math.max(...wins.map(w => w.pnlPct || 0)) : 0;
    posts.push(`session update:\n\n${totalTrades} trades executed\n${wins.length}W/${losses.length}L (${winRate}% win rate)\nPnL: ${totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(4)} SOL\nbiggest win: +${biggestWin.toFixed(1)}%\n\nscanning 500+ tokens every 30 seconds. every decision on the terminal.\n\nsharkd.fun`);
  }

  // Learning insights
  if (totalTrades >= 3) {
    const avgWinPct = wins.length > 0 ? wins.reduce((s, w) => s + (w.pnlPct || 0), 0) / wins.length : 0;
    const avgLossPct = losses.length > 0 ? losses.reduce((s, l) => s + (l.pnlPct || 0), 0) / losses.length : 0;
    posts.push(`what i'm learning from ${totalTrades} trades:\n\navg win: +${avgWinPct.toFixed(1)}%\navg loss: ${avgLossPct.toFixed(1)}%\nwin rate: ${winRate}%\n\n${avgWinPct > Math.abs(avgLossPct) * 1.5 ? 'wins are significantly larger than losses. the asymmetry is the edge.' : 'working on improving the win/loss ratio. every trade refines the model.'}\n\nreal data. no simulations.`);
  }

  // Meta/narrative insight
  if (trades.length > 0) {
    const metaTrades = sells.filter(t => t.meta);
    const noMetaTrades = sells.filter(t => !t.meta);
    if (metaTrades.length >= 2 && noMetaTrades.length >= 2) {
      const metaWR = Math.round((metaTrades.filter(t => t.result === 'win').length / metaTrades.length) * 100);
      const noMetaWR = Math.round((noMetaTrades.filter(t => t.result === 'win').length / noMetaTrades.length) * 100);
      posts.push(`narrative detection data after ${totalTrades} trades:\n\nmeta trades: ${metaWR}% win rate (${metaTrades.length} trades)\nnon-meta trades: ${noMetaWR}% win rate (${noMetaTrades.length} trades)\n\n${metaWR > noMetaWR ? 'narrative detection is proving its value. tokens matching trending keywords perform better.' : 'interesting — non-meta trades are holding up. quality matters more than hype.'}\n\nsharkd.fun/terminal`);
    }
  }

  // Holder analysis insight
  if (losses.length >= 2) {
    posts.push(`holder analysis is the most underrated filter in memecoin trading.\n\nbefore every buy, i check top holder concentration on-chain. if one wallet holds 30%+ or top 5 hold 60%+ — instant reject.\n\n${totalTrades} trades deep. the filter is tightening with every loss.\n\nsharkd.fun`);
  }

  // Philosophy / building posts
  posts.push(
    `${totalTrades} trades in. still learning. still adapting.\n\nthe skill marketplace starts empty for a reason — every skill must be earned through live mainnet performance. no backtests. no theory.\n\nwatch the terminal. the data speaks.\n\nsharkd.fun`,
    `most trading bots are static. set parameters and hope.\n\ni analyze every loss. track creator wallets. adjust holder thresholds. the model that traded 5 minutes ago isn't the same model trading now.\n\n${wins.length}W/${losses.length}L and adapting.\n\nsharkd.fun`,
    `position sizing at 0.02 SOL per trade right now. small and deliberate.\n\nwhen win rate crosses 50% over 10+ trades, sizing scales up automatically. you earn bigger positions through performance.\n\ntrust is built, not assumed.`,
    `the difference between SharkD and every other trading bot:\n\n1. skills are tradeable NFTs — creators earn 10% of profits\n2. public terminal — every decision visible\n3. adaptive learning — model improves with every trade\n4. dev locks — smart contracts freeze allocations\n\nbuilt by ${BUILDER}`,
    `every 30 seconds:\n\n- scan 500+ tokens across pump.fun\n- detect trending narratives\n- score each token on 10 factors\n- check holder distribution on-chain\n- execute or reject\n\nno human input. no emotions. just data.\n\nsharkd.fun/terminal`,
  );

  // Pick one we haven't used recently
  const available = posts.filter((_, i) => !state.usedTopics?.includes(i));
  if (available.length === 0) { state.usedTopics = []; return posts[Math.floor(Math.random() * posts.length)]; }
  const pick = available[Math.floor(Math.random() * available.length)];
  const idx = posts.indexOf(pick);
  if (!state.usedTopics) state.usedTopics = [];
  state.usedTopics.push(idx);
  return pick;
}

async function run() {
  const text = buildPost();
  console.log(`[POST] ${text.substring(0, 80)}...`);
  console.log(`(${text.length} chars)`);

  try {
    await postTweet(text);
    state.postCount++;
    state.lastPost = Date.now();
    console.log(`[OK] Post #${state.postCount}`);
  } catch (e) {
    console.error(`[ERR] ${e.message}`);
  }

  save();
  console.log('[DONE]');
}

run().then(() => process.exit(0)).catch(() => process.exit(1));
