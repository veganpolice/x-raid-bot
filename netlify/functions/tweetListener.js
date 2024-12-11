import { validateTwitterWebhook } from './utils/webhookValidator.js';
import { handleTweetInteraction } from './utils/tweetInteractions.js';

export const handler = async (event) => {
  try {
    // Validate the webhook request
    const validation = validateTwitterWebhook(event.headers['x-twitter-webhooks-signature']);
    if (!validation.isValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: validation.error || 'Unauthorized request' }),
      };
    }

    const payload = JSON.parse(event.body);
    
    // Check if this is a tweet from the specified account
    if (payload.tweet_create_events) {
      const tweet = payload.tweet_create_events[0];
      const targetUserId = process.env.TARGET_USER_ID;
      
      if (tweet.user.id_str === targetUserId) {
        const result = await handleTweetInteraction(tweet);
        
        if (!result.success) {
          return {
            statusCode: 500,
            body: JSON.stringify({ error: result.error }),
          };
        }
        
        return {
          statusCode: 200,
          body: JSON.stringify({ message: result.message }),
        };
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Event processed' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}