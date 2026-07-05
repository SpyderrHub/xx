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
      console.error('[WEBHOOK] Initialization error');
      return NextResponse.json({ message: 'Service unavailable' }, { status: 500 });
    }

    // 1. Verify Webhook Authenticity
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    const eventData = JSON.parse(body);
    const event = eventData.event;

    // 2. Process success events
    if (event === 'payment.captured' || event === 'order.paid') {
      const payload = eventData.payload.payment?.entity || eventData.payload.order?.entity;
      if (!payload) return NextResponse.json({ status: 'ok' });

      const payment = event === 'payment.captured' ? payload : (eventData.payload.payment?.entity || payload);
      const paymentId = payment.id;
      const orderId = payment.order_id;
      const email = payment.email;
      
      const packId = payment.notes?.planName || 
                    payment.notes?.payment_button_id || 
                    payment.payment_link_id;

      // 3. Resolve Credits
      let creditsToAdd = BUTTON_CREDIT_MAP[packId] || 0;
      if (creditsToAdd === 0 && payment.notes?.credits) {
        creditsToAdd = parseInt(payment.notes.credits);
      }

      if (creditsToAdd === 0) {
        // Amount calculation fallback (₹49 -> 25k, ₹99 -> 50k, ₹149 -> 100k)
        const inr = Math.round(payment.amount / 100);
        if (inr === 49) creditsToAdd = 25000;
        else if (inr === 99) creditsToAdd = 50000;
        else if (inr === 149) creditsToAdd = 100000;
      }

      if (creditsToAdd === 0) {
        console.warn(`[WEBHOOK] No credit mapping for pack: ${packId}`);
        return NextResponse.json({ status: 'ok', message: 'No credits mapped' });
      }

      // 4. Identify User (Priority: Note -> Email)
      let uid = payment.notes?.userId;
      let userDocRef;

      if (uid) {
        userDocRef = adminDb.collection('users').doc(uid);
      } else if (email) {
        const userQuery = await adminDb.collection('users').where('email', '==', email).limit(1).get();
        if (!userQuery.empty) {
          userDocRef = userQuery.docs[0].ref;
          uid = userDocRef.id;
        }
      }

      if (!userDocRef) {
        console.error(`[WEBHOOK] User identity lost for payment: ${paymentId}`);
        return NextResponse.json({ status: 'ok', error: 'User not identified' });
      }

      // 5. Execute Atomic Update
      const logRef = adminDb.collection('user_topups').doc(paymentId);

      await adminDb.runTransaction(async (transaction) => {
        const logSnap = await transaction.get(logRef);
        if (logSnap.exists) return; // Prevent double crediting
        
        const userSnap = await transaction.get(userDocRef);
        if (!userSnap.exists) return;
        
        const currentCredits = userSnap.data()?.credits || 0;

        transaction.update(userDocRef, {
          credits: currentCredits + creditsToAdd,
          lastTopupAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        transaction.set(logRef, {
          userId: uid,
          packId: packId || 'manual',
          creditsAdded: creditsToAdd,
          previousBalance: currentCredits,
          newBalance: currentCredits + creditsToAdd,
          razorpayPaymentId: paymentId,
          razorpayOrderId: orderId || 'N/A',
          status: 'success',
          createdAt: new Date().toISOString(),
          method: 'razorpay_webhook'
        });
      });

      console.log(`[WEBHOOK] Credited ${creditsToAdd} to ${uid}`);
    }

    return NextResponse.json({ status: 'ok', verified: true });
  } catch (error: any) {
    console.error('[WEBHOOK] Processing exception:', error);
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}

export async function GET() {
  return new NextResponse('Webhook Online', { status: 200 });
}
