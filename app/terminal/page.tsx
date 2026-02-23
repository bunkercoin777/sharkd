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

const FEED = [
  { time: '13:42:02', color: '#3d5a80', text: '[SCAN] Cycle #1,847 — 412 tokens scanned across bonding + graduated' },
  { time: '13:42:03', color: '#3d5a80', text: '[SKILL] narrative-detection v2.4 found "ocean" meta — 17 tokens matching' },
  { time: '13:42:04', color: '#00b4d8', text: '[SCORE] $DEEPOCEAN — 8.2/10 | meta: +2 | holders: clean (top1: 8.2%) | age: 4m' },
  { time: '13:42:04', color: '#3d5a80', text: '[SKILL] holder-analysis v1.8 — PASSED (top10: 31%, no single wallet >15%)' },
  { time: '13:42:04', color: '#3d5a80', text: '[SKILL] momentum-tracker v3.1 — trend: RISING (12 of last 15 checks up)' },
  { time: '13:42:05', color: '#06d6a0', text: '[BUY] $DEEPOCEAN — 0.25 SOL @ $0.000041 | mode: Balanced | sizing: tier 3' },
  { time: '13:42:05', color: '#3d5a80', text: '[TX] Confirmed in 1.2s — sig: 4xK7m...9wQ2' },
  { time: '13:44:31', color: '#3d5a80', text: '[HOLD] $DEEPOCEAN — +6.2% | hold: 2m26s | momentum: still rising' },
  { time: '13:46:12', color: '#3d5a80', text: '[HOLD] $DEEPOCEAN — +14.1% | hold: 4m07s | approaching TP threshold' },
  { time: '13:47:55', color: '#06d6a0', text: '[SELL] $DEEPOCEAN — +18.7% | +0.047 SOL | hold: 5m50s | 1st attempt success' },
  { time: '13:47:56', color: '#8338ec', text: '[UPDATE] narrative-detection v2.4 → v2.4.1 — meta threshold: 12→11 (success rate 78%)' },
  { time: '13:47:56', color: '#8338ec', text: '[UPDATE] momentum-tracker v3.1 → v3.1.1 — hold window adjusted: 5m→6m for graduated' },
  { time: '13:47:56', color: '#8338ec', text: '[UPDATE] adaptive-sizing v1.4 — tier 3 confirmed (win rate: 68%)' },
  { time: '13:48:02', color: '#3d5a80', text: '[SCAN] Cycle #1,848 — 409 tokens scanned' },
  { time: '13:48:03', color: '#ef476f', text: '[REJECT] $RUGFISH — holder-analysis: top1 wallet holds 62.4% (threshold: 50%)' },
  { time: '13:48:03', color: '#ef476f', text: '[REJECT] $FAKEMOON — narrative-detection: no meta match, score 2.1/10' },
  { time: '13:48:04', color: '#00b4d8', text: '[SCORE] $ABYSSAL — 7.4/10 | fresh mint 3m | holders: clean | meta: "abyss" (8 tokens)' },
  { time: '13:48:05', color: '#3d5a80', text: '[SKILL] momentum-tracker v3.1.1 — insufficient data (3 price points, need 8)' },
  { time: '13:48:05', color: '#ffd166', text: '[WAIT] $ABYSSAL — holding for more momentum data before entry' },
  { time: '13:49:30', color: '#3d5a80', text: '[HOLD] $TIDEWRECK — +3.8% | hold: 12m14s | momentum: flat — monitoring' },
  { time: '13:50:02', color: '#3d5a80', text: '[SCAN] Cycle #1,849 — 415 tokens scanned' },
  { time: '13:50:04', color: '#00b4d8', text: '[SCORE] $ABYSSAL — 7.8/10 | momentum now confirmed rising | 10 checks up' },
  { time: '13:50:05', color: '#06d6a0', text: '[BUY] $ABYSSAL — 0.20 SOL @ $0.000028 | mode: Balanced | sizing: tier 2' },
];

const RECENT_TRADES = [
  { token: '$DEEPOCEAN', entry: '0.25 SOL', pnl: '+18.7%', solPnl: '+0.047', hold: '5m50s', result: 'win' },
  { token: '$CORALreef', entry: '0.30 SOL', pnl: '+22.1%', solPnl: '+0.066', hold: '8m12s', result: 'win' },
  { token: '$SUNKENSHIP', entry: '0.15 SOL', pnl: '-7.2%', solPnl: '-0.011', hold: '3m44s', result: 'loss' },
  { token: '$PLANKTON', entry: '0.20 SOL', pnl: '+11.4%', solPnl: '+0.023', hold: '6m02s', result: 'win' },
  { token: '$KELP', entry: '0.25 SOL', pnl: '+8.9%', solPnl: '+0.022', hold: '4m18s', result: 'win' },
  { token: '$BARNACLE', entry: '0.10 SOL', pnl: '-4.8%', solPnl: '-0.005', hold: '2m55s', result: 'loss' },
];

export default function Terminal() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Nav />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '100px clamp(16px, 3vw, 32px) 60px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.green, boxShadow: `0 0 10px ${C.green}`, animation: 'pulse-slow 2s ease-in-out infinite' }} />
              <span style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 700, color: C.green }}>LIVE</span>
              <span style={{ fontFamily: C.mono, fontSize: 11, color: C.dimmer }}>|</span>
              <span style={{ fontFamily: C.mono, fontSize: 11, color: C.dim }}>SHARKD Reference Agent</span>
            </div>
            <h1 style={{ fontFamily: C.sans, fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: '-0.02em' }}>Live Terminal</h1>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ padding: '6px 14px', borderRadius: 6, background: 'rgba(6,214,160,0.06)', border: '1px solid rgba(6,214,160,0.12)', fontFamily: C.mono, fontSize: 11, fontWeight: 700, color: C.green }}>9.87 SOL</div>
            <div style={{ padding: '6px 14px', borderRadius: 6, background: 'rgba(0,180,216,0.06)', border: '1px solid rgba(0,180,216,0.12)', fontFamily: C.mono, fontSize: 11, fontWeight: 700, color: C.accent }}>Cycle #1,849</div>
          </div>
        </div>

        <div className="terminal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
          {/* Main feed */}
          <div style={{
            background: C.surface, border: `1px solid ${C.borderLit}`, borderRadius: 14,
            overflow: 'hidden', boxShadow: C.glow,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 16px', background: 'rgba(0,180,216,0.02)', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ef476f' }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ffd166' }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#06d6a0' }} />
              <span style={{ fontFamily: C.mono, fontSize: 10, marginLeft: 8, color: C.dim }}>Decision Feed — All skill activity logged</span>
              <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, boxShadow: `0 0 8px ${C.green}`, animation: 'pulse-slow 2s ease-in-out infinite' }} />
                <span style={{ fontFamily: C.mono, fontSize: 9, color: C.green }}>STREAMING</span>
              </span>
            </div>
            <div style={{ padding: '14px 18px', fontFamily: C.mono, fontSize: 11, lineHeight: 1.85, maxHeight: 600, overflowY: 'auto' }}>
              {FEED.map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, animation: `fade-in 0.3s ease-out ${0.05 * i}s both` }}>
                  <span style={{ color: C.dimmer, flexShrink: 0, fontSize: 10 }}>{line.time}</span>
                  <span style={{ color: line.color }}>{line.text}</span>
                </div>
              ))}
              <div style={{ marginTop: 8, color: C.accent }}>
                <span style={{ animation: 'blink 1s step-end infinite' }}>▊</span>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Stats */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
              <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.accent, marginBottom: 12 }}>SESSION</p>
              {[
                { label: 'Balance', value: '9.87 SOL', color: C.white },
                { label: 'Today PnL', value: '+0.42 SOL', color: C.green },
                { label: 'Win Rate', value: '68% (19W/9L)', color: C.green },
                { label: 'Active Holds', value: '2 tokens', color: C.accent },
                { label: 'Total Scans', value: '1,849 cycles', color: C.text },
                { label: 'Uptime', value: '14h 22m', color: C.text },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                  <span style={{ fontFamily: C.mono, fontSize: 10, color: C.dim }}>{s.label}</span>
                  <span style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 700, color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>

            {/* Active skills */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
              <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.purple, marginBottom: 12 }}>ACTIVE SKILLS</p>
              {[
                { name: 'Narrative Detection', ver: 'v2.4.1', fires: 847 },
                { name: 'Holder Analysis', ver: 'v1.8', fires: 1849 },
                { name: 'Momentum Tracker', ver: 'v3.1.1', fires: 1204 },
                { name: 'Aggressive Sell', ver: 'v2.0', fires: 28 },
                { name: 'Dual Market', ver: 'v1.6', fires: 1849 },
                { name: 'Adaptive Sizing', ver: 'v1.4', fires: 28 },
              ].map(s => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0' }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: C.purple, animation: 'pulse-slow 2s ease-in-out infinite' }} />
                  <span style={{ fontFamily: C.mono, fontSize: 10, color: C.text, flex: 1 }}>{s.name}</span>
                  <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dimmer }}>{s.fires}x</span>
                </div>
              ))}
            </div>

            {/* Current holds */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
              <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.amber, marginBottom: 12 }}>HOLDING</p>
              {[
                { token: '$ABYSSAL', entry: '0.20 SOL', pnl: '+2.1%', hold: '0m30s' },
                { token: '$TIDEWRECK', entry: '0.15 SOL', pnl: '+3.8%', hold: '12m44s' },
              ].map(h => (
                <div key={h.token} style={{ padding: '6px 0', borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 700, color: C.white }}>{h.token}</span>
                    <span style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 700, color: C.green }}>{h.pnl}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dim }}>{h.entry}</span>
                    <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dim }}>{h.hold}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Risk mode */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
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
          </div>
        </div>

        {/* Recent trades table */}
        <div style={{ marginTop: 24, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 700, letterSpacing: 1, color: C.white }}>RECENT TRADES</span>
            <span style={{ fontFamily: C.mono, fontSize: 10, color: C.dim }}>Last 6 trades</span>
          </div>
          <div style={{ padding: '0 20px' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 12, padding: '12px 0', borderBottom: `1px solid ${C.border}`, fontFamily: C.mono, fontSize: 10, color: C.dimmer }}>
              <span>TOKEN</span><span>ENTRY</span><span>PnL</span><span>SOL</span><span>HOLD TIME</span>
            </div>
            {RECENT_TRADES.map(t => (
              <div key={t.token} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 12, padding: '10px 0', borderBottom: `1px solid ${C.border}`, fontFamily: C.mono, fontSize: 11 }}>
                <span style={{ color: C.white, fontWeight: 600 }}>{t.token}</span>
                <span style={{ color: C.text }}>{t.entry}</span>
                <span style={{ color: t.result === 'win' ? C.green : C.red, fontWeight: 700 }}>{t.pnl}</span>
                <span style={{ color: t.result === 'win' ? C.green : C.red }}>{t.solPnl}</span>
                <span style={{ color: C.dim }}>{t.hold}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
