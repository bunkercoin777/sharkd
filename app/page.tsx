import { Nav } from './components/Nav';
import { Footer } from './components/Footer';

export default function Home() {
  return (
    <>
      <Nav />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-[15%] left-[20%] w-[500px] h-[500px] rounded-full opacity-[0.03]" 
          style={{ background: 'radial-gradient(circle, #388eff, transparent 70%)' }} />
        <div className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] rounded-full opacity-[0.02]"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent 70%)' }} />

        <div className="relative z-10 max-w-[900px] text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-10"
            style={{ background: 'rgba(56,142,255,0.06)', border: '1px solid rgba(56,142,255,0.1)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse-soft" />
            <span className="font-mono text-xs tracking-widest text-[#7bb5ff] font-medium">
              AUTONOMOUS TRADING INTELLIGENCE
            </span>
          </div>

          <h1 className="text-[clamp(3.5rem,9vw,7rem)] font-black leading-[0.92] tracking-[-0.03em] mb-8">
            <span className="text-gradient">Trade smarter.</span>
            <br />
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>Sleep better.</span>
          </h1>

          <p className="text-lg md:text-xl leading-relaxed max-w-[580px] mx-auto mb-12" 
            style={{ color: '#6b7394' }}>
            SharkD is an AI agent that lives in your Telegram, autonomously trades 
            Solana memecoins, and evolves by installing skills from a marketplace.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap mb-20">
            <a href="https://t.me/" className="btn-primary">
              Deploy Your Agent
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="/docs" className="btn-secondary">Documentation</a>
          </div>

          {/* Mini terminal preview */}
          <div className="terminal max-w-[520px] mx-auto text-left glow-blue">
            <div className="terminal-header">
              <div className="terminal-dot" style={{ background: '#ff5f57' }} />
              <div className="terminal-dot" style={{ background: '#febc2e' }} />
              <div className="terminal-dot" style={{ background: '#28c840' }} />
              <span className="font-mono text-[11px] ml-3" style={{ color: '#4a4a5a' }}>sharkd — active</span>
            </div>
            <div className="terminal-body">
              <div style={{ color: '#4a5568' }}>$ sharkd status</div>
              <div className="mt-2" style={{ color: '#6b7394' }}>
                <span style={{ color: '#22c55e' }}>●</span> Agent online — scanning 347 tokens
              </div>
              <div style={{ color: '#6b7394' }}>
                <span style={{ color: '#388eff' }}>◆</span> Position: <span style={{ color: '#fff' }}>$SHARK</span> +12.4% (0.15 SOL)
              </div>
              <div style={{ color: '#6b7394' }}>
                <span style={{ color: '#f59e0b' }}>▲</span> Session: 7W/2L — <span style={{ color: '#22c55e' }}>+2.14 SOL</span>
              </div>
              <div className="mt-2" style={{ color: '#4a5568' }}>
                <span className="animate-pulse-soft">▊</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IT DOES — 3 pillars ── */}
      <section className="glow-line" />
      <section className="max-w-[1100px] mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <p className="font-mono text-xs tracking-[0.2em] text-[#388eff] mb-4 font-medium">THE PRODUCT</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Three layers. One edge.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 grid-mobile-1">
          {[
            {
              icon: '💬',
              label: '01 — CONVERSATIONAL',
              title: 'Talk to it.',
              desc: 'Lives in your Telegram. No dashboards, no charts, no terminal. Just text your agent like a friend. "Go hunt." "Be careful." "What are you holding?" It understands you.',
              accent: '#388eff'
            },
            {
              icon: '🧠',
              label: '02 — SKILL-POWERED',
              title: 'Teach it.',
              desc: 'Install modular trading skills from a marketplace. Rug detectors, narrative scanners, whale trackers. Each skill makes your agent measurably smarter. On-chain verified performance.',
              accent: '#a855f7'
            },
            {
              icon: '🛡️',
              label: '03 — TRUST LAYER',
              title: 'Protect it.',
              desc: 'Dev lock contracts prevent rug pulls. Holder rewards pay SOL to diamond hands. Vesting schedules replace cliff dumps. Trust built into the protocol, not promised in a whitepaper.',
              accent: '#22c55e'
            },
          ].map((item) => (
            <div key={item.label} className="card p-8 flex flex-col gap-5">
              <div className="text-3xl">{item.icon}</div>
              <p className="font-mono text-[10px] tracking-[0.15em] font-semibold" style={{ color: item.accent }}>
                {item.label}
              </p>
              <h3 className="text-2xl font-bold text-white tracking-tight">{item.title}</h3>
              <p className="text-[15px] leading-relaxed" style={{ color: '#6b7394' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE CHAT DEMO ── */}
      <section className="glow-line" />
      <section className="max-w-[1100px] mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center grid-mobile-1">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-[#388eff] mb-4 font-medium">INTERFACE</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-white mb-6">
              Conversation,<br />not configuration.
            </h2>
            <p className="text-[16px] leading-relaxed mb-8" style={{ color: '#6b7394' }}>
              Most trading tools give you a dashboard with 47 settings you&apos;ll never touch. 
              SharkD gives you a chat. Say what you want in plain English. Your agent handles the rest.
            </p>
            <div className="flex flex-col gap-3">
              {[
                'Natural language commands — no syntax to learn',
                'Proactive updates — it messages you first',
                'Risk modes you can change mid-conversation',
                'Manual overrides when you want control',
              ].map((line) => (
                <div key={line} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-[#388eff] flex-shrink-0" />
                  <span className="text-sm" style={{ color: '#8b93a8' }}>{line}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="terminal glow-blue">
            <div className="terminal-header">
              <div className="terminal-dot" style={{ background: '#ff5f57' }} />
              <div className="terminal-dot" style={{ background: '#febc2e' }} />
              <div className="terminal-dot" style={{ background: '#28c840' }} />
              <span className="font-mono text-[11px] ml-3" style={{ color: '#4a4a5a' }}>Telegram — SharkD</span>
            </div>
            <div className="p-6 flex flex-col gap-3">
              {[
                { from: 'user', text: 'how are we doing today?' },
                { from: 'bot', text: '9.42 SOL in the wallet\n3W/1L — 75% win rate\nPnL: +0.87 SOL today\nWatching $LOBSTR at +6.2%' },
                { from: 'user', text: 'nice. be more aggressive' },
                { from: 'bot', text: 'Degen mode. Bigger positions, wider stops.\nScanning 347 tokens. Let\'s eat.' },
                { from: 'bot', text: '🔍 Found $DEEPBLUE — score 8/10\nNarrative: "deep" meta (14 tokens)\nTop holder: 3.8%. Clean.\nBuying 0.30 SOL...' },
                { from: 'bot', text: '✅ +22.1% on $DEEPBLUE\n+0.066 SOL profit\nBalance: 9.49 SOL | 4W/1L' },
              ].map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${msg.from === 'user' ? 'chat-user' : 'chat-bot'} px-4 py-3 max-w-[85%]`}>
                    <pre className="font-mono text-[12px] leading-relaxed whitespace-pre-wrap">{msg.text}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS MARKETPLACE ── */}
      <section className="glow-line" />
      <section className="max-w-[1100px] mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <p className="font-mono text-xs tracking-[0.2em] text-[#a855f7] mb-4 font-medium">MARKETPLACE</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-5">
            Skills that trade.
          </h2>
          <p className="text-[16px] max-w-[520px] mx-auto" style={{ color: '#6b7394' }}>
            Every skill was extracted from real trading — 72+ mainnet trades, real SOL, real lessons.
            Install one, your agent gets that capability instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 grid-mobile-1">
          {[
            { name: 'Narrative Detection', tag: 'SCANNER', tagClass: 'tag-scanner', desc: 'Scans 400+ tokens for trending keywords. Finds metas forming across 3+ tokens before they peak. Score boost for tokens riding the narrative.', metric: 'Identified 29-token lobster meta', perf: '+18% avg on meta trades' },
            { name: 'Holder Analysis', tag: 'FILTER', tagClass: 'tag-filter', desc: 'Checks top 1/5/10 wallet concentration before every buy via Solana RPC. Auto-rejects tokens where a single wallet holds >50% of supply.', metric: 'Blocked 14 potential rugs', perf: '0 rug losses with skill active' },
            { name: 'Momentum Tracker', tag: 'ANALYSIS', tagClass: 'tag-analysis', desc: 'Tracks 30-point price history per position. Detects recovery, dumping, and flat momentum. Extends hold time for recoveries, cuts dumps fast.', metric: 'Dynamic 1-10 min holds', perf: '+34% avg hold efficiency' },
            { name: 'Aggressive Sell Engine', tag: 'EXECUTION', tagClass: 'tag-execution', desc: 'Three retry attempts with fresh Jupiter quotes each time. Escalating slippage from 1500→2500 bps. 200K lamport priority fees. No more lost profits.', metric: 'Fixed +26% trade lost to failed TX', perf: '97% sell success rate' },
            { name: 'Dual Market Scanner', tag: 'SCANNER', tagClass: 'tag-scanner', desc: 'Simultaneous pump.fun bonding curve and PumpSwap graduated token scanning. Different parameters optimized for each market type.', metric: '300 graduated + 100 bonding per cycle', perf: '2x opportunity surface' },
            { name: 'Smart Money Tracker', tag: 'ALPHA', tagClass: 'tag-alpha', desc: 'Identifies and follows wallets with consistent win rates. Detects smart money entries into tokens. Uses free Solana RPC — no paid APIs required.', metric: 'Tracks top 20 performing wallets', perf: 'Copy trading without the copy' },
          ].map((skill) => (
            <div key={skill.name} className="card p-7 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className={`font-mono text-[10px] tracking-wider font-semibold px-2.5 py-1 rounded ${skill.tagClass}`}>
                  {skill.tag}
                </span>
                <span className="font-mono text-[10px] text-[#22c55e] font-medium">PROVEN</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">{skill.name}</h3>
              <p className="text-[14px] leading-relaxed flex-1" style={{ color: '#6b7394' }}>{skill.desc}</p>
              <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="flex justify-between text-[11px] font-mono">
                  <span style={{ color: '#4a5568' }}>{skill.metric}</span>
                  <span style={{ color: '#22c55e' }}>{skill.perf}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="/marketplace" className="btn-secondary">
            View Full Marketplace
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      {/* ── TRUST LAYER ── */}
      <section className="glow-line" />
      <section className="max-w-[1100px] mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 grid-mobile-1">
          {/* Dev Locks */}
          <div className="card p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ background: 'rgba(255,77,106,0.08)', border: '1px solid rgba(255,77,106,0.1)' }}>
                🔒
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-[0.15em] text-[#ff4d6a] font-semibold">TRUST PROTOCOL</p>
                <h3 className="text-xl font-bold text-white">Dev Locks</h3>
              </div>
            </div>
            <p className="text-[15px] leading-relaxed mb-8" style={{ color: '#6b7394' }}>
              Smart contracts that freeze developer token allocations for a verified period. 
              Not a promise — cryptographic certainty. Buyers see the lock status before buying.
            </p>
            <div className="flex flex-col gap-3">
              {[
                { period: '7 days', level: 'Basic trust', bar: 25 },
                { period: '30 days', level: 'Strong commitment', bar: 55 },
                { period: '90 days', level: 'Maximum trust', bar: 90 },
              ].map((lock) => (
                <div key={lock.period} className="flex items-center gap-4">
                  <span className="font-mono text-[12px] text-white w-16 flex-shrink-0">{lock.period}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div className="h-full rounded-full" style={{ width: `${lock.bar}%`, background: 'linear-gradient(90deg, #ff4d6a, #ff8fa3)' }} />
                  </div>
                  <span className="font-mono text-[10px] flex-shrink-0" style={{ color: '#6b7394' }}>{lock.level}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Holder Rewards */}
          <div className="card p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.1)' }}>
                💎
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-[0.15em] text-[#22c55e] font-semibold">YIELD PROTOCOL</p>
                <h3 className="text-xl font-bold text-white">Holder Rewards</h3>
              </div>
            </div>
            <p className="text-[15px] leading-relaxed mb-8" style={{ color: '#6b7394' }}>
              SOL distributed to holders proportionally based on how long they&apos;ve held. 
              Longer hold = higher multiplier. Real yield in SOL, not inflationary tokens.
            </p>
            <div className="flex flex-col gap-3">
              {[
                { period: '1 day', mult: '1.0x', bar: 20 },
                { period: '7 days', mult: '1.5x', bar: 35 },
                { period: '30 days', mult: '3.0x', bar: 65 },
                { period: '90 days', mult: '5.0x', bar: 100 },
              ].map((tier) => (
                <div key={tier.period} className="flex items-center gap-4">
                  <span className="font-mono text-[12px] text-white w-16 flex-shrink-0">{tier.period}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div className="h-full rounded-full" style={{ width: `${tier.bar}%`, background: 'linear-gradient(90deg, #22c55e, #4ade80)' }} />
                  </div>
                  <span className="font-mono text-[12px] font-semibold flex-shrink-0" style={{ color: '#22c55e' }}>{tier.mult}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── NUMBERS ── */}
      <section className="glow-line" />
      <section className="max-w-[1100px] mx-auto px-6 py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 grid-mobile-1">
          {[
            { value: '72+', label: 'Mainnet trades executed', sub: 'Real SOL, real results' },
            { value: '7', label: 'Proven trading skills', sub: 'Extracted from live trading' },
            { value: '400+', label: 'Tokens scanned per cycle', sub: 'Bonding + graduated markets' },
            { value: '97%', label: 'Sell execution rate', sub: 'After aggressive retry system' },
          ].map((stat) => (
            <div key={stat.label} className="card p-6 text-center">
              <div className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">{stat.value}</div>
              <div className="text-[13px] font-medium text-[#8b93a8] mb-1">{stat.label}</div>
              <div className="font-mono text-[10px]" style={{ color: '#4a5568' }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SDK PREVIEW ── */}
      <section className="glow-line" />
      <section className="max-w-[1100px] mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center grid-mobile-1">
          <div className="terminal">
            <div className="terminal-header">
              <div className="terminal-dot" style={{ background: '#ff5f57' }} />
              <div className="terminal-dot" style={{ background: '#febc2e' }} />
              <div className="terminal-dot" style={{ background: '#28c840' }} />
              <span className="font-mono text-[11px] ml-3" style={{ color: '#4a4a5a' }}>skill.config.json</span>
            </div>
            <div className="terminal-body">
              <pre className="text-[12px] leading-relaxed" style={{ color: '#6b7394' }}>
{`{
  `}<span style={{ color: '#388eff' }}>&quot;name&quot;</span>{`: `}<span style={{ color: '#22c55e' }}>&quot;narrative-detector&quot;</span>{`,
  `}<span style={{ color: '#388eff' }}>&quot;version&quot;</span>{`: `}<span style={{ color: '#22c55e' }}>&quot;2.1.0&quot;</span>{`,
  `}<span style={{ color: '#388eff' }}>&quot;type&quot;</span>{`: `}<span style={{ color: '#22c55e' }}>&quot;scanner&quot;</span>{`,
  `}<span style={{ color: '#388eff' }}>&quot;hooks&quot;</span>{`: [`}<span style={{ color: '#22c55e' }}>&quot;post-scan&quot;</span>{`, `}<span style={{ color: '#22c55e' }}>&quot;on-cycle&quot;</span>{`],
  `}<span style={{ color: '#388eff' }}>&quot;pricing&quot;</span>{`: {
    `}<span style={{ color: '#388eff' }}>&quot;model&quot;</span>{`: `}<span style={{ color: '#22c55e' }}>&quot;performance&quot;</span>{`,
    `}<span style={{ color: '#388eff' }}>&quot;revShare&quot;</span>{`: `}<span style={{ color: '#f59e0b' }}>0.10</span>{`
  }
}`}
              </pre>
            </div>
          </div>

          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-[#f59e0b] mb-4 font-medium">FOR BUILDERS</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-white mb-6">
              Build skills.<br />Earn from every trade.
            </h2>
            <p className="text-[16px] leading-relaxed mb-8" style={{ color: '#6b7394' }}>
              Write a trading strategy. Test it against real market data. Mint it as an on-chain NFT. 
              Every time an agent profits using your skill, you earn 10% of the gain. 
              Passive income from code that works.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a href="/docs" className="btn-primary">Read the SDK Docs</a>
              <a href="/marketplace" className="btn-secondary">Browse Skills</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="glow-line" />
      <section className="py-40 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, #388eff, transparent 70%)' }} />
        <div className="relative z-10">
          <h2 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
            Your edge is waiting.
          </h2>
          <p className="text-lg max-w-[440px] mx-auto mb-12" style={{ color: '#6b7394' }}>
            Deploy a personal trading agent in 60 seconds.
            Telegram-native. Skill-powered. Battle-tested.
          </p>
          <a href="https://t.me/" className="btn-primary text-lg px-12 py-5">
            Deploy Your Agent
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
