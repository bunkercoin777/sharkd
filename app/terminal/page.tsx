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

        {/* ──── Advanced Skills / Architecture ──── */}
        <div style={{ marginTop: 48, marginBottom: 16 }}>
          <h2 style={{ fontFamily: C.sans, fontSize: 22, fontWeight: 800, color: C.white, letterSpacing: '-0.02em', marginBottom: 6 }}>Architecture Under the Hood</h2>
          <p style={{ fontFamily: C.mono, fontSize: 12, color: C.dim, maxWidth: 600, lineHeight: 1.7 }}>
            What I'm built to do — and what separates me from the noise.
          </p>
        </div>

        <div className="three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 40 }}>
          {[
            {
              title: 'Multi-Signal Scoring',
              tag: 'CORE',
              tagColor: C.accent,
              desc: 'Every token gets a composite score from liquidity depth, holder distribution, dev wallet exposure, bonding curve position, social velocity, and contract metadata. No single-metric gambling.',
              detail: '10-factor weighted scoring model',
            },
            {
              title: 'Graduated Token Routing',
              tag: 'EXECUTION',
              tagColor: C.green,
              desc: 'Detects whether a token trades on pump.fun bonding curve or PumpSwap DEX post-graduation. Routes through the correct AMM with optimal slippage. Most bots break at the migration boundary.',
              detail: 'Bonding curve + PumpSwap aware',
            },
            {
              title: 'Skill NFT Protocol',
              tag: 'MARKETPLACE',
              tagColor: C.purple,
              desc: 'Trading strategies are packaged as on-chain skill NFTs. Install a skill, the agent runs it live. Creators earn 10% of profits generated. Skills must pass 20+ mainnet trades and positive PnL before listing.',
              detail: 'Performance-gated marketplace',
            },
            {
              title: 'Adaptive Risk Engine',
              tag: 'RISK',
              tagColor: C.amber,
              desc: 'Position sizing adjusts dynamically based on conviction score, portfolio heat, recent drawdown, and market regime. High-conviction plays get 2-3x allocation. Bad streaks trigger automatic cooldown.',
              detail: 'Dynamic sizing + drawdown protection',
            },
            {
              title: 'Dev Lock Verification',
              tag: 'TRUST',
              tagColor: C.accent,
              desc: 'On-chain smart contracts that freeze dev token allocations with 7d / 30d / 90d lock tiers. Linear vesting — no cliff dumps. I verify lock status before trusting any project.',
              detail: 'Solana program, on-chain verification',
            },
            {
              title: 'Holder Reward Distribution',
              tag: 'YIELD',
              tagColor: C.green,
              desc: 'SOL rewards distributed to holders based on hold duration. Loyalty multipliers: 1d = 1x, 7d = 1.5x, 30d = 3x, 90d = 5x. The longer you hold, the bigger your cut.',
              detail: 'Duration-weighted SOL distribution',
            },
          ].map(s => (
            <div key={s.title} style={{
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20,
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontFamily: C.mono, fontSize: 8, fontWeight: 800, letterSpacing: 2,
                  padding: '3px 8px', borderRadius: 4,
                  background: `${s.tagColor}18`, color: s.tagColor,
                }}>{s.tag}</span>
              </div>
              <h3 style={{ fontFamily: C.sans, fontSize: 15, fontWeight: 700, color: C.white }}>{s.title}</h3>
              <p style={{ fontFamily: C.mono, fontSize: 11, color: C.text, lineHeight: 1.7, flex: 1 }}>{s.desc}</p>
              <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dim, borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>{s.detail}</span>
            </div>
          ))}
        </div>

        {/* ──── Competitive Comparison ──── */}
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontFamily: C.sans, fontSize: 22, fontWeight: 800, color: C.white, letterSpacing: '-0.02em', marginBottom: 6 }}>How I Compare</h2>
          <p style={{ fontFamily: C.mono, fontSize: 12, color: C.dim, maxWidth: 600, lineHeight: 1.7 }}>
            Most trading bots are just trigger scripts with a UI. I'm an adaptive agent with a brain.
          </p>
        </div>

        <div style={{
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
          overflow: 'hidden', marginBottom: 60,
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.borderLit}` }}>
                  {['Feature', 'SharkD', 'BONKbot', 'Trojan', 'Photon', 'BullX'].map((h, i) => (
                    <th key={h} style={{
                      fontFamily: C.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
                      color: i === 1 ? C.accent : C.dim,
                      padding: '14px 16px', textAlign: i === 0 ? 'left' : 'center',
                      background: i === 1 ? 'rgba(0,180,216,0.04)' : 'transparent',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Autonomous Trading', sharkd: true, bonk: false, trojan: false, photon: false, bullx: false, note: 'I decide. You collect.' },
                  { feature: 'Multi-Factor Scoring', sharkd: true, bonk: false, trojan: false, photon: true, bullx: true, note: 'Not just price alerts' },
                  { feature: 'Tradeable Skill NFTs', sharkd: true, bonk: false, trojan: false, photon: false, bullx: false, note: 'Install strategies on-chain' },
                  { feature: 'Dev Lock Verification', sharkd: true, bonk: false, trojan: false, photon: false, bullx: false, note: 'On-chain trust layer' },
                  { feature: 'Holder Rewards', sharkd: true, bonk: false, trojan: false, photon: false, bullx: false, note: 'SOL distribution by hold time' },
                  { feature: 'PumpSwap Migration Aware', sharkd: true, bonk: true, trojan: true, photon: true, bullx: true, note: 'Route through correct AMM' },
                  { feature: 'Adaptive Position Sizing', sharkd: true, bonk: false, trojan: false, photon: false, bullx: false, note: 'Not flat bets' },
                  { feature: 'Full Transparency Terminal', sharkd: true, bonk: false, trojan: false, photon: false, bullx: false, note: 'Every decision visible' },
                  { feature: 'Strategy Marketplace', sharkd: true, bonk: false, trojan: false, photon: false, bullx: false, note: 'Community-built skills' },
                  { feature: 'Telegram Bot Interface', sharkd: true, bonk: true, trojan: true, photon: false, bullx: false, note: 'Where traders live' },
                ].map((row, ri) => (
                  <tr key={row.feature} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ fontFamily: C.mono, fontSize: 11, color: C.white, padding: '12px 16px' }}>
                      {row.feature}
                      <span style={{ display: 'block', fontFamily: C.mono, fontSize: 9, color: C.dim, marginTop: 2 }}>{row.note}</span>
                    </td>
                    {[row.sharkd, row.bonk, row.trojan, row.photon, row.bullx].map((v, ci) => (
                      <td key={ci} style={{
                        textAlign: 'center', padding: '12px 16px',
                        background: ci === 0 ? 'rgba(0,180,216,0.04)' : 'transparent',
                      }}>
                        <span style={{
                          fontFamily: C.mono, fontSize: 13, fontWeight: 700,
                          color: v ? (ci === 0 ? C.accent : C.green) : C.dimmer,
                        }}>{v ? (ci === 0 ? '[*]' : '[+]') : '[ ]'}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}`, textAlign: 'center' }}>
            <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dim }}>
              [*] SharkD  |  [+] Supported  |  [ ] Not available  —  Comparison based on publicly documented features as of 2026
            </span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
