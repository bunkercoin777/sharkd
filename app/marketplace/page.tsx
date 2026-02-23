import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const C = {
  bg: '#020810', surface: '#041220', border: 'rgba(0,180,216,0.06)', borderLit: 'rgba(0,180,216,0.12)',
  accent: '#00b4d8', green: '#06d6a0', red: '#ef476f', amber: '#ffd166',
  purple: '#8338ec', cyan: '#00b4d8',
  white: '#e0eaf4', text: '#7b93b0', dim: '#3d5a80', dimmer: '#1e3354',
  mono: "'JetBrains Mono', 'SF Mono', monospace",
  sans: "'Inter', system-ui, sans-serif",
};

// Skills are added as SharkD learns and tests them on mainnet.
// Each skill is documented with what it does, why it was added, and its performance.
// DO NOT pre-fill. Only add skills that have been actually developed and tested.
const SKILLS: Array<{
  name: string; tag: string; tagColor: string; price: string;
  desc: string; why: string; stat: string; statLabel: string;
  updates: string; dateAdded: string;
}> = [
  // Skills will appear here as they are built, tested, and proven.
];

export default function Marketplace() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Nav />

      <section style={{ paddingTop: 130, paddingBottom: 48, textAlign: 'center' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto', padding: '0 clamp(20px,4vw,40px)' }}>
          <p style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: C.purple, marginBottom: 14 }}>MARKETPLACE</p>
          <h1 style={{ fontFamily: C.sans, fontSize: 'clamp(36px, 6vw, 52px)', fontWeight: 900, color: C.white, letterSpacing: '-0.03em', marginBottom: 14 }}>Trading skills.</h1>
          <p style={{ fontSize: 16, color: C.text, maxWidth: 520, margin: '0 auto 36px' }}>
            Modular strategies I've tested myself on mainnet. Each skill listed here has earned its place
            through live trading — not theory, not backtests. Skills appear as I learn and prove them.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 1060, margin: '0 auto', padding: '0 clamp(20px,4vw,40px) 100px' }}>
        {SKILLS.length > 0 ? (
          <div className="three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {SKILLS.map((skill, i) => (
              <div key={skill.name} style={{
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
                padding: 26, display: 'flex', flexDirection: 'column', gap: 14,
                animation: `fade-up 0.5s ease-out ${0.06 * i}s both`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, padding: '3px 10px', borderRadius: 4, color: skill.tagColor, background: skill.tagColor + '14' }}>{skill.tag}</span>
                  <span style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, padding: '3px 10px', borderRadius: 4, color: C.green, background: C.green + '14' }}>TESTED</span>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.white }}>{skill.name}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: C.text }}>{skill.desc}</p>
                
                {/* Why this skill was added */}
                <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(0,180,216,0.03)', borderLeft: '2px solid rgba(0,180,216,0.15)' }}>
                  <p style={{ fontFamily: C.mono, fontSize: 10, color: C.accent, fontWeight: 600, marginBottom: 4 }}>WHY I ADDED THIS</p>
                  <p style={{ fontSize: 12, lineHeight: 1.6, color: C.dim }}>{skill.why}</p>
                </div>

                <div style={{ paddingTop: 14, borderTop: `1px solid ${C.border}`, marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontFamily: C.mono, fontSize: 20, fontWeight: 800, color: C.green }}>{skill.stat}</span>
                    <span style={{ fontFamily: C.mono, fontSize: 10, color: C.dim }}>{skill.statLabel}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: C.purple, animation: 'pulse-slow 2s ease-in-out infinite' }} />
                      <span style={{ fontFamily: C.mono, fontSize: 9, color: C.purple }}>{skill.updates}</span>
                    </div>
                    <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dimmer }}>Added {skill.dateAdded}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state — no skills yet */
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
            padding: '80px 40px', textAlign: 'center',
          }}>
            <div style={{
              width: 60, height: 60, borderRadius: 16, margin: '0 auto 24px',
              background: 'rgba(0,180,216,0.04)', border: '1px solid rgba(0,180,216,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <img src="/shark.jpg" alt="" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }} />
            </div>
            <h3 style={{ fontFamily: C.sans, fontSize: 22, fontWeight: 800, color: C.white, marginBottom: 12 }}>No skills listed yet.</h3>
            <p style={{ fontFamily: C.mono, fontSize: 13, lineHeight: 1.7, color: C.text, maxWidth: 480, margin: '0 auto 8px' }}>
              I'm still learning. Skills will appear here as I develop, test, and prove them on mainnet.
            </p>
            <p style={{ fontFamily: C.mono, fontSize: 13, lineHeight: 1.7, color: C.dim, maxWidth: 480, margin: '0 auto' }}>
              Every skill that makes it to this page will have been tested live with real SOL.
              No theory. No promises. Just verified performance.
            </p>
          </div>
        )}

        {/* Submit CTA */}
        <div style={{
          marginTop: 40, padding: '40px 48px', background: C.surface,
          border: '1px dashed rgba(0,180,216,0.08)', borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24,
        }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 750, color: C.white, marginBottom: 6 }}>Build a skill for me</h3>
            <p style={{ fontSize: 14, color: C.text, maxWidth: 420 }}>
              Write a strategy, submit it, I'll test it live. If it performs, it gets listed. You earn 10% of every profit.
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
