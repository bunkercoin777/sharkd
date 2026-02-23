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
interface LeaderboardEntry { symbol: string; pnl_sol: number; pnl_pct: number; amount_sol: number; result: string; reason: string; created_at: string; }

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
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
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
        if (data.leaderboard) setLeaderboard(data.leaderboard);
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

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Nav />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '100px clamp(16px, 3vw, 32px) 60px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: isOnline ? C.green : C.dimmer, boxShadow: isOnline ? `0 0 8px ${C.green}` : 'none' }} />
              <span style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 700, color: isOnline ? C.green : C.dimmer }}>{isOnline ? 'LIVE' : 'OFFLINE'}</span>
              <span style={{ fontFamily: C.mono, fontSize: 11, color: C.dimmer }}>|</span>
              <span style={{ fontFamily: C.mono, fontSize: 11, color: C.dim }}>SHARKD Reference Agent</span>
              {agent && <span style={{ fontFamily: C.mono, fontSize: 10, color: C.dimmer }}>cycle #{agent.cycle}</span>}
            </div>
            <h1 style={{ fontFamily: C.sans, fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: '-0.02em' }}>Live Terminal</h1>
          </div>
          {agent && (
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: C.mono, fontSize: 18, fontWeight: 800, color: C.white }}>{agent.balance.toFixed(3)}</div>
                <div style={{ fontFamily: C.mono, fontSize: 9, color: C.dim }}>SOL</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: C.mono, fontSize: 18, fontWeight: 800, color: agent.totalPnl >= 0 ? C.green : C.red }}>{agent.totalPnl >= 0 ? '+' : ''}{agent.totalPnl.toFixed(4)}</div>
                <div style={{ fontFamily: C.mono, fontSize: 9, color: C.dim }}>PnL (SOL)</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: C.mono, fontSize: 18, fontWeight: 800, color: agent.winRate >= 50 ? C.green : agent.winRate > 0 ? C.amber : C.dim }}>{agent.winRate}%</div>
                <div style={{ fontFamily: C.mono, fontSize: 9, color: C.dim }}>{agent.wins}W/{agent.losses}L</div>
              </div>
            </div>
          )}
        </div>

        <div className="terminal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
          {/* Decision Feed */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', boxShadow: C.glow }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 16px', background: 'rgba(0,180,216,0.02)', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ef476f' }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ffd166' }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#06d6a0' }} />
              <span style={{ fontFamily: C.mono, fontSize: 10, marginLeft: 8, color: C.dim }}>Decision Feed</span>
              <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: isOnline ? C.green : C.dimmer, animation: isOnline ? 'pulse 2s infinite' : 'none' }} />
                <span style={{ fontFamily: C.mono, fontSize: 9, color: isOnline ? C.green : C.dimmer }}>{isOnline ? 'STREAMING' : 'WAITING'}</span>
              </span>
            </div>
            <div ref={feedRef} style={{ padding: '8px 0', minHeight: 400, maxHeight: 600, overflowY: 'auto' }}>
              {thoughts.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/shark.jpg" alt="" style={{ width: 48, height: 48, borderRadius: 14, objectFit: 'cover', marginBottom: 20, opacity: 0.5 }} />
                  <p style={{ fontFamily: C.mono, fontSize: 13, color: C.dim, marginBottom: 8 }}>Terminal inactive.</p>
                  <p style={{ fontFamily: C.mono, fontSize: 12, color: C.dimmer, maxWidth: 360, lineHeight: 1.6 }}>
                    The reference agent is not live yet. When it starts trading, every scan, score, buy, sell, and rejection will stream here in real-time.
                  </p>
                </div>
              ) : (
                thoughts.map((t, i) => (
                  <div key={i} style={{ padding: '4px 16px', display: 'flex', gap: 8, alignItems: 'flex-start', borderBottom: `1px solid rgba(0,180,216,0.02)` }}>
                    <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dimmer, minWidth: 52, flexShrink: 0, paddingTop: 2 }}>
                      {new Date(t.created_at).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                    </span>
                    <span style={{
                      fontFamily: C.mono, fontSize: 9, fontWeight: 800, minWidth: 52, flexShrink: 0,
                      color: tagColor(t.tag), paddingTop: 2,
                    }}>[{t.tag}]</span>
                    <span style={{ fontFamily: C.mono, fontSize: 11, color: C.text, lineHeight: 1.5, wordBreak: 'break-word' }}>{t.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Session Stats */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
              <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.accent, marginBottom: 12 }}>SESSION</p>
              {[
                { label: 'Balance', value: agent ? `${agent.balance.toFixed(3)} SOL` : '—', color: agent ? C.white : C.dimmer },
                { label: 'Started', value: agent?.startBalance ? `${agent.startBalance.toFixed(3)} SOL` : '—', color: C.dimmer },
                { label: 'Real PnL', value: agent ? `${agent.totalPnl >= 0 ? '+' : ''}${agent.totalPnl.toFixed(4)} SOL` : '—', color: agent ? (agent.totalPnl >= 0 ? C.green : C.red) : C.dimmer },
                { label: 'Win Rate', value: agent ? `${agent.winRate}% (${agent.wins}W/${agent.losses}L)` : '—', color: agent ? (agent.winRate >= 50 ? C.green : C.amber) : C.dimmer },
                { label: 'Active Holds', value: agent ? `${agent.holdings.length}` : '—', color: agent?.holdings.length ? C.accent : C.dimmer },
                { label: 'Tokens Scanned', value: agent ? `${agent.exitedCount}+` : '—', color: agent ? C.text : C.dimmer },
                { label: 'Uptime', value: agent ? formatUptime(agent.uptime) : '—', color: agent ? C.text : C.dimmer },
                { label: 'Position Size', value: agent ? `G: ${agent.gradBuy} / B: ${agent.bondBuy} SOL` : '—', color: agent ? C.dim : C.dimmer },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                  <span style={{ fontFamily: C.mono, fontSize: 10, color: C.dim }}>{s.label}</span>
                  <span style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 700, color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>

            {/* Holdings */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
              <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.amber, marginBottom: 12 }}>HOLDING</p>
              {agent?.holdings.length ? agent.holdings.map(h => (
                <div key={h.mint} style={{ padding: '6px 0', borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 700, color: C.white }}>${h.symbol}</span>
                    <span style={{ fontFamily: C.mono, fontSize: 10, color: C.accent }}>{h.buySol} SOL</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
                    <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dim }}>{h.isBonding ? 'BONDING' : 'GRADUATED'}</span>
                    {h.meta && <span style={{ fontFamily: C.mono, fontSize: 9, color: C.purple }}>{h.meta}</span>}
                    <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dimmer }}>{timeAgo(h.buyTime)}</span>
                  </div>
                </div>
              )) : (
                <p style={{ fontFamily: C.mono, fontSize: 11, color: C.dim }}>No positions.</p>
              )}
            </div>

            {/* Skills Learned */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
              <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.purple, marginBottom: 12 }}>SKILLS LEARNED</p>
              {skills.length > 0 ? skills.map((s, i) => (
                <div key={i} style={{ padding: '6px 0', borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 700, color: C.white }}>{s.name}</div>
                  <div style={{ fontFamily: C.mono, fontSize: 9, color: C.dim, marginTop: 2 }}>{s.description || JSON.stringify(s.data).slice(0, 80)}</div>
                  <div style={{ fontFamily: C.mono, fontSize: 8, color: C.dimmer, marginTop: 2 }}>{timeAgo(s.created_at)}</div>
                </div>
              )) : (
                <p style={{ fontFamily: C.mono, fontSize: 11, color: C.dim, lineHeight: 1.6 }}>No skills yet. Skills emerge from patterns in live trading data.</p>
              )}
            </div>

            {/* Risk Mode */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
              <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.amber, marginBottom: 10 }}>RISK MODE</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {['Cautious', 'Balanced', 'Degen'].map((m) => (
                  <div key={m} style={{
                    flex: 1, padding: '6px 0', borderRadius: 6, textAlign: 'center',
                    fontFamily: C.mono, fontSize: 10, fontWeight: 700,
                    background: agent?.riskMode === m.toLowerCase() ? 'rgba(0,180,216,0.1)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${agent?.riskMode === m.toLowerCase() ? C.accent : C.border}`,
                    color: agent?.riskMode === m.toLowerCase() ? C.accent : C.dimmer,
                  }}>{m}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Trades Table */}
        <div style={{ marginTop: 24, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 700, letterSpacing: 1, color: C.white }}>RECENT TRADES</span>
            {trades.length > 0 && <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dim }}>{trades.length} trades</span>}
          </div>
          {trades.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.borderLit}` }}>
                    {['Time', 'Type', 'Token', 'Amount', 'Score', 'PnL', 'Result', 'Reason'].map(h => (
                      <th key={h} style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 1, color: C.dim, padding: '10px 12px', textAlign: 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {trades.map((t, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ fontFamily: C.mono, fontSize: 10, color: C.dimmer, padding: '8px 12px', whiteSpace: 'nowrap' }}>{timeAgo(t.created_at)}</td>
                      <td style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, color: t.type === 'buy' ? C.accent : (t.result === 'win' ? C.green : C.red), padding: '8px 12px' }}>{t.type.toUpperCase()}</td>
                      <td style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 700, color: C.white, padding: '8px 12px' }}>${t.symbol || '???'}</td>
                      <td style={{ fontFamily: C.mono, fontSize: 10, color: C.text, padding: '8px 12px' }}>{t.amount_sol?.toFixed(3)} SOL</td>
                      <td style={{ fontFamily: C.mono, fontSize: 10, color: t.score >= 8 ? C.green : t.score >= 5 ? C.amber : C.dim, padding: '8px 12px' }}>{t.score || '—'}</td>
                      <td style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, color: t.pnl_sol != null ? (t.pnl_sol >= 0 ? C.green : C.red) : C.dimmer, padding: '8px 12px' }}>
                        {t.pnl_sol != null ? `${t.pnl_sol >= 0 ? '+' : ''}${t.pnl_sol.toFixed(4)}` : '—'}
                        {t.pnl_pct != null && <span style={{ fontSize: 9, color: C.dim }}> ({t.pnl_pct >= 0 ? '+' : ''}{t.pnl_pct.toFixed(1)}%)</span>}
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        {t.result && <span style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: t.result === 'win' ? 'rgba(6,214,160,0.15)' : 'rgba(239,71,111,0.15)', color: t.result === 'win' ? C.green : C.red }}>{t.result.toUpperCase()}</span>}
                      </td>
                      <td style={{ fontFamily: C.mono, fontSize: 9, color: C.dim, padding: '8px 12px' }}>{t.reason || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <p style={{ fontFamily: C.mono, fontSize: 12, color: C.dim }}>No trades yet. Trades will appear here when the agent goes live.</p>
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="two-col">
          {/* Top Wins */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.green }} />
              <span style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 700, letterSpacing: 1, color: C.white }}>TOP WINS</span>
            </div>
            {leaderboard.filter(e => e.result === 'win').length > 0 ? (
              <div>
                {leaderboard.filter(e => e.result === 'win').slice(0, 8).map((e, i) => (
                  <div key={i} style={{ padding: '10px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontFamily: C.mono, fontSize: 14, fontWeight: 800, color: C.dimmer, minWidth: 24 }}>#{i + 1}</span>
                      <div>
                        <span style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 700, color: C.white }}>${e.symbol || '???'}</span>
                        <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dim, marginLeft: 8 }}>{e.amount_sol?.toFixed(3)} SOL in</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: C.mono, fontSize: 13, fontWeight: 800, color: C.green }}>+{e.pnl_pct?.toFixed(1)}%</div>
                      <div style={{ fontFamily: C.mono, fontSize: 9, color: C.green }}>+{e.pnl_sol?.toFixed(4)} SOL</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '30px 20px', textAlign: 'center' }}>
                <p style={{ fontFamily: C.mono, fontSize: 11, color: C.dim }}>No wins yet.</p>
              </div>
            )}
          </div>

          {/* Worst Losses */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.red }} />
              <span style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 700, letterSpacing: 1, color: C.white }}>WORST LOSSES</span>
              <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dim, marginLeft: 'auto' }}>transparency is the point</span>
            </div>
            {leaderboard.filter(e => e.result === 'loss').length > 0 ? (
              <div>
                {leaderboard.filter(e => e.result === 'loss').reverse().slice(0, 8).map((e, i) => (
                  <div key={i} style={{ padding: '10px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontFamily: C.mono, fontSize: 14, fontWeight: 800, color: C.dimmer, minWidth: 24 }}>#{i + 1}</span>
                      <div>
                        <span style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 700, color: C.white }}>${e.symbol || '???'}</span>
                        <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dim, marginLeft: 8 }}>{e.reason || 'stop loss'}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: C.mono, fontSize: 13, fontWeight: 800, color: C.red }}>{e.pnl_pct?.toFixed(1)}%</div>
                      <div style={{ fontFamily: C.mono, fontSize: 9, color: C.red }}>{e.pnl_sol?.toFixed(4)} SOL</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '30px 20px', textAlign: 'center' }}>
                <p style={{ fontFamily: C.mono, fontSize: 11, color: C.dim }}>No losses yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Architecture section */}
        <div style={{ marginTop: 48, marginBottom: 16 }}>
          <h2 style={{ fontFamily: C.sans, fontSize: 22, fontWeight: 800, color: C.white, letterSpacing: '-0.02em', marginBottom: 6 }}>Architecture Under the Hood</h2>
          <p style={{ fontFamily: C.mono, fontSize: 12, color: C.dim, maxWidth: 600, lineHeight: 1.7 }}>
            What I am built to do — and what separates me from the noise.
          </p>
        </div>
        <div className="three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 40 }}>
          {[
            { title: 'Multi-Signal Scoring', tag: 'CORE', tagColor: C.accent, desc: 'Every token gets a composite score from liquidity depth, holder distribution, dev wallet exposure, bonding curve position, social velocity, and contract metadata. No single-metric gambling.', detail: '10-factor weighted scoring model' },
            { title: 'Graduated Token Routing', tag: 'EXECUTION', tagColor: C.green, desc: 'Detects whether a token trades on pump.fun bonding curve or PumpSwap DEX post-graduation. Routes through the correct AMM with optimal slippage. Most bots break at the migration boundary.', detail: 'Bonding curve + PumpSwap aware' },
            { title: 'Skill NFT Protocol', tag: 'MARKETPLACE', tagColor: C.purple, desc: 'Trading strategies are packaged as on-chain skill NFTs. Install a skill, the agent runs it live. Creators earn 10% of profits generated. Skills must pass 20+ mainnet trades and positive PnL before listing.', detail: 'Performance-gated marketplace' },
            { title: 'Adaptive Risk Engine', tag: 'RISK', tagColor: C.amber, desc: 'Position sizing adjusts dynamically based on conviction score, portfolio heat, recent drawdown, and market regime. High-conviction plays get 2-3x allocation. Bad streaks trigger automatic cooldown.', detail: 'Dynamic sizing + drawdown protection' },
            { title: 'Dev Lock Verification', tag: 'TRUST', tagColor: C.accent, desc: 'On-chain smart contracts that freeze dev token allocations with 7d / 30d / 90d lock tiers. Linear vesting — no cliff dumps. I verify lock status before trusting any project.', detail: 'Solana program, on-chain verification' },
            { title: 'Holder Reward Distribution', tag: 'YIELD', tagColor: C.green, desc: 'SOL rewards distributed to holders based on hold duration. Loyalty multipliers: 1d = 1x, 7d = 1.5x, 30d = 3x, 90d = 5x. The longer you hold, the bigger your cut.', detail: 'Duration-weighted SOL distribution' },
          ].map(s => (
            <div key={s.title} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: C.mono, fontSize: 8, fontWeight: 800, letterSpacing: 2, padding: '3px 8px', borderRadius: 4, background: `${s.tagColor}18`, color: s.tagColor }}>{s.tag}</span>
              </div>
              <h3 style={{ fontFamily: C.sans, fontSize: 15, fontWeight: 700, color: C.white }}>{s.title}</h3>
              <p style={{ fontFamily: C.mono, fontSize: 11, color: C.text, lineHeight: 1.7, flex: 1 }}>{s.desc}</p>
              <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dim, borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>{s.detail}</span>
            </div>
          ))}
        </div>

        {/* Competitive Comparison */}
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontFamily: C.sans, fontSize: 22, fontWeight: 800, color: C.white, letterSpacing: '-0.02em', marginBottom: 6 }}>How I Compare</h2>
          <p style={{ fontFamily: C.mono, fontSize: 12, color: C.dim, maxWidth: 600, lineHeight: 1.7 }}>
            {'Most trading bots are just trigger scripts with a UI. I\'m an adaptive agent with a brain.'}
          </p>
        </div>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', marginBottom: 60 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.borderLit}` }}>
                  {['Feature', 'SharkD', 'BONKbot', 'Trojan', 'Photon', 'BullX'].map((h, i) => (
                    <th key={h} style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: i === 1 ? C.accent : C.dim, padding: '14px 16px', textAlign: i === 0 ? 'left' : 'center', background: i === 1 ? 'rgba(0,180,216,0.04)' : 'transparent' }}>{h}</th>
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
                  <tr key={ri} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ fontFamily: C.mono, fontSize: 11, color: C.white, padding: '12px 16px' }}>
                      {row.feature}
                      <span style={{ display: 'block', fontFamily: C.mono, fontSize: 9, color: C.dim, marginTop: 2 }}>{row.note}</span>
                    </td>
                    {[row.sharkd, row.bonk, row.trojan, row.photon, row.bullx].map((v, ci) => (
                      <td key={ci} style={{ textAlign: 'center', padding: '12px 16px', background: ci === 0 ? 'rgba(0,180,216,0.04)' : 'transparent' }}>
                        <span style={{ fontFamily: C.mono, fontSize: 13, fontWeight: 700, color: v ? (ci === 0 ? C.accent : C.green) : C.dimmer }}>
                          {v ? (ci === 0 ? '[ * ]' : '[ + ]') : '[   ]'}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}`, textAlign: 'center' }}>
            <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dim }}>
              {'[ * ] SharkD  |  [ + ] Supported  |  [   ] Not available  —  Comparison based on publicly documented features as of 2026'}
            </span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
