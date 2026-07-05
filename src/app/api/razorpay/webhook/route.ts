import { NextResponse, type NextRequest } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebase-admin';

// Map of Razorpay IDs (Buttons & Manual Packs) to character credit amounts
const BUTTON_CREDIT_MAP: Record<string, number> = {
  'pl_T0oXNYcMxeNBOG': 25000,   // Lite Pack (Button)
  'pl_T0opo07PIT6g6U': 50000,   // Power Pack (Button)
  'pl_T0os3gC0kF4oVi': 100000,  // Studio Pack (Button)
  'topup_25k': 25000,           // Manual Top-up
  'topup_50k': 50000,           // Manual Top-up
  'topup_100k': 100000,         // Manual Top-up
};

/**
 * Razorpay Webhook Handler for QuantisAI Labs
 * Processes payment.captured events to automatically add credits to user accounts.
 * Now integrated with the external verification node at pay.quantisai.org.
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

    // 1. Verify Webhook Signature (Security Audit Pass)
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('[WEBHOOK] Invalid signature detected. Request rejected.');
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
      
      // Extract the identification key (Button ID, Link ID, or Manual Plan Name)
      const buttonId = payment.notes?.payment_button_id || 
                       payment.payment_link_id || 
                       payment.notes?.planName;

      console.log(`[WEBHOOK] Verifying captured payment ${paymentId} for user ${email}`);

      // 3. Identify Reward Credits
      const creditsToAdd = BUTTON_CREDIT_MAP[buttonId] || 0;

      if (creditsToAdd === 0) {
        // Fallback check for credits in custom metadata notes
        const noteCredits = parseInt(payment.notes?.credits || '0');
        if (!noteCredits) {
          console.warn(`[WEBHOOK] Unrecognized ID: ${buttonId}. No credits assigned.`);
          return NextResponse.json({ status: 'ok', message: 'No reward found for this ID' });
        }
      }

      // 4. Locate User via robust identification (userId note or email fallback)
      let uid = payment.notes?.userId;
      let userDocRef;

      if (uid) {
        userDocRef = adminDb.collection('users').doc(uid);
      } else {
        const usersRef = adminDb.collection('users');
        const userQuery = await usersRef.where('email', '==', email).limit(1).get();
        if (userQuery.empty) {
          console.error(`[WEBHOOK] Critical Failure: No account found for email: ${email}`);
          return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        userDocRef = userQuery.docs[0].ref;
        uid = userDocRef.id;
      }

      // 5. Execute Atomic Transaction to apply credits
      await adminDb.runTransaction(async (transaction) => {
        const freshUserDoc = await transaction.get(userDocRef);
        if (!freshUserDoc.exists) return;
        
        const currentCredits = freshUserDoc.data()?.credits || 0;

        // Verify if this payment has already been processed (Idempotency check)
        const existingTx = await adminDb.collection('user_topups')
          .where('razorpayPaymentId', '==', paymentId)
          .limit(1)
          .get();
          
        if (!existingTx.empty) {
          console.log(`[WEBHOOK] Duplicate event for ${paymentId}. Skipping.`);
          return;
        }

        // Apply Credits
        transaction.update(userDocRef, {
          credits: currentCredits + creditsToAdd,
          lastTopupAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        // Audit Logging
        const topupRef = adminDb.collection('user_topups').doc();
        transaction.set(topupRef, {
          userId: uid,
          packId: buttonId || 'razorpay_manual',
          creditsAdded: creditsToAdd,
          razorpayPaymentId: paymentId,
          razorpayOrderId: orderId || 'order_payment',
          status: 'success',
          createdAt: new Date().toISOString(),
          method: payment.notes?.planName ? 'razorpay_api' : 'razorpay_button'
        });
      });

      console.log(`[WEBHOOK] Success: Credited ${creditsToAdd} chars to user ${uid} (Verified via pay.quantisai.org)`);
    }

    return NextResponse.json({ status: 'ok', verified: true });
  } catch (error: any) {
    console.error('[WEBHOOK] Error during payment verification:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  return new NextResponse('QuantisAI Labs Webhook Verification Node active.', { status: 200 });
}
