import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const SKILLS = [
  { name: 'Narrative Detection', tag: 'SCANNER', tagClass: 'tag-scanner', price: '0.5 SOL', installs: 0, desc: 'Scans 400+ tokens for trending keywords appearing in 3+ tokens. Identifies forming metas and applies score boosts to tokens riding the narrative wave.', metric: '29-token lobster meta identified', perf: '+18% avg meta trades' },
  { name: 'Holder Analysis', tag: 'FILTER', tagClass: 'tag-filter', price: '0.3 SOL', installs: 0, desc: 'Checks top 1/5/10 wallet concentration via Solana RPC before every buy. Auto-rejects tokens with >50% single-wallet concentration.', metric: '14 rug pulls blocked', perf: '0 rug losses' },
  { name: 'Momentum Tracker', tag: 'ANALYSIS', tagClass: 'tag-analysis', price: '0.4 SOL', installs: 0, desc: '30-point price history per position. Recovery/dumping/flat momentum detection. Dynamic hold time adjustment based on real-time conditions.', metric: 'Dynamic 1-10min holds', perf: '+34% hold efficiency' },
  { name: 'Aggressive Sell Engine', tag: 'EXECUTION', tagClass: 'tag-execution', price: '0.6 SOL', installs: 0, desc: '3 retry attempts with fresh Jupiter quotes. Escalating slippage 1500→2000→2500 bps. 200K lamport priority fees. TX spam-sending for confirmation.', metric: 'Saved +26% lost trade', perf: '97% sell success' },
  { name: 'Dual Market Scanner', tag: 'SCANNER', tagClass: 'tag-scanner', price: '0.5 SOL', installs: 0, desc: 'Simultaneous pump.fun bonding curve + PumpSwap graduated token scanning with independently optimized parameters for each market type.', metric: '300 grad + 100 bonding per cycle', perf: '2x opportunity surface' },
  { name: 'Adaptive Position Sizing', tag: 'RISK', tagClass: 'tag-risk', price: '0.3 SOL', installs: 0, desc: 'Win-rate-based position scaling. Starts conservative, grows with proven performance. Different sizing tiers for bonding vs graduated markets.', metric: '0.05 → 1.00 SOL adaptive', perf: 'Risk-adjusted growth' },
  { name: 'Smart Money Tracker', tag: 'ALPHA', tagClass: 'tag-alpha', price: '0.8 SOL', installs: 0, desc: 'Identifies wallets with consistent winning trades. Detects smart money entries into new tokens. Uses free Solana RPC — no paid API needed.', metric: 'Top 20 wallets tracked', perf: 'Whale-informed entries' },
];

export default function Marketplace() {
  return (
    <>
      <Nav />

      <section className="pt-36 pb-16 px-6 text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-[#a855f7] mb-4 font-medium">MARKETPLACE</p>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-5">
          Trading skills.
        </h1>
        <p className="text-[16px] max-w-[480px] mx-auto" style={{ color: '#6b7394' }}>
          Modular strategies proven on mainnet. Install one, your agent gets that edge instantly.
        </p>
      </section>

      <section className="max-w-[1100px] mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKILLS.map(skill => (
            <div key={skill.name} className="card p-7 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className={`font-mono text-[10px] tracking-wider font-semibold px-2.5 py-1 rounded ${skill.tagClass}`}>
                  {skill.tag}
                </span>
                <span className="font-mono text-[10px] text-[#22c55e] font-medium">PROVEN</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">{skill.name}</h3>
              <p className="text-[13px] leading-relaxed flex-1" style={{ color: '#6b7394' }}>{skill.desc}</p>
              <div className="pt-4 flex flex-col gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="flex justify-between text-[10px] font-mono">
                  <span style={{ color: '#4a5568' }}>{skill.metric}</span>
                  <span style={{ color: '#22c55e' }}>{skill.perf}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-mono text-[11px]" style={{ color: '#4a5568' }}>{skill.installs} installs</span>
                  <button className="font-mono text-[12px] font-semibold px-5 py-2 rounded-lg transition-all duration-200"
                    style={{ background: 'rgba(56,142,255,0.1)', border: '1px solid rgba(56,142,255,0.15)', color: '#7bb5ff' }}>
                    {skill.price}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-12 text-center mt-12" style={{ border: '1px dashed rgba(255,255,255,0.08)' }}>
          <h3 className="text-xl font-bold text-white mb-3">Build your own skill</h3>
          <p className="text-[14px] mb-6" style={{ color: '#6b7394' }}>
            Write a strategy, test it against real data, mint it as an NFT. Earn 10% of every profit your skill generates.
          </p>
          <a href="/docs" className="btn-secondary">Read the SDK Docs</a>
        </div>
      </section>

      <Footer />
    </>
  );
}
