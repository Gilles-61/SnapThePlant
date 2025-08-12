
import { NextResponse } from 'next/server';
import { updateUserSubscription } from '@/lib/user-service';

/**
 * Handles POST requests from Buy Me a Coffee webhooks.
 * See: https://developers.buymeacoffee.com/docs/webhook-events
 */
export async function POST(req: Request) {
  try {
    const secret = process.env.BUYMECOFFEE_WEBHOOK_SECRET;
    
    // 1. Verify the webhook signature/token for security
    const token = req.headers.get('x-buymeacoffee-webhook-token');
    if (!secret || token !== secret) {
      console.warn('Unauthorized webhook attempt');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const event = await req.json();

    // 2. Respond immediately with a 200 OK
    // This is crucial to prevent Buy Me a Coffee from resending the webhook.
    // The actual processing will happen after this response is sent.
    // Note: Vercel/serverless functions will continue execution after the response.
    const response = NextResponse.json({ message: 'Webhook received' }, { status: 200 });
    
    // 3. Process the event asynchronously
    processEvent(event);

    return response;

  } catch (error) {
    console.error('Error processing webhook:', error);
    // Return a generic error to avoid leaking implementation details
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * Processes the received webhook event.
 * @param event The event payload from Buy Me a Coffee.
 */
async function processEvent(event: any) {
  const eventType = event.type;
  const data = event.data;

  console.log(`Processing webhook event: ${eventType}`);

  if (!data || !data.supporter_email) {
    console.error('Webhook event is missing required data (supporter_email).');
    return;
  }

  const userEmail = data.supporter_email;
  let newStatus: 'free' | 'paid' = 'free';

  switch (eventType) {
    case 'membership.created':
    case 'membership.renewed':
      // Check if it's a valid plan (not a one-time donation)
      if (data.membership_level_id) {
        newStatus = 'paid';
        await updateUserSubscription(userEmail, newStatus);
        console.log(`Upgraded user ${userEmail} to ${newStatus}`);
      } else {
        console.log(`Received a one-time donation from ${userEmail}. No subscription change.`);
      }
      break;
    
    case 'membership.cancelled':
      newStatus = 'free';
      await updateUserSubscription(userEmail, newStatus);
      console.log(`Cancelled subscription for user ${userEmail}. Set to ${newStatus}`);
      break;

    default:
      console.log(`Ignoring unhandled event type: ${eventType}`);
      break;
  }
}
