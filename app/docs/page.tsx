import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const C = {
  bg: '#020810', surface: '#041220', border: 'rgba(0,180,216,0.06)', borderLit: 'rgba(0,180,216,0.12)',
  accent: '#00b4d8', green: '#06d6a0', red: '#ef476f', amber: '#ffd166',
  purple: '#8338ec',
  white: '#e0eaf4', text: '#7b93b0', dim: '#3d5a80', dimmer: '#1e3354',
  mono: "'JetBrains Mono', 'SF Mono', monospace",
  sans: "'Inter', system-ui, sans-serif",
};

const sections = [
  {
    id: 'quickstart',
    title: 'Quick Start',
    blocks: [
      { type: 'text', content: 'Get your personal trading agent running in under 2 minutes.' },
      { type: 'steps', content: [
        { step: '1', title: 'Create a Telegram bot', desc: 'Message @BotFather on Telegram. Send /newbot and follow the prompts. Copy the API token.' },
        { step: '2', title: 'Get your chat ID', desc: 'Send /start to your new bot. Your chat ID appears in the welcome message.' },
        { step: '3', title: 'Fund a wallet', desc: 'Create or import a Solana wallet. Export the private key (base58 or base64). Send SOL to it.' },
        { step: '4', title: 'Configure', desc: 'Set TELEGRAM_BOT_TOKEN, OWNER_CHAT_ID, and WALLET_SECRET in your .env file.' },
        { step: '5', title: 'Launch', desc: 'Run npm run bot. Message your bot "go" and it starts hunting.' },
      ]},
    ]
  },
  {
    id: 'conversation',
    title: 'Conversational Interface',
    blocks: [
      { type: 'text', content: 'Your agent understands natural language. No slash commands, no syntax to memorize.' },
      { type: 'commands', content: [
        { cmd: '"go" / "hunt" / "start"', desc: 'Begin scanning and trading autonomously' },
        { cmd: '"pause" / "chill" / "stop"', desc: 'Pause all trading activity' },
        { cmd: '"status" / "how are we doing"', desc: 'Current balance, win rate, PnL' },
        { cmd: '"what are you holding"', desc: 'List open positions with hold time' },
        { cmd: '"be more aggressive"', desc: 'Switch to degen risk mode' },
        { cmd: '"play it safe"', desc: 'Switch to cautious risk mode' },
        { cmd: '"sell everything"', desc: 'Close all positions immediately' },
        { cmd: '"buy [address] [SOL]"', desc: 'Manual buy of a specific token' },
        { cmd: '"wallet"', desc: 'Show wallet address and balance' },
        { cmd: '"what are you doing"', desc: 'Current activity status' },
      ]},
    ]
  },
  {
    id: 'risk',
    title: 'Risk Modes',
    blocks: [
      { type: 'text', content: 'Three preset risk profiles. Switch between them mid-conversation.' },
      { type: 'table', content: [
        { mode: 'Cautious', sizing: '0.05-0.20 SOL', tp: '+10%', sl: '-5%', score: '6+' },
        { mode: 'Balanced', sizing: '0.10-0.50 SOL', tp: '+15%', sl: '-8%', score: '5+' },
        { mode: 'Degen', sizing: '0.10-1.00 SOL', tp: '+20%', sl: '-12%', score: '4+' },
      ]},
      { type: 'text', content: 'Position sizing scales within these ranges based on your agent\'s win rate. More wins = bigger positions, automatically.' },
    ]
  },
  {
    id: 'skills',
    title: 'Skills System',
    blocks: [
      { type: 'text', content: 'Skills are modular trading strategies that plug into your agent\'s decision loop. Each skill hooks into specific points in the trading lifecycle. All skills must pass testing on the reference agent before marketplace listing.' },
      { type: 'code', title: 'Skill lifecycle hooks', content: `pre-buy    → Filter or modify buy decisions before execution
post-scan  → Process scan results, boost or penalize scores
on-cycle   → Run logic every scan cycle (monitoring, tracking)
pre-sell   → Adjust sell logic, override stop loss / take profit` },
      { type: 'text', content: 'Skills are on-chain NFTs. Owning the NFT gives your agent the license to run the skill. Performance is tracked and verified on-chain.' },
    ]
  },
  {
    id: 'sdk',
    title: 'Building Skills (SDK)',
    blocks: [
      { type: 'text', content: 'Write a strategy as a JavaScript module that exports hook functions. The SDK provides the context object with everything your skill needs.' },
      { type: 'code', title: 'skill.config.json', content: `{
  "name": "my-rug-detector",
  "version": "1.0.0",
  "type": "filter",
  "hooks": ["pre-buy"],
  "pricing": {
    "model": "performance",
    "revShare": 0.10
  }
}` },
      { type: 'code', title: 'skill.mjs', content: `export function preBuy(context) {
  const { token, holders, narratives } = context;
  
  // Reject if top wallet holds > 40%
  if (holders?.top1Pct > 40) {
    return { action: 'reject', reason: 'concentrated holder' };
  }
  
  // Boost score if riding a narrative
  const metaBoost = narratives.some(n => 
    token.name.toLowerCase().includes(n.keyword)
  ) ? 2 : 0;
  
  return { 
    action: 'allow',
    scoreModifier: metaBoost 
  };
}` },
      { type: 'text', content: 'Test your skill on the reference agent first. Once it proves profitable over at least 20 trades, it can be minted on the marketplace. You earn 10% of every profitable trade your skill contributes to.' },
    ]
  },
  {
    id: 'testing',
    title: 'Skill Testing Pipeline',
    blocks: [
      { type: 'text', content: 'Every skill goes through a rigorous testing pipeline before it can be listed on the marketplace. No exceptions.' },
      { type: 'code', title: 'Testing requirements', content: `1. Submit skill to reference agent
2. Minimum 20 live trades on mainnet
3. Positive PnL over testing period
4. No critical failures (missed sells, etc)
5. Skill self-update cycle verified
6. Performance metrics published on-chain

Testing period: 48-168 hours depending on market activity
Results: publicly visible on the Live Terminal` },
      { type: 'text', content: 'The reference agent runs all marketplace skills simultaneously. The Live Terminal page shows every decision in real-time — which skills triggered, what they scored, and the outcome.' },
    ]
  },
  {
    id: 'devlocks',
    title: 'Dev Locks',
    blocks: [
      { type: 'text', content: 'Smart contracts that cryptographically lock developer token allocations for a verified period. Visible and verifiable by anyone on-chain.' },
      { type: 'code', title: 'Lock options', content: `  7 days   — Basic trust signal
  30 days  — Strong commitment  
  90 days  — Maximum trust

Vesting: Linear unlock over the period
         (1% per day over 100 days)
         vs cliff unlock (all at once)` },
      { type: 'text', content: 'Buyers can filter tokens by lock duration. Locked tokens receive a trust badge visible on the platform.' },
    ]
  },
  {
    id: 'rewards',
    title: 'Holder Rewards',
    blocks: [
      { type: 'text', content: 'An agent-powered reward distribution system that pays SOL to token holders based on how long they\'ve held.' },
      { type: 'code', title: 'Multiplier tiers', content: `Hold duration    Multiplier
─────────────    ──────────
1 day            1.0x
7 days           1.5x
30 days          3.0x
90 days          5.0x

Selling resets your multiplier.
Rewards paid in SOL, not tokens.` },
      { type: 'text', content: 'The agent snapshots holder wallets periodically, calculates proportional rewards with hold-duration multipliers, and distributes SOL via on-chain transactions.' },
    ]
  },
];

export default function Docs() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Nav />

      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '140px clamp(20px, 4vw, 40px) 40px' }}>
        <div className="docs-grid" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 48 }}>

          {/* Sidebar */}
          <aside className="docs-sidebar">
            <div style={{ position: 'sticky', top: 100, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <p style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: C.accent, marginBottom: 14 }}>DOCUMENTATION</p>
              {sections.map(s => (
                <a key={s.id} href={`#${s.id}`} style={{ fontFamily: C.mono, fontSize: 12, padding: '6px 0', textDecoration: 'none', color: C.dim }}>
                  {s.title}
                </a>
              ))}
            </div>
          </aside>

          {/* Content */}
          <main style={{ display: 'flex', flexDirection: 'column', gap: 64, paddingBottom: 120 }}>
            <div>
              <h1 style={{ fontFamily: C.sans, fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-0.03em', color: C.white, marginBottom: 12 }}>Documentation</h1>
              <p style={{ fontSize: 15, color: C.dim, lineHeight: 1.6 }}>Everything you need to deploy, configure, and extend your trading agent.</p>
            </div>

            {sections.map(section => (
              <section key={section.id} id={section.id} style={{ scrollMarginTop: 100 }}>
                <h2 style={{ fontFamily: C.sans, fontSize: 24, fontWeight: 800, color: C.white, marginBottom: 24, letterSpacing: '-0.01em' }}>{section.title}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {section.blocks.map((block, i) => {
                    if (block.type === 'text') {
                      return <p key={i} style={{ fontSize: 15, lineHeight: 1.7, color: C.text }}>{block.content as string}</p>;
                    }
                    if (block.type === 'code') {
                      const b = block as { type: string; title: string; content: string };
                      return (
                        <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 16px', background: 'rgba(0,180,216,0.02)', borderBottom: `1px solid ${C.border}` }}>
                            <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ef476f' }} />
                            <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ffd166' }} />
                            <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#06d6a0' }} />
                            <span style={{ fontFamily: C.mono, fontSize: 11, marginLeft: 8, color: C.dimmer }}>{b.title}</span>
                          </div>
                          <div style={{ padding: '16px 20px' }}>
                            <pre style={{ fontFamily: C.mono, fontSize: 12, lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0, color: C.text }}>{b.content}</pre>
                          </div>
                        </div>
                      );
                    }
                    if (block.type === 'steps') {
                      const steps = block.content as Array<{ step: string; title: string; desc: string }>;
                      return (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {steps.map(s => (
                            <div key={s.step} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, display: 'flex', gap: 16 }}>
                              <div style={{
                                width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                background: 'rgba(0,180,216,0.08)', border: '1px solid rgba(0,180,216,0.12)',
                                fontFamily: C.mono, fontSize: 13, fontWeight: 700, color: C.accent,
                              }}>{s.step}</div>
                              <div>
                                <h4 style={{ fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 4 }}>{s.title}</h4>
                                <p style={{ fontSize: 13, color: C.dim, lineHeight: 1.6 }}>{s.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    if (block.type === 'commands') {
                      const cmds = block.content as Array<{ cmd: string; desc: string }>;
                      return (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                          {cmds.map(c => (
                            <div key={c.cmd} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                              <code style={{ fontFamily: C.mono, fontSize: 12, color: '#48cae4', flexShrink: 0, minWidth: 240 }}>{c.cmd}</code>
                              <span style={{ fontSize: 13, color: C.dim, lineHeight: 1.5 }}>{c.desc}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    if (block.type === 'table') {
                      const rows = block.content as Array<{ mode: string; sizing: string; tp: string; sl: string; score: string }>;
                      return (
                        <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                          <div style={{ padding: '16px 20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 16, fontFamily: C.mono, fontSize: 11, color: C.dimmer, paddingBottom: 12, marginBottom: 12, borderBottom: `1px solid ${C.border}` }}>
                              <span>MODE</span><span>SIZING</span><span>TP</span><span>SL</span><span>MIN SCORE</span>
                            </div>
                            {rows.map(r => (
                              <div key={r.mode} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 16, fontFamily: C.mono, fontSize: 12, color: C.text, padding: '8px 0' }}>
                                <span style={{ color: C.white, fontWeight: 600 }}>{r.mode}</span>
                                <span>{r.sizing}</span>
                                <span style={{ color: C.green }}>{r.tp}</span>
                                <span style={{ color: C.red }}>{r.sl}</span>
                                <span>{r.score}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </section>
            ))}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
