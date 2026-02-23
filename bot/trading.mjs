import { connection, getKeypair, getWalletAddress, getTokenBalance } from './wallet.mjs';
import { VersionedTransaction } from '@solana/web3.js';

// ── Buy via PumpPortal (works for both bonding curve and graduated) ──
export async function buyToken(mint, solAmount) {
  const kp = getKeypair();
  
  const res = await fetch('https://pumpportal.fun/api/trade-local', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      publicKey: kp.publicKey.toBase58(),
      action: 'buy',
      mint,
      amount: solAmount,
      denominatedInSol: 'true',
      slippage: 20,
      priorityFee: 0.0005,
      pool: 'auto'
    })
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PumpPortal buy failed: ${res.status} ${text}`);
  }
  
  const data = await res.arrayBuffer();
  const tx = VersionedTransaction.deserialize(new Uint8Array(data));
  tx.sign([kp]);
  
  const sig = await connection.sendRawTransaction(tx.serialize(), {
    skipPreflight: true,
    maxRetries: 3
  });
  
  // Poll for confirmation
  const confirmed = await waitForConfirmation(sig);
  if (!confirmed) throw new Error(`Buy TX not confirmed: ${sig}`);
  
  return sig;
}

// ── Sell via Jupiter (graduated) or PumpPortal (bonding) ──
export async function sellToken(mint, tokenAmount, isBonding = false) {
  const kp = getKeypair();
  
  // Try 3 times with escalating slippage
  const slippages = [1500, 2000, 2500];
  
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      let sig;
      
      if (isBonding) {
        sig = await sellViaPumpPortal(mint, tokenAmount, kp);
      } else {
        sig = await sellViaJupiter(mint, tokenAmount, kp, slippages[attempt]);
      }
      
      const confirmed = await waitForConfirmation(sig);
      if (confirmed) return sig;
      
    } catch (e) {
      if (attempt === 2) throw e;
      await sleep(1000);
    }
  }
  
  throw new Error('All 3 sell attempts failed');
}

async function sellViaJupiter(mint, tokenAmount, kp, slippageBps) {
  const SOL = 'So11111111111111111111111111111111111111112';
  
  const quoteRes = await fetch(
    `https://lite-api.jup.ag/swap/v1/quote?inputMint=${mint}&outputMint=${SOL}&amount=${tokenAmount}&slippageBps=${slippageBps}`
  );
  if (!quoteRes.ok) throw new Error('Jupiter quote failed');
  const quote = await quoteRes.json();
  
  const swapRes = await fetch('https://lite-api.jup.ag/swap/v1/swap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quoteResponse: quote,
      userPublicKey: kp.publicKey.toBase58(),
      prioritizationFeeLamports: 200000,
      dynamicSlippage: { maxBps: slippageBps }
    })
  });
  if (!swapRes.ok) throw new Error('Jupiter swap failed');
  const { swapTransaction } = await swapRes.json();
  
  const txBuf = Buffer.from(swapTransaction, 'base64');
  const tx = VersionedTransaction.deserialize(txBuf);
  tx.sign([kp]);
  
  return await connection.sendRawTransaction(tx.serialize(), {
    skipPreflight: true,
    maxRetries: 3
  });
}

async function sellViaPumpPortal(mint, tokenAmount, kp) {
  const res = await fetch('https://pumpportal.fun/api/trade-local', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      publicKey: kp.publicKey.toBase58(),
      action: 'sell',
      mint,
      amount: tokenAmount,  // UI amount for sells
      denominatedInSol: 'false',
      slippage: 25,
      priorityFee: 0.0005,
      pool: 'auto'
    })
  });
  
  if (!res.ok) throw new Error(`PumpPortal sell failed: ${res.status}`);
  
  const data = await res.arrayBuffer();
  const tx = VersionedTransaction.deserialize(new Uint8Array(data));
  tx.sign([kp]);
  
  return await connection.sendRawTransaction(tx.serialize(), {
    skipPreflight: true,
    maxRetries: 3
  });
}

async function waitForConfirmation(sig, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const { value } = await connection.getSignatureStatus(sig);
      if (value?.confirmationStatus === 'confirmed' || value?.confirmationStatus === 'finalized') return true;
      if (value?.err) return false;
    } catch {}
    await sleep(2000);
  }
  return false;
}

// ── Price a token via Jupiter quote ──
export async function getTokenPrice(mint, tokenAmount) {
  try {
    const SOL = 'So11111111111111111111111111111111111111112';
    const res = await fetch(
      `https://lite-api.jup.ag/swap/v1/quote?inputMint=${mint}&outputMint=${SOL}&amount=${tokenAmount}&slippageBps=1500`
    );
    if (!res.ok) return null;
    const quote = await res.json();
    return { solValue: Number(quote.outAmount) / 1e9, quote };
  } catch {
    return null;
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
