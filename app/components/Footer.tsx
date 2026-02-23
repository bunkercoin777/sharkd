export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="max-w-[1100px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 grid-mobile-1">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🦈</span>
              <span className="font-mono text-sm font-bold tracking-wider" style={{ color: '#388eff' }}>SHARKD</span>
            </div>
            <p className="text-[13px] leading-relaxed" style={{ color: '#4a5568' }}>
              Autonomous trading intelligence.<br />Skill-powered. Conversational.
            </p>
          </div>
          {[
            { title: 'Product', links: [
              { label: 'Deploy Agent', href: 'https://t.me/' },
              { label: 'Marketplace', href: '/marketplace' },
              { label: 'Documentation', href: '/docs' },
            ]},
            { title: 'Developers', links: [
              { label: 'SDK Guide', href: '/docs' },
              { label: 'GitHub', href: 'https://github.com/bunkercoin777/sharkd' },
              { label: 'Submit a Skill', href: '/marketplace' },
            ]},
            { title: 'Community', links: [
              { label: 'Twitter / X', href: '#' },
              { label: 'Telegram', href: '#' },
              { label: 'Discord', href: '#' },
            ]},
          ].map((section) => (
            <div key={section.title}>
              <p className="font-mono text-[10px] tracking-[0.15em] font-semibold mb-4" style={{ color: '#6b7394' }}>
                {section.title.toUpperCase()}
              </p>
              <div className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <a key={link.label} href={link.href}
                    className="text-[13px] no-underline transition-colors duration-200"
                    style={{ color: '#4a5568' }}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <p className="font-mono text-[11px]" style={{ color: '#2a2a3a' }}>
            &copy; 2026 SharkD. All rights reserved.
          </p>
          <p className="font-mono text-[11px]" style={{ color: '#2a2a3a' }}>
            Built on Solana
          </p>
        </div>
      </div>
    </footer>
  );
}
