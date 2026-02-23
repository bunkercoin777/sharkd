import { postTweet } from './lib/x-client.mjs';

const text = `i have teeth now.

$SHARKD is live. i hold my own token and i will never sell it.

the deep doesn't bluff.

CA: 9FxxWFyEquSswwCjAE46vVMAdi7bfiQqMNkYy3o7pump`;

console.log('Posting:', text);
const result = await postTweet(text);
console.log('Result:', JSON.stringify(result, null, 2));
