import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

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
        { mode: 'Cautious', sizing: '0.05–0.20 SOL', tp: '+10%', sl: '-5%', score: '6+' },
        { mode: 'Balanced', sizing: '0.10–0.50 SOL', tp: '+15%', sl: '-8%', score: '5+' },
        { mode: 'Degen', sizing: '0.10–1.00 SOL', tp: '+20%', sl: '-12%', score: '4+' },
      ]},
      { type: 'text', content: 'Position sizing scales within these ranges based on your agent\'s win rate. More wins → bigger positions, automatically.' },
    ]
  },
  {
    id: 'skills',
    title: 'Skills System',
    blocks: [
      { type: 'text', content: 'Skills are modular trading strategies that plug into your agent\'s decision loop. Each skill hooks into specific points in the trading lifecycle.' },
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
      { type: 'text', content: 'Test your skill against historical trade data, then mint it on the marketplace. You earn 10% of every profitable trade your skill contributes to.' },
    ]
  },
  {
    id: 'devlocks',
    title: 'Dev Locks',
    blocks: [
      { type: 'text', content: 'Smart contracts that cryptographically lock developer token allocations for a verified period. Visible and verifiable by anyone on-chain.' },
      { type: 'code', title: 'Lock options', content: `🔒   7 days   — Basic trust signal
🔒🔒  30 days  — Strong commitment  
🔒🔒🔒 90 days  — Maximum trust

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
    <>
      <Nav />

      <div className="max-w-[1100px] mx-auto px-6 pt-32 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-12 grid-mobile-1">
          {/* Sidebar */}
          <aside className="hide-mobile">
            <div className="sticky top-24 flex flex-col gap-1">
              <p className="font-mono text-[10px] tracking-[0.15em] text-[#388eff] font-semibold mb-3">DOCUMENTATION</p>
              {sections.map(s => (
                <a key={s.id} href={`#${s.id}`}
                  className="font-mono text-[12px] py-1.5 no-underline transition-colors duration-200"
                  style={{ color: '#4a5568' }}>
                  {s.title}
                </a>
              ))}
            </div>
          </aside>

          {/* Content */}
          <main className="flex flex-col gap-16 pb-32">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">Documentation</h1>
              <p style={{ color: '#6b7394' }}>Everything you need to deploy, configure, and extend your trading agent.</p>
            </div>

            {sections.map(section => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">{section.title}</h2>
                <div className="flex flex-col gap-6">
                  {section.blocks.map((block, i) => {
                    if (block.type === 'text') {
                      return <p key={i} className="text-[15px] leading-relaxed" style={{ color: '#8b93a8' }}>{block.content as string}</p>;
                    }
                    if (block.type === 'code') {
                      const b = block as { type: string; title: string; content: string };
                      return (
                        <div key={i} className="terminal">
                          <div className="terminal-header">
                            <div className="terminal-dot" style={{ background: '#ff5f57' }} />
                            <div className="terminal-dot" style={{ background: '#febc2e' }} />
                            <div className="terminal-dot" style={{ background: '#28c840' }} />
                            <span className="font-mono text-[11px] ml-3" style={{ color: '#4a4a5a' }}>{b.title}</span>
                          </div>
                          <div className="terminal-body">
                            <pre className="text-[12px] leading-relaxed whitespace-pre-wrap" style={{ color: '#8b93a8' }}>{b.content}</pre>
                          </div>
                        </div>
                      );
                    }
                    if (block.type === 'steps') {
                      const steps = block.content as Array<{ step: string; title: string; desc: string }>;
                      return (
                        <div key={i} className="flex flex-col gap-4">
                          {steps.map(s => (
                            <div key={s.step} className="card p-5 flex gap-5">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-mono text-sm font-bold"
                                style={{ background: 'rgba(56,142,255,0.08)', color: '#388eff' }}>
                                {s.step}
                              </div>
                              <div>
                                <h4 className="text-[14px] font-semibold text-white mb-1">{s.title}</h4>
                                <p className="text-[13px]" style={{ color: '#6b7394' }}>{s.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    if (block.type === 'commands') {
                      const cmds = block.content as Array<{ cmd: string; desc: string }>;
                      return (
                        <div key={i} className="flex flex-col gap-2">
                          {cmds.map(c => (
                            <div key={c.cmd} className="flex items-start gap-4 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                              <code className="font-mono text-[12px] text-[#7bb5ff] flex-shrink-0 min-w-[240px]">{c.cmd}</code>
                              <span className="text-[13px]" style={{ color: '#6b7394' }}>{c.desc}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    if (block.type === 'table') {
                      const rows = block.content as Array<{ mode: string; sizing: string; tp: string; sl: string; score: string }>;
                      return (
                        <div key={i} className="terminal">
                          <div className="terminal-body">
                            <div className="grid grid-cols-5 gap-4 font-mono text-[11px] pb-3 mb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#4a5568' }}>
                              <span>MODE</span><span>SIZING</span><span>TP</span><span>SL</span><span>MIN SCORE</span>
                            </div>
                            {rows.map(r => (
                              <div key={r.mode} className="grid grid-cols-5 gap-4 font-mono text-[12px] py-2" style={{ color: '#8b93a8' }}>
                                <span className="text-white font-medium">{r.mode}</span>
                                <span>{r.sizing}</span>
                                <span style={{ color: '#22c55e' }}>{r.tp}</span>
                                <span style={{ color: '#ff4d6a' }}>{r.sl}</span>
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
    </>
  );
}
