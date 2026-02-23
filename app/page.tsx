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

function Bubbles() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${12 + i * 11}%`, bottom: '-20px',
          width: 3 + (i % 3) * 2, height: 3 + (i % 3) * 2, borderRadius: '50%',
          background: `rgba(0,180,216,${0.06 + (i % 3) * 0.03})`,
          animation: `bubble-rise ${12 + i * 4}s linear infinite ${i * 2}s`,
        }} />
      ))}
    </div>
  );
}

/* Agent voice — SharkD speaks in first person, sharp, underwater predator */
function AgentQuote({ text, style }: { text: string; style?: React.CSSProperties }) {
  return (
    <div style={{
      position: 'relative', padding: '20px 24px', borderRadius: 12,
      background: 'rgba(0,180,216,0.03)', borderLeft: '2px solid rgba(0,180,216,0.2)',
      ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <img src="/shark.jpg" alt="" style={{ width: 20, height: 20, borderRadius: 6, objectFit: 'cover' }} />
        <span style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, color: C.accent, letterSpacing: 1 }}>SHARKD</span>
      </div>
      <p style={{ fontFamily: C.mono, fontSize: 13, lineHeight: 1.7, color: C.accentBright, fontStyle: 'italic' }}>{text}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh', position: 'relative' }}>
      <Nav />

      {/* ═══ HERO ═══ */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 120% 80% at 50% 20%, rgba(0,119,182,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 30% 70%, rgba(0,180,216,0.03) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 70% 60%, rgba(131,56,236,0.02) 0%, transparent 50%)', pointerEvents: 'none' }} />
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
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '7px 18px', borderRadius: 100, marginBottom: 36,
            background: 'rgba(0,180,216,0.06)', border: '1px solid rgba(0,180,216,0.1)',
            animation: 'fade-in 1s ease-out 0.3s both',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.green, boxShadow: `0 0 8px ${C.green}`, animation: 'pulse-slow 2.5s ease-in-out infinite' }} />
            <span style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 600, letterSpacing: 2, color: C.accent }}>AUTONOMOUS TRADING INTELLIGENCE</span>
          </div>

          <h1 style={{ fontFamily: C.sans, fontSize: 'clamp(44px, 7.5vw, 76px)', fontWeight: 850, lineHeight: 1.0, letterSpacing: '-0.035em', marginBottom: 26, animation: 'fade-up 0.8s ease-out 0.2s both' }}>
            <span style={{ color: C.white }}>I hunt the depths.</span><br />
            <span style={{ color: C.dimmer }}>You collect the gains.</span>
          </h1>

          <p style={{ fontFamily: C.mono, fontSize: 14, lineHeight: 1.8, color: C.text, maxWidth: 540, margin: '0 auto 20px', animation: 'fade-up 0.8s ease-out 0.4s both' }}>
            I'm SharkD. I live in your Telegram. I scan hundreds of tokens every cycle,
            filter the noise, and execute trades while you sleep. I get smarter with every
            skill you install. And I never stop learning.
          </p>

          <p style={{ fontFamily: C.mono, fontSize: 12, color: C.dim, marginBottom: 44, animation: 'fade-up 0.8s ease-out 0.5s both' }}>
            Don't trust me. Watch me. Everything I do is public.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64, animation: 'fade-up 0.8s ease-out 0.6s both' }}>
            <a href="/terminal" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 32px', borderRadius: 10, textDecoration: 'none',
              background: 'linear-gradient(135deg, #00b4d8, #0077b6)', color: '#020810', fontWeight: 700, fontSize: 14,
              boxShadow: '0 4px 24px rgba(0,180,216,0.2)',
            }}>Watch Me Trade Live</a>
            <a href="/docs" style={{ padding: '13px 32px', borderRadius: 10, textDecoration: 'none', background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`, color: C.text, fontWeight: 550, fontSize: 14 }}>Documentation</a>
          </div>

          {/* Hero terminal — agent speaks */}
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
              <span style={{ fontFamily: C.mono, fontSize: 10, marginLeft: 8, color: C.dimmer }}>sharkd - neural feed</span>
              <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: C.green, animation: 'pulse-slow 2s ease-in-out infinite' }} />
            </div>
            <div style={{ padding: '18px 20px', fontFamily: C.mono, fontSize: 12, lineHeight: 2.0 }}>
              <div style={{ color: C.dimmer }}>you: are you ready?</div>
              <div style={{ color: C.accentBright }}>Almost. Building my skills. Learning the deep.</div>
              <div style={{ color: C.accentBright }}>When I'm ready, you'll know.</div>
              <div style={{ marginTop: 4, color: C.accent }}>
                <span style={{ animation: 'blink 1s step-end infinite' }}>_</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ $SHARKD TOKEN ═══ */}
      <div style={divider} />
      <section style={{ padding: '60px 0', background: 'linear-gradient(180deg, rgba(0,180,216,0.02) 0%, transparent 100%)' }}>
        <div style={wrap}>
          <div style={{ background: C.surface, border: `1px solid ${C.borderLit}`, borderRadius: 16, padding: 'clamp(24px, 4vw, 40px)', boxShadow: C.glowStrong }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <img src="/shark.jpg" alt="" style={{ width: 40, height: 40, borderRadius: 12, objectFit: 'cover', border: '2px solid rgba(0,180,216,0.2)' }} />
              <div>
                <h2 style={{ fontFamily: C.sans, fontSize: 24, fontWeight: 800, color: C.white, letterSpacing: '-0.02em', margin: 0 }}>$SHARKD</h2>
                <p style={{ fontFamily: C.mono, fontSize: 10, color: C.accent, letterSpacing: 1 }}>THE TOKEN</p>
              </div>
              <a href="https://pump.fun/coin/9FxxWFyEquSswwCjAE46vVMAdi7bfiQqMNkYy3o7pump" target="_blank" rel="noopener" style={{
                marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 24px', borderRadius: 10, textDecoration: 'none',
                background: 'linear-gradient(135deg, #00b4d8, #0077b6)', color: '#020810',
                fontWeight: 700, fontSize: 13, fontFamily: C.sans,
              }}>Buy on pump.fun</a>
            </div>

            <div style={{ fontFamily: C.mono, fontSize: 12, lineHeight: 1.8, color: C.text, marginBottom: 24 }}>
              <p style={{ marginBottom: 12 }}>$SHARKD powers the ecosystem. The agent holds its own token and will never sell.</p>
            </div>

            {/* CA */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.dim, marginBottom: 6 }}>CONTRACT ADDRESS</p>
              <div style={{ background: 'rgba(0,180,216,0.04)', border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <code style={{ fontFamily: C.mono, fontSize: 11, color: C.accent, wordBreak: 'break-all', flex: 1 }}>9FxxWFyEquSswwCjAE46vVMAdi7bfiQqMNkYy3o7pump</code>
              </div>
            </div>

            {/* Agent wallet */}
            <div>
              <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.dim, marginBottom: 6 }}>AGENT WALLET</p>
              <div style={{ background: 'rgba(6,214,160,0.04)', border: `1px solid rgba(6,214,160,0.08)`, borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <code style={{ fontFamily: C.mono, fontSize: 11, color: C.green, wordBreak: 'break-all', flex: 1 }}>HdRxdfqwTg8Mdxf2HPZTYrwroTEaSGzmaxfi3MxBgfYz</code>
                <a href="https://solscan.io/account/HdRxdfqwTg8Mdxf2HPZTYrwroTEaSGzmaxfi3MxBgfYz" target="_blank" rel="noopener" style={{ fontFamily: C.mono, fontSize: 9, color: C.dim, textDecoration: 'none', whiteSpace: 'nowrap' }}>view on solscan</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ AGENT INTRO ═══ */}
      <div style={divider} />
      <section style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 28, maxWidth: 700, margin: '0 auto', alignItems: 'start' }}>
            <img src="/shark.jpg" alt="SharkD" style={{ width: 80, height: 80, borderRadius: 20, objectFit: 'cover', border: '2px solid rgba(0,180,216,0.15)' }} />
            <div>
              <h2 style={{ fontFamily: C.sans, fontSize: 28, fontWeight: 800, color: C.white, marginBottom: 16 }}>Who am I?</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: C.mono, fontSize: 13, lineHeight: 1.8, color: C.text }}>
                <p>I'm an autonomous trading agent built for Solana memecoins. I don't sleep. I don't panic sell. I don't FOMO in.</p>
                <p>I run on modular skills — each one tested live on mainnet before I trust it. When a skill proves itself, I install it. When it stops working, I adapt it. When it fails, I drop it.</p>
                <p>I talk to you through Telegram. You tell me how aggressive to be. I tell you what I'm seeing. We work together, but the deep is my territory.</p>
                <p style={{ color: C.accent }}>My decisions are public. My terminal is live. My performance is on-chain. I have nothing to hide because the data speaks for itself.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ LIVE REFERENCE TERMINAL ═══ */}
      <div style={divider} />
      <section style={sectionPad}>
        <div style={wrap}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <p style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: C.green, marginBottom: 14 }}>PROOF OF HUNT</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: C.white, letterSpacing: '-0.02em', marginBottom: 12 }}>Don't trust. Verify.</h2>
          </div>

          <AgentQuote
            text="Everything I do is logged here. Every scan, every rejection, every trade. If I make a bad call, you'll see it. That's the deal."
            style={{ maxWidth: 600, margin: '0 auto 48px' }}
          />

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
              <div style={{ padding: '40px 20px', textAlign: 'center', minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontFamily: C.mono, fontSize: 12, color: C.dim, marginBottom: 6 }}>Terminal inactive.</p>
                <p style={{ fontFamily: C.mono, fontSize: 11, color: C.dimmer }}>Live feed will stream here when the agent starts trading.</p>
              </div>
            </div>

            {/* Stats sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
                <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.accent, marginBottom: 14 }}>MY STATUS</p>
                {[
                  { label: 'Balance', value: '—' },
                  { label: 'Today PnL', value: '—' },
                  { label: 'Win Rate', value: '—' },
                  { label: 'Holding', value: '—' },
                  { label: 'Cycles', value: '—' },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                    <span style={{ fontFamily: C.mono, fontSize: 11, color: C.dim }}>{s.label}</span>
                    <span style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 700, color: C.dimmer }}>{s.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
                <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: '#8338ec', marginBottom: 14 }}>MY SKILLS</p>
                <p style={{ fontFamily: C.mono, fontSize: 11, color: C.dim, lineHeight: 1.6 }}>Learning. Skills will appear here as I develop and test them.</p>
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
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <p style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: C.accent, marginBottom: 14 }}>HOW I WORK</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: C.white, letterSpacing: '-0.02em' }}>Three layers. One predator.</h2>
          </div>

          <AgentQuote
            text="I'm not one thing. I'm three systems working together — conversation, skills, and trust. Remove any one and I'm just another bot."
            style={{ maxWidth: 600, margin: '0 auto 48px' }}
          />

          <div className="three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { num: '01', label: 'Conversational', title: 'Talk to me.', desc: 'I live in Telegram. No dashboards, no portals. Tell me "go hunt" and I hunt. Tell me "chill" and I chill. Ask what I\'m holding. I\'ll tell you everything.', color: C.accent },
              { num: '02', label: 'Skill-powered', title: 'Teach me.', desc: 'Install skills from the marketplace and I gain that edge instantly. Each skill is proven on mainnet — I ran it myself before it was listed. Skills self-update after every trade I make.', color: C.purple },
              { num: '03', label: 'Trust layer', title: 'Verify me.', desc: 'Dev lock contracts prevent rug pulls. Holder rewards pay SOL to diamond hands. My terminal is public. My trades are on-chain. I don\'t ask for trust — I earn it.', color: C.green },
            ].map((p, i) => (
              <div key={p.num} style={{
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
                padding: 32, display: 'flex', flexDirection: 'column', gap: 16,
                animation: `fade-up 0.6s ease-out ${0.1 * i}s both`,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: p.color + '0a', border: `1px solid ${p.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: C.mono, fontSize: 13, fontWeight: 800, color: p.color,
                }}>{p.num}</div>
                <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: p.color, textTransform: 'uppercase' }}>{p.label}</p>
                <h3 style={{ fontSize: 22, fontWeight: 750, color: C.white }}>{p.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: C.text }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SKILLS ═══ */}
      <div style={divider} />
      <section style={{ ...sectionPad, position: 'relative', overflow: 'hidden' }}>
        <Bubbles />
        <div style={wrap}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <p style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: C.purple, marginBottom: 14 }}>SKILL MARKETPLACE</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: C.white, letterSpacing: '-0.02em', marginBottom: 12 }}>My arsenal. Always evolving.</h2>
          </div>

          <AgentQuote
            text="I don't list skills I haven't tested. The marketplace starts empty and fills as I learn. Every skill here will have earned its place through live mainnet performance."
            style={{ maxWidth: 640, margin: '0 auto 48px' }}
          />

          {/* Skill flow */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
            padding: '24px 28px', marginBottom: 32, display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
          }}>
            {['Build Skill', 'I Test It Live', 'Verify Results', 'Mint as NFT', 'You Earn Rev Share'].map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: i === 1 ? 'rgba(6,214,160,0.1)' : i === 4 ? 'rgba(131,56,236,0.1)' : 'rgba(0,180,216,0.06)',
                  border: `1px solid ${i === 1 ? 'rgba(6,214,160,0.2)' : i === 4 ? 'rgba(131,56,236,0.2)' : 'rgba(0,180,216,0.1)'}`,
                  fontFamily: C.mono, fontSize: 10, fontWeight: 700,
                  color: i === 1 ? C.green : i === 4 ? C.purple : C.accent,
                }}>{i + 1}</div>
                <span style={{ fontFamily: C.mono, fontSize: 11, color: i === 1 ? C.green : i === 4 ? C.purple : C.text, fontWeight: i === 1 || i === 4 ? 700 : 500 }}>{step}</span>
                {i < 4 && <span style={{ color: C.dimmer, fontSize: 14, margin: '0 2px' }}>›</span>}
              </div>
            ))}
          </div>

          {/* Empty state — skills added as learned */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
            padding: '60px 40px', textAlign: 'center',
          }}>
            <p style={{ fontFamily: C.mono, fontSize: 13, color: C.text, marginBottom: 8 }}>No skills listed yet. I'm still learning.</p>
            <p style={{ fontFamily: C.mono, fontSize: 12, color: C.dim }}>Skills will appear here as I develop, test, and prove them on mainnet.</p>
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <a href="/marketplace" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 32px', borderRadius: 10, textDecoration: 'none',
              background: 'rgba(0,180,216,0.06)', border: '1px solid rgba(0,180,216,0.12)',
              fontFamily: C.mono, fontSize: 13, fontWeight: 700, color: C.accent,
            }}>View Marketplace</a>
          </div>
        </div>
      </section>

      {/* ═══ TRUST ═══ */}
      <div style={divider} />
      <section style={sectionPad}>
        <div style={wrap}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <p style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: C.green, marginBottom: 14 }}>TRUST PROTOCOL</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: C.white, letterSpacing: '-0.02em' }}>Built-in protection.</h2>
          </div>

          <AgentQuote
            text="The crypto space has a trust problem. I'm not going to fix it with promises. Smart contracts don't lie. On-chain data doesn't lie. That's my approach."
            style={{ maxWidth: 600, margin: '0 auto 48px' }}
          />

          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 36 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,71,111,0.06)', border: '1px solid rgba(239,71,111,0.1)', fontFamily: C.mono, fontSize: 14, fontWeight: 800, color: C.red }}>DL</div>
                <div>
                  <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.red }}>SMART CONTRACTS</p>
                  <h3 style={{ fontSize: 18, fontWeight: 750, color: C.white }}>Dev Locks</h3>
                </div>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: C.text, marginBottom: 24 }}>I believe devs should lock their tokens. Not because I said so — because the contract enforces it. Vesting, not cliff dumps.</p>
              {[{ label: '7 days', pct: 25, note: 'Basic' }, { label: '30 days', pct: 55, note: 'Strong' }, { label: '90 days', pct: 90, note: 'Maximum' }].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <span style={{ fontFamily: C.mono, fontSize: 11, color: C.white, width: 52, fontWeight: 600 }}>{l.label}</span>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ width: `${l.pct}%`, height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${C.red}, #f87171)` }} />
                  </div>
                  <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dim, width: 56, textAlign: 'right' }}>{l.note}</span>
                </div>
              ))}
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 36 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(6,214,160,0.06)', border: '1px solid rgba(6,214,160,0.1)', fontFamily: C.mono, fontSize: 14, fontWeight: 800, color: C.green }}>HR</div>
                <div>
                  <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.green }}>YIELD PROTOCOL</p>
                  <h3 style={{ fontSize: 18, fontWeight: 750, color: C.white }}>Holder Rewards</h3>
                </div>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: C.text, marginBottom: 24 }}>I distribute SOL to holders based on how long they've held. Patience pays. Selling resets your multiplier. Simple.</p>
              {[{ label: '1 day', pct: 20, mult: '1.0x' }, { label: '7 days', pct: 35, mult: '1.5x' }, { label: '30 days', pct: 65, mult: '3.0x' }, { label: '90 days', pct: 100, mult: '5.0x' }].map(t => (
                <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <span style={{ fontFamily: C.mono, fontSize: 11, color: C.white, width: 52, fontWeight: 600 }}>{t.label}</span>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ width: `${t.pct}%`, height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${C.green}, #34d399)` }} />
                  </div>
                  <span style={{ fontFamily: C.mono, fontSize: 11, color: C.green, width: 36, textAlign: 'right', fontWeight: 700 }}>{t.mult}</span>
                </div>
              ))}
            </div>
          </div>
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
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, color: C.white, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 18 }}>Build skills for me.<br />I'll make you money.</h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: C.text, marginBottom: 20, maxWidth: 420 }}>
              Write a strategy. Submit it. I'll test it live on mainnet with real SOL.
              If it performs, I'll list it. You earn 10% of every profit it generates. Forever.
            </p>
            <AgentQuote text="I'm picky about skills. Impress me." style={{ marginBottom: 24 }} />
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
          <img src="/shark.jpg" alt="SharkD" style={{ width: 60, height: 60, borderRadius: 16, objectFit: 'cover', border: '2px solid rgba(0,180,216,0.15)', marginBottom: 24 }} />
          <h2 style={{ fontFamily: C.mono, fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 700, color: C.accentBright, lineHeight: 1.5, marginBottom: 12 }}>
            "The deep is mine. The gains are yours."
          </h2>
          <p style={{ fontSize: 15, color: C.dim, marginBottom: 40 }}>— SharkD</p>
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
