import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const C = {
  bg: '#020810', surface: '#041220', border: 'rgba(0,180,216,0.06)', borderLit: 'rgba(0,180,216,0.12)',
  accent: '#00b4d8', green: '#06d6a0', red: '#ef476f', amber: '#ffd166',
  purple: '#8338ec', cyan: '#00b4d8',
  white: '#e0eaf4', text: '#7b93b0', dim: '#3d5a80', dimmer: '#1e3354',
  mono: "'JetBrains Mono', 'SF Mono', monospace",
};

const SKILLS = [
  { name: 'Narrative Detection', tag: 'SCANNER', tagColor: C.accent, price: '0.5 SOL', desc: 'Scans 400+ tokens for trending keywords. Meta detection with auto-adjusting thresholds based on meta success rate.', stat: '+18%', statLabel: 'avg meta trades', updates: 'v2.4 — 312 updates', tested: true },
  { name: 'Holder Analysis', tag: 'FILTER', tagColor: C.red, price: '0.3 SOL', desc: 'Top 1/5/10 wallet concentration check. Rejection threshold tightens with each rug detected. Zero rug losses on record.', stat: '0 rugs', statLabel: 'with skill active', updates: 'v1.8 — 89 updates', tested: true },
  { name: 'Momentum Tracker', tag: 'ANALYSIS', tagColor: C.green, price: '0.4 SOL', desc: '30-point price history. Recovery/dump/flat detection. Hold time windows auto-tune per market type based on outcomes.', stat: '+34%', statLabel: 'hold efficiency', updates: 'v3.1 — 540 updates', tested: true },
  { name: 'Aggressive Sell', tag: 'EXECUTION', tagColor: C.amber, price: '0.6 SOL', desc: '3-attempt retry with fresh quotes. Slippage curve adapts based on recent TX success rates. Never lose a winning trade.', stat: '97%', statLabel: 'sell success', updates: 'v2.0 — 198 updates', tested: true },
  { name: 'Dual Market Scanner', tag: 'SCANNER', tagColor: C.accent, price: '0.5 SOL', desc: 'Bonding + graduated simultaneously. Score weights shift based on which market produces better returns this cycle.', stat: '2x', statLabel: 'opportunity surface', updates: 'v1.6 — 156 updates', tested: true },
  { name: 'Adaptive Sizing', tag: 'RISK', tagColor: C.cyan, price: '0.3 SOL', desc: 'Win-rate-based position scaling. Size tiers adjust as your agent\'s track record evolves. Different curves per market.', stat: '5 tiers', statLabel: '0.05 to 1.00 SOL', updates: 'v1.4 — 110 updates', tested: true },
  { name: 'Smart Money Tracker', tag: 'ALPHA', tagColor: C.purple, price: '0.8 SOL', desc: 'Follows top wallets. Rankings refresh every cycle based on rolling 24h performance. No paid APIs required.', stat: 'Top 20', statLabel: 'wallets tracked', updates: 'v1.3 — 72 updates', tested: true },
];

export default function Marketplace() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Nav />

      <section style={{ paddingTop: 130, paddingBottom: 48, textAlign: 'center' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto', padding: '0 clamp(20px,4vw,40px)' }}>
          <p style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: C.purple, marginBottom: 14 }}>MARKETPLACE</p>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 52px)', fontWeight: 900, color: C.white, letterSpacing: '-0.03em', marginBottom: 14 }}>Trading skills.</h1>
          <p style={{ fontSize: 16, color: C.text, maxWidth: 500, margin: '0 auto 36px' }}>
            Modular strategies proven on the reference agent. Self-updating after every trade.
            Every skill listed here has been tested live on mainnet before listing.
          </p>

          {/* Tested banner */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 20px',
            borderRadius: 10, background: 'rgba(6,214,160,0.06)', border: '1px solid rgba(6,214,160,0.12)',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.green, animation: 'pulse-slow 2s ease-in-out infinite' }} />
            <span style={{ fontFamily: C.mono, fontSize: 11, color: C.green, fontWeight: 600 }}>All skills ref-agent tested before listing</span>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1060, margin: '0 auto', padding: '0 clamp(20px,4vw,40px) 100px' }}>
        <div className="three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {SKILLS.map((skill, i) => (
            <div key={skill.name} style={{
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
              padding: 26, display: 'flex', flexDirection: 'column', gap: 14,
              animation: `fade-up 0.5s ease-out ${0.06 * i}s both`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, padding: '3px 10px', borderRadius: 4, color: skill.tagColor, background: skill.tagColor + '14' }}>{skill.tag}</span>
                <span style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, padding: '3px 10px', borderRadius: 4, color: C.green, background: C.green + '14' }}>REF-TESTED</span>
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: C.white }}>{skill.name}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: C.text, flex: 1 }}>{skill.desc}</p>

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
                    background: 'rgba(0,180,216,0.06)', border: '1px solid rgba(0,180,216,0.1)',
                  }}>{skill.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit CTA */}
        <div style={{
          marginTop: 40, padding: '40px 48px', background: C.surface,
          border: '1px dashed rgba(0,180,216,0.08)', borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24,
        }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 750, color: C.white, marginBottom: 6 }}>Build your own skill</h3>
            <p style={{ fontSize: 14, color: C.text, maxWidth: 420 }}>
              Write a strategy, test it on the reference agent, prove it works, mint as an NFT. Earn 10% of every profit.
            </p>
          </div>
          <a href="/docs" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 28px', borderRadius: 10, textDecoration: 'none',
            background: 'linear-gradient(135deg, #00b4d8, #0077b6)', color: '#020810', fontWeight: 700, fontSize: 14, flexShrink: 0,
          }}>Read the SDK Docs</a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
