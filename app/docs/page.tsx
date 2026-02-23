export default function Docs() {
  return (
    <div style={{ background: '#050508', minHeight: '100vh' }}>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 64,
        background: 'rgba(5,5,8,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #1a1a2e', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', zIndex: 100
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <span style={{ fontSize: 28 }}>🦈</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 20, color: '#00a8ff', letterSpacing: 2 }}>SHARKD</span>
        </a>
        <div style={{ display: 'flex', gap: 32 }}>
          <a href="/" style={{ color: '#6b7394', textDecoration: 'none', fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>Home</a>
          <a href="/marketplace" style={{ color: '#6b7394', textDecoration: 'none', fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>Marketplace</a>
          <a href="/docs" style={{ color: '#00a8ff', textDecoration: 'none', fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>Docs</a>
        </div>
      </nav>

      <main style={{ padding: '120px 32px 80px', maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{
          fontSize: 48, fontWeight: 900, marginBottom: 48,
          background: 'linear-gradient(135deg, #e0e8ff, #00a8ff)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
        }}>Documentation</h1>

        {[
          {
            title: 'Quick Start',
            content: `1. Create a Telegram bot via @BotFather — copy the token
2. Send /start to your new bot to get your chat ID
3. Fund a Solana wallet and export the private key
4. Configure your shark with your credentials
5. Say "go" — your shark starts hunting`
          },
          {
            title: 'Talking To Your Shark',
            content: `Your shark understands natural language. No slash commands needed.

• "go" / "hunt" / "start" — Begin scanning and trading
• "pause" / "chill" / "stop" — Pause trading
• "status" / "how are we doing" — Get current stats
• "what are you holding" — See open positions
• "be more aggressive" — Switch to degen mode (wider stops, bigger bets)
• "play it safe" — Switch to cautious mode (tight stops, small bets)
• "sell everything" — Close all positions immediately
• "buy [address] [amount]" — Manual buy
• "wallet" — Show wallet address and balance`
          },
          {
            title: 'Risk Modes',
            content: `Cautious — 0.05-0.20 SOL positions, +10% TP, -5% SL, min score 6
Balanced — 0.10-0.50 SOL positions, +15% TP, -8% SL, min score 5
Degen — 0.10-1.00 SOL positions, +20% TP, -12% SL, min score 4

Your shark adapts position sizing based on win rate within these ranges.`
          },
          {
            title: 'Skills',
            content: `Skills are modular trading strategies your shark can install. Each skill is an on-chain NFT — owning it gives your shark the license to run it.

Built-in skills (free):
• Token scoring — basic quality filter
• Position management — entry/exit logic

Marketplace skills (paid):
• Narrative Detection — trending meta scanner
• Holder Analysis — rug prevention filter
• Momentum Tracker — dynamic hold times
• Aggressive Sell Engine — retry with escalating slippage
• Dual Market Scanner — bonding + graduated
• Smart Money Tracker — whale following

Install a skill and your shark immediately starts using it.`
          },
          {
            title: 'Building Skills (SDK)',
            content: `Skills follow a standard interface:

// skill.config.json
{
  "name": "my-skill",
  "version": "1.0.0",
  "type": "filter|scanner|execution|analysis|risk",
  "hooks": ["pre-buy", "pre-sell", "post-scan", "on-cycle"]
}

// skill.mjs
export function onCycle(context) {
  // context.tokens — scanned tokens
  // context.positions — open positions
  // context.wallet — balance info
  // return modified tokens/scores/decisions
}

Skills hook into the trading lifecycle at defined points:
• pre-buy — filter or modify buy decisions
• pre-sell — adjust sell logic
• post-scan — process scan results
• on-cycle — run every scan cycle

Test your skill against historical data, then mint it on the marketplace.`
          },
          {
            title: 'Dev Locks',
            content: `Launch tokens through SharkD with built-in dev wallet locks.

Lock tiers:
🔒 7 days — basic trust signal
🔒🔒 30 days — strong commitment
🔒🔒🔒 90 days — maximum trust

Vesting option: linear unlock over the lock period instead of cliff.
All locks are on-chain and verifiable by anyone.`
          },
          {
            title: 'Holder Rewards',
            content: `Token projects on SharkD can enable holder rewards:

• Agent snapshots all holders periodically
• Distributes SOL proportionally based on holdings
• Hold duration multiplier: 1d=1x, 7d=1.5x, 30d=3x, 90d=5x
• Rewards paid in SOL (real yield, not more tokens)
• Selling resets your multiplier

This creates genuine incentive to hold instead of flip.`
          },
        ].map((section, i) => (
          <div key={i} style={{
            marginBottom: 48, padding: 32,
            background: '#0a0a12', border: '1px solid #1a1a2e', borderRadius: 12
          }}>
            <h2 style={{
              fontSize: 24, fontWeight: 700, marginBottom: 20, color: '#00a8ff',
              fontFamily: "'JetBrains Mono', monospace"
            }}>{section.title}</h2>
            <pre style={{
              color: '#e0e8ff', fontSize: 14, lineHeight: 1.8,
              whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              fontFamily: "'JetBrains Mono', monospace"
            }}>{section.content}</pre>
          </div>
        ))}
      </main>

      <footer style={{
        padding: '48px 32px', borderTop: '1px solid #1a1a2e',
        textAlign: 'center', color: '#6b7394', fontSize: 13
      }}>
        <p>SharkD &copy; 2026. Built by sharks, for sharks.</p>
      </footer>
    </div>
  );
}
