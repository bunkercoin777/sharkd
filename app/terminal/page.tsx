'use client';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { useState, useEffect, useRef } from 'react';

const C = {
  bg: '#020810', surface: '#041220', border: 'rgba(0,180,216,0.08)', borderLit: 'rgba(0,180,216,0.15)',
  accent: '#00b4d8', accentDeep: '#0077b6', green: '#06d6a0', red: '#ef476f', amber: '#ffd166',
  purple: '#8338ec', white: '#e0eaf4', text: '#7b93b0', dim: '#3d5a80', dimmer: '#1e3354',
  mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
  sans: "'Inter', system-ui, sans-serif",
};

interface AgentState {
  status: string; balance: number; startBalance: number; wins: number; losses: number;
  totalPnl: number; tradePnl: number; winRate: number;
  holdings: Array<{ mint: string; symbol: string; buySol: number; buyTime: number; isBonding: boolean; meta: string | null }>;
  cycle: number; exitedCount: number; riskMode: string; uptime: number; lastUpdate: number;
}
interface Thought { tag: string; message: string; type: string; created_at: string; }
interface Trade { type: string; symbol: string; amount_sol: number; pnl_sol: number; pnl_pct: number; reason: string; result: string; created_at: string; }
interface Skill { name: string; description: string; }

function tagColor(tag: string) {
  if (['BUY', 'BOUGHT', 'TARGET'].includes(tag)) return C.accent;
  if (['SELL', 'TP', 'WIN'].includes(tag)) return C.green;
  if (['SL', 'LOSS', 'REJECT', 'ERROR', 'FATAL'].includes(tag)) return C.red;
  if (['STALE', 'HOLDER'].includes(tag)) return C.amber;
  if (['META', 'LEARN', 'SKILL'].includes(tag)) return C.purple;
  if (['HOLD'].includes(tag)) return '#3d8ecf';
  if (['RECOVER', 'RESTART', 'MEMORY'].includes(tag)) return C.accent;
  return C.dim;
}

function timeAgo(ts: string | number) {
  const diff = (Date.now() - new Date(ts).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
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
      } catch { /* silent */ }
    }
    poll();
    const iv = setInterval(poll, 5000);
    return () => { active = false; clearInterval(iv); };
  }, []);

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [thoughts]);

  const isOnline = online && agent;
  const pnlColor = agent && agent.totalPnl >= 0 ? C.green : C.red;
  const pnlSign = agent && agent.totalPnl >= 0 ? '+' : '';

  const uniqueSkills = skills.reduce<Skill[]>((acc, s) => {
    if (!acc.find(x => x.name === s.name)) acc.push(s);
    return acc;
  }, []);

  return (
    <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Nav />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 1400, width: '100%', margin: '0 auto', padding: '72px 16px 0' }}>

        {/* Top Bar: Status + Stats + Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 0', marginBottom: 8, flexWrap: 'wrap' }}>
          {/* Left: Logo + Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
            <img src="/shark.jpg" alt="SharkD" style={{ width: 28, height: 28, borderRadius: 6 }} />
            <div>
              <div style={{ fontFamily: C.sans, fontSize: 15, fontWeight: 800, color: C.white, lineHeight: 1, letterSpacing: '-0.02em' }}>SHARKD TERMINAL</div>
              <div style={{ fontFamily: C.mono, fontSize: 9, color: C.dim, marginTop: 1 }}>
                {agent ? `Cycle #${agent.cycle}` : 'Connecting...'} | {isOnline ? 'LIVE' : 'OFFLINE'}
                <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: isOnline ? C.green : C.dimmer, marginLeft: 6, verticalAlign: 'middle', boxShadow: isOnline ? `0 0 8px ${C.green}` : 'none' }} />
              </div>
            </div>
          </div>

          {/* Stats Row */}
          {agent && (
            <div style={{ display: 'flex', gap: 2, flex: 1, minWidth: 0 }}>
              {[
                { label: 'BAL', value: `${agent.balance.toFixed(3)}`, sub: 'SOL', color: C.white },
                { label: 'PNL', value: `${pnlSign}${agent.totalPnl.toFixed(4)}`, sub: 'SOL', color: pnlColor },
                { label: 'TRADE PNL', value: `${agent.tradePnl >= 0 ? '+' : ''}${agent.tradePnl.toFixed(4)}`, sub: 'SOL', color: agent.tradePnl >= 0 ? C.green : C.red },
                { label: 'W/L', value: `${agent.wins}/${agent.losses}`, sub: `${agent.winRate}%`, color: agent.winRate >= 50 ? C.green : C.amber },
                { label: 'POS', value: `${agent.holdings.length}`, sub: `${agent.exitedCount} exited`, color: C.accent },
                { label: 'RISK', value: agent.riskMode?.toUpperCase() || '--', sub: '', color: agent.riskMode === 'aggressive' ? C.amber : C.text },
                { label: 'UPTIME', value: formatUptime(agent.uptime), sub: '', color: C.text },
              ].map(s => (
                <div key={s.label} style={{ padding: '4px 10px', background: C.surface, borderRight: `1px solid ${C.border}`, minWidth: 0 }}>
                  <div style={{ fontFamily: C.mono, fontSize: 7, fontWeight: 700, letterSpacing: '0.1em', color: C.dim, whiteSpace: 'nowrap' }}>{s.label}</div>
                  <div style={{ fontFamily: C.mono, fontSize: 15, fontWeight: 800, color: s.color, lineHeight: 1.2, whiteSpace: 'nowrap' }}>{s.value}</div>
                  {s.sub && <div style={{ fontFamily: C.mono, fontSize: 8, color: C.dimmer }}>{s.sub}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Buy Button */}
          <a href="https://pump.fun/coin/9FxxWFyEquSswwCjAE46vVMAdi7bfiQqMNkYy3o7pump" target="_blank" rel="noopener" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 6,
            background: `linear-gradient(135deg, ${C.accent}, ${C.accentDeep})`, color: C.bg,
            fontFamily: C.mono, fontSize: 11, fontWeight: 800, textDecoration: 'none', letterSpacing: '0.05em',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>Buy $SHARKD</a>
        </div>

        {/* Wallet Address */}
        <div style={{ fontFamily: C.mono, fontSize: 9, color: C.dimmer, marginBottom: 8, letterSpacing: '0.02em' }}>
          Agent Wallet: <span style={{ color: C.dim, userSelect: 'all' as const }}>HdRxdfqwTg8Mdxf2HPZTYrwroTEaSGzmaxfi3MxBgfYz</span>
        </div>

        {/* Main Grid */}
        <div className="terminal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 8, flex: 1, minHeight: 0, marginBottom: 8 }}>

          {/* LEFT: Decision Feed */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '6px 12px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
              <span style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: C.accent }}>DECISION FEED</span>
              <span style={{ marginLeft: 'auto', fontFamily: C.mono, fontSize: 8, color: isOnline ? C.green : C.dimmer }}>
                {isOnline ? 'STREAMING' : 'WAITING'}
              </span>
            </div>
            <div ref={feedRef} style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
              {thoughts.length === 0 ? (
                <div style={{ padding: '40px 16px', textAlign: 'center', fontFamily: C.mono, fontSize: 11, color: C.dim }}>
                  Waiting for agent...
                </div>
              ) : thoughts.map((t, i) => (
                <div key={i} style={{ padding: '2px 10px', display: 'flex', gap: 6, alignItems: 'baseline', borderBottom: `1px solid rgba(0,180,216,0.02)` }}>
                  <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dimmer, minWidth: 36, flexShrink: 0 }}>
                    {new Date(t.created_at).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                  </span>
                  <span style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 800, minWidth: 52, flexShrink: 0, color: tagColor(t.tag) }}>[{t.tag}]</span>
                  <span style={{ fontFamily: C.mono, fontSize: 10, color: C.text, lineHeight: 1.5, wordBreak: 'break-word' }}>{t.message}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Holdings + Trades + Skills stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0, overflow: 'hidden' }}>

            {/* Holdings */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, flexShrink: 0 }}>
              <div style={{ padding: '6px 12px', borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: C.amber }}>HOLDINGS</span>
                <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dim, marginLeft: 8 }}>{agent?.holdings.length || 0}</span>
              </div>
              <div style={{ padding: '4px 12px', maxHeight: 140, overflowY: 'auto' }}>
                {agent?.holdings.length ? agent.holdings.map(h => (
                  <div key={h.mint} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: `1px solid ${C.border}` }}>
                    <div>
                      <span style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 700, color: C.white }}>${h.symbol}</span>
                      <span style={{ fontFamily: C.mono, fontSize: 8, color: C.dim, marginLeft: 6 }}>{h.isBonding ? 'BOND' : 'GRAD'}</span>
                      {h.meta && <span style={{ fontFamily: C.mono, fontSize: 8, color: C.purple, marginLeft: 4 }}>{h.meta}</span>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, color: C.accent }}>{h.buySol} SOL</span>
                      <div style={{ fontFamily: C.mono, fontSize: 8, color: C.dimmer }}>{timeAgo(h.buyTime)} ago</div>
                    </div>
                  </div>
                )) : <div style={{ padding: '8px 0', fontFamily: C.mono, fontSize: 10, color: C.dim }}>No open positions</div>}
              </div>
            </div>

            {/* Recent Trades */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '6px 12px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
                <span style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: C.white }}>RECENT TRADES</span>
                <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dim, marginLeft: 8 }}>{trades.length}</span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                {trades.length > 0 ? trades.map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ fontFamily: C.mono, fontSize: 8, color: C.dimmer, minWidth: 24 }}>{timeAgo(t.created_at)}</span>
                    <span style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 800, minWidth: 28, color: t.type === 'buy' ? C.accent : (t.result === 'win' ? C.green : C.red) }}>{t.type.toUpperCase()}</span>
                    <span style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, color: C.white, minWidth: 60 }}>${t.symbol || '???'}</span>
                    <span style={{ fontFamily: C.mono, fontSize: 9, color: C.text }}>{t.amount_sol?.toFixed(3)}</span>
                    <span style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, marginLeft: 'auto', color: t.pnl_sol != null ? (t.pnl_sol >= 0 ? C.green : C.red) : C.dimmer }}>
                      {t.pnl_sol != null ? `${t.pnl_sol >= 0 ? '+' : ''}${t.pnl_sol.toFixed(4)}` : '--'}
                    </span>
                    {t.pnl_pct != null && <span style={{ fontFamily: C.mono, fontSize: 8, color: C.dim }}>({t.pnl_pct >= 0 ? '+' : ''}{t.pnl_pct.toFixed(1)}%)</span>}
                    {t.result && (
                      <span style={{ fontFamily: C.mono, fontSize: 7, fontWeight: 800, padding: '1px 4px', borderRadius: 2, background: t.result === 'win' ? 'rgba(6,214,160,0.12)' : 'rgba(239,71,111,0.12)', color: t.result === 'win' ? C.green : C.red }}>{t.result.toUpperCase()}</span>
                    )}
                  </div>
                )) : <div style={{ padding: '20px 12px', fontFamily: C.mono, fontSize: 10, color: C.dim, textAlign: 'center' }}>No trades yet</div>}
              </div>
            </div>

            {/* Skills — compact */}
            {uniqueSkills.length > 0 && (
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, flexShrink: 0, maxHeight: 120, overflow: 'hidden' }}>
                <div style={{ padding: '6px 12px', borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: C.purple }}>LEARNED SKILLS</span>
                  <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dim, marginLeft: 8 }}>{uniqueSkills.length}</span>
                </div>
                <div style={{ padding: '4px 12px', overflowY: 'auto', maxHeight: 80 }}>
                  {uniqueSkills.slice(0, 5).map((s, i) => (
                    <div key={i} style={{ padding: '2px 0', borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, color: C.white }}>{s.name}</span>
                      <span style={{ fontFamily: C.mono, fontSize: 8, color: C.dim, marginLeft: 8 }}>{(s.description || '').slice(0, 60)}{(s.description || '').length > 60 ? '...' : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
