import { Nav } from './components/Nav';
import { Footer } from './components/Footer';

const C = {
  bg: '#020810', surface: '#041220', surfaceAlt: '#061428',
  border: 'rgba(0,180,216,0.06)', borderLit: 'rgba(0,180,216,0.12)',
  accent: '#00b4d8', accentDeep: '#0077b6', accentBright: '#48cae4',
  green: '#06d6a0', red: '#ef476f', amber: '#ffd166',
  purple: '#8338ec', cyan: '#00b4d8',
  white: '#e0eaf4', text: '#7b93b0', dim: '#3d5a80', dimmer: '#1e3354',
  mono: "'JetBrains Mono', 'SF Mono', monospace",
  sans: "'Inter', system-ui, sans-serif",
  glow: '0 0 40px rgba(0,180,216,0.08)',
  glowStrong: '0 0 80px rgba(0,180,216,0.12)',
};
const wrap = { maxWidth: 1060, margin: '0 auto', padding: '0 clamp(20px, 4vw, 40px)' };
const sectionPad = { padding: '100px 0' };
const divider = { height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,180,216,0.1), transparent)' };

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return <span style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, padding: '3px 10px', borderRadius: 4, color, background: color + '14' }}>{children}</span>;
}

/* Bubble particle (decorative) */
function Bubbles() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${12 + i * 11}%`,
          bottom: '-20px',
          width: 3 + (i % 3) * 2,
          height: 3 + (i % 3) * 2,
          borderRadius: '50%',
          background: `rgba(0,180,216,${0.06 + (i % 3) * 0.03})`,
          animation: `bubble-rise ${12 + i * 4}s linear infinite ${i * 2}s`,
        }} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh', position: 'relative' }}>
      <Nav />

      {/* ═══ HERO ═══ */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Deep ocean gradient layers */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 120% 80% at 50% 20%, rgba(0,119,182,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 30% 70%, rgba(0,180,216,0.03) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 70% 60%, rgba(131,56,236,0.02) 0%, transparent 50%)', pointerEvents: 'none' }} />

        {/* Underwater current line */}
        <div style={{ position: 'absolute', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,180,216,0.2), transparent)', pointerEvents: 'none', animation: 'scan-line 8s linear infinite' }} />

        <Bubbles />

        {/* Sonar rings */}
        <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: 200, height: 200, borderRadius: '50%',
              border: '1px solid rgba(0,180,216,0.04)',
              animation: `sonar 6s ease-out infinite ${i * 2}s`,
            }} />
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 760, padding: '0 24px', animation: 'fade-up 0.8s ease-out' }}>
          {/* Status beacon */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '7px 18px', borderRadius: 100, marginBottom: 44,
            background: 'rgba(0,180,216,0.06)', border: '1px solid rgba(0,180,216,0.1)',
            animation: 'fade-in 1s ease-out 0.3s both',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.green, boxShadow: `0 0 8px ${C.green}`, animation: 'pulse-slow 2.5s ease-in-out infinite' }} />
            <span style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 600, letterSpacing: 2, color: C.accent }}>AUTONOMOUS TRADING INTELLIGENCE</span>
          </div>

          <h1 style={{ fontFamily: C.sans, fontSize: 'clamp(44px, 7.5vw, 76px)', fontWeight: 850, lineHeight: 1.0, letterSpacing: '-0.035em', marginBottom: 26, animation: 'fade-up 0.8s ease-out 0.2s both' }}>
            <span style={{ color: C.white }}>Hunt the depths.</span><br />
            <span style={{ color: C.dimmer }}>Surface the gains.</span>
          </h1>

          <p style={{ fontSize: 17, lineHeight: 1.7, color: C.text, maxWidth: 520, margin: '0 auto 44px', animation: 'fade-up 0.8s ease-out 0.4s both' }}>
            An AI agent that lives in your Telegram, hunts Solana memecoins
            in the deep, and gets smarter by installing skills from a marketplace.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64, animation: 'fade-up 0.8s ease-out 0.6s both' }}>
            <a href="/terminal" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 32px', borderRadius: 10, textDecoration: 'none',
              background: 'linear-gradient(135deg, #00b4d8, #0077b6)', color: '#020810', fontWeight: 700, fontSize: 14,
              boxShadow: '0 4px 24px rgba(0,180,216,0.2)',
            }}>
              Watch It Trade Live
            </a>
            <a href="/docs" style={{ padding: '13px 32px', borderRadius: 10, textDecoration: 'none', background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`, color: C.text, fontWeight: 550, fontSize: 14 }}>Documentation</a>
          </div>

          {/* Hero terminal */}
          <div style={{
            maxWidth: 440, margin: '0 auto', textAlign: 'left',
            background: C.surface, border: `1px solid ${C.borderLit}`, borderRadius: 14,
            overflow: 'hidden', animation: 'fade-up 0.8s ease-out 0.8s both, glow-pulse 4s ease-in-out infinite 1.5s',
            boxShadow: C.glowStrong,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 16px', background: 'rgba(0,180,216,0.02)', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ef476f' }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ffd166' }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#06d6a0' }} />
              <span style={{ fontFamily: C.mono, fontSize: 10, marginLeft: 8, color: C.dimmer }}>sharkd - depth scan</span>
              <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: C.green, animation: 'pulse-slow 2s ease-in-out infinite' }} />
            </div>
            <div style={{ padding: '18px 20px', fontFamily: C.mono, fontSize: 12, lineHeight: 2.0 }}>
              <div style={{ color: C.dimmer }}>$ status</div>
              <div style={{ color: C.text }}><span style={{ color: C.green }}>●</span> Diving — scanning 347 tokens</div>
              <div style={{ color: C.text }}><span style={{ color: C.accent }}>◆</span> Holding <span style={{ color: C.white }}>$SHARK</span> +12.4%</div>
              <div style={{ color: C.text }}><span style={{ color: C.amber }}>▲</span> 7W/2L — <span style={{ color: C.green }}>+2.14 SOL</span></div>
              <div style={{ marginTop: 4, color: C.accent }}>
                <span style={{ animation: 'blink 1s step-end infinite' }}>▊</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ LIVE REFERENCE TERMINAL ═══ */}
      <div style={divider} />
      <section style={sectionPad}>
        <div style={wrap}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: C.green, marginBottom: 14 }}>PROOF OF HUNT</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: C.white, letterSpacing: '-0.02em', marginBottom: 12 }}>Don't trust. Verify.</h2>
            <p style={{ fontSize: 15, color: C.text, maxWidth: 520, margin: '0 auto' }}>
              Our reference agent trades live on mainnet using marketplace skills. Every buy, every sell, every decision — public and verifiable. Skills must prove themselves here before they hit the marketplace.
            </p>
          </div>

          <div className="terminal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
            {/* Main terminal feed */}
            <div style={{
              background: C.surface, border: `1px solid ${C.borderLit}`, borderRadius: 14,
              overflow: 'hidden', boxShadow: C.glow,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 16px', background: 'rgba(0,180,216,0.02)', borderBottom: `1px solid ${C.border}` }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ef476f' }} />
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ffd166' }} />
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#06d6a0' }} />
                <span style={{ fontFamily: C.mono, fontSize: 10, marginLeft: 8, color: C.dim }}>SHARKD-REF — Live Feed</span>
                <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, boxShadow: `0 0 8px ${C.green}`, animation: 'pulse-slow 2s ease-in-out infinite' }} />
                  <span style={{ fontFamily: C.mono, fontSize: 9, color: C.green }}>LIVE</span>
                </span>
              </div>
              <div style={{ padding: '16px 20px', fontFamily: C.mono, fontSize: 11, lineHeight: 1.9 }}>
                {[
                  { time: '13:42:08', color: C.dim, text: '[SCAN] Cycle #1,847 — 412 tokens scanned' },
                  { time: '13:42:09', color: C.accent, text: '[SCORE] $DEEPOCEAN — 8.2/10 | "ocean" meta (17 tokens) | top10: 31%' },
                  { time: '13:42:10', color: C.green, text: '[BUY] $DEEPOCEAN — 0.25 SOL @ $0.000041 | Balanced mode' },
                  { time: '13:42:10', color: C.dim, text: '[SKILL] narrative-detection v2.4 boosted score +2 (meta match)' },
                  { time: '13:42:10', color: C.dim, text: '[SKILL] holder-analysis v1.8 passed (top1: 8.2%, clean)' },
                  { time: '13:44:31', color: C.dim, text: '[HOLD] $DEEPOCEAN — +6.2% | hold: 2m21s | momentum: rising' },
                  { time: '13:47:55', color: C.green, text: '[SELL] $DEEPOCEAN — +18.7% | +0.047 SOL | hold: 5m45s' },
                  { time: '13:47:56', color: '#8338ec', text: '[UPDATE] narrative-detection v2.4 → v2.4.1 (threshold adjusted)' },
                  { time: '13:47:56', color: '#8338ec', text: '[UPDATE] momentum-tracker v3.1 → v3.1.1 (hold window: 5m→6m)' },
                  { time: '13:48:02', color: C.dim, text: '[SCAN] Cycle #1,848 — 409 tokens scanned' },
                  { time: '13:48:04', color: C.red, text: '[REJECT] $RUGFISH — holder-analysis: top1 wallet 62% (threshold 50%)' },
                  { time: '13:48:05', color: C.accent, text: '[SCORE] $ABYSSAL — 7.4/10 | fresh mint 3m | top10: 28%' },
                ].map((line, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, animation: `fade-in 0.3s ease-out ${0.08 * i}s both` }}>
                    <span style={{ color: C.dimmer, flexShrink: 0 }}>{line.time}</span>
                    <span style={{ color: line.color }}>{line.text}</span>
                  </div>
                ))}
                <div style={{ marginTop: 8, color: C.accent }}>
                  <span style={{ animation: 'blink 1s step-end infinite' }}>▊</span>
                </div>
              </div>
            </div>

            {/* Stats sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Session stats */}
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
                <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.accent, marginBottom: 14 }}>SESSION STATS</p>
                {[
                  { label: 'Balance', value: '9.87 SOL', color: C.white },
                  { label: 'Today PnL', value: '+0.42 SOL', color: C.green },
                  { label: 'Win Rate', value: '68% (19W/9L)', color: C.green },
                  { label: 'Active Holds', value: '2 tokens', color: C.accent },
                  { label: 'Scans Today', value: '1,847 cycles', color: C.text },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                    <span style={{ fontFamily: C.mono, fontSize: 11, color: C.dim }}>{s.label}</span>
                    <span style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 700, color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>

              {/* Active skills */}
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
                <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: '#8338ec', marginBottom: 14 }}>ACTIVE SKILLS</p>
                {[
                  { name: 'Narrative Detection', ver: 'v2.4.1', tag: 'SCANNER' },
                  { name: 'Holder Analysis', ver: 'v1.8', tag: 'FILTER' },
                  { name: 'Momentum Tracker', ver: 'v3.1.1', tag: 'ANALYSIS' },
                  { name: 'Aggressive Sell', ver: 'v2.0', tag: 'EXECUTION' },
                  { name: 'Dual Market', ver: 'v1.6', tag: 'SCANNER' },
                ].map(s => (
                  <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0' }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#8338ec', animation: 'pulse-slow 2s ease-in-out infinite' }} />
                    <span style={{ fontFamily: C.mono, fontSize: 10, color: C.text, flex: 1 }}>{s.name}</span>
                    <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dimmer }}>{s.ver}</span>
                  </div>
                ))}
              </div>

              {/* Risk mode */}
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
                <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.amber, marginBottom: 10 }}>RISK MODE</p>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['Cautious', 'Balanced', 'Degen'].map((m, i) => (
                    <div key={m} style={{
                      flex: 1, padding: '6px 0', borderRadius: 6, textAlign: 'center',
                      fontFamily: C.mono, fontSize: 10, fontWeight: 700,
                      background: i === 1 ? 'rgba(0,180,216,0.1)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${i === 1 ? 'rgba(0,180,216,0.2)' : C.border}`,
                      color: i === 1 ? C.accent : C.dimmer,
                    }}>{m}</div>
                  ))}
                </div>
              </div>

              <a href="/terminal" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '12px 0', borderRadius: 10, textDecoration: 'none',
                background: 'rgba(0,180,216,0.06)', border: '1px solid rgba(0,180,216,0.12)',
                fontFamily: C.mono, fontSize: 12, fontWeight: 700, color: C.accent,
              }}>Full Terminal View</a>
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
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: C.white, letterSpacing: '-0.02em' }}>Three layers. One predator.</h2>
          </div>
          <div className="three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { num: '01', label: 'Conversational', title: 'Talk to it.', desc: 'Lives in Telegram. No dashboards. Text your agent like a friend — "go hunt", "be careful", "what are you holding". It understands you.', color: C.accent },
              { num: '02', label: 'Skill-powered', title: 'Teach it.', desc: 'Install modular trading skills from a marketplace. Each skill is proven on mainnet with verifiable performance. Skills self-update after every trade.', color: C.purple },
              { num: '03', label: 'Trust layer', title: 'Protect it.', desc: 'Dev lock contracts prevent rug pulls. Holder rewards pay SOL to diamond hands. Trust built into the protocol, not promised.', color: C.green },
            ].map((p, i) => (
              <div key={p.num} style={{
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
                padding: 32, display: 'flex', flexDirection: 'column', gap: 16,
                animation: `fade-up 0.6s ease-out ${0.1 * i}s both`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: p.color + '0a', border: `1px solid ${p.color}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: C.mono, fontSize: 13, fontWeight: 800, color: p.color,
                  }}>{p.num}</div>
                </div>
                <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: p.color, textTransform: 'uppercase' }}>{p.label}</p>
                <h3 style={{ fontSize: 22, fontWeight: 750, color: C.white }}>{p.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: C.text }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SKILLS — self-updating ═══ */}
      <div style={divider} />
      <section style={{ ...sectionPad, position: 'relative', overflow: 'hidden' }}>
        <Bubbles />
        <div style={wrap}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: C.purple, marginBottom: 14 }}>SKILL MARKETPLACE</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: C.white, letterSpacing: '-0.02em', marginBottom: 12 }}>Battle-tested. Self-evolving.</h2>
            <p style={{ fontSize: 15, color: C.text, maxWidth: 520, margin: '0 auto' }}>
              Every skill runs on the reference agent first. If it can't prove itself in live trading,
              it doesn't make it to the marketplace. No theory — only verified performance.
            </p>
          </div>

          {/* Skill flow */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
            padding: '24px 28px', marginBottom: 32, display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
          }}>
            {['Build Skill', 'Test on Ref Agent', 'Verify Performance', 'Mint as NFT', 'Earn Rev Share'].map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: i === 1 ? 'rgba(6,214,160,0.1)' : i === 4 ? 'rgba(131,56,236,0.1)' : 'rgba(0,180,216,0.06)',
                  border: `1px solid ${i === 1 ? 'rgba(6,214,160,0.2)' : i === 4 ? 'rgba(131,56,236,0.2)' : 'rgba(0,180,216,0.1)'}`,
                  fontFamily: C.mono, fontSize: 10, fontWeight: 700,
                  color: i === 1 ? C.green : i === 4 ? C.purple : C.accent,
                }}>{i + 1}</div>
                <span style={{ fontFamily: C.mono, fontSize: 11, color: i === 1 ? C.green : i === 4 ? C.purple : C.text, fontWeight: i === 1 || i === 4 ? 700 : 500 }}>{step}</span>
                {i < 4 && <span style={{ color: C.dimmer, fontSize: 14, margin: '0 2px' }}>→</span>}
              </div>
            ))}
          </div>

          <div className="three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { name: 'Narrative Detection', tag: 'SCANNER', tagColor: C.accent, desc: 'Finds trending keywords across 400+ tokens. Meta detection with score boosting. Thresholds auto-adjust based on meta success rate.', stat: '+18%', statLabel: 'avg meta trades', updates: 'v2.4 — 312 updates', tested: true },
              { name: 'Holder Analysis', tag: 'FILTER', tagColor: C.red, desc: 'Top wallet concentration check via Solana RPC. Auto-rejects >50% single wallet. Rejection threshold tightens with each rug detected.', stat: '0 rugs', statLabel: 'with skill active', updates: 'v1.8 — 89 updates', tested: true },
              { name: 'Momentum Tracker', tag: 'ANALYSIS', tagColor: C.green, desc: '30-point price history. Recovery/dump/flat detection. Hold time windows adjust per-market based on outcome data.', stat: '+34%', statLabel: 'hold efficiency', updates: 'v3.1 — 540 updates', tested: true },
              { name: 'Aggressive Sell', tag: 'EXECUTION', tagColor: C.amber, desc: '3-attempt retry with fresh quotes. Escalating slippage. Slippage curve adapts based on recent TX success rates.', stat: '97%', statLabel: 'sell success', updates: 'v2.0 — 198 updates', tested: true },
              { name: 'Dual Market Scanner', tag: 'SCANNER', tagColor: C.accent, desc: 'Bonding curve + graduated simultaneously. Score weights shift based on which market is producing better returns.', stat: '2x', statLabel: 'opportunity surface', updates: 'v1.6 — 156 updates', tested: true },
              { name: 'Smart Money Tracker', tag: 'ALPHA', tagColor: C.purple, desc: 'Follows top-performing wallets. Wallet rankings refresh after each cycle based on rolling 24h performance.', stat: 'Top 20', statLabel: 'wallets tracked', updates: 'v1.3 — 72 updates', tested: true },
            ].map((s, i) => (
              <div key={s.name} style={{
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
                padding: '24px 24px 20px', display: 'flex', flexDirection: 'column', gap: 12,
                animation: `fade-up 0.5s ease-out ${0.08 * i}s both`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Badge color={s.tagColor}>{s.tag}</Badge>
                  <Badge color={C.green}>{s.tested ? 'REF-TESTED' : 'PENDING'}</Badge>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.white }}>{s.name}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: C.text, flex: 1 }}>{s.desc}</p>
                <div style={{ paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontFamily: C.mono, fontSize: 18, fontWeight: 800, color: C.green }}>{s.stat}</span>
                    <span style={{ fontFamily: C.mono, fontSize: 10, color: C.dim }}>{s.statLabel}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: C.purple, animation: 'pulse-slow 2s ease-in-out infinite' }} />
                    <span style={{ fontFamily: C.mono, fontSize: 9, color: C.purple }}>{s.updates}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <a href="/marketplace" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 32px', borderRadius: 10, textDecoration: 'none',
              background: 'rgba(0,180,216,0.06)', border: '1px solid rgba(0,180,216,0.12)',
              fontFamily: C.mono, fontSize: 13, fontWeight: 700, color: C.accent,
            }}>View Full Marketplace</a>
          </div>
        </div>
      </section>

      {/* ═══ TRUST ═══ */}
      <div style={divider} />
      <section style={sectionPad}>
        <div style={wrap}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: C.green, marginBottom: 14 }}>TRUST PROTOCOL</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: C.white, letterSpacing: '-0.02em' }}>Built-in protection.</h2>
          </div>
          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {/* Dev Locks */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 36 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,71,111,0.06)', border: '1px solid rgba(239,71,111,0.1)', fontFamily: C.mono, fontSize: 14, fontWeight: 800, color: C.red }}>DL</div>
                <div>
                  <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.red }}>SMART CONTRACTS</p>
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
                <div style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(6,214,160,0.06)', border: '1px solid rgba(6,214,160,0.1)', fontFamily: C.mono, fontSize: 14, fontWeight: 800, color: C.green }}>HR</div>
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
                    <div style={{ width: `${t.pct}%`, height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${C.green}, #34d399)`, transition: 'width 1.5s ease-out' }} />
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
        <div className="four-col" style={{ ...wrap, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { val: '72+', label: 'Mainnet trades', sub: 'Real SOL, verified on-chain' },
            { val: '7', label: 'Tested skills', sub: 'Ref-agent proven' },
            { val: '400+', label: 'Tokens per cycle', sub: 'Deep sea scanning' },
            { val: '97%', label: 'Sell success', sub: 'Aggressive retry' },
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
        <div className="sdk-grid" style={{ ...wrap, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
            overflow: 'hidden', boxShadow: C.glow,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 16px', background: 'rgba(0,180,216,0.02)', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ef476f' }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ffd166' }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#06d6a0' }} />
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
              Write a strategy. Test it on the reference agent with real market data. Once it proves profitable, mint as an NFT. You earn 10% of every profit your skill generates.
            </p>
            <a href="/docs" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 32px', borderRadius: 10, textDecoration: 'none', background: 'linear-gradient(135deg, #00b4d8, #0077b6)', color: '#020810', fontWeight: 700, fontSize: 14 }}>SDK Docs</a>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <div style={divider} />
      <section style={{ padding: '140px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 700, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,180,216,0.04), transparent 70%)', pointerEvents: 'none' }} />
        <Bubbles />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: 'clamp(36px, 6vw, 52px)', fontWeight: 900, color: C.white, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 18 }}>The deep awaits.</h2>
          <p style={{ fontSize: 16, color: C.text, maxWidth: 400, margin: '0 auto 40px' }}>Deploy a personal trading agent in 60 seconds.</p>
          <a href="https://t.me/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 44px', borderRadius: 10, textDecoration: 'none',
            background: 'linear-gradient(135deg, #00b4d8, #0077b6)', color: '#020810', fontWeight: 700, fontSize: 16,
            boxShadow: '0 4px 32px rgba(0,180,216,0.2)',
          }}>Deploy Your Agent</a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
