// ── Token Scanner — pump.fun graduated + bonding curve ──

export async function scanGraduated(limit = 200) {
  try {
    const tokens = [];
    for (let offset = 0; offset < limit; offset += 50) {
      const res = await fetch(`https://frontend-api-v3.pump.fun/coins?offset=${offset}&limit=50&sort=last_trade_timestamp&order=DESC&complete=true&includeNsfw=false`);
      if (!res.ok) break;
      const batch = await res.json();
      if (!batch.length) break;
      tokens.push(...batch);
    }
    return tokens;
  } catch (e) {
    console.error('[SCANNER] graduated fetch error:', e.message);
    return [];
  }
}

export async function scanBondingCurve(limit = 100) {
  try {
    const tokens = [];
    for (let offset = 0; offset < limit; offset += 50) {
      const res = await fetch(`https://frontend-api-v3.pump.fun/coins?offset=${offset}&limit=50&sort=last_trade_timestamp&order=DESC&complete=false&includeNsfw=false`);
      if (!res.ok) break;
      const batch = await res.json();
      if (!batch.length) break;
      tokens.push(...batch);
    }
    return tokens;
  } catch (e) {
    console.error('[SCANNER] bonding fetch error:', e.message);
    return [];
  }
}

// ── Holder Analysis ──
export async function analyzeHolders(mint, rpcUrl) {
  try {
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 1,
        method: 'getTokenLargestAccounts',
        params: [mint]
      })
    });
    const { result } = await res.json();
    if (!result?.value?.length) return null;
    
    const holders = result.value;
    const totalSupply = holders.reduce((s, h) => s + Number(h.uiAmount || 0), 0);
    if (totalSupply === 0) return null;
    
    const top1Pct = (Number(holders[0]?.uiAmount || 0) / totalSupply) * 100;
    const top5Pct = (holders.slice(0, 5).reduce((s, h) => s + Number(h.uiAmount || 0), 0) / totalSupply) * 100;
    const top10Pct = (holders.slice(0, 10).reduce((s, h) => s + Number(h.uiAmount || 0), 0) / totalSupply) * 100;
    
    return {
      holderCount: holders.length,
      top1Pct: Math.round(top1Pct * 10) / 10,
      top5Pct: Math.round(top5Pct * 10) / 10,
      top10Pct: Math.round(top10Pct * 10) / 10,
      risky: top1Pct > 50
    };
  } catch {
    return null;
  }
}

// ── Narrative/Meta Detection ──
export function detectNarratives(tokens) {
  const wordCount = {};
  const wordTokens = {};
  const stopWords = new Set(['the','token','coin','sol','solana','pump','fun','meme','a','an','to','of','in','and','or','is','on','it','for','my','i','me','we','no','do','go','so','up','be','by','at','if','ai']);
  
  for (const t of tokens) {
    const text = `${t.name || ''} ${t.symbol || ''}`.toLowerCase();
    const words = text.split(/[^a-z0-9]+/).filter(w => w.length >= 3 && !stopWords.has(w));
    const seen = new Set();
    
    for (const word of words) {
      if (seen.has(word)) continue;
      seen.add(word);
      wordCount[word] = (wordCount[word] || 0) + 1;
      if (!wordTokens[word]) wordTokens[word] = [];
      wordTokens[word].push(t.symbol || t.name);
    }
  }
  
  return Object.entries(wordCount)
    .filter(([_, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([keyword, count]) => ({
      keyword,
      count,
      tokens: wordTokens[keyword]?.slice(0, 5) || []
    }));
}

export function getMetaBoost(token, narratives) {
  if (!narratives.length) return 0;
  const text = `${token.name || ''} ${token.symbol || ''}`.toLowerCase();
  let boost = 0;
  
  for (const n of narratives) {
    if (text.includes(n.keyword)) {
      if (n.count >= 10) boost = Math.max(boost, 3);
      else if (n.count >= 5) boost = Math.max(boost, 2);
      else boost = Math.max(boost, 1);
    }
  }
  return boost;
}

// ── Score a token ──
export function scoreToken(token, narratives = []) {
  let score = 0;
  const age = (Date.now() - new Date(token.created_timestamp).getTime()) / 60000;
  const replies = token.reply_count || 0;
  const isBonding = !token.complete;
  const bondingPct = token.real_sol_reserves ? (Number(token.real_sol_reserves) / 1e9 / 85) * 100 : 0;
  
  // Freshness
  if (age < 30) score += 3;
  else if (age < 120) score += 2;
  else if (age < 360) score += 1;
  
  // Social signal
  if (replies >= 20) score += 3;
  else if (replies >= 10) score += 2;
  else if (replies >= 5) score += 1;
  
  // Market cap proxy (usd_market_cap if available)
  const mcap = Number(token.usd_market_cap || 0);
  if (mcap > 50000 && mcap < 500000) score += 2;
  else if (mcap > 10000) score += 1;
  
  // Bonding curve progress
  if (isBonding) {
    if (bondingPct >= 60) score += 2;
    else if (bondingPct >= 40) score += 1;
    else score -= 1; // Too early
  }
  
  // Narrative boost
  score += getMetaBoost(token, narratives);
  
  return {
    score,
    age: Math.round(age),
    replies,
    mcap,
    isBonding,
    bondingPct: Math.round(bondingPct * 10) / 10
  };
}
