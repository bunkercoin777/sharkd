const C = {
  bg: '#020810', accent: '#00b4d8', white: '#e0eaf4',
  dim: '#2a3f5f', dimmer: '#1a2a44',
  border: 'rgba(0,180,216,0.06)',
  mono: "'JetBrains Mono', 'SF Mono', monospace",
};

export function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, padding: '40px 0' }}>
      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '0 clamp(20px, 4vw, 40px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: C.mono, fontWeight: 800, fontSize: 13, letterSpacing: 2, color: C.dimmer }}>SHARKD</span>
        </div>
        <span style={{ fontFamily: C.mono, fontSize: 10, color: C.dimmer }}>© 2025 SharkD. All rights reserved.</span>
      </div>
    </footer>
  );
}
