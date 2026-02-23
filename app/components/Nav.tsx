'use client';

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      style={{ background: 'rgba(2,2,4,0.8)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="max-w-[1100px] mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 no-underline">
          <span className="text-2xl">🦈</span>
          <span className="font-mono text-[15px] font-bold tracking-[0.15em]" style={{ color: '#388eff' }}>
            SHARKD
          </span>
        </a>
        <div className="flex items-center gap-8 hide-mobile">
          {[
            { href: '/marketplace', label: 'Marketplace' },
            { href: '/docs', label: 'Docs' },
          ].map((link) => (
            <a key={link.href} href={link.href}
              className="font-mono text-[12px] tracking-wide no-underline transition-colors duration-200"
              style={{ color: '#4a5568' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#c8cdd8')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#4a5568')}>
              {link.label}
            </a>
          ))}
          <a href="https://t.me/" className="font-mono text-[12px] tracking-wide px-4 py-2 rounded-lg no-underline transition-all duration-200"
            style={{ background: 'rgba(56,142,255,0.08)', border: '1px solid rgba(56,142,255,0.12)', color: '#7bb5ff' }}>
            Launch App
          </a>
        </div>
      </div>
    </nav>
  );
}
