import { NextRequest, NextResponse } from 'next/headers';
import { headers } from 'next/headers';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebase-admin';

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // Conditionally verify webhook signature if secret is present
  if (webhookSecret) {
    const signature = headers().get('x-razorpay-signature');
    if (!signature) {
      return NextResponse.json({ error: 'No signature found' }, { status: 400 });
    }

    try {
      const shasum = crypto.createHmac('sha256', webhookSecret);
      shasum.update(rawBody);
      const digest = shasum.digest('hex');

      if (digest !== signature) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 400 }
        );
      }
    } catch (error: any) {
      console.error('Error verifying Razorpay signature:', error.message);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 500 });
    }
  } else {
    // This is insecure and should only be used in development
    console.warn('RAZORPAY_WEBHOOK_SECRET is not set. Skipping signature verification. DO NOT USE IN PRODUCTION.');
  }

  try {
    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const payload = event.payload;

    switch (eventType) {
      case 'subscription.activated':
        const { id: subscriptionId, notes, plan_id, current_start, current_end } = payload.subscription.entity;
        const uid = notes.firebase_uid;
        const planName = notes.plan_name;

        if (!uid) {
          console.error('Webhook Error: Firebase UID not found in subscription notes.');
          break;
        }

        const userRef = adminDb.collection('users').doc(uid);
        await userRef.update({
          plan: planName.toLowerCase(),
          subscriptionId: subscriptionId,
          paymentStatus: 'active',
          currentPeriodStart: new Date(current_start * 1000).toISOString(),
          currentPeriodEnd: new Date(current_end * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        });
        console.log(`Subscription activated for user ${uid}, plan ${planName}`);
        break;

      case 'subscription.cancelled':
        const cancelledSubscription = payload.subscription.entity;
        const cancelledUid = cancelledSubscription.notes.firebase_uid;

        if (!cancelledUid) {
          console.error('Webhook Error: Firebase UID not found in cancelled subscription notes.');
          break;
        }
        
        const cancelledUserRef = adminDb.collection('users').doc(cancelledUid);
        await cancelledUserRef.update({
          paymentStatus: 'cancelled',
          updatedAt: new Date().toISOString(),
        });
        console.log(`Subscription cancelled for user ${cancelledUid}`);
        break;

      default:
        console.log(`Unhandled Razorpay event type: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error handling Razorpay webhook:', error.message);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
