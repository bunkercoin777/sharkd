const C = {
  bg: '#020810', accent: '#00b4d8', white: '#e0eaf4', text: '#7b93b0',
  dim: '#2a3f5f', dimmer: '#1a2a44',
  border: 'rgba(0,180,216,0.06)',
  mono: "'JetBrains Mono', 'SF Mono', monospace",
  sans: "'Inter', system-ui, sans-serif",
};

export function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, padding: '48px 0 32px' }}>
      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '0 clamp(20px, 4vw, 40px)' }}>

        {/* Top row — brand + X link */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: C.mono, fontWeight: 800, fontSize: 13, letterSpacing: 2, color: C.dimmer }}>SHARKD</span>
          </div>
          <a
            href="https://x.com/SharkdAgent"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: C.dim, transition: 'color 0.2s' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 600 }}>@SharkdAgent</span>
          </a>
        </div>

        {/* Disclaimer */}
        <div style={{
          borderTop: `1px solid ${C.border}`, paddingTop: 24, marginBottom: 24,
        }}>
          <p style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.dim, marginBottom: 12 }}>DISCLAIMER</p>
          <p style={{ fontFamily: C.sans, fontSize: 11, color: C.dim, lineHeight: 1.8, maxWidth: 800, marginBottom: 10 }}>
            SharkD is an experimental autonomous trading agent operating on the Solana blockchain. This is not financial advice. Trading cryptocurrencies, memecoins, and digital assets involves substantial risk of loss and is not suitable for every investor. You could lose some or all of your investment. Past performance is not indicative of future results.
          </p>
          <p style={{ fontFamily: C.sans, fontSize: 11, color: C.dim, lineHeight: 1.8, maxWidth: 800, marginBottom: 10 }}>
            The SharkD platform, its creators, developers, contributors, and affiliates accept no liability whatsoever for any loss, damage, or expense arising from or in connection with the use of this platform, its trading agent, skill marketplace, smart contracts, tokens, or any related services. All interactions with SharkD are at your own risk.
          </p>
          <p style={{ fontFamily: C.sans, fontSize: 11, color: C.dim, lineHeight: 1.8, maxWidth: 800, marginBottom: 10 }}>
            Skills listed on the marketplace are community-created and are not endorsed, audited, or guaranteed by SharkD. Smart contract interactions, token purchases, and on-chain transactions are irreversible. No refunds. No guarantees. No warranties of any kind, express or implied.
          </p>
          <p style={{ fontFamily: C.sans, fontSize: 11, color: C.dim, lineHeight: 1.8, maxWidth: 800 }}>
            By using SharkD you acknowledge that you have read this disclaimer, understand the risks involved, and agree that SharkD and its team bear zero liability for any outcomes resulting from your use of the platform.
          </p>
        </div>

        {/* Copyright */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontFamily: C.mono, fontSize: 10, color: C.dimmer }}>© 2025 SharkD. All rights reserved.</span>
          <span style={{ fontFamily: C.mono, fontSize: 9, color: C.dimmer }}>USE AT YOUR OWN RISK</span>
        </div>
      </div>
    </footer>
  );
}
