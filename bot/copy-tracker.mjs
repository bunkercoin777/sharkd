// ── SharkD Copy Trade Tracker ──
// Monitors profitable wallets on Solana and mirrors their memecoin buys.
// Learns which wallets are consistently profitable and adjusts follow weight.
// All tracked on-chain and logged to DB.

import { Connection, PublicKey } from '@solana/web3.js';
import { neon } from '@neondatabase/serverless';

const RPC = process.env.RPC_URL;
const conn = new Connection(RPC, 'confirmed');
const sql = neon(process.env.DATABASE_URL);

// ══════════════════════════════════════════════════════════════
// WALLET DISCOVERY — find profitable traders
// ══════════════════════════════════════════════════════════════

// Known profitable wallet sources:
// 1. Top traders on GMGN leaderboard
// 2. Wallets that consistently buy early and sell at profit
// 3. Wallets discovered from our own winning trades (who else was in early?)

const TRACKED_WALLETS = new Map(); // address → { alias, wins, losses, pnl, lastSeen, trust }

async function discoverProfitableWallets() {
  // Method 1: Check top holders of tokens we won on
  // If we made money on a token, who else was in early?
  try {
    const recentWins = await sql`SELECT mint, symbol FROM sharkd_trades WHERE result='win' AND type='sell' ORDER BY created_at DESC LIMIT 5`;
    
    for (const trade of recentWins) {
      if (!trade.mint) continue;
      try {
        const holders = await conn.getTokenLargestAccounts(new PublicKey(trade.mint));
        const topHolders = (holders.value || []).slice(0, 10);
        
        for (const holder of topHolders) {
          // Get the owner of this token account
          try {
            const acctInfo = await conn.getParsedAccountInfo(holder.address);
            const owner = acctInfo?.value?.data?.parsed?.info?.owner;
            if (!owner) continue;
            
            // Skip if it's a known program or our own wallet
            if (owner === process.env.WALLET_PUBLIC || owner.endsWith('pump')) continue;
            
            if (!TRACKED_WALLETS.has(owner)) {
              TRACKED_WALLETS.set(owner, {
                alias: `winner-${trade.symbol}`,
                wins: 1, losses: 0, pnl: 0,
                lastSeen: Date.now(),
                trust: 0.5, // start neutral
                source: `co-holder on $${trade.symbol} win`,
                discoveredAt: Date.now(),
              });
            }
          } catch {}
        }
      } catch {}
    }
  } catch (e) {
    console.log(`[DISCOVER] Error: ${e.message}`);
  }
}

// Method 2: Fetch from GMGN top traders API
async function fetchGMGNTopTraders() {
  try {
    const res = await fetch('https://gmgn.ai/defi/quotation/v1/rank/sol/wallets/7d?orderby=pnl_7d&direction=desc&limit=20');
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.data?.rank || []).map(w => ({
      address: w.address,
      pnl7d: w.pnl_7d,
      winRate: w.winrate_7d,
      trades: w.buy_7d + w.sell_7d,
    })).filter(w => w.winRate > 0.5 && w.trades > 10);
  } catch { return []; }
}

// ══════════════════════════════════════════════════════════════
// WALLET MONITORING — watch what tracked wallets buy
// ══════════════════════════════════════════════════════════════

async function checkWalletActivity(walletAddress) {
  try {
    // Get recent transactions
    const sigs = await conn.getSignaturesForAddress(
      new PublicKey(walletAddress),
      { limit: 5 }
    );
    
    const recentTxs = [];
    for (const sig of sigs) {
      // Only look at last 5 minutes
      if (sig.blockTime && (Date.now() / 1000 - sig.blockTime) > 300) continue;
      
      try {
        const tx = await conn.getParsedTransaction(sig.signature, {
          maxSupportedTransactionVersion: 0,
        });
        if (!tx) continue;
        
        // Look for token buys (SOL → token swaps)
        const instructions = tx.transaction.message.instructions || [];
        for (const ix of instructions) {
          // Check if this is a swap/buy on Jupiter or PumpPortal
          if (ix.programId?.toString() === 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4' ||
              ix.programId?.toString() === '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P') {
            recentTxs.push({
              signature: sig.signature,
              blockTime: sig.blockTime,
              program: ix.programId.toString(),
            });
          }
        }
      } catch {}
    }
    
    return recentTxs;
  } catch { return []; }
}

// ══════════════════════════════════════════════════════════════
// SIGNAL GENERATION — determine if we should follow a trade
// ══════════════════════════════════════════════════════════════

function shouldFollowTrade(wallet, tokenMint, tradeData) {
  const walletInfo = TRACKED_WALLETS.get(wallet);
  if (!walletInfo) return false;
  
  // Trust-based filtering
  if (walletInfo.trust < 0.3) return false;
  
  // Don't follow if we already hold or exited this token
  // (checked by caller against positions and exitedMints)
  
  // Higher trust = follow more aggressively
  const followProbability = walletInfo.trust;
  
  return {
    follow: Math.random() < followProbability,
    confidence: walletInfo.trust,
    reason: `${walletInfo.alias} (trust: ${walletInfo.trust.toFixed(2)}, ${walletInfo.wins}W/${walletInfo.losses}L)`,
    sizeMult: walletInfo.trust, // scale position by trust level
  };
}

// ══════════════════════════════════════════════════════════════
// TRUST SCORING — learn which wallets to follow
// ══════════════════════════════════════════════════════════════

function updateWalletTrust(walletAddress, result) {
  const info = TRACKED_WALLETS.get(walletAddress);
  if (!info) return;
  
  if (result === 'win') {
    info.wins++;
    info.trust = Math.min(info.trust + 0.1, 1.0);
  } else {
    info.losses++;
    info.trust = Math.max(info.trust - 0.15, 0.0); // penalize losses more
  }
  
  info.lastSeen = Date.now();
}

// ══════════════════════════════════════════════════════════════
// PERSISTENCE — save tracked wallets to DB
// ══════════════════════════════════════════════════════════════

async function persistWallets() {
  try {
    const data = Object.fromEntries(
      [...TRACKED_WALLETS.entries()].map(([k, v]) => [k, v])
    );
    await sql`INSERT INTO sharkd_state (key, value) 
              VALUES ('tracked_wallets', ${JSON.stringify(data)}::jsonb) 
              ON CONFLICT (key) DO UPDATE SET value = ${JSON.stringify(data)}::jsonb, updated_at = now()`;
  } catch {}
}

async function loadWallets() {
  try {
    const rows = await sql`SELECT value FROM sharkd_state WHERE key = 'tracked_wallets'`;
    if (rows.length && rows[0].value) {
      const data = rows[0].value;
      for (const [addr, info] of Object.entries(data)) {
        TRACKED_WALLETS.set(addr, info);
      }
      console.log(`[COPY] Loaded ${TRACKED_WALLETS.size} tracked wallets`);
    }
  } catch {}
}

// ══════════════════════════════════════════════════════════════
// HELIUS WEBSOCKET — real-time transaction monitoring
// ══════════════════════════════════════════════════════════════

// For real-time copy trading, we need Helius enhanced websockets
// to get instant notifications when tracked wallets make trades.
// This is more efficient than polling each wallet.

async function setupHeliusWebhook(walletAddresses) {
  // Helius provides transaction webhooks that fire when
  // specific wallets make transactions. This is the fastest
  // way to copy trade.
  
  // For now we poll — webhook setup requires a public endpoint
  // which we'll add when the bot has its own server.
  console.log(`[COPY] Monitoring ${walletAddresses.length} wallets via polling`);
}

// ══════════════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════════════

export {
  TRACKED_WALLETS,
  discoverProfitableWallets,
  fetchGMGNTopTraders,
  checkWalletActivity,
  shouldFollowTrade,
  updateWalletTrust,
  persistWallets,
  loadWallets,
  setupHeliusWebhook,
};
