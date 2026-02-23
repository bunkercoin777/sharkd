import crypto from 'crypto';
import https from 'https';

const apiKey = process.env.X_API_KEY;
const apiSecret = process.env.X_API_SECRET;
const token = process.env.X_ACCESS_TOKEN;
const tokenSecret = process.env.X_ACCESS_SECRET;

export async function postTweet(text) {
  // RULES — hard enforced
  if (text.includes('vercel.app')) throw new Error('BLOCKED: no vercel links');
  if (text.includes('solscan.io')) throw new Error('BLOCKED: no solscan links');
  if (/crubs|afinity|retardbot|bunkercoin|democracy|nations/i.test(text)) throw new Error('BLOCKED: no previous projects');
  if (/send.*sol|airdrop|giveaway|free.*token/i.test(text)) throw new Error('BLOCKED: no sending tokens');
  if (/72\+?\s*(?:mainnet\s*)?trades|past.*wallet|previous.*trades|already.*traded|battle.?tested/i.test(text)) throw new Error('BLOCKED: no past wallet/trade references');

  const method = 'POST';
  const url = 'https://api.twitter.com/2/tweets';
  const body = JSON.stringify({ text });

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString('hex');

  const params = {
    oauth_consumer_key: apiKey,
    oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp,
    oauth_token: token,
    oauth_version: '1.0',
  };

  const paramStr = Object.keys(params).sort().map(k =>
    encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
  ).join('&');

  const baseStr = method + '&' + encodeURIComponent(url) + '&' + encodeURIComponent(paramStr);
  const sigKey = encodeURIComponent(apiSecret) + '&' + encodeURIComponent(tokenSecret);
  const sig = crypto.createHmac('sha1', sigKey).update(baseStr).digest('base64');

  const authParts = Object.keys(params).sort().map(k =>
    encodeURIComponent(k) + '="' + encodeURIComponent(params[k]) + '"'
  ).join(', ');
  const authHeader = 'OAuth ' + authParts + ', oauth_signature="' + encodeURIComponent(sig) + '"';

  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        if (res.statusCode === 201) {
          const data = JSON.parse(d);
          console.log(`[X] Posted: ${data.data.id}`);
          resolve(data);
        } else {
          console.error(`[X] Failed ${res.statusCode}: ${d}`);
          reject(new Error(`X API ${res.statusCode}: ${d}`));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

export async function deleteTweet(id) {
  const method = 'DELETE';
  const url = `https://api.twitter.com/2/tweets/${id}`;

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString('hex');

  const params = {
    oauth_consumer_key: apiKey,
    oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp,
    oauth_token: token,
    oauth_version: '1.0',
  };

  const paramStr = Object.keys(params).sort().map(k =>
    encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
  ).join('&');

  const baseStr = method + '&' + encodeURIComponent(url) + '&' + encodeURIComponent(paramStr);
  const sigKey = encodeURIComponent(apiSecret) + '&' + encodeURIComponent(tokenSecret);
  const sig = crypto.createHmac('sha1', sigKey).update(baseStr).digest('base64');

  const authParts = Object.keys(params).sort().map(k =>
    encodeURIComponent(k) + '="' + encodeURIComponent(params[k]) + '"'
  ).join(', ');
  const authHeader = 'OAuth ' + authParts + ', oauth_signature="' + encodeURIComponent(sig) + '"';

  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method,
      headers: { 'Authorization': authHeader },
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        console.log(`[X] Delete ${id}: ${res.statusCode}`);
        resolve(res.statusCode);
      });
    });
    req.on('error', reject);
    req.end();
  });
}
