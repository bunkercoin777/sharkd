import { Nav } from './components/Nav';
import { Footer } from './components/Footer';

const C = {
  bg: '#060610', surface: '#0b0b18', border: 'rgba(255,255,255,0.05)',
  accent: '#3b82f6', green: '#22c55e', red: '#ef4444', amber: '#f59e0b',
  purple: '#a855f7', cyan: '#06b6d4', white: '#f0f2f8', text: '#94a3b8',
  dim: '#475569', dimmer: '#334155',
  mono: "'JetBrains Mono', 'SF Mono', monospace",
  sans: "'Inter', system-ui, sans-serif",
  accentSoft: 'rgba(59,130,246,0.08)',
};
const wrap = { maxWidth: 1060, margin: '0 auto', padding: '0 clamp(20px, 4vw, 40px)' };
const sectionPad = { padding: '100px 0' };
const divider = { height: 1, background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.12), transparent)' };

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return <span style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, padding: '3px 10px', borderRadius: 4, color, background: color + '12' }}>{children}</span>;
}

export default function Home() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Nav />

      {/* ═══ HERO ═══ */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Animated orbs */}
        <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: 900, height: 600, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(59,130,246,0.05) 0%, transparent 70%)', pointerEvents: 'none', animation: 'pulse-slow 6s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '30%', left: '25%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.03) 0%, transparent 70%)', pointerEvents: 'none', animation: 'float 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '20%', right: '20%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.03) 0%, transparent 70%)', pointerEvents: 'none', animation: 'float 10s ease-in-out infinite 2s' }} />

        {/* Scan line */}
        <div style={{ position: 'absolute', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)', pointerEvents: 'none', animation: 'scan-line 5s linear infinite' }} />

        {/* Orbiting dots */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              position: 'absolute', width: 4, height: 4, borderRadius: '50%',
              background: i === 0 ? C.accent : i === 1 ? C.purple : C.green,
              opacity: 0.3,
              animation: `orbit ${20 + i * 5}s linear infinite ${i * 3}s`,
            }} />
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 760, padding: '0 24px', animation: 'fade-up 0.8s ease-out' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '7px 18px', borderRadius: 100, marginBottom: 44,
            background: C.accentSoft, border: '1px solid rgba(59,130,246,0.1)',
            animation: 'fade-in 1s ease-out 0.3s both',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.green, boxShadow: `0 0 6px ${C.green}`, animation: 'pulse-slow 2.5s ease-in-out infinite' }} />
            <span style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 600, letterSpacing: 2, color: C.accent }}>AUTONOMOUS TRADING INTELLIGENCE</span>
          </div>

          <h1 style={{ fontFamily: C.sans, fontSize: 'clamp(44px, 7.5vw, 76px)', fontWeight: 850, lineHeight: 1.0, letterSpacing: '-0.035em', marginBottom: 26, animation: 'fade-up 0.8s ease-out 0.2s both' }}>
            <span style={{ color: C.white }}>Trade smarter.</span><br />
            <span style={{ color: '#334155' }}>Sleep better.</span>
          </h1>

          <p style={{ fontSize: 17, lineHeight: 1.7, color: C.text, maxWidth: 520, margin: '0 auto 44px', animation: 'fade-up 0.8s ease-out 0.4s both' }}>
            An AI agent that lives in your Telegram, trades Solana memecoins,
            and gets smarter by installing skills from a marketplace.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64, animation: 'fade-up 0.8s ease-out 0.6s both' }}>
            <a href="https://t.me/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 32px', borderRadius: 10, textDecoration: 'none', background: C.accent, color: '#060610', fontWeight: 650, fontSize: 14 }}>
              Try the Demo →
            </a>
            <a href="/docs" style={{ padding: '13px 32px', borderRadius: 10, textDecoration: 'none', background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, color: C.text, fontWeight: 550, fontSize: 14 }}>Documentation</a>
          </div>

          {/* Terminal with typing effect */}
          <div style={{
            maxWidth: 440, margin: '0 auto', textAlign: 'left',
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
            overflow: 'hidden', animation: 'fade-up 0.8s ease-out 0.8s both, glow-pulse 4s ease-in-out infinite 1.5s',
            boxShadow: '0 20px 80px rgba(0,0,0,0.4)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 16px', background: 'rgba(255,255,255,0.015)', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ff5f57' }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#febc2e' }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#28c840' }} />
              <span style={{ fontFamily: C.mono, fontSize: 10, marginLeft: 8, color: C.dimmer }}>sharkd — live</span>
              <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: C.green, animation: 'pulse-slow 2s ease-in-out infinite' }} />
            </div>
            <div style={{ padding: '18px 20px', fontFamily: C.mono, fontSize: 12, lineHeight: 2.0 }}>
              <div style={{ color: C.dimmer }}>$ status</div>
              <div style={{ color: C.text }}><span style={{ color: C.green }}>●</span> Online — scanning 347 tokens</div>
              <div style={{ color: C.text }}><span style={{ color: C.accent }}>◆</span> Holding <span style={{ color: C.white }}>$SHARK</span> +12.4%</div>
              <div style={{ color: C.text }}><span style={{ color: C.amber }}>▲</span> 7W/2L — <span style={{ color: C.green }}>+2.14 SOL</span></div>
              <div style={{ marginTop: 4, color: C.accent }}>
                <span style={{ animation: 'blink 1s step-end infinite' }}>▊</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ THREE PILLARS ═══ */}
      <div style={divider} />
      <section style={sectionPad}>
        <div style={wrap}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: C.accent, marginBottom: 14 }}>HOW IT WORKS</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: C.white, letterSpacing: '-0.02em' }}>Three layers. One edge.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { icon: '💬', num: '01', label: 'Conversational', title: 'Talk to it.', desc: 'Lives in Telegram. No dashboards. Text your agent like a friend — "go hunt", "be careful", "what are you holding". It understands you.', color: C.accent },
              { icon: '🧠', num: '02', label: 'Skill-powered', title: 'Teach it.', desc: 'Install modular trading skills from a marketplace. Each skill is proven on mainnet with verifiable performance. Skills auto-update after every trade.', color: C.purple },
              { icon: '🛡️', num: '03', label: 'Trust layer', title: 'Protect it.', desc: 'Dev lock contracts prevent rug pulls. Holder rewards pay SOL to diamond hands. Trust built into the protocol, not promised.', color: C.green },
            ].map((p, i) => (
              <div key={p.num} style={{
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
                padding: 32, display: 'flex', flexDirection: 'column', gap: 16,
                animation: `fade-up 0.6s ease-out ${0.1 * i}s both`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 28 }}>{p.icon}</span>
                  <span style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: p.color }}>{p.num}</span>
                </div>
                <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: p.color, textTransform: 'uppercase' }}>{p.label}</p>
                <h3 style={{ fontSize: 22, fontWeight: 750, color: C.white }}>{p.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: C.text }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LIVE DEMO SECTION ═══ */}
      <div style={divider} />
      <section style={sectionPad}>
        <div style={wrap}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: C.green, marginBottom: 14 }}>LIVE DEMO</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: C.white, letterSpacing: '-0.02em', marginBottom: 12 }}>See it in action.</h2>
            <p style={{ fontSize: 15, color: C.text, maxWidth: 460, margin: '0 auto' }}>
              Try the demo bot on Telegram. No wallet needed — paper trade with virtual SOL and see how SharkD operates.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 800, margin: '0 auto' }}>
            {/* Demo chat */}
            <div style={{
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
              overflow: 'hidden', animation: 'glow-pulse 4s ease-in-out infinite',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 16px', background: 'rgba(255,255,255,0.015)', borderBottom: `1px solid ${C.border}` }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ff5f57' }} />
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#febc2e' }} />
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#28c840' }} />
                <span style={{ fontFamily: C.mono, fontSize: 10, marginLeft: 8, color: C.dimmer }}>Demo Session</span>
              </div>
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { from: 'user', text: 'how are we doing?' },
                  { from: 'bot', text: '9.42 SOL | 3W/1L (75%)\nPnL: +0.87 SOL today\n$LOBSTR at +6.2%' },
                  { from: 'user', text: 'be more aggressive' },
                  { from: 'bot', text: 'Degen mode. Let\'s eat. 🔥' },
                  { from: 'bot', text: '🔍 $DEEPBLUE — 8/10\n"deep" meta (14 tokens)\nBuying 0.30 SOL...' },
                  { from: 'bot', text: '✅ +22.1% | +0.066 SOL\n4W/1L | 9.49 SOL' },
                ].map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start', animation: `slide-right 0.4s ease-out ${0.15 * i}s both` }}>
                    <div style={{
                      maxWidth: '85%', padding: '8px 12px',
                      borderRadius: m.from === 'user' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
                      background: m.from === 'user' ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.025)',
                      border: `1px solid ${m.from === 'user' ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.04)'}`,
                    }}>
                      <pre style={{ fontFamily: C.mono, fontSize: 10, lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0, color: m.from === 'user' ? '#7bb5ff' : C.text }}>{m.text}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Demo features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center' }}>
              {[
                { icon: '🎮', title: 'Paper Trading', desc: '10 virtual SOL to start. No real money at risk.' },
                { icon: '⚡', title: 'Real Market Data', desc: 'Live pump.fun tokens. Real scores, real narratives.' },
                { icon: '📊', title: 'Skill Preview', desc: 'See skills in action before you buy them.' },
                { icon: '🔄', title: 'Self-Improving', desc: 'Skills update parameters after every trade cycle.' },
              ].map((f, i) => (
                <div key={f.title} style={{
                  background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10,
                  padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start',
                  animation: `fade-up 0.5s ease-out ${0.1 * i}s both`,
                }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{f.icon}</span>
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 3 }}>{f.title}</h4>
                    <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
              <a href="https://t.me/" style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '12px 28px', borderRadius: 10, textDecoration: 'none',
                background: C.accent, color: '#060610', fontWeight: 650, fontSize: 13, marginTop: 4,
              }}>Try Demo Bot →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SKILLS — self-updating ═══ */}
      <div style={divider} />
      <section style={sectionPad}>
        <div style={wrap}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: C.purple, marginBottom: 14 }}>ADAPTIVE SKILLS</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: C.white, letterSpacing: '-0.02em', marginBottom: 12 }}>Skills that evolve.</h2>
            <p style={{ fontSize: 15, color: C.text, maxWidth: 500, margin: '0 auto' }}>
              Every skill updates its parameters after each trade. Win rates, thresholds, and strategies
              adapt to current market conditions. What worked last week gets refined for this week.
            </p>
          </div>

          {/* Self-update diagram */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
            padding: '28px 32px', marginBottom: 32, display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
          }}>
            {['Scan Market', 'Score Tokens', 'Execute Trade', 'Analyze Result', 'Update Skill'].map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: i === 4 ? 'rgba(168,85,247,0.1)' : C.accentSoft,
                  border: `1px solid ${i === 4 ? 'rgba(168,85,247,0.2)' : 'rgba(59,130,246,0.1)'}`,
                  fontFamily: C.mono, fontSize: 11, fontWeight: 700, color: i === 4 ? C.purple : C.accent,
                }}>{i + 1}</div>
                <span style={{ fontFamily: C.mono, fontSize: 11, color: i === 4 ? C.purple : C.text, fontWeight: i === 4 ? 700 : 500 }}>{step}</span>
                {i < 4 && <span style={{ color: C.dimmer, fontSize: 16, margin: '0 4px' }}>→</span>}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { name: 'Narrative Detection', tag: 'SCANNER', tagColor: C.accent, desc: 'Finds trending keywords across 400+ tokens. Meta detection with score boosting. Thresholds adjust based on meta success rate.', stat: '+18%', statLabel: 'avg meta trades', updates: 'v2.4 — 312 updates' },
              { name: 'Holder Analysis', tag: 'FILTER', tagColor: C.red, desc: 'Top wallet concentration check via Solana RPC. Auto-rejects >50% single wallet. Rejection threshold tightens with each rug detected.', stat: '0 rugs', statLabel: 'with skill active', updates: 'v1.8 — 89 updates' },
              { name: 'Momentum Tracker', tag: 'ANALYSIS', tagColor: C.green, desc: '30-point price history. Recovery/dump/flat detection. Hold time windows adjust per-market based on outcome data.', stat: '+34%', statLabel: 'hold efficiency', updates: 'v3.1 — 540 updates' },
              { name: 'Aggressive Sell', tag: 'EXECUTION', tagColor: C.amber, desc: '3-attempt retry with fresh quotes. Escalating slippage. Slippage curve adapts based on recent TX success rates.', stat: '97%', statLabel: 'sell success', updates: 'v2.0 — 198 updates' },
              { name: 'Dual Market Scanner', tag: 'SCANNER', tagColor: C.accent, desc: 'Bonding curve + graduated simultaneously. Score weights shift based on which market is producing better returns.', stat: '2x', statLabel: 'opportunity surface', updates: 'v1.6 — 156 updates' },
              { name: 'Smart Money Tracker', tag: 'ALPHA', tagColor: C.purple, desc: 'Follows top-performing wallets. Wallet rankings refresh after each cycle based on rolling 24h performance.', stat: 'Top 20', statLabel: 'wallets tracked', updates: 'v1.3 — 72 updates' },
            ].map((s, i) => (
              <div key={s.name} style={{
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
                padding: '24px 24px 20px', display: 'flex', flexDirection: 'column', gap: 12,
                animation: `fade-up 0.5s ease-out ${0.08 * i}s both`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Badge color={s.tagColor}>{s.tag}</Badge>
                  <Badge color={C.green}>PROVEN</Badge>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.white }}>{s.name}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: C.text, flex: 1 }}>{s.desc}</p>
                <div style={{ paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontFamily: C.mono, fontSize: 18, fontWeight: 800, color: C.green }}>{s.stat}</span>
                    <span style={{ fontFamily: C.mono, fontSize: 10, color: C.dim }}>{s.statLabel}</span>
                  </div>
                  {/* Self-update indicator */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: C.purple, animation: 'pulse-slow 2s ease-in-out infinite' }} />
                    <span style={{ fontFamily: C.mono, fontSize: 9, color: C.purple }}>{s.updates}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUST ═══ */}
      <div style={divider} />
      <section style={sectionPad}>
        <div style={wrap}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {/* Dev Locks */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 36 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.1)', fontSize: 18 }}>🔒</div>
                <div>
                  <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.red }}>TRUST PROTOCOL</p>
                  <h3 style={{ fontSize: 18, fontWeight: 750, color: C.white }}>Dev Locks</h3>
                </div>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: C.text, marginBottom: 24 }}>Smart contracts freeze dev tokens at launch. Vesting instead of cliff dumps. Verified on-chain.</p>
              {[{ label: '7 days', pct: 25, note: 'Basic' }, { label: '30 days', pct: 55, note: 'Strong' }, { label: '90 days', pct: 90, note: 'Maximum' }].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <span style={{ fontFamily: C.mono, fontSize: 11, color: C.white, width: 52, fontWeight: 600 }}>{l.label}</span>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ width: `${l.pct}%`, height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${C.red}, #f87171)`, transition: 'width 1.5s ease-out' }} />
                  </div>
                  <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dim, width: 56, textAlign: 'right' }}>{l.note}</span>
                </div>
              ))}
            </div>
            {/* Holder Rewards */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 36 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.1)', fontSize: 18 }}>💎</div>
                <div>
                  <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.green }}>YIELD PROTOCOL</p>
                  <h3 style={{ fontSize: 18, fontWeight: 750, color: C.white }}>Holder Rewards</h3>
                </div>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: C.text, marginBottom: 24 }}>SOL distributed based on hold duration. Longer hold = higher multiplier. Real yield in SOL.</p>
              {[{ label: '1 day', pct: 20, mult: '1.0x' }, { label: '7 days', pct: 35, mult: '1.5x' }, { label: '30 days', pct: 65, mult: '3.0x' }, { label: '90 days', pct: 100, mult: '5.0x' }].map(t => (
                <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <span style={{ fontFamily: C.mono, fontSize: 11, color: C.white, width: 52, fontWeight: 600 }}>{t.label}</span>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ width: `${t.pct}%`, height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${C.green}, #4ade80)`, transition: 'width 1.5s ease-out' }} />
                  </div>
                  <span style={{ fontFamily: C.mono, fontSize: 11, color: C.green, width: 36, textAlign: 'right', fontWeight: 700 }}>{t.mult}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <div style={divider} />
      <section style={{ padding: '64px 0' }}>
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { val: '72+', label: 'Mainnet trades', sub: 'Real SOL, real results' },
            { val: '7', label: 'Proven skills', sub: 'Self-updating after each trade' },
            { val: '400+', label: 'Tokens per cycle', sub: 'Bonding + graduated' },
            { val: '97%', label: 'Sell success', sub: 'Aggressive retry system' },
          ].map((s, i) => (
            <div key={s.label} style={{
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, textAlign: 'center',
              animation: `count-up 0.5s ease-out ${0.1 * i}s both`,
            }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: C.white, letterSpacing: '-0.02em' }}>{s.val}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginTop: 4 }}>{s.label}</div>
              <div style={{ fontFamily: C.mono, fontSize: 9, color: C.dim, marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SDK ═══ */}
      <div style={divider} />
      <section style={sectionPad}>
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
            overflow: 'hidden', boxShadow: '0 16px 64px rgba(0,0,0,0.3)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 16px', background: 'rgba(255,255,255,0.015)', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ff5f57' }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#febc2e' }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#28c840' }} />
              <span style={{ fontFamily: C.mono, fontSize: 10, marginLeft: 8, color: C.dimmer }}>skill.config.json</span>
            </div>
            <div style={{ padding: '20px 22px' }}>
              <pre style={{ fontFamily: C.mono, fontSize: 12, lineHeight: 1.9, margin: 0 }}>
<span style={{ color: C.dim }}>{'{'}</span>{'\n'}
<span style={{ color: C.accent }}>  &quot;name&quot;</span><span style={{ color: C.dim }}>:</span> <span style={{ color: C.green }}>&quot;narrative-detector&quot;</span>{'\n'}
<span style={{ color: C.accent }}>  &quot;version&quot;</span><span style={{ color: C.dim }}>:</span> <span style={{ color: C.green }}>&quot;2.4.0&quot;</span>{'\n'}
<span style={{ color: C.accent }}>  &quot;type&quot;</span><span style={{ color: C.dim }}>:</span> <span style={{ color: C.green }}>&quot;scanner&quot;</span>{'\n'}
<span style={{ color: C.accent }}>  &quot;autoUpdate&quot;</span><span style={{ color: C.dim }}>:</span> <span style={{ color: C.amber }}>true</span>{'\n'}
<span style={{ color: C.accent }}>  &quot;hooks&quot;</span><span style={{ color: C.dim }}>: [</span><span style={{ color: C.green }}>&quot;post-scan&quot;</span><span style={{ color: C.dim }}>,</span> <span style={{ color: C.green }}>&quot;on-cycle&quot;</span><span style={{ color: C.dim }}>]</span>{'\n'}
<span style={{ color: C.accent }}>  &quot;pricing&quot;</span><span style={{ color: C.dim }}>: {'{'}</span>{'\n'}
<span style={{ color: C.accent }}>    &quot;revShare&quot;</span><span style={{ color: C.dim }}>:</span> <span style={{ color: C.amber }}>0.10</span>{'\n'}
<span style={{ color: C.dim }}>  {'}'}</span>{'\n'}
<span style={{ color: C.dim }}>{'}'}</span>
              </pre>
            </div>
          </div>
          <div>
            <p style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: C.amber, marginBottom: 14 }}>FOR BUILDERS</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, color: C.white, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 18 }}>Build skills.<br />Earn from every trade.</h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: C.text, marginBottom: 32, maxWidth: 420 }}>
              Write a strategy. Test against real data. Mint as an NFT.
              Skills auto-update with <code style={{ fontFamily: C.mono, fontSize: 13, color: C.purple }}>&quot;autoUpdate&quot;: true</code> — your skill improves itself after every trade. You earn 10% of every profit.
            </p>
            <a href="/docs" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 32px', borderRadius: 10, textDecoration: 'none', background: C.accent, color: '#060610', fontWeight: 650, fontSize: 14 }}>SDK Docs →</a>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <div style={divider} />
      <section style={{ padding: '140px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 700, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(59,130,246,0.04), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: 'clamp(36px, 6vw, 52px)', fontWeight: 900, color: C.white, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 18 }}>Your edge is waiting.</h2>
          <p style={{ fontSize: 16, color: C.text, maxWidth: 400, margin: '0 auto 40px' }}>Deploy a personal trading agent in 60 seconds.</p>
          <a href="https://t.me/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 44px', borderRadius: 10, textDecoration: 'none', background: C.accent, color: '#060610', fontWeight: 700, fontSize: 16 }}>Deploy Your Agent →</a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
