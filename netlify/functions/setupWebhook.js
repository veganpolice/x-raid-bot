import { twitterClient } from './utils/twitterClient.js';
import dotenv from 'dotenv';

dotenv.config();

export const handler = async () => {
  try {
    // Register webhook URL with Twitter
    const webhookUrl = process.env.WEBHOOK_URL + '/.netlify/functions/tweetListener';
    await twitterClient.v2.updateWebhook(webhookUrl);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Webhook setup successful' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to setup webhook' }),
    };
  }
}