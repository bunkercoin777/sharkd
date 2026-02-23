import { Nav } from './components/Nav';
import { Footer } from './components/Footer';

/* ── Design tokens ── */
const C = {
  bg: '#060610',
  surface: '#0b0b18',
  surface2: '#101020',
  border: 'rgba(255,255,255,0.05)',
  borderHover: 'rgba(59,130,246,0.15)',
  accent: '#3b82f6',
  accentSoft: 'rgba(59,130,246,0.08)',
  green: '#22c55e',
  red: '#ef4444',
  amber: '#f59e0b',
  purple: '#a855f7',
  cyan: '#06b6d4',
  white: '#f0f2f8',
  text: '#94a3b8',
  dim: '#475569',
  dimmer: '#334155',
  mono: "'JetBrains Mono', 'SF Mono', monospace",
  sans: "'Inter', system-ui, sans-serif",
};

const wrap = { maxWidth: 1060, margin: '0 auto', padding: '0 clamp(20px, 4vw, 40px)' };
const sectionPad = { padding: '100px 0' };
const divider = { height: 1, background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.12), transparent)' };

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 1.5,
      padding: '3px 10px', borderRadius: 4,
      color, background: color + '12',
    }}>{children}</span>
  );
}

export default function Home() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Nav />

      {/* ═══ HERO ═══ */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Ambient light */}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 900, height: 600, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(59,130,246,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 760, padding: '0 24px' }}>
          {/* Status pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '7px 18px', borderRadius: 100, marginBottom: 44,
            background: C.accentSoft, border: `1px solid rgba(59,130,246,0.1)`,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.green, boxShadow: `0 0 6px ${C.green}`, animation: 'pulse-slow 2.5s ease-in-out infinite' }} />
            <span style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 600, letterSpacing: 2, color: C.accent }}>
              AUTONOMOUS TRADING INTELLIGENCE
            </span>
          </div>

          <h1 style={{
            fontFamily: C.sans, fontSize: 'clamp(44px, 7.5vw, 76px)', fontWeight: 850,
            lineHeight: 1.0, letterSpacing: '-0.035em', marginBottom: 26,
          }}>
            <span style={{ color: C.white }}>Trade smarter.</span>
            <br />
            <span style={{ color: '#334155' }}>Sleep better.</span>
          </h1>

          <p style={{ fontSize: 17, lineHeight: 1.7, color: C.text, maxWidth: 520, margin: '0 auto 44px' }}>
            An AI agent that lives in your Telegram, trades Solana memecoins,
            and gets smarter by installing skills from a marketplace.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
            <a href="https://t.me/" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 32px', borderRadius: 10, textDecoration: 'none',
              background: C.accent, color: '#060610', fontWeight: 650, fontSize: 14,
            }}>Deploy Your Agent →</a>
            <a href="/docs" style={{
              padding: '13px 32px', borderRadius: 10, textDecoration: 'none',
              background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`,
              color: C.text, fontWeight: 550, fontSize: 14,
            }}>Documentation</a>
          </div>

          {/* Terminal */}
          <div style={{
            maxWidth: 440, margin: '0 auto', textAlign: 'left',
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
            boxShadow: '0 20px 80px rgba(0,0,0,0.4), 0 0 60px rgba(59,130,246,0.03)',
            overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '11px 16px',
              background: 'rgba(255,255,255,0.015)', borderBottom: `1px solid ${C.border}`,
            }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ff5f57' }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#febc2e' }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#28c840' }} />
              <span style={{ fontFamily: C.mono, fontSize: 10, marginLeft: 8, color: C.dimmer }}>sharkd</span>
            </div>
            <div style={{ padding: '18px 20px', fontFamily: C.mono, fontSize: 12, lineHeight: 2.0 }}>
              <div style={{ color: C.dimmer }}>$ status</div>
              <div style={{ color: C.text }}><span style={{ color: C.green }}>●</span> Online — scanning 347 tokens</div>
              <div style={{ color: C.text }}><span style={{ color: C.accent }}>◆</span> Holding <span style={{ color: C.white }}>$SHARK</span> +12.4%</div>
              <div style={{ color: C.text }}><span style={{ color: C.amber }}>▲</span> 7W/2L — <span style={{ color: C.green }}>+2.14 SOL</span></div>
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
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: C.white, letterSpacing: '-0.02em' }}>
              Three layers. One edge.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { icon: '💬', num: '01', label: 'Conversational', title: 'Talk to it.', desc: 'Lives in Telegram. No dashboards. Text your agent like a friend — "go hunt", "be careful", "what are you holding". It understands you.', color: C.accent },
              { icon: '🧠', num: '02', label: 'Skill-powered', title: 'Teach it.', desc: 'Install modular trading skills from a marketplace. Rug detectors, narrative scanners, whale trackers. Each skill is proven on mainnet with verifiable performance.', color: C.purple },
              { icon: '🛡️', num: '03', label: 'Trust layer', title: 'Protect it.', desc: 'Dev lock contracts prevent rug pulls. Holder rewards pay SOL to diamond hands. Vesting replaces cliff dumps. Trust built into the protocol.', color: C.green },
            ].map(p => (
              <div key={p.num} style={{
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
                padding: 32, display: 'flex', flexDirection: 'column', gap: 16,
                transition: 'border-color 0.3s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 28 }}>{p.icon}</span>
                  <span style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: p.color }}>{p.num}</span>
                </div>
                <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: p.color, textTransform: 'uppercase' }}>{p.label}</p>
                <h3 style={{ fontSize: 22, fontWeight: 750, color: C.white, letterSpacing: '-0.01em' }}>{p.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: C.text }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CHAT DEMO ═══ */}
      <div style={divider} />
      <section style={sectionPad}>
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 48, alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: C.accent, marginBottom: 14 }}>INTERFACE</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, color: C.white, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 18 }}>
              Conversation,<br />not configuration.
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: C.text, marginBottom: 28, maxWidth: 420 }}>
              Most tools give you dashboards with 47 settings. SharkD gives you a chat.
              Say what you want. Your agent handles the rest.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Natural language — no syntax to learn',
                'Proactive updates — it messages you first',
                'Three risk modes, switchable mid-chat',
                'Manual overrides when you want control',
              ].map(line => (
                <div key={line} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: C.accent, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: C.dim }}>{line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat window */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
            overflow: 'hidden', boxShadow: '0 16px 64px rgba(0,0,0,0.3)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '11px 16px',
              background: 'rgba(255,255,255,0.015)', borderBottom: `1px solid ${C.border}`,
            }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ff5f57' }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#febc2e' }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#28c840' }} />
              <span style={{ fontFamily: C.mono, fontSize: 10, marginLeft: 8, color: C.dimmer }}>Telegram — SharkD</span>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { from: 'user', text: 'how are we doing today?' },
                { from: 'bot', text: '9.42 SOL in the wallet\n3W/1L — 75% win rate\nPnL: +0.87 SOL today\nWatching $LOBSTR at +6.2%' },
                { from: 'user', text: 'be more aggressive' },
                { from: 'bot', text: 'Degen mode. Bigger positions, wider stops.\nScanning 347 tokens. Let\'s eat.' },
                { from: 'bot', text: '🔍 Found $DEEPBLUE — score 8/10\nNarrative: "deep" meta (14 tokens)\nTop holder: 3.8%. Clean.\nBuying 0.30 SOL...' },
                { from: 'bot', text: '✅ +22.1% on $DEEPBLUE\n+0.066 SOL profit | 4W/1L' },
              ].map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '82%', padding: '10px 14px',
                    borderRadius: m.from === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: m.from === 'user' ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.025)',
                    border: `1px solid ${m.from === 'user' ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.04)'}`,
                  }}>
                    <pre style={{
                      fontFamily: C.mono, fontSize: 11, lineHeight: 1.7,
                      whiteSpace: 'pre-wrap', margin: 0,
                      color: m.from === 'user' ? '#7bb5ff' : C.text,
                    }}>{m.text}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SKILLS ═══ */}
      <div style={divider} />
      <section style={sectionPad}>
        <div style={wrap}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: C.purple, marginBottom: 14 }}>SKILLS</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: C.white, letterSpacing: '-0.02em', marginBottom: 12 }}>
              Proven on mainnet.
            </h2>
            <p style={{ fontSize: 15, color: C.text, maxWidth: 460, margin: '0 auto' }}>
              Every skill was extracted from 72+ real trades. Real SOL. Real lessons. Install one and your agent gains that edge instantly.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: 12 }}>
            {[
              { name: 'Narrative Detection', tag: 'SCANNER', tagColor: C.accent, desc: 'Finds trending keywords across 400+ tokens. Identifies metas forming in 3+ tokens before they peak. Score boost for narrative riders.', stat: '+18% avg', statLabel: 'on meta trades' },
              { name: 'Holder Analysis', tag: 'FILTER', tagColor: C.red, desc: 'Checks top 1/5/10 wallet concentration via Solana RPC. Auto-rejects tokens with >50% single-wallet ownership. Rug prevention.', stat: '0 rugs', statLabel: 'with skill active' },
              { name: 'Momentum Tracker', tag: 'ANALYSIS', tagColor: C.green, desc: '30-point price history per position. Recovering/dumping/flat detection. Dynamic hold times — patient with recoveries, fast on dumps.', stat: '+34%', statLabel: 'hold efficiency' },
              { name: 'Aggressive Sell', tag: 'EXECUTION', tagColor: C.amber, desc: '3 retry attempts with fresh Jupiter quotes. Escalating slippage 1500→2500 bps. 200K lamport priority. No more lost profits.', stat: '97%', statLabel: 'sell success rate' },
              { name: 'Dual Market Scanner', tag: 'SCANNER', tagColor: C.accent, desc: 'Simultaneous bonding curve + graduated token scanning. Different params optimized per market type. 300+ graduated, 100+ bonding per cycle.', stat: '2x', statLabel: 'opportunity surface' },
              { name: 'Smart Money Tracker', tag: 'ALPHA', tagColor: C.purple, desc: 'Identifies wallets with consistent win rates. Detects smart money entering tokens. Uses free Solana RPC — no paid APIs.', stat: 'Top 20', statLabel: 'wallets tracked' },
            ].map(s => (
              <div key={s.name} style={{
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
                padding: '24px 24px 20px', display: 'flex', flexDirection: 'column', gap: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Badge color={s.tagColor}>{s.tag}</Badge>
                  <Badge color={C.green}>PROVEN</Badge>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.white }}>{s.name}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: C.text, flex: 1 }}>{s.desc}</p>
                <div style={{ paddingTop: 14, borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontFamily: C.mono, fontSize: 18, fontWeight: 800, color: C.green }}>{s.stat}</span>
                  <span style={{ fontFamily: C.mono, fontSize: 10, color: C.dim }}>{s.statLabel}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <a href="/marketplace" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 10, textDecoration: 'none',
              background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`,
              color: C.text, fontWeight: 550, fontSize: 14,
            }}>View Marketplace →</a>
          </div>
        </div>
      </section>

      {/* ═══ TRUST LAYER ═══ */}
      <div style={divider} />
      <section style={sectionPad}>
        <div style={wrap}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
            {/* Dev Locks */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 36 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.1)', fontSize: 18
                }}>🔒</div>
                <div>
                  <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.red }}>TRUST PROTOCOL</p>
                  <h3 style={{ fontSize: 18, fontWeight: 750, color: C.white }}>Dev Locks</h3>
                </div>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: C.text, marginBottom: 24 }}>
                Smart contracts freeze dev tokens at launch. Not a promise — cryptographic certainty. Vesting instead of cliff dumps.
              </p>
              {[
                { label: '7 days', pct: 25, note: 'Basic' },
                { label: '30 days', pct: 55, note: 'Strong' },
                { label: '90 days', pct: 90, note: 'Maximum' },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <span style={{ fontFamily: C.mono, fontSize: 11, color: C.white, width: 52, fontWeight: 600 }}>{l.label}</span>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ width: `${l.pct}%`, height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${C.red}, #f87171)` }} />
                  </div>
                  <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dim, width: 56, textAlign: 'right' }}>{l.note}</span>
                </div>
              ))}
            </div>

            {/* Holder Rewards */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 36 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.1)', fontSize: 18
                }}>💎</div>
                <div>
                  <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.green }}>YIELD PROTOCOL</p>
                  <h3 style={{ fontSize: 18, fontWeight: 750, color: C.white }}>Holder Rewards</h3>
                </div>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: C.text, marginBottom: 24 }}>
                SOL distributed to holders based on hold duration. Longer hold = higher multiplier. Real yield in SOL, not more tokens.
              </p>
              {[
                { label: '1 day', pct: 20, mult: '1.0x' },
                { label: '7 days', pct: 35, mult: '1.5x' },
                { label: '30 days', pct: 65, mult: '3.0x' },
                { label: '90 days', pct: 100, mult: '5.0x' },
              ].map(t => (
                <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <span style={{ fontFamily: C.mono, fontSize: 11, color: C.white, width: 52, fontWeight: 600 }}>{t.label}</span>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ width: `${t.pct}%`, height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${C.green}, #4ade80)` }} />
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
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {[
            { val: '72+', label: 'Mainnet trades', sub: 'Real SOL, real results' },
            { val: '7', label: 'Proven skills', sub: 'Extracted from live trading' },
            { val: '400+', label: 'Tokens per cycle', sub: 'Bonding + graduated' },
            { val: '97%', label: 'Sell success', sub: 'Aggressive retry system' },
          ].map(s => (
            <div key={s.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: C.white, fontFamily: C.sans, letterSpacing: '-0.02em' }}>{s.val}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginTop: 4 }}>{s.label}</div>
              <div style={{ fontFamily: C.mono, fontSize: 9, color: C.dim, marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SDK ═══ */}
      <div style={divider} />
      <section style={sectionPad}>
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 48, alignItems: 'center' }}>
          {/* Code preview */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
            overflow: 'hidden', boxShadow: '0 16px 64px rgba(0,0,0,0.3)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '11px 16px',
              background: 'rgba(255,255,255,0.015)', borderBottom: `1px solid ${C.border}`,
            }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ff5f57' }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#febc2e' }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#28c840' }} />
              <span style={{ fontFamily: C.mono, fontSize: 10, marginLeft: 8, color: C.dimmer }}>skill.config.json</span>
            </div>
            <div style={{ padding: '20px 22px' }}>
              <pre style={{ fontFamily: C.mono, fontSize: 12, lineHeight: 1.9, margin: 0 }}>
<span style={{ color: C.dim }}>{'{'}</span>{'\n'}
<span style={{ color: C.accent }}>  &quot;name&quot;</span><span style={{ color: C.dim }}>:</span> <span style={{ color: C.green }}>&quot;narrative-detector&quot;</span><span style={{ color: C.dim }}>,</span>{'\n'}
<span style={{ color: C.accent }}>  &quot;version&quot;</span><span style={{ color: C.dim }}>:</span> <span style={{ color: C.green }}>&quot;2.1.0&quot;</span><span style={{ color: C.dim }}>,</span>{'\n'}
<span style={{ color: C.accent }}>  &quot;type&quot;</span><span style={{ color: C.dim }}>:</span> <span style={{ color: C.green }}>&quot;scanner&quot;</span><span style={{ color: C.dim }}>,</span>{'\n'}
<span style={{ color: C.accent }}>  &quot;hooks&quot;</span><span style={{ color: C.dim }}>: [</span><span style={{ color: C.green }}>&quot;post-scan&quot;</span><span style={{ color: C.dim }}>,</span> <span style={{ color: C.green }}>&quot;on-cycle&quot;</span><span style={{ color: C.dim }}>],</span>{'\n'}
<span style={{ color: C.accent }}>  &quot;pricing&quot;</span><span style={{ color: C.dim }}>: {'{'}</span>{'\n'}
<span style={{ color: C.accent }}>    &quot;model&quot;</span><span style={{ color: C.dim }}>:</span> <span style={{ color: C.green }}>&quot;performance&quot;</span><span style={{ color: C.dim }}>,</span>{'\n'}
<span style={{ color: C.accent }}>    &quot;revShare&quot;</span><span style={{ color: C.dim }}>:</span> <span style={{ color: C.amber }}>0.10</span>{'\n'}
<span style={{ color: C.dim }}>  {'}'}</span>{'\n'}
<span style={{ color: C.dim }}>{'}'}</span>
              </pre>
            </div>
          </div>

          <div>
            <p style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: C.amber, marginBottom: 14 }}>FOR BUILDERS</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, color: C.white, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 18 }}>
              Build skills.<br />Earn from every trade.
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: C.text, marginBottom: 32, maxWidth: 420 }}>
              Write a strategy. Test against real data. Mint as an NFT.
              Every time an agent profits from your skill, you earn 10%.
            </p>
            <a href="/docs" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 32px', borderRadius: 10, textDecoration: 'none',
              background: C.accent, color: '#060610', fontWeight: 650, fontSize: 14,
            }}>Read the SDK Docs →</a>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <div style={divider} />
      <section style={{ padding: '140px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 700, height: 400, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(59,130,246,0.04), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: 'clamp(36px, 6vw, 52px)', fontWeight: 900, color: C.white, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 18 }}>
            Your edge is waiting.
          </h2>
          <p style={{ fontSize: 16, color: C.text, maxWidth: 400, margin: '0 auto 40px' }}>
            Deploy a personal trading agent in 60 seconds.
          </p>
          <a href="https://t.me/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '16px 44px', borderRadius: 10, textDecoration: 'none',
            background: C.accent, color: '#060610', fontWeight: 700, fontSize: 16,
          }}>Deploy Your Agent →</a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
