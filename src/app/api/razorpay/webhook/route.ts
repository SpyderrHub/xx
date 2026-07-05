import { NextResponse, type NextRequest } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebase-admin';

// Map of Razorpay IDs to character credit amounts
const BUTTON_CREDIT_MAP: Record<string, number> = {
  'pl_T0oXNYcMxeNBOG': 25000,   // Lite Pack (Button)
  'pl_T0opo07PIT6g6U': 50000,   // Power Pack (Button)
  'pl_T0os3gC0kF4oVi': 100000,  // Studio Pack (Button)
  'topup_25k': 25000,           // Manual Top-up
  'topup_50k': 50000,           // Manual Top-up
  'topup_100k': 100000,         // Manual Top-up
};

/**
 * Razorpay Webhook Handler
 * Processes payment.captured and order.paid to ensure additive credits.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!signature || !secret || !adminDb) {
      console.error('[WEBHOOK] Initialization error: missing signature, secret or DB');
      return NextResponse.json({ message: 'Service unavailable' }, { status: 500 });
    }

    // 1. Verify Webhook Authenticity
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('[WEBHOOK] Authentication failed: invalid signature');
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    const eventData = JSON.parse(body);
    const event = eventData.event;

    // 2. Filter for success events
    if (event === 'payment.captured' || event === 'order.paid') {
      // Robust payload extraction
      const payload = eventData.payload.payment?.entity || eventData.payload.order?.entity;
      if (!payload) return NextResponse.json({ status: 'ok', message: 'No processable entity' });

      // In payment.captured, the entity is the payment. 
      // In order.paid, we should look specifically for the captured payment within the payload if possible.
      const payment = event === 'payment.captured' 
        ? payload 
        : (eventData.payload.payment?.entity || payload);

      const paymentId = payment.id;
      const orderId = payment.order_id;
      const email = payment.email;
      
      // Extraction of identification key
      const buttonId = payment.notes?.payment_button_id || 
                       payment.payment_link_id || 
                       payment.notes?.planName;

      console.log(`[WEBHOOK] Processing ${event} for ${email}. Pack ID: ${buttonId}, Payment: ${paymentId}`);

      // 3. Resolve Credits
      let creditsToAdd = BUTTON_CREDIT_MAP[buttonId] || 0;

      if (creditsToAdd === 0) {
        // Fallback to explicit credits note
        const noteCredits = parseInt(payment.notes?.credits || '0');
        if (noteCredits > 0) {
          creditsToAdd = noteCredits;
        } else {
            // Last resort: Amount calculation (₹49 -> 25k, ₹99 -> 50k, ₹149 -> 100k)
            const amountInInr = Math.round(payment.amount / 100);
            if (amountInInr === 49) creditsToAdd = 25000;
            else if (amountInInr === 99) creditsToAdd = 50000;
            else if (amountInInr === 149) creditsToAdd = 100000;
        }
      }

      if (creditsToAdd === 0) {
        console.warn(`[WEBHOOK] No credit mapping found for ID: ${buttonId}. Skipping credit addition.`);
        return NextResponse.json({ status: 'ok', message: 'No credits mapped' });
      }

      // 4. Identify User
      let uid = payment.notes?.userId;
      let userDocRef;

      if (uid) {
        userDocRef = adminDb.collection('users').doc(uid);
      } else {
        const userQuery = await adminDb.collection('users').where('email', '==', email).limit(1).get();
        if (userQuery.empty) {
          console.error(`[WEBHOOK] Identity failure: No user found for ${email}`);
          return NextResponse.json({ status: 'ok', message: 'User not found' });
        }
        userDocRef = userQuery.docs[0].ref;
        uid = userDocRef.id;
      }

      // 5. Execute Atomic Update
      const logRef = adminDb.collection('user_topups').doc(paymentId);

      await adminDb.runTransaction(async (transaction) => {
        const logSnap = await transaction.get(logRef);
        if (logSnap.exists) {
            console.log(`[WEBHOOK] Payment ${paymentId} already processed. Skipping.`);
            return;
        }
        
        const userSnap = await transaction.get(userDocRef);
        if (!userSnap.exists) return;
        
        const currentCredits = userSnap.data()?.credits || 0;

        // Apply additive credits
        transaction.update(userDocRef, {
          credits: currentCredits + creditsToAdd,
          lastTopupAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        // Audit Log
        transaction.set(logRef, {
          userId: uid,
          packId: buttonId || 'webhook_fallback',
          creditsAdded: creditsToAdd,
          razorpayPaymentId: paymentId,
          razorpayOrderId: orderId || 'order_ref',
          status: 'success',
          createdAt: new Date().toISOString(),
          method: 'razorpay_webhook'
        });
      });

      console.log(`[WEBHOOK] Successfully credited ${creditsToAdd} chars to ${uid}`);
    }

    return NextResponse.json({ status: 'ok', verified: true });
  } catch (error: any) {
    console.error('[WEBHOOK] Processing exception:', error);
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}

export async function GET() {
  return new NextResponse('Webhook Node Status: Online', { status: 200 });
}
