import { Connection, Keypair, PublicKey, VersionedTransaction } from '@solana/web3.js';
import bs58 from 'bs58';

const RPC = process.env.RPC_URL;
const conn = new Connection(RPC, 'confirmed');
const wallet = Keypair.fromSecretKey(bs58.decode(process.env.WALLET_SECRET_B58));
const WALLET = wallet.publicKey.toBase58();
const SOL_MINT = 'So11111111111111111111111111111111111111112';
const SPL = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const T22 = new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');

async function getTokenAccounts() {
  const [a, b] = await Promise.all([
    conn.getParsedTokenAccountsByOwner(wallet.publicKey, { programId: SPL }),
    conn.getParsedTokenAccountsByOwner(wallet.publicKey, { programId: T22 }),
  ]);
  return [...a.value, ...b.value]
    .map(a => ({
      mint: a.account.data.parsed.info.mint,
      amount: a.account.data.parsed.info.tokenAmount.amount,
      uiAmount: a.account.data.parsed.info.tokenAmount.uiAmount,
      decimals: a.account.data.parsed.info.tokenAmount.decimals,
    }))
    .filter(t => Number(t.amount) > 0);
}

async function sellToken(mint, baseAmount, label) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const slip = 2000 + attempt * 1000; // aggressive slippage — just dump it
    console.log(`  [${label}] Attempt ${attempt} — slippage ${slip}bps`);
    try {
      // Try Jupiter first
      const qr = await fetch(`https://lite-api.jup.ag/swap/v1/quote?inputMint=${mint}&outputMint=${SOL_MINT}&amount=${baseAmount}&slippageBps=${slip}`);
      if (!qr.ok) {
        console.log(`  Jupiter quote failed (${qr.status}), trying PumpPortal...`);
        // Try PumpPortal for bonding curve tokens
        const ppRes = await fetch('https://pumpportal.fun/api/trade-local', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            publicKey: WALLET,
            action: 'sell',
            mint: mint,
            amount: baseAmount,
            denominatedInSol: 'false',
            slippage: slip / 100,
            priorityFee: 0.0005,
            pool: 'pump',
          }),
        });
        if (!ppRes.ok) { console.log(`  PumpPortal also failed (${ppRes.status})`); continue; }
        const ppTx = VersionedTransaction.deserialize(new Uint8Array(await ppRes.arrayBuffer()));
        ppTx.sign([wallet]);
        const ppSig = await conn.sendRawTransaction(ppTx.serialize(), { skipPreflight: true, maxRetries: 5 });
        console.log(`  PumpPortal TX: ${ppSig}`);
        await confirmTx(ppSig);
        return true;
      }
      const quote = await qr.json();
      console.log(`  Quote: ${(Number(quote.outAmount)/1e9).toFixed(6)} SOL`);

      const sr = await fetch('https://lite-api.jup.ag/swap/v1/swap', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteResponse: quote, userPublicKey: WALLET, wrapAndUnwrapSol: true, dynamicComputeUnitLimit: true, prioritizationFeeLamports: 200000 }),
      });
      if (!sr.ok) { console.log(`  Swap failed: ${sr.status}`); continue; }
      const { swapTransaction } = await sr.json();
      const tx = VersionedTransaction.deserialize(Buffer.from(swapTransaction, 'base64'));
      tx.sign([wallet]);
      const sig = await conn.sendRawTransaction(tx.serialize(), { skipPreflight: true, maxRetries: 5 });
      console.log(`  Jupiter TX: ${sig}`);
      await confirmTx(sig);
      return true;
    } catch (e) { console.log(`  Error: ${e.message}`); }
  }
  console.log(`  FAILED to sell ${mint}`);
  return false;
}

async function confirmTx(sig) {
  for (let i = 0; i < 30; i++) {
    const { value } = await conn.getSignatureStatus(sig);
    if (value?.confirmationStatus === 'confirmed' || value?.confirmationStatus === 'finalized') {
      console.log('  CONFIRMED');
      return true;
    }
    if (value?.err) { console.log('  TX error:', JSON.stringify(value.err)); return false; }
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log('  Timed out waiting for confirmation');
  return false;
}

async function main() {
  const startBal = await conn.getBalance(wallet.publicKey);
  console.log(`Wallet: ${WALLET}`);
  console.log(`Starting SOL: ${(startBal/1e9).toFixed(4)}`);
  
  const tokens = await getTokenAccounts();
  console.log(`\nFound ${tokens.length} token accounts with balance\n`);
  
  let sold = 0, failed = 0;
  for (const t of tokens) {
    console.log(`Selling ${t.mint} (${t.uiAmount} tokens)`);
    const ok = await sellToken(t.mint, t.amount, `${++sold}/${tokens.length}`);
    if (!ok) failed++;
    // Small delay between sells
    await new Promise(r => setTimeout(r, 1500));
  }
  
  const endBal = await conn.getBalance(wallet.publicKey);
  console.log(`\n=== DONE ===`);
  console.log(`Sold: ${sold - failed}/${tokens.length}`);
  console.log(`Failed: ${failed}`);
  console.log(`Final SOL: ${(endBal/1e9).toFixed(4)}`);
  console.log(`Recovered: ${((endBal - startBal)/1e9).toFixed(4)} SOL`);
}

main().catch(console.error);
