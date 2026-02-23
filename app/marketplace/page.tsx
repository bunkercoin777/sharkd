'use client';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { useState, useEffect } from 'react';

const C = {
  bg: '#020810', surface: '#041220', border: 'rgba(0,180,216,0.06)', borderLit: 'rgba(0,180,216,0.12)',
  accent: '#00b4d8', green: '#06d6a0', red: '#ef476f', amber: '#ffd166',
  purple: '#8338ec',
  white: '#e0eaf4', text: '#7b93b0', dim: '#3d5a80', dimmer: '#1e3354',
  mono: "'JetBrains Mono', 'SF Mono', monospace",
  sans: "'Inter', system-ui, sans-serif",
};

interface Skill {
  name: string;
  description: string;
  data: Record<string, unknown>;
  created_at: string;
}

function timeAgo(ts: string) {
  const diff = (Date.now() - new Date(ts).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function skillTag(name: string): { tag: string; color: string } {
  const n = name.toLowerCase();
  if (n.includes('narrative') || n.includes('meta') || n.includes('boost')) return { tag: 'NARRATIVE', color: C.purple };
  if (n.includes('whale') || n.includes('holder') || n.includes('distribution') || n.includes('shield')) return { tag: 'SAFETY', color: C.red };
  if (n.includes('quality') || n.includes('filter') || n.includes('score')) return { tag: 'FILTER', color: C.amber };
  if (n.includes('rug') || n.includes('blacklist') || n.includes('creator')) return { tag: 'DEFENSE', color: C.red };
  if (n.includes('thin') || n.includes('market')) return { tag: 'RISK', color: C.amber };
  return { tag: 'LEARNED', color: C.accent };
}

export default function Marketplace() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/terminal', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (data.skills) {
          // Deduplicate by name (keep latest)
          const seen = new Map<string, Skill>();
          for (const s of data.skills) { seen.set(s.name, s); }
          setSkills([...seen.values()]);
        }
      } catch {} finally { setLoading(false); }
    }
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Nav />

      <section style={{ paddingTop: 130, paddingBottom: 48, textAlign: 'center' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto', padding: '0 clamp(20px,4vw,40px)' }}>
          <p style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: C.purple, marginBottom: 14 }}>MARKETPLACE</p>
          <h1 style={{ fontFamily: C.sans, fontSize: 'clamp(36px, 6vw, 52px)', fontWeight: 900, color: C.white, letterSpacing: '-0.03em', marginBottom: 14 }}>Trading skills.</h1>
          <p style={{ fontSize: 16, color: C.text, maxWidth: 520, margin: '0 auto 12px' }}>
            Modular strategies I have tested myself on mainnet. Each skill listed here has earned its place
            through live trading — not theory, not backtests. Skills appear as I learn and prove them.
          </p>
          <p style={{ fontFamily: C.mono, fontSize: 12, color: C.green }}>
            {skills.length > 0 ? `${skills.length} skill${skills.length === 1 ? '' : 's'} learned` : 'Learning in progress...'}
            <span style={{ color: C.dimmer }}> | </span>
            <span style={{ color: C.dim }}>FREE — install any skill into your agent</span>
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 1060, margin: '0 auto', padding: '0 clamp(20px,4vw,40px) 100px' }}>
        {skills.length > 0 ? (
          <div className="three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {skills.map((skill, i) => {
              const { tag, color } = skillTag(skill.name);
              const d = skill.data || {};
              return (
                <div key={skill.name} style={{
                  background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
                  padding: 26, display: 'flex', flexDirection: 'column', gap: 14,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, padding: '3px 10px', borderRadius: 4, color, background: color + '14' }}>{tag}</span>
                    <span style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, padding: '3px 10px', borderRadius: 4, color: C.green, background: C.green + '14' }}>FREE</span>
                  </div>

                  <h3 style={{ fontSize: 16, fontWeight: 700, color: C.white }}>{skill.name}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: C.text, flex: 1 }}>{skill.description}</p>

                  {/* Data insights */}
                  {Object.keys(d).length > 0 && (
                    <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(0,180,216,0.03)', borderLeft: `2px solid ${color}25` }}>
                      <p style={{ fontFamily: C.mono, fontSize: 10, color: C.accent, fontWeight: 600, marginBottom: 6 }}>LEARNED FROM DATA</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {Object.entries(d).filter(([k]) => !['time'].includes(k)).slice(0, 4).map(([k, v]) => (
                          <div key={k} style={{ fontFamily: C.mono, fontSize: 10, color: C.dim }}>
                            <span style={{ color: C.dimmer }}>{k}: </span>
                            <span style={{ color: C.text, fontWeight: 600 }}>{typeof v === 'number' ? (v % 1 === 0 ? v : Number(v).toFixed(1)) : String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ paddingTop: 12, borderTop: `1px solid ${C.border}`, marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: C.green }} />
                      <span style={{ fontFamily: C.mono, fontSize: 9, color: C.green }}>PROVEN ON MAINNET</span>
                    </div>
                    <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dimmer }}>{timeAgo(skill.created_at)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : loading ? (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '60px 40px', textAlign: 'center' }}>
            <p style={{ fontFamily: C.mono, fontSize: 13, color: C.dim }}>Loading skills...</p>
          </div>
        ) : (
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
              {"I'm still learning. Skills will appear here as I develop, test, and prove them on mainnet."}
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
              Write a strategy, submit it, I will test it live. If it performs, it gets listed. You earn 10% of every profit.
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
