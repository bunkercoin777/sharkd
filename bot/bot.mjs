// ── SharkD — Your AI Trading Shark ──
import { Bot } from 'grammy';
import { initWallet, getBalance, getWalletAddress } from './wallet.mjs';
import { start, stop, setNotify, getState, getConfig, updateConfig, setRisk, manualBuy, manualSellAll } from './brain.mjs';

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) { console.error('TELEGRAM_BOT_TOKEN not set'); process.exit(1); }

const OWNER_ID = process.env.OWNER_CHAT_ID;
const bot = new Bot(token);

// ── Init wallet ──
let walletAddr;
try {
  walletAddr = initWallet();
  console.log(`[WALLET] ${walletAddr}`);
} catch (e) {
  console.error('[WALLET] init failed:', e.message);
  console.log('[BOT] Starting in chat-only mode (no wallet configured)');
}

// ── Auth middleware — only talk to owner ──
bot.use(async (ctx, next) => {
  const chatId = String(ctx.chat?.id || '');
  if (OWNER_ID && chatId !== OWNER_ID) {
    console.log(`[AUTH] rejected chat ${chatId}`);
    return;
  }
  await next();
});

// ── Notify function — brain sends messages through this ──
let ownerChatId = OWNER_ID;

setNotify(async (msg) => {
  if (!ownerChatId) return;
  try {
    await bot.api.sendMessage(ownerChatId, msg, { parse_mode: undefined });
  } catch (e) {
    console.error('[NOTIFY]', e.message);
  }
});

// ── Command handlers ──
bot.command('start', async (ctx) => {
  ownerChatId = String(ctx.chat.id);
  const bal = walletAddr ? await getBalance() : null;
  const balStr = bal !== null ? `\n💰 Balance: ${bal.toFixed(2)} SOL` : '\n⚠️ No wallet configured — set WALLET_SECRET in .env';
  
  await ctx.reply(
    `Hey! I'm your trading shark 🦈\n` +
    `🏦 Wallet: ${walletAddr || 'not set'}${balStr}\n\n` +
    `Talk to me naturally or use:\n` +
    `/go — Start trading\n` +
    `/pause — Stop trading\n` +
    `/status — Current state\n` +
    `/sell — Sell all positions\n` +
    `/risk <cautious|balanced|degen> — Set risk level\n\n` +
    `Or just chat — "what are you holding?", "be more aggressive", "buy [address] 0.1"`
  );
});

bot.command('go', async (ctx) => {
  if (!walletAddr) return ctx.reply('⚠️ No wallet configured. Set WALLET_SECRET in .env.local');
  start();
});

bot.command('pause', async (ctx) => {
  stop();
  await ctx.reply('⏸️ Trading paused. Say /go to resume.');
});

bot.command('status', async (ctx) => {
  const state = getState();
  const bal = walletAddr ? await getBalance() : 0;
  const posText = state.positions.length
    ? state.positions.map(p => {
        const mins = ((Date.now() - p.buyTime) / 60000).toFixed(0);
        return `  • $${p.symbol} — ${p.buySol} SOL (${mins}min)`;
      }).join('\n')
    : '  None';
  
  await ctx.reply(
    `📊 Status\n` +
    `Mode: ${state.mode} | Risk: ${state.risk}\n` +
    `💰 ${bal.toFixed(2)} SOL\n` +
    `📈 ${state.wins}W / ${state.losses}L | PnL: ${state.totalPnl >= 0 ? '+' : ''}${state.totalPnl.toFixed(4)} SOL\n` +
    `🚫 ${state.exitedCount} tokens blacklisted\n\n` +
    `Positions:\n${posText}`
  );
});

bot.command('sell', async (ctx) => {
  await ctx.reply('🔄 Selling all positions...');
  const result = await manualSellAll();
  await ctx.reply(result);
});

bot.command('risk', async (ctx) => {
  const level = ctx.match?.trim().toLowerCase();
  if (!['cautious', 'balanced', 'degen'].includes(level)) {
    return ctx.reply('Usage: /risk <cautious|balanced|degen>');
  }
  setRisk(level);
  const conf = getConfig();
  await ctx.reply(
    `Risk set to ${level} 🎯\n` +
    `TP: +${conf.gradTP}% / SL: ${conf.gradSL}% | Max buy: ${conf.gradMaxBuy} SOL\n` +
    `Min score: ${conf.minScore}`
  );
});

// ── Natural language handler ──
bot.on('message:text', async (ctx) => {
  const text = ctx.message.text.toLowerCase().trim();
  ownerChatId = String(ctx.chat.id);  // Always update
  
  // Status queries
  if (matches(text, ['status', 'how are we doing', 'how we doing', "what's the score", 'stats', 'pnl', 'balance', 'how much'])) {
    const state = getState();
    const bal = walletAddr ? await getBalance() : 0;
    const winRate = (state.wins + state.losses) > 0 ? ((state.wins / (state.wins + state.losses)) * 100).toFixed(0) : '0';
    await ctx.reply(
      `${bal.toFixed(2)} SOL in the wallet\n` +
      `${state.wins}W/${state.losses}L (${winRate}% win rate)\n` +
      `PnL: ${state.totalPnl >= 0 ? '+' : ''}${state.totalPnl.toFixed(4)} SOL\n` +
      `${state.positions.length} open position(s), ${state.exitedCount} tokens avoided`
    );
    return;
  }
  
  // Holdings
  if (matches(text, ['holding', 'positions', 'what do you have', 'bag', 'portfolio'])) {
    const state = getState();
    if (!state.positions.length) {
      await ctx.reply('Empty hands. Looking for the next play.');
      return;
    }
    const lines = state.positions.map(p => {
      const mins = ((Date.now() - p.buyTime) / 60000).toFixed(0);
      return `$${p.symbol} — ${p.buySol} SOL, held ${mins}min (${p.isBonding ? 'bonding' : 'graduated'})`;
    });
    await ctx.reply(`Currently holding:\n${lines.join('\n')}`);
    return;
  }
  
  // Start/stop
  if (matches(text, ['go', 'start', 'trade', 'wake up', 'lets go', "let's go", 'get to work', 'hunt'])) {
    if (!walletAddr) return ctx.reply('Need a wallet first. Set WALLET_SECRET in .env.local');
    start();
    return;
  }
  if (matches(text, ['stop', 'pause', 'chill', 'take a break', 'sleep', 'rest', 'hold up'])) {
    stop();
    return;
  }
  
  // Risk
  if (matches(text, ['aggressive', 'degen', 'yolo', 'send it', 'ape mode'])) {
    setRisk('degen');
    await ctx.reply('Degen mode activated. Bigger bets, wider stops. Let\'s eat. 🔥');
    return;
  }
  if (matches(text, ['careful', 'cautious', 'safe', 'conservative', 'slow down', 'easy'])) {
    setRisk('cautious');
    await ctx.reply('Going cautious. Smaller positions, tighter stops. Playing it safe.');
    return;
  }
  if (matches(text, ['balanced', 'normal', 'default', 'reset risk'])) {
    setRisk('balanced');
    await ctx.reply('Back to balanced mode. Steady as she goes.');
    return;
  }
  
  // Sell all
  if (matches(text, ['sell everything', 'sell all', 'dump it', 'close all', 'exit all'])) {
    await ctx.reply('Selling everything...');
    const result = await manualSellAll();
    await ctx.reply(result);
    return;
  }
  
  // Manual buy — "buy <mint> <amount>"
  const buyMatch = text.match(/buy\s+([a-zA-Z0-9]{32,50})\s+([0-9.]+)/);
  if (buyMatch) {
    const mint = buyMatch[1];
    const amount = parseFloat(buyMatch[2]);
    if (isNaN(amount) || amount <= 0) return ctx.reply('Invalid amount.');
    await ctx.reply(`Buying ${amount} SOL of ${mint.slice(0, 8)}...`);
    const result = await manualBuy(mint, amount);
    await ctx.reply(result);
    return;
  }
  
  // Wallet
  if (matches(text, ['wallet', 'address'])) {
    if (!walletAddr) return ctx.reply('No wallet configured.');
    const bal = await getBalance();
    await ctx.reply(`🏦 ${walletAddr}\n💰 ${bal.toFixed(2)} SOL\n🔗 solscan.io/account/${walletAddr}`);
    return;
  }
  
  // What are you doing
  if (matches(text, ['what are you doing', 'whatcha doing', 'sup', "what's up", 'what you up to'])) {
    const state = getState();
    if (state.mode === 'paused') {
      await ctx.reply('Chilling. Not scanning right now. Say "go" when you want me hunting.');
    } else if (state.positions.length > 0) {
      const p = state.positions[0];
      const mins = ((Date.now() - p.buyTime) / 60000).toFixed(0);
      await ctx.reply(`Watching $${p.symbol} — been holding for ${mins}min. Scanning the market between checks.`);
    } else {
      await ctx.reply(`Scanning ${200 + 100} tokens per cycle. Looking for something with good score, clean holders, and momentum. Nothing worth buying yet.`);
    }
    return;
  }
  
  // Help
  if (matches(text, ['help', 'commands', 'what can you do'])) {
    await ctx.reply(
      `Just talk to me! Some things I understand:\n\n` +
      `"go" / "hunt" — start trading\n` +
      `"pause" / "chill" — stop trading\n` +
      `"status" / "how are we doing"\n` +
      `"what are you holding"\n` +
      `"be more aggressive" / "play it safe"\n` +
      `"sell everything"\n` +
      `"buy <address> <SOL amount>"\n` +
      `"wallet" — show wallet info\n` +
      `"what are you doing"\n\n` +
      `Or just chat. I'll figure it out.`
    );
    return;
  }
  
  // Default — friendly fallback
  await ctx.reply(`Not sure what you mean by that. Try "help" to see what I can do, or just ask me naturally — "how are we doing", "start trading", "be more aggressive" etc.`);
});

// ── Global error handler ──
process.on('unhandledRejection', (e) => {
  console.error('[UNHANDLED]', e);
  // Don't crash
});

process.on('uncaughtException', (e) => {
  console.error('[UNCAUGHT]', e);
  // Don't crash
});

// ── Start ──
console.log('=== SHARKD STARTING ===');
console.log(`Wallet: ${walletAddr || 'NOT SET'}`);
console.log(`Owner: ${OWNER_ID || 'ANY (set OWNER_CHAT_ID to restrict)'}`);

bot.start({
  onStart: () => console.log('[BOT] Online and listening'),
});

function matches(text, patterns) {
  return patterns.some(p => text.includes(p));
}
