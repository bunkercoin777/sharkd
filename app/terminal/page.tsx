import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const C = {
  bg: '#020810', surface: '#041220', border: 'rgba(0,180,216,0.06)', borderLit: 'rgba(0,180,216,0.12)',
  accent: '#00b4d8', green: '#06d6a0', red: '#ef476f', amber: '#ffd166',
  purple: '#8338ec',
  white: '#e0eaf4', text: '#7b93b0', dim: '#3d5a80', dimmer: '#1e3354',
  mono: "'JetBrains Mono', 'SF Mono', monospace",
  sans: "'Inter', system-ui, sans-serif",
  glow: '0 0 40px rgba(0,180,216,0.08)',
};

export default function Terminal() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Nav />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '100px clamp(16px, 3vw, 32px) 60px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.dimmer }} />
              <span style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 700, color: C.dimmer }}>OFFLINE</span>
              <span style={{ fontFamily: C.mono, fontSize: 11, color: C.dimmer }}>|</span>
              <span style={{ fontFamily: C.mono, fontSize: 11, color: C.dim }}>SHARKD Reference Agent</span>
            </div>
            <h1 style={{ fontFamily: C.sans, fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: '-0.02em' }}>Live Terminal</h1>
          </div>
        </div>

        <div className="terminal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
          {/* Main feed — empty, waiting */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
            overflow: 'hidden', boxShadow: C.glow,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 16px', background: 'rgba(0,180,216,0.02)', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ef476f' }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ffd166' }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#06d6a0' }} />
              <span style={{ fontFamily: C.mono, fontSize: 10, marginLeft: 8, color: C.dim }}>Decision Feed</span>
              <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.dimmer }} />
                <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dimmer }}>WAITING</span>
              </span>
            </div>
            <div style={{ padding: '60px 20px', textAlign: 'center', minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/shark.jpg" alt="" style={{ width: 48, height: 48, borderRadius: 14, objectFit: 'cover', marginBottom: 20, opacity: 0.5 }} />
              <p style={{ fontFamily: C.mono, fontSize: 13, color: C.dim, marginBottom: 8 }}>Terminal inactive.</p>
              <p style={{ fontFamily: C.mono, fontSize: 12, color: C.dimmer, maxWidth: 360, lineHeight: 1.6 }}>
                The reference agent isn't live yet. When it starts trading, every scan, score, buy, sell, and rejection will stream here in real-time.
              </p>
            </div>
          </div>

          {/* Right panel — empty state */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Stats */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
              <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.accent, marginBottom: 12 }}>SESSION</p>
              {[
                { label: 'Balance', value: '—', color: C.dimmer },
                { label: 'Today PnL', value: '—', color: C.dimmer },
                { label: 'Win Rate', value: '—', color: C.dimmer },
                { label: 'Active Holds', value: '—', color: C.dimmer },
                { label: 'Total Scans', value: '—', color: C.dimmer },
                { label: 'Uptime', value: '—', color: C.dimmer },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                  <span style={{ fontFamily: C.mono, fontSize: 10, color: C.dim }}>{s.label}</span>
                  <span style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 700, color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
              <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.purple, marginBottom: 12 }}>ACTIVE SKILLS</p>
              <p style={{ fontFamily: C.mono, fontSize: 11, color: C.dim, lineHeight: 1.6 }}>No skills installed yet.</p>
            </div>

            {/* Holdings */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
              <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.amber, marginBottom: 12 }}>HOLDING</p>
              <p style={{ fontFamily: C.mono, fontSize: 11, color: C.dim }}>No positions.</p>
            </div>

            {/* Risk mode */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
              <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.amber, marginBottom: 10 }}>RISK MODE</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {['Cautious', 'Balanced', 'Degen'].map((m) => (
                  <div key={m} style={{
                    flex: 1, padding: '6px 0', borderRadius: 6, textAlign: 'center',
                    fontFamily: C.mono, fontSize: 10, fontWeight: 700,
                    background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`,
                    color: C.dimmer,
                  }}>{m}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent trades — empty */}
        <div style={{ marginTop: 24, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 700, letterSpacing: 1, color: C.white }}>RECENT TRADES</span>
          </div>
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <p style={{ fontFamily: C.mono, fontSize: 12, color: C.dim }}>No trades yet. Trades will appear here when the agent goes live.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
