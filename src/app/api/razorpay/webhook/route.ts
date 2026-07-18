
import { NextResponse, type NextRequest } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebase-admin';

/**
 * Razorpay Webhook Handler
 * Processes payment.captured and order.paid to handle asynchronous events.
 * Currently primarily used for monitoring subscription events.
 * One-time top-ups have been removed.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!signature || !secret || !adminDb) {
      console.error('[WEBHOOK] Initialization error: Missing signature, secret, or DB');
      return NextResponse.json({ message: 'Service unavailable' }, { status: 500 });
    }

    // 1. Verify Webhook Authenticity
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('[WEBHOOK] Invalid signature detected');
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    const eventData = JSON.parse(body);
    const event = eventData.event;

    // 2. Log events for audit
    console.log(`[WEBHOOK] Received event: ${event}`);

    // If needed, specific subscription lifecycle events can be handled here.
    // One-time top-up processing logic has been removed as per user request.

    return NextResponse.json({ status: 'ok', verified: true });
  } catch (error: any) {
    console.error('[WEBHOOK] Fatal processing exception:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return new NextResponse('Razorpay Webhook Handler Online', { status: 200 });
}
