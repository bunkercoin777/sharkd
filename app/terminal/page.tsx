'use client';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { useState, useEffect, useRef } from 'react';

const C = {
  bg: '#020810', surface: '#041220', border: 'rgba(0,180,216,0.06)', borderLit: 'rgba(0,180,216,0.12)',
  accent: '#00b4d8', green: '#06d6a0', red: '#ef476f', amber: '#ffd166',
  purple: '#8338ec',
  white: '#e0eaf4', text: '#7b93b0', dim: '#3d5a80', dimmer: '#1e3354',
  mono: "'JetBrains Mono', 'SF Mono', monospace",
  sans: "'Inter', system-ui, sans-serif",
  glow: '0 0 40px rgba(0,180,216,0.08)',
};

interface AgentState {
  status: string; balance: number; startBalance: number; wins: number; losses: number; totalPnl: number; tradePnl: number;
  winRate: number; holdings: Array<{ mint: string; symbol: string; buySol: number; buyTime: number; isBonding: boolean; meta: string | null }>;
  cycle: number; exitedCount: number; riskMode: string; gradBuy: number; bondBuy: number; uptime: number; lastUpdate: number;
}
interface Thought { tag: string; message: string; type: string; created_at: string; }
interface Trade { type: string; symbol: string; amount_sol: number; score: number; meta: string; pnl_sol: number; pnl_pct: number; reason: string; result: string; tx: string; balance_after: number; created_at: string; }
interface Skill { name: string; description: string; data: Record<string, unknown>; created_at: string; }

function tagColor(tag: string) {
  if (['BUY', 'BOUGHT', 'TARGET'].includes(tag)) return C.accent;
  if (['SELL', 'TP', 'WIN'].includes(tag)) return C.green;
  if (['SL', 'LOSS', 'REJECT'].includes(tag)) return C.red;
  if (['STALE'].includes(tag)) return C.amber;
  if (['META', 'LEARN', 'SKILL'].includes(tag)) return C.purple;
  if (['HOLD'].includes(tag)) return '#3d8ecf';
  if (['BOOT', 'SCAN', 'SCORE'].includes(tag)) return C.dim;
  if (['ERROR', 'FATAL'].includes(tag)) return C.red;
  if (['HOLDER'].includes(tag)) return C.amber;
  if (['RECOVER', 'RESTART', 'MEMORY'].includes(tag)) return C.accent;
  return C.dim;
}

function timeAgo(ts: string | number) {
  const diff = (Date.now() - new Date(ts).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function formatUptime(ms: number) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function Terminal() {
  const [agent, setAgent] = useState<AgentState | null>(null);
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [online, setOnline] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    async function poll() {
      try {
        const res = await fetch('/api/terminal', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (!active) return;
        if (data.agent) { setAgent(data.agent); setOnline(data.agent.status === 'online' && (Date.now() - data.agent.lastUpdate) < 120000); }
        if (data.thoughts) setThoughts(data.thoughts);
        if (data.trades) setTrades(data.trades);
        if (data.skills) setSkills(data.skills);
      } catch {}
    }
    poll();
    const iv = setInterval(poll, 5000);
    return () => { active = false; clearInterval(iv); };
  }, []);

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [thoughts]);

  const isOnline = online && agent;

  // Dedupe skills by name
  const uniqueSkills = skills.reduce<Skill[]>((acc, s) => {
    if (!acc.find(x => x.name === s.name)) acc.push(s);
    return acc;
  }, []);

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Nav />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px clamp(16px, 3vw, 32px) 40px' }}>
        {/* Header + Stats Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: isOnline ? C.green : C.dimmer, boxShadow: isOnline ? `0 0 12px ${C.green}` : 'none' }} />
            <div>
              <h1 style={{ fontFamily: C.sans, fontSize: 24, fontWeight: 800, color: C.white, letterSpacing: '-0.02em', margin: 0 }}>Live Terminal</h1>
              <span style={{ fontFamily: C.mono, fontSize: 10, color: C.dim }}>SharkD Reference Agent {agent ? `| cycle #${agent.cycle}` : ''}</span>
            </div>
          </div>
          {agent && (
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[
                { label: 'BALANCE', value: `${agent.balance.toFixed(3)}`, unit: 'SOL', color: C.white },
                { label: 'PnL', value: `${agent.totalPnl >= 0 ? '+' : ''}${agent.totalPnl.toFixed(4)}`, unit: 'SOL', color: agent.totalPnl >= 0 ? C.green : C.red },
                { label: 'WIN RATE', value: `${agent.winRate}%`, unit: `${agent.wins}W/${agent.losses}L`, color: agent.winRate >= 50 ? C.green : C.amber },
                { label: 'UPTIME', value: formatUptime(agent.uptime), unit: '', color: C.text },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: C.mono, fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontFamily: C.mono, fontSize: 8, color: C.dim, letterSpacing: 1 }}>{s.label} {s.unit && <span style={{ color: C.dimmer }}>{s.unit}</span>}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Grid: Feed left, Holdings + Skills right */}
        <div className="terminal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 12, marginBottom: 16 }}>
          {/* Decision Feed — fixed height */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)', maxHeight: 520, minHeight: 300 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 14px', background: 'rgba(0,180,216,0.02)', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef476f' }} />
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ffd166' }} />
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#06d6a0' }} />
              <span style={{ fontFamily: C.mono, fontSize: 9, marginLeft: 6, color: C.dim }}>Decision Feed</span>
              <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: isOnline ? C.green : C.dimmer, animation: isOnline ? 'pulse 2s infinite' : 'none' }} />
                <span style={{ fontFamily: C.mono, fontSize: 8, color: isOnline ? C.green : C.dimmer }}>{isOnline ? 'STREAMING' : 'WAITING'}</span>
              </span>
            </div>
            <div ref={feedRef} style={{ flex: 1, padding: '4px 0', overflowY: 'auto' }}>
              {thoughts.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <p style={{ fontFamily: C.mono, fontSize: 12, color: C.dim }}>Terminal inactive. Waiting for agent to start.</p>
                </div>
              ) : (
                thoughts.map((t, i) => (
                  <div key={i} style={{ padding: '3px 12px', display: 'flex', gap: 6, alignItems: 'flex-start', borderBottom: `1px solid rgba(0,180,216,0.015)` }}>
                    <span style={{ fontFamily: C.mono, fontSize: 8, color: C.dimmer, minWidth: 46, flexShrink: 0, paddingTop: 2 }}>
                      {new Date(t.created_at).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                    </span>
                    <span style={{ fontFamily: C.mono, fontSize: 8, fontWeight: 800, minWidth: 50, flexShrink: 0, color: tagColor(t.tag), paddingTop: 2 }}>[{t.tag}]</span>
                    <span style={{ fontFamily: C.mono, fontSize: 10, color: C.text, lineHeight: 1.4, wordBreak: 'break-word' }}>{t.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right panel — compact stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: 'calc(100vh - 200px)', maxHeight: 520, minHeight: 300, overflowY: 'auto' }}>
            {/* Holdings */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
              <p style={{ fontFamily: C.mono, fontSize: 8, fontWeight: 700, letterSpacing: 2, color: C.amber, marginBottom: 8 }}>HOLDINGS</p>
              {agent?.holdings.length ? agent.holdings.map(h => (
                <div key={h.mint} style={{ padding: '5px 0', borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 700, color: C.white }}>${h.symbol}</span>
                    <span style={{ fontFamily: C.mono, fontSize: 10, color: C.accent }}>{h.buySol} SOL</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                    <span style={{ fontFamily: C.mono, fontSize: 8, color: C.dim }}>{h.isBonding ? 'BOND' : 'GRAD'}</span>
                    {h.meta && <span style={{ fontFamily: C.mono, fontSize: 8, color: C.purple }}>{h.meta}</span>}
                    <span style={{ fontFamily: C.mono, fontSize: 8, color: C.dimmer, marginLeft: 'auto' }}>{timeAgo(h.buyTime)}</span>
                  </div>
                </div>
              )) : <p style={{ fontFamily: C.mono, fontSize: 10, color: C.dim }}>No positions.</p>}
            </div>

            {/* Session */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
              <p style={{ fontFamily: C.mono, fontSize: 8, fontWeight: 700, letterSpacing: 2, color: C.accent, marginBottom: 8 }}>SESSION</p>
              {[
                { l: 'Start Balance', v: agent?.startBalance ? `${agent.startBalance.toFixed(3)} SOL` : '—' },
                { l: 'Active Holds', v: agent ? `${agent.holdings.length}` : '—' },
                { l: 'Tokens Scanned', v: agent ? `${agent.exitedCount}+` : '—' },
                { l: 'Risk Mode', v: agent?.riskMode || '—' },
              ].map(s => (
                <div key={s.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                  <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dim }}>{s.l}</span>
                  <span style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, color: C.text }}>{s.v}</span>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
              <p style={{ fontFamily: C.mono, fontSize: 8, fontWeight: 700, letterSpacing: 2, color: C.purple, marginBottom: 8 }}>SKILLS LEARNED</p>
              {uniqueSkills.length > 0 ? uniqueSkills.slice(0, 6).map((s, i) => (
                <div key={i} style={{ padding: '4px 0', borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, color: C.white }}>{s.name}</div>
                  <div style={{ fontFamily: C.mono, fontSize: 8, color: C.dim, marginTop: 1, lineHeight: 1.4 }}>{(s.description || '').slice(0, 80)}{(s.description || '').length > 80 ? '...' : ''}</div>
                </div>
              )) : <p style={{ fontFamily: C.mono, fontSize: 10, color: C.dim }}>Skills emerge from trade patterns.</p>}
            </div>
          </div>
        </div>

        {/* Recent Trades — compact */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '10px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1, color: C.white }}>RECENT TRADES</span>
            {trades.length > 0 && <span style={{ fontFamily: C.mono, fontSize: 8, color: C.dim }}>{trades.length} trades</span>}
          </div>
          {trades.length > 0 ? (
            <div style={{ overflowX: 'auto', maxHeight: 220 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.borderLit}`, position: 'sticky', top: 0, background: C.surface }}>
                    {['Time', 'Type', 'Token', 'Size', 'PnL', 'Result', 'Reason'].map(h => (
                      <th key={h} style={{ fontFamily: C.mono, fontSize: 8, fontWeight: 700, letterSpacing: 1, color: C.dim, padding: '8px 10px', textAlign: 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {trades.map((t, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ fontFamily: C.mono, fontSize: 9, color: C.dimmer, padding: '6px 10px', whiteSpace: 'nowrap' }}>{timeAgo(t.created_at)}</td>
                      <td style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, color: t.type === 'buy' ? C.accent : (t.result === 'win' ? C.green : C.red), padding: '6px 10px' }}>{t.type.toUpperCase()}</td>
                      <td style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, color: C.white, padding: '6px 10px' }}>${t.symbol || '???'}</td>
                      <td style={{ fontFamily: C.mono, fontSize: 9, color: C.text, padding: '6px 10px' }}>{t.amount_sol?.toFixed(3)}</td>
                      <td style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, color: t.pnl_sol != null ? (t.pnl_sol >= 0 ? C.green : C.red) : C.dimmer, padding: '6px 10px' }}>
                        {t.pnl_sol != null ? `${t.pnl_sol >= 0 ? '+' : ''}${t.pnl_sol.toFixed(4)}` : '—'}
                        {t.pnl_pct != null && <span style={{ fontSize: 8, color: C.dim }}> ({t.pnl_pct >= 0 ? '+' : ''}{t.pnl_pct.toFixed(1)}%)</span>}
                      </td>
                      <td style={{ padding: '6px 10px' }}>
                        {t.result && <span style={{ fontFamily: C.mono, fontSize: 8, fontWeight: 700, padding: '2px 5px', borderRadius: 3, background: t.result === 'win' ? 'rgba(6,214,160,0.15)' : 'rgba(239,71,111,0.15)', color: t.result === 'win' ? C.green : C.red }}>{t.result.toUpperCase()}</span>}
                      </td>
                      <td style={{ fontFamily: C.mono, fontSize: 8, color: C.dim, padding: '6px 10px' }}>{t.reason || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '30px 16px', textAlign: 'center' }}>
              <p style={{ fontFamily: C.mono, fontSize: 11, color: C.dim }}>No trades yet.</p>
            </div>
          )}
        </div>

        {/* Architecture — 2x3 compact grid */}
        <div style={{ marginTop: 32, marginBottom: 12 }}>
          <h2 style={{ fontFamily: C.sans, fontSize: 20, fontWeight: 800, color: C.white, letterSpacing: '-0.02em', marginBottom: 4 }}>Architecture</h2>
          <p style={{ fontFamily: C.mono, fontSize: 11, color: C.dim }}>What separates SharkD from static trading bots.</p>
        </div>
        <div className="three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 32 }}>
          {[
            { title: 'Multi-Signal Scoring', tag: 'CORE', tagColor: C.accent, desc: 'Composite score from liquidity, holder distribution, dev exposure, bonding curve position, social velocity, and metadata.' },
            { title: 'Graduated Token Routing', tag: 'EXECUTION', tagColor: C.green, desc: 'Detects bonding curve vs PumpSwap post-graduation. Routes through correct AMM with optimal slippage.' },
            { title: 'Skill NFT Protocol', tag: 'MARKETPLACE', tagColor: C.purple, desc: 'Trading strategies as on-chain NFTs. Creators earn 10% of profits. 20+ mainnet trades required before listing.' },
            { title: 'Adaptive Risk Engine', tag: 'RISK', tagColor: C.amber, desc: 'Position sizing adjusts by conviction score, mcap tier, portfolio heat, and recent drawdown.' },
            { title: 'Dev Lock Verification', tag: 'TRUST', tagColor: C.accent, desc: 'Smart contracts freeze dev allocations. 7d/30d/90d lock tiers with linear vesting.' },
            { title: 'Holder Rewards', tag: 'YIELD', tagColor: C.green, desc: 'SOL distributed by hold duration. 1d=1x, 7d=1.5x, 30d=3x, 90d=5x multiplier.' },
          ].map(s => (
            <div key={s.title} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
              <span style={{ fontFamily: C.mono, fontSize: 7, fontWeight: 800, letterSpacing: 2, padding: '2px 6px', borderRadius: 3, background: `${s.tagColor}18`, color: s.tagColor }}>{s.tag}</span>
              <h3 style={{ fontFamily: C.sans, fontSize: 13, fontWeight: 700, color: C.white, margin: '8px 0 4px' }}>{s.title}</h3>
              <p style={{ fontFamily: C.mono, fontSize: 10, color: C.text, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Comparison — compact */}
        <div style={{ marginBottom: 12 }}>
          <h2 style={{ fontFamily: C.sans, fontSize: 20, fontWeight: 800, color: C.white, letterSpacing: '-0.02em', marginBottom: 4 }}>How I Compare</h2>
        </div>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', marginBottom: 48 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.borderLit}` }}>
                  {['Feature', 'SharkD', 'BONKbot', 'Trojan', 'Photon', 'BullX'].map((h, i) => (
                    <th key={h} style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 1, color: i === 1 ? C.accent : C.dim, padding: '10px 12px', textAlign: i === 0 ? 'left' : 'center', background: i === 1 ? 'rgba(0,180,216,0.04)' : 'transparent' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { f: 'Autonomous Trading', s: true, b: false, t: false, p: false, x: false },
                  { f: 'Tradeable Skill NFTs', s: true, b: false, t: false, p: false, x: false },
                  { f: 'Dev Lock Verification', s: true, b: false, t: false, p: false, x: false },
                  { f: 'Holder Rewards', s: true, b: false, t: false, p: false, x: false },
                  { f: 'Adaptive Position Sizing', s: true, b: false, t: false, p: false, x: false },
                  { f: 'Full Transparency Terminal', s: true, b: false, t: false, p: false, x: false },
                  { f: 'PumpSwap Aware', s: true, b: true, t: true, p: true, x: true },
                  { f: 'Multi-Factor Scoring', s: true, b: false, t: false, p: true, x: true },
                ].map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ fontFamily: C.mono, fontSize: 10, color: C.white, padding: '8px 12px' }}>{row.f}</td>
                    {[row.s, row.b, row.t, row.p, row.x].map((v, ci) => (
                      <td key={ci} style={{ textAlign: 'center', padding: '8px 12px', background: ci === 0 ? 'rgba(0,180,216,0.04)' : 'transparent' }}>
                        <span style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 700, color: v ? (ci === 0 ? C.accent : C.green) : C.dimmer }}>
                          {v ? (ci === 0 ? '[ \u2713 ]' : '[ \u2713 ]') : '[ \u2014 ]'}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
