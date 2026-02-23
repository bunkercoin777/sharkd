// Buy $SHARKD token — NEVER SELL
import { Connection, Keypair, VersionedTransaction } from '@solana/web3.js';
import bs58 from 'bs58';

const RPC = process.env.RPC_URL;
const conn = new Connection(RPC, 'confirmed');
const wallet = Keypair.fromSecretKey(bs58.decode(process.env.WALLET_SECRET_B58));
const WALLET = wallet.publicKey.toBase58();
const SHARKD_MINT = '9FxxWFyEquSswwCjAE46vVMAdi7bfiQqMNkYy3o7pump';

const SOL_AMOUNT = 0.5; // Buy 0.5 SOL worth

console.log(`Wallet: ${WALLET}`);
console.log(`Buying ${SOL_AMOUNT} SOL of $SHARKD...`);

const bal = await conn.getBalance(wallet.publicKey) / 1e9;
console.log(`Balance: ${bal.toFixed(4)} SOL`);

if (bal < SOL_AMOUNT + 0.01) {
  console.log('Not enough SOL');
  process.exit(1);
}

const res = await fetch('https://pumpportal.fun/api/trade-local', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    publicKey: WALLET,
    action: 'buy',
    mint: SHARKD_MINT,
    amount: SOL_AMOUNT,
    denominatedInSol: 'true',
    slippage: 25,
    priorityFee: 0.001,
    pool: 'pump',
  }),
});

if (!res.ok) {
  console.log(`PumpPortal error: ${res.status} ${await res.text()}`);
  process.exit(1);
}

const tx = VersionedTransaction.deserialize(new Uint8Array(await res.arrayBuffer()));
tx.sign([wallet]);
const sig = await conn.sendRawTransaction(tx.serialize(), { skipPreflight: true, maxRetries: 5 });
console.log(`TX sent: ${sig}`);

// Confirm
const start = Date.now();
while (Date.now() - start < 60000) {
  const { value } = await conn.getSignatureStatus(sig);
  if (value?.confirmationStatus === 'confirmed' || value?.confirmationStatus === 'finalized') {
    if (value.err) { console.log('TX failed:', value.err); process.exit(1); }
    console.log(`CONFIRMED! Bought $SHARKD for ${SOL_AMOUNT} SOL`);
    console.log(`TX: https://solscan.io/tx/${sig}`);
    process.exit(0);
  }
  await new Promise(r => setTimeout(r, 2000));
}
console.log('TX not confirmed in 60s');
