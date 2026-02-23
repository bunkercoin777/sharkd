import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

export async function tweet(text) {
  try {
    const { data } = await client.readWrite.v2.tweet(text);
    console.log(`[X] tweeted: ${data.id}`);
    return data.id;
  } catch (e) {
    console.error(`[X] tweet failed: ${e.message}`);
    return null;
  }
}

export async function reply(tweetId, text) {
  try {
    const { data } = await client.readWrite.v2.reply(text, tweetId);
    console.log(`[X] replied: ${data.id}`);
    return data.id;
  } catch (e) {
    console.error(`[X] reply failed: ${e.message}`);
    return null;
  }
}
