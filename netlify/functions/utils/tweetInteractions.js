import { twitterClient } from './twitterClient.js';

export async function handleTweetInteraction(tweet) {
  try {
    // Like the tweet
    await twitterClient.v2.like(process.env.BOT_USER_ID, tweet.id_str);
    
    // Reply to the tweet
    await twitterClient.v2.reply(
      process.env.TWEET_COMMENT,
      tweet.id_str
    );

    return {
      success: true,
      message: 'Tweet liked and commented successfully'
    };
  } catch (error) {
    console.error('Error interacting with tweet:', error);
    return {
      success: false,
      error: error.message
    };
  }
}