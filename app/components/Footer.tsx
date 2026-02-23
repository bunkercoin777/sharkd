const C = { dim: '#333340', dimmer: '#22222e', accent: '#3b82f6' };

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '60px clamp(20px,4vw,40px) 40px' }}>
      <div style={{ maxWidth: 1060, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 18 }}>🦈</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 12, color: C.accent, letterSpacing: 1.5 }}>SHARKD</span>
          </div>
          <p style={{ fontSize: 12, color: C.dim, lineHeight: 1.7, maxWidth: 220 }}>
            Autonomous trading intelligence. Skill-powered. Conversational. Built on Solana.
          </p>
        </div>
        {[
          { title: 'Product', links: [['Deploy Agent', 'https://t.me/'], ['Marketplace', '/marketplace'], ['Docs', '/docs']] },
          { title: 'Developers', links: [['SDK Guide', '/docs#sdk'], ['GitHub', 'https://github.com/bunkercoin777/sharkd'], ['Submit Skill', '/marketplace']] },
          { title: 'Community', links: [['Twitter / X', '#'], ['Telegram', '#'], ['Discord', '#']] },
        ].map(s => (
          <div key={s.title}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2, color: C.dim, marginBottom: 14, fontWeight: 600 }}>{s.title.toUpperCase()}</p>
            {s.links.map(([label, href]) => (
              <a key={label} href={href} style={{ display: 'block', fontSize: 12, color: C.dim, textDecoration: 'none', marginBottom: 10 }}>{label}</a>
            ))}
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1060, margin: '40px auto 0', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: C.dimmer }}>&copy; 2026 SharkD</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: C.dimmer }}>Solana</span>
      </div>
    </footer>
  );
}
