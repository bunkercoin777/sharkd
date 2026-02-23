import { Connection, Keypair, PublicKey, VersionedTransaction } from '@solana/web3.js';
import bs58 from 'bs58';

const RPC = process.env.RPC_URL;
const conn = new Connection(RPC, 'confirmed');
const wallet = Keypair.fromSecretKey(bs58.decode(process.env.WALLET_SECRET_B58));
const WALLET = wallet.publicKey.toBase58();

const MINT = process.argv[2];
const BASE_AMOUNT = process.argv[3];
if (!MINT || !BASE_AMOUNT) { console.error('Usage: node sell-stuck.mjs <mint> <baseAmount>'); process.exit(1); }

const SOL = 'So11111111111111111111111111111111111111112';

async function sell() {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const slip = 1000 + attempt * 500;
    console.log(`Attempt ${attempt} — slippage ${slip}bps`);
    try {
      const qr = await fetch(`https://lite-api.jup.ag/swap/v1/quote?inputMint=${MINT}&outputMint=${SOL}&amount=${BASE_AMOUNT}&slippageBps=${slip}`);
      if (!qr.ok) { console.log('Quote failed:', qr.status); continue; }
      const quote = await qr.json();
      console.log(`Quote: ${(Number(quote.outAmount)/1e9).toFixed(6)} SOL`);

      const sr = await fetch('https://lite-api.jup.ag/swap/v1/swap', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteResponse: quote, userPublicKey: WALLET, wrapAndUnwrapSol: true, dynamicComputeUnitLimit: true, prioritizationFeeLamports: 200000 }),
      });
      if (!sr.ok) { console.log('Swap failed:', sr.status); continue; }
      const { swapTransaction } = await sr.json();
      const tx = VersionedTransaction.deserialize(Buffer.from(swapTransaction, 'base64'));
      tx.sign([wallet]);
      const sig = await conn.sendRawTransaction(tx.serialize(), { skipPreflight: true, maxRetries: 5 });
      console.log(`TX: ${sig}`);

      // Confirm
      for (let i = 0; i < 30; i++) {
        const { value } = await conn.getSignatureStatus(sig);
        if (value?.confirmationStatus === 'confirmed' || value?.confirmationStatus === 'finalized') {
          console.log('CONFIRMED');
          const bal = await conn.getBalance(wallet.publicKey);
          console.log(`Balance: ${(bal/1e9).toFixed(4)} SOL`);
          return;
        }
        if (value?.err) { console.log('TX error'); break; }
        await new Promise(r => setTimeout(r, 2000));
      }
    } catch (e) { console.log(`Error: ${e.message}`); }
  }
  console.log('All attempts failed');
}

sell();
