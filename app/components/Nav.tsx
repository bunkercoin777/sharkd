'use client';
import Link from 'next/link';

const C = {
  bg: '#020810', accent: '#00b4d8', white: '#e0eaf4',
  dim: '#3d5a80', border: 'rgba(0,180,216,0.08)',
  mono: "'JetBrains Mono', 'SF Mono', monospace",
  sans: "'Inter', system-ui, sans-serif",
};

const links = [
  { href: '/terminal', label: 'Live Terminal' },
  { href: '/marketplace', label: 'Skills' },
  { href: '/docs', label: 'Docs' },
];

export function Nav() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(2,8,16,0.85)', backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '0 clamp(20px, 4vw, 40px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/shark.jpg" alt="SharkD" style={{ width: 30, height: 30, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(0,180,216,0.2)' }} />
          <span style={{ fontFamily: C.mono, fontWeight: 800, fontSize: 16, letterSpacing: 2, color: C.white }}>SHARKD</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} style={{
              fontFamily: C.mono, fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
              color: l.href === '/terminal' ? C.accent : C.dim,
              textDecoration: 'none', transition: 'color 0.2s',
            }}>{l.label}</Link>
          ))}
          <a href="https://t.me/" style={{
            padding: '7px 18px', borderRadius: 6, textDecoration: 'none',
            background: 'rgba(0,180,216,0.1)', border: '1px solid rgba(0,180,216,0.2)',
            fontFamily: C.mono, fontSize: 11, fontWeight: 700, color: C.accent,
          }}>Launch</a>
        </div>
      </div>
    </nav>
  );
}
