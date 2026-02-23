'use client';

const C = {
  bg: 'rgba(6,6,16,0.85)',
  accent: '#3b82f6',
  dim: '#4b5563',
  text: '#e2e8f0',
};

export function Nav() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 clamp(20px, 4vw, 40px)',
      background: C.bg, backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <span style={{ fontSize: 22 }}>🦈</span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
          fontSize: 14, color: C.accent, letterSpacing: 2
        }}>SHARKD</span>
      </a>
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        {[
          { href: '/marketplace', label: 'Marketplace' },
          { href: '/docs', label: 'Docs' },
        ].map(l => (
          <a key={l.href} href={l.href} style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: C.dim, textDecoration: 'none', letterSpacing: 0.5, fontWeight: 500,
          }}>{l.label}</a>
        ))}
        <a href="https://t.me/" style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600,
          color: C.accent, textDecoration: 'none',
          padding: '7px 16px', borderRadius: 8,
          background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)',
        }}>Launch</a>
      </div>
    </nav>
  );
}
