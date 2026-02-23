import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

const RPC = process.env.RPC_URL || 'https://api.mainnet-beta.solana.com';
export const connection = new Connection(RPC, 'confirmed');

let keypair;

export function initWallet() {
  const secret = process.env.WALLET_SECRET;
  if (!secret) throw new Error('WALLET_SECRET not set');
  
  // Support both base64 and base58
  try {
    const bytes = Buffer.from(secret, 'base64');
    if (bytes.length === 64) {
      keypair = Keypair.fromSecretKey(bytes);
    } else {
      keypair = Keypair.fromSecretKey(bs58.decode(secret));
    }
  } catch {
    keypair = Keypair.fromSecretKey(bs58.decode(secret));
  }
  
  return keypair.publicKey.toBase58();
}

export function getKeypair() {
  return keypair;
}

export function getWalletAddress() {
  return keypair?.publicKey?.toBase58();
}

export async function getBalance() {
  const bal = await connection.getBalance(keypair.publicKey);
  return bal / 1e9;
}

export async function getTokenBalance(mint) {
  try {
    const mintPk = new PublicKey(mint);
    const accounts = await connection.getParsedTokenAccountsByOwner(keypair.publicKey, { mint: mintPk });
    if (accounts.value.length === 0) return { balance: 0, account: null };
    const acc = accounts.value[0];
    const info = acc.account.data.parsed.info;
    return {
      balance: Number(info.tokenAmount.amount),
      uiBalance: Number(info.tokenAmount.uiAmount),
      decimals: info.tokenAmount.decimals,
      account: acc.pubkey.toBase58()
    };
  } catch {
    return { balance: 0, account: null };
  }
}
