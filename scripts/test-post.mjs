import crypto from 'crypto';
import https from 'https';

const apiKey = process.env.X_API_KEY;
const apiSecret = process.env.X_API_SECRET;
const token = process.env.X_ACCESS_TOKEN;
const tokenSecret = process.env.X_ACCESS_SECRET;

const method = 'POST';
const url = 'https://api.twitter.com/2/tweets';
const text = process.argv[2] || 'Systems online. SharkD is scanning the deep.\n\nsharkd.vercel.app';
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

const req = https.request(url, {
  method,
  headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', d);
  });
});
req.write(body);
req.end();
