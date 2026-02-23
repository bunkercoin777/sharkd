const SKILLS = [
  { name: 'Narrative Detection', tag: 'SCANNER', tagColor: '#00a8ff', price: '0.5 SOL', installs: 0, winRate: '—', desc: 'Scans 400+ tokens for trending metas. Finds keywords in 3+ tokens, boosts scores for narrative rides. First to spot the wave.', proven: true },
  { name: 'Holder Analysis', tag: 'FILTER', tagColor: '#ff3860', price: '0.3 SOL', installs: 0, winRate: '—', desc: 'Checks top wallet concentration. Auto-rejects >50% single wallet. Rug detection before you buy.', proven: true },
  { name: 'Momentum Tracker', tag: 'ANALYSIS', tagColor: '#00e676', price: '0.4 SOL', installs: 0, winRate: '—', desc: 'Price history tracking with recovery/dumping/flat detection. Dynamic hold times based on momentum.', proven: true },
  { name: 'Aggressive Sell Engine', tag: 'EXECUTION', tagColor: '#ffb800', price: '0.6 SOL', installs: 0, winRate: '—', desc: '3-attempt retry, fresh quotes each try, escalating slippage. Never lose profit to a failed TX.', proven: true },
  { name: 'Dual Market Scanner', tag: 'SCANNER', tagColor: '#00a8ff', price: '0.5 SOL', installs: 0, winRate: '—', desc: 'Simultaneous pump.fun bonding curve + PumpSwap graduated token scanning with optimized params.', proven: true },
  { name: 'Adaptive Sizing', tag: 'RISK', tagColor: '#00e5ff', price: '0.3 SOL', installs: 0, winRate: '—', desc: 'Scales position size with win rate. 0.05 SOL cautious → 1.00 SOL degen. Risk-adjusted growth.', proven: true },
  { name: 'Smart Money Tracker', tag: 'ALPHA', tagColor: '#a855f7', price: '0.8 SOL', installs: 0, winRate: '—', desc: 'Tracks top-performing wallets. Detects when smart money enters a token. Follow the whales.', proven: true },
];

export default function Marketplace() {
  return (
    <div style={{ background: '#050508', minHeight: '100vh' }}>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 64,
        background: 'rgba(5,5,8,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #1a1a2e', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', zIndex: 100
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <span style={{ fontSize: 28 }}>🦈</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 20, color: '#00a8ff', letterSpacing: 2 }}>SHARKD</span>
        </a>
        <div style={{ display: 'flex', gap: 32 }}>
          <a href="/" style={{ color: '#6b7394', textDecoration: 'none', fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>Home</a>
          <a href="/marketplace" style={{ color: '#00a8ff', textDecoration: 'none', fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>Marketplace</a>
          <a href="/docs" style={{ color: '#6b7394', textDecoration: 'none', fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>Docs</a>
        </div>
      </nav>

      <section style={{ padding: '120px 32px 40px', textAlign: 'center' }}>
        <h1 style={{
          fontSize: 48, fontWeight: 900, marginBottom: 16,
          background: 'linear-gradient(135deg, #e0e8ff, #00a8ff)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
        }}>Skill Marketplace</h1>
        <p style={{ color: '#6b7394', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
          Battle-tested trading skills. Install them, your shark gets smarter instantly.
        </p>
      </section>

      {/* Filters */}
      <section style={{ padding: '0 32px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['ALL', 'SCANNER', 'FILTER', 'ANALYSIS', 'EXECUTION', 'RISK', 'ALPHA'].map(f => (
            <button key={f} style={{
              padding: '8px 20px', background: f === 'ALL' ? '#0a2a4a' : '#0a0a12',
              border: `1px solid ${f === 'ALL' ? '#00a8ff' : '#1a1a2e'}`,
              borderRadius: 6, color: f === 'ALL' ? '#00a8ff' : '#6b7394',
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
              cursor: 'pointer', letterSpacing: 1, fontWeight: 600
            }}>{f}</button>
          ))}
        </div>
      </section>

      {/* Skills grid */}
      <section style={{ padding: '0 32px 120px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {SKILLS.map(skill => (
            <div key={skill.name} style={{
              background: '#0a0a12', border: '1px solid #1a1a2e', borderRadius: 12,
              padding: 28, display: 'flex', flexDirection: 'column', gap: 16,
              transition: 'border-color 0.3s'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                  color: skill.tagColor, padding: '4px 10px',
                  background: `${skill.tagColor}15`, borderRadius: 4,
                  fontWeight: 600, letterSpacing: 1
                }}>{skill.tag}</span>
                {skill.proven && (
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                    color: '#00e676', padding: '3px 8px',
                    background: 'rgba(0,230,118,0.08)', borderRadius: 4,
                    fontWeight: 600
                  }}>PROVEN</span>
                )}
              </div>

              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#e0e8ff' }}>{skill.name}</h3>
              <p style={{ color: '#6b7394', fontSize: 14, lineHeight: 1.6, flex: 1 }}>{skill.desc}</p>

              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: 16, borderTop: '1px solid #1a1a2e'
              }}>
                <div style={{ display: 'flex', gap: 20 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#6b7394', fontFamily: "'JetBrains Mono', monospace" }}>INSTALLS</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#e0e8ff' }}>{skill.installs}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#6b7394', fontFamily: "'JetBrains Mono', monospace" }}>WIN RATE</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#00e676' }}>{skill.winRate}</div>
                  </div>
                </div>
                <button style={{
                  padding: '10px 24px', background: '#00a8ff', color: '#050508',
                  border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 14,
                  cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace"
                }}>
                  {skill.price}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Submit skill CTA */}
        <div style={{
          marginTop: 48, padding: 40, background: '#0a0a12',
          border: '1px dashed #1a1a2e', borderRadius: 12, textAlign: 'center'
        }}>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: '#e0e8ff', marginBottom: 12 }}>
            Build & Sell Your Own Skills
          </h3>
          <p style={{ color: '#6b7394', fontSize: 15, marginBottom: 24 }}>
            Write a trading strategy, test it against real data, mint it as an NFT.
            Earn SOL every time an agent profits from your skill.
          </p>
          <a href="/docs" style={{
            padding: '12px 32px', background: 'transparent',
            border: '1px solid #1a1a2e', color: '#00a8ff',
            borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace"
          }}>
            Read the SDK Docs
          </a>
        </div>
      </section>

      <footer style={{
        padding: '48px 32px', borderTop: '1px solid #1a1a2e',
        textAlign: 'center', color: '#6b7394', fontSize: 13
      }}>
        <p>SharkD &copy; 2026. Built by sharks, for sharks.</p>
      </footer>
    </div>
  );
}
