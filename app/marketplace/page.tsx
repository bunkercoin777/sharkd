import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const C = {
  bg: '#060610', surface: '#0b0b18', border: 'rgba(255,255,255,0.05)',
  accent: '#3b82f6', green: '#22c55e', red: '#ef4444', amber: '#f59e0b',
  purple: '#a855f7', cyan: '#06b6d4', white: '#f0f2f8', text: '#94a3b8',
  dim: '#475569', dimmer: '#334155',
  mono: "'JetBrains Mono', 'SF Mono', monospace",
};

const SKILLS = [
  { name: 'Narrative Detection', tag: 'SCANNER', tagColor: C.accent, price: '0.5 SOL', installs: 0, desc: 'Scans 400+ tokens for trending keywords. Meta detection with auto-adjusting thresholds based on meta success rate.', stat: '+18%', statLabel: 'avg meta trades', updates: 'v2.4 — 312 updates' },
  { name: 'Holder Analysis', tag: 'FILTER', tagColor: C.red, price: '0.3 SOL', installs: 0, desc: 'Top 1/5/10 wallet concentration check. Rejection threshold tightens with each rug detected. Zero rug losses on record.', stat: '0 rugs', statLabel: 'with skill active', updates: 'v1.8 — 89 updates' },
  { name: 'Momentum Tracker', tag: 'ANALYSIS', tagColor: C.green, price: '0.4 SOL', installs: 0, desc: '30-point price history. Recovery/dump/flat detection. Hold time windows auto-tune per market type based on outcomes.', stat: '+34%', statLabel: 'hold efficiency', updates: 'v3.1 — 540 updates' },
  { name: 'Aggressive Sell', tag: 'EXECUTION', tagColor: C.amber, price: '0.6 SOL', installs: 0, desc: '3-attempt retry with fresh quotes. Slippage curve adapts based on recent TX success rates. Never lose a winning trade.', stat: '97%', statLabel: 'sell success', updates: 'v2.0 — 198 updates' },
  { name: 'Dual Market Scanner', tag: 'SCANNER', tagColor: C.accent, price: '0.5 SOL', installs: 0, desc: 'Bonding + graduated simultaneously. Score weights shift based on which market produces better returns this cycle.', stat: '2x', statLabel: 'opportunity surface', updates: 'v1.6 — 156 updates' },
  { name: 'Adaptive Sizing', tag: 'RISK', tagColor: C.cyan, price: '0.3 SOL', installs: 0, desc: 'Win-rate-based position scaling. Size tiers adjust as your agent\'s track record evolves. Different curves per market.', stat: '5 tiers', statLabel: '0.05→1.00 SOL', updates: 'v1.4 — 110 updates' },
  { name: 'Smart Money Tracker', tag: 'ALPHA', tagColor: C.purple, price: '0.8 SOL', installs: 0, desc: 'Follows top wallets. Rankings refresh every cycle based on rolling 24h performance. No paid APIs required.', stat: 'Top 20', statLabel: 'wallets tracked', updates: 'v1.3 — 72 updates' },
];

export default function Marketplace() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Nav />

      <section style={{ paddingTop: 130, paddingBottom: 48, textAlign: 'center' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto', padding: '0 clamp(20px,4vw,40px)' }}>
          <p style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: C.purple, marginBottom: 14 }}>MARKETPLACE</p>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 52px)', fontWeight: 900, color: C.white, letterSpacing: '-0.03em', marginBottom: 14 }}>Trading skills.</h1>
          <p style={{ fontSize: 16, color: C.text, maxWidth: 480, margin: '0 auto 36px' }}>
            Modular strategies proven on mainnet. Self-updating after every trade.
            Install one, your agent gains that edge instantly.
          </p>

          {/* Self-update banner */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 20px',
            borderRadius: 10, background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.12)',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.purple, animation: 'pulse-slow 2s ease-in-out infinite' }} />
            <span style={{ fontFamily: C.mono, fontSize: 11, color: C.purple, fontWeight: 600 }}>All skills auto-update parameters after each trade cycle</span>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1060, margin: '0 auto', padding: '0 clamp(20px,4vw,40px) 100px' }}>
        {/* Grid — 3 columns, consistent */}
        <div className="three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {SKILLS.map((skill, i) => (
            <div key={skill.name} style={{
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
              padding: 26, display: 'flex', flexDirection: 'column', gap: 14,
              animation: `fade-up 0.5s ease-out ${0.06 * i}s both`,
            }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, padding: '3px 10px', borderRadius: 4, color: skill.tagColor, background: skill.tagColor + '12' }}>{skill.tag}</span>
                <span style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, padding: '3px 10px', borderRadius: 4, color: C.green, background: C.green + '12' }}>PROVEN</span>
              </div>

              {/* Content */}
              <h3 style={{ fontSize: 16, fontWeight: 700, color: C.white }}>{skill.name}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: C.text, flex: 1 }}>{skill.desc}</p>

              {/* Stats */}
              <div style={{ paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontFamily: C.mono, fontSize: 20, fontWeight: 800, color: C.green }}>{skill.stat}</span>
                  <span style={{ fontFamily: C.mono, fontSize: 10, color: C.dim }}>{skill.statLabel}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: C.purple, animation: 'pulse-slow 2s ease-in-out infinite' }} />
                    <span style={{ fontFamily: C.mono, fontSize: 9, color: C.purple }}>{skill.updates}</span>
                  </div>
                  <div style={{
                    fontFamily: C.mono, fontSize: 12, fontWeight: 700, color: C.accent,
                    padding: '8px 18px', borderRadius: 8,
                    background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.12)',
                    cursor: 'pointer',
                  }}>{skill.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit CTA */}
        <div style={{
          marginTop: 40, padding: '40px 48px', background: C.surface,
          border: '1px dashed rgba(255,255,255,0.06)', borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24,
        }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 750, color: C.white, marginBottom: 6 }}>Build your own skill</h3>
            <p style={{ fontSize: 14, color: C.text, maxWidth: 400 }}>
              Write a strategy, test against real data, mint as an NFT. Earn 10% of every profit. Skills auto-update after each trade.
            </p>
          </div>
          <a href="/docs" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 28px', borderRadius: 10, textDecoration: 'none',
            background: C.accent, color: '#060610', fontWeight: 650, fontSize: 14, flexShrink: 0,
          }}>Read the SDK Docs →</a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
