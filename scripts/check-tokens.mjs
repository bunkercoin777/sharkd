import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

const conn = new Connection(process.env.RPC_URL, 'confirmed');
const wallet = Keypair.fromSecretKey(bs58.decode(process.env.WALLET_SECRET_B58));

const SPL = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const T22 = new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');

const [a, b] = await Promise.all([
  conn.getParsedTokenAccountsByOwner(wallet.publicKey, { programId: SPL }),
  conn.getParsedTokenAccountsByOwner(wallet.publicKey, { programId: T22 }),
]);

const all = [...a.value, ...b.value].map(x => ({
  mint: x.account.data.parsed.info.mint,
  amount: x.account.data.parsed.info.tokenAmount.amount,
  ui: x.account.data.parsed.info.tokenAmount.uiAmount,
}));

console.log('ALL token accounts (including zero):');
all.forEach(t => console.log(`  ${t.mint} — ${t.ui} (raw: ${t.amount})`));
console.log(`\nTotal: ${all.length} (non-zero: ${all.filter(t=>Number(t.amount)>0).length})`);
