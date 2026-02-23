export default function Home() {
  return (
    <div style={{ background: '#050508', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 64,
        background: 'rgba(5,5,8,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #1a1a2e', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>🦈</span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            fontSize: 20, color: '#00a8ff', letterSpacing: 2
          }}>SHARKD</span>
        </div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <a href="#skills" style={{ color: '#6b7394', textDecoration: 'none', fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>Skills</a>
          <a href="#how" style={{ color: '#6b7394', textDecoration: 'none', fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>How It Works</a>
          <a href="/marketplace" style={{ color: '#6b7394', textDecoration: 'none', fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>Marketplace</a>
          <a href="/docs" style={{ color: '#6b7394', textDecoration: 'none', fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>Docs</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '180px 32px 120px', textAlign: 'center',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Gradient orb */}
        <div style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: 800, height: 800, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,168,255,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 20px', border: '1px solid #1a1a2e', borderRadius: 100,
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
            color: '#00a8ff', background: 'rgba(0,168,255,0.06)', marginBottom: 40
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00e676', boxShadow: '0 0 8px #00e676' }} />
            AI-POWERED TRADING COMPANION
          </div>

          <h1 style={{
            fontSize: 'clamp(56px, 10vw, 96px)', fontWeight: 900, lineHeight: 0.95,
            marginBottom: 28, letterSpacing: -2,
            background: 'linear-gradient(135deg, #e0e8ff 0%, #00a8ff 50%, #00e5ff 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Your Trading<br />Shark.
          </h1>

          <p style={{
            fontSize: 20, color: '#6b7394', lineHeight: 1.6,
            maxWidth: 600, margin: '0 auto 48px'
          }}>
            An AI that lives in your Telegram, trades Solana memecoins autonomously,
            and gets smarter by buying skills from a marketplace.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://t.me/" style={{
              padding: '16px 40px', background: '#00a8ff', color: '#050508',
              borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 16,
              transition: 'all 0.2s', border: 'none'
            }}>
              Launch Your Shark
            </a>
            <a href="/marketplace" style={{
              padding: '16px 40px', background: 'transparent',
              border: '1px solid #1a1a2e', color: '#e0e8ff',
              borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 16
            }}>
              Browse Skills
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{
        display: 'flex', justifyContent: 'center', gap: 64,
        padding: '40px 32px', borderTop: '1px solid #1a1a2e',
        borderBottom: '1px solid #1a1a2e', flexWrap: 'wrap'
      }}>
        {[
          { label: 'Active Sharks', value: '—' },
          { label: 'Skills Available', value: '7' },
          { label: 'Total Trades', value: '—' },
          { label: 'SOL Volume', value: '—' },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 32,
              fontWeight: 700, color: '#00a8ff'
            }}>{s.value}</div>
            <div style={{ fontSize: 13, color: '#6b7394', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: '120px 32px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: 42, fontWeight: 800, marginBottom: 16, color: '#e0e8ff' }}>
            How SharkD Works
          </h2>
          <p style={{ color: '#6b7394', fontSize: 18 }}>
            Three layers. One killer trading companion.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {[
            {
              num: '01',
              title: 'Your Trading Pal',
              desc: 'A Telegram bot that talks to you like a friend. Say "go hunt" and it scans 300+ tokens. Say "chill" and it stops. Say "be more aggressive" and it shifts to degen mode. Natural conversation, not slash commands.',
              color: '#00a8ff'
            },
            {
              num: '02',
              title: 'Skill Marketplace',
              desc: 'Modular trading strategies as on-chain NFTs. Rug detectors, narrative scanners, whale trackers, momentum engines. Buy a skill, your shark installs it and immediately trades smarter. Creators earn from every profitable trade.',
              color: '#00e5ff'
            },
            {
              num: '03',
              title: 'Trust Layer',
              desc: 'Dev locks prevent rug pulls — smart contracts freeze dev tokens for verified periods. Holder rewards distribute SOL to diamond hands. The longer you hold, the more you earn. Real yield, not inflationary tokens.',
              color: '#00e676'
            },
          ].map((item) => (
            <div key={item.num} style={{
              background: '#0a0a12', border: '1px solid #1a1a2e', borderRadius: 12,
              padding: 32, transition: 'border-color 0.3s'
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 14,
                color: item.color, marginBottom: 16, fontWeight: 600
              }}>{item.num}</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, color: '#e0e8ff' }}>
                {item.title}
              </h3>
              <p style={{ color: '#6b7394', lineHeight: 1.7, fontSize: 15 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills showcase */}
      <section id="skills" style={{
        padding: '120px 32px', maxWidth: 1000, margin: '0 auto',
        borderTop: '1px solid #1a1a2e'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: 42, fontWeight: 800, marginBottom: 16, color: '#e0e8ff' }}>
            Battle-Tested Skills
          </h2>
          <p style={{ color: '#6b7394', fontSize: 18 }}>
            Extracted from 72+ real trades. Proven on mainnet.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {[
            { name: 'Narrative Detection', desc: 'Scans 400+ tokens to find trending metas. Identifies keywords appearing in 3+ tokens and boosts scores for tokens riding the wave.', tag: 'SCANNER', tagColor: '#00a8ff' },
            { name: 'Holder Analysis', desc: 'Checks top wallet concentration before every buy. Auto-rejects tokens where a single wallet holds >50%. Rug prevention built in.', tag: 'FILTER', tagColor: '#ff3860' },
            { name: 'Momentum Tracker', desc: 'Tracks price history, detects recovery/dumping/flat momentum. Dynamically adjusts hold times — patient with recoveries, quick to cut dumps.', tag: 'ANALYSIS', tagColor: '#00e676' },
            { name: 'Aggressive Sell Engine', desc: '3-attempt retry with fresh quotes and escalating slippage (1500→2500 bps). Never loses a profitable trade to a failed transaction again.', tag: 'EXECUTION', tagColor: '#ffb800' },
            { name: 'Dual Market Scanner', desc: 'Scans both pump.fun bonding curve AND PumpSwap graduated tokens simultaneously with optimized parameters for each market type.', tag: 'SCANNER', tagColor: '#00a8ff' },
            { name: 'Adaptive Position Sizing', desc: 'Starts small, scales up as win rate improves. Cautious 0.05 SOL → Degen 1.00 SOL. Risk-adjusted sizing based on proven performance.', tag: 'RISK', tagColor: '#00e5ff' },
          ].map((skill) => (
            <div key={skill.name} style={{
              background: '#0a0a12', border: '1px solid #1a1a2e', borderRadius: 10,
              padding: 24, display: 'flex', flexDirection: 'column', gap: 12
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                  color: skill.tagColor, padding: '4px 10px',
                  background: `${skill.tagColor}15`, borderRadius: 4,
                  fontWeight: 600, letterSpacing: 1
                }}>{skill.tag}</span>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#e0e8ff' }}>{skill.name}</h3>
              <p style={{ color: '#6b7394', fontSize: 14, lineHeight: 1.6 }}>{skill.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Chat preview */}
      <section style={{
        padding: '120px 32px', maxWidth: 700, margin: '0 auto',
        borderTop: '1px solid #1a1a2e'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 42, fontWeight: 800, marginBottom: 16, color: '#e0e8ff' }}>
            Talk To Your Shark
          </h2>
          <p style={{ color: '#6b7394', fontSize: 18 }}>
            Natural conversation. Not another dashboard.
          </p>
        </div>

        <div style={{
          background: '#0a0a12', border: '1px solid #1a1a2e', borderRadius: 16,
          padding: 32, fontFamily: "'JetBrains Mono', monospace", fontSize: 14
        }}>
          {[
            { from: 'you', text: 'how are we doing?' },
            { from: 'shark', text: '9.42 SOL in the wallet\n3W/1L (75% win rate)\nPnL: +0.87 SOL\n1 open position, 24 tokens avoided' },
            { from: 'you', text: 'be more aggressive' },
            { from: 'shark', text: 'Degen mode activated. Bigger bets, wider stops. Let\'s eat. 🔥' },
            { from: 'shark', text: '🔍 Buying $LOBSTR — score: 8/10, graduated, top1: 4.2% 🔥\n💰 0.30 SOL' },
            { from: 'shark', text: '🎯 Taking profit on $LOBSTR: +18.4% (0.354 SOL)\n✅ Sold — +0.054 SOL\n💰 Balance: 9.47 SOL | 4W/1L' },
            { from: 'you', text: 'nice. take a break' },
            { from: 'shark', text: '⏸️ Trading paused. Good session. Say "go" when you want me hunting.' },
          ].map((msg, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: msg.from === 'you' ? 'flex-end' : 'flex-start',
              marginBottom: 12
            }}>
              <div style={{
                maxWidth: '80%', padding: '10px 16px', borderRadius: 12,
                background: msg.from === 'you' ? '#0a2a4a' : '#12121e',
                color: msg.from === 'you' ? '#00a8ff' : '#e0e8ff',
                whiteSpace: 'pre-line', lineHeight: 1.5, fontSize: 13
              }}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dev Lock + Holder Rewards */}
      <section style={{
        padding: '120px 32px', maxWidth: 1000, margin: '0 auto',
        borderTop: '1px solid #1a1a2e'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 32 }}>
          <div style={{
            background: '#0a0a12', border: '1px solid #1a1a2e', borderRadius: 12,
            padding: 40
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
              color: '#ff3860', letterSpacing: 2, marginBottom: 16, fontWeight: 600
            }}>DEV LOCKS</div>
            <h3 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16, color: '#e0e8ff' }}>
              No More Rug Pulls
            </h3>
            <p style={{ color: '#6b7394', lineHeight: 1.7, fontSize: 15, marginBottom: 24 }}>
              Smart contracts lock dev tokens at launch. Verified on-chain, visible to everyone.
              Vesting schedules instead of cliff dumps. Filter tokens by lock duration.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['🔒 7 Day', '🔒🔒 30 Day', '🔒🔒🔒 90 Day'].map(l => (
                <span key={l} style={{
                  padding: '6px 14px', background: '#1a0a14', border: '1px solid #3a1a2e',
                  borderRadius: 6, fontSize: 13, color: '#ff3860',
                  fontFamily: "'JetBrains Mono', monospace"
                }}>{l}</span>
              ))}
            </div>
          </div>

          <div style={{
            background: '#0a0a12', border: '1px solid #1a1a2e', borderRadius: 12,
            padding: 40
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
              color: '#00e676', letterSpacing: 2, marginBottom: 16, fontWeight: 600
            }}>HOLDER REWARDS</div>
            <h3 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16, color: '#e0e8ff' }}>
              Get Paid To Hold
            </h3>
            <p style={{ color: '#6b7394', lineHeight: 1.7, fontSize: 15, marginBottom: 24 }}>
              SOL rewards distributed to holders based on hold duration. The longer you hold,
              the bigger your multiplier. Real yield, paid in SOL — not inflationary tokens.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['1d → 1x', '7d → 1.5x', '30d → 3x', '90d → 5x'].map(l => (
                <span key={l} style={{
                  padding: '6px 14px', background: '#0a1a14', border: '1px solid #1a3a2e',
                  borderRadius: 6, fontSize: 13, color: '#00e676',
                  fontFamily: "'JetBrains Mono', monospace"
                }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '120px 32px', textAlign: 'center',
        borderTop: '1px solid #1a1a2e'
      }}>
        <h2 style={{
          fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 900, marginBottom: 24,
          background: 'linear-gradient(135deg, #e0e8ff, #00a8ff)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Stop watching charts.<br />Let your shark hunt.
        </h2>
        <p style={{ color: '#6b7394', fontSize: 18, marginBottom: 48, maxWidth: 500, margin: '0 auto 48px' }}>
          Deploy your personal trading shark in 60 seconds.
          Telegram-native. Skill-powered. Battle-tested.
        </p>
        <a href="https://t.me/" style={{
          padding: '18px 48px', background: '#00a8ff', color: '#050508',
          borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 18,
          display: 'inline-block'
        }}>
          Deploy Your Shark
        </a>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '48px 32px', borderTop: '1px solid #1a1a2e',
        textAlign: 'center', color: '#6b7394', fontSize: 13
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 24 }}>
          <a href="/marketplace" style={{ color: '#6b7394', textDecoration: 'none' }}>Marketplace</a>
          <a href="/docs" style={{ color: '#6b7394', textDecoration: 'none' }}>Docs</a>
          <a href="https://github.com/bunkercoin777/sharkd" style={{ color: '#6b7394', textDecoration: 'none' }}>GitHub</a>
        </div>
        <p>SharkD &copy; 2026. Built by sharks, for sharks.</p>
      </footer>
    </div>
  );
}
