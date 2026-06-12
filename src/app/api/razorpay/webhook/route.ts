
import { NextResponse, type NextRequest } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebase-admin';

// Map of Razorpay Payment Button IDs to character credit amounts
const BUTTON_CREDIT_MAP: Record<string, number> = {
  'pl_T0oXNYcMxeNBOG': 25000,   // Lite Pack
  'pl_T0opo07PIT6g6U': 50000,   // Power Pack
  'pl_T0os3gC0kF4oVi': 100000,  // Studio Pack
};

/**
 * Razorpay Webhook Handler
 * Processes payment.captured events to automatically add credits to user accounts.
 * Verification is required via RAZORPAY_KEY_SECRET.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!signature || !secret || !adminDb) {
      console.error('[WEBHOOK] Missing signature, secret, or database services.');
      return NextResponse.json({ message: 'Unauthorized or service unavailable' }, { status: 401 });
    }

    // 1. Verify Webhook Signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('[WEBHOOK] Invalid signature detected.');
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    const eventData = JSON.parse(body);
    const event = eventData.event;

    // 2. Handle Payment Captured Event
    if (event === 'payment.captured') {
      const payment = eventData.payload.payment.entity;
      const paymentId = payment.id;
      const orderId = payment.order_id;
      const email = payment.email;
      
      // Buttons don't always have order_id in the same way as API orders
      // We look for payment_link_id or notes which Razorpay Buttons use
      const buttonId = payment.notes?.payment_button_id || payment.payment_link_id;

      console.log(`[WEBHOOK] Processing captured payment ${paymentId} for ${email}`);

      // 3. Identify Credit Amount
      const creditsToAdd = BUTTON_CREDIT_MAP[buttonId] || 0;

      if (creditsToAdd === 0) {
        // Check if credits are defined in notes instead (fallback)
        const noteCredits = parseInt(payment.notes?.credits || '0');
        if (!noteCredits) {
          console.warn(`[WEBHOOK] No credit mapping found for button/link: ${buttonId}`);
          return NextResponse.json({ status: 'ok', message: 'No credits assigned to this button' });
        }
      }

      // 4. Find User by Email & Update Credits Atomically
      const usersRef = adminDb.collection('users');
      const userQuery = await usersRef.where('email', '==', email).limit(1).get();

      if (userQuery.empty) {
        console.error(`[WEBHOOK] No user found with email: ${email}`);
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      const userDoc = userQuery.docs[0];
      const uid = userDoc.id;

      await adminDb.runTransaction(async (transaction) => {
        const freshUserDoc = await transaction.get(userDoc.ref);
        const currentCredits = freshUserDoc.data()?.credits || 0;

        // Update User Balance
        transaction.update(userDoc.ref, {
          credits: currentCredits + creditsToAdd,
          lastTopupAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        // Log the Transaction
        const topupRef = adminDb.collection('user_topups').doc();
        transaction.set(topupRef, {
          userId: uid,
          packId: buttonId || 'razorpay_button',
          creditsAdded: creditsToAdd,
          razorpayPaymentId: paymentId,
          razorpayOrderId: orderId || 'button_payment',
          status: 'success',
          createdAt: new Date().toISOString(),
          method: 'razorpay_button'
        });
      });

      console.log(`[WEBHOOK] Successfully added ${creditsToAdd} credits to user ${uid}`);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('[WEBHOOK] Internal Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  return new NextResponse('Webhook endpoint active.', { status: 200 });
}
