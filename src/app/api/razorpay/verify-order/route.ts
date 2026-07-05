import { NextResponse, type NextRequest } from 'next/server';
import crypto from 'crypto';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

const TOPUP_CREDITS: Record<string, number> = {
  'topup_25k': 25000,
  'topup_50k': 50000,
  'topup_100k': 100000,
};

/**
 * Immediate verification called by the client-side checkout modal.
 * Uses a transaction with an idempotent document check to ensure credits are added safely.
 */
export async function POST(request: NextRequest) {
  try {
    const idToken = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!adminAuth || !adminDb) {
      return NextResponse.json({ message: 'Backend services not available' }, { status: 500 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      topupType,
    } = await request.json();

    console.log(`[VERIFY_ORDER] Start verification for Payment: ${razorpay_payment_id}, User: ${uid}`);

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('[VERIFY_ORDER] RAZORPAY_KEY_SECRET missing');
      return NextResponse.json({ message: 'Secret key not configured' }, { status: 500 });
    }

    // 1. Verify Razorpay Signature
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      console.error(`[VERIFY_ORDER] Signature mismatch for ${razorpay_payment_id}`);
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    // 2. Resolve Credit Amount
    const creditsToAdd = TOPUP_CREDITS[topupType];
    if (!creditsToAdd) {
      console.error(`[VERIFY_ORDER] Invalid pack: ${topupType}`);
      return NextResponse.json({ message: 'Invalid top-up pack' }, { status: 400 });
    }

    // 3. Atomically Update Credits with Idempotency
    // We use the payment ID as the document ID for the transaction log to prevent double-crediting
    const userRef = adminDb.collection('users').doc(uid);
    const logRef = adminDb.collection('user_topups').doc(razorpay_payment_id);
    
    let alreadyProcessed = false;

    await adminDb.runTransaction(async (transaction) => {
      const logSnap = await transaction.get(logRef);
      if (logSnap.exists) {
        alreadyProcessed = true;
        return;
      }

      const userSnap = await transaction.get(userRef);
      if (!userSnap.exists) throw new Error("User document not found");
      
      const currentCredits = userSnap.data()?.credits || 0;

      // Increment credits
      transaction.update(userRef, {
        credits: currentCredits + creditsToAdd,
        lastTopupAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Commit Audit Log
      transaction.set(logRef, {
        userId: uid,
        packId: topupType,
        creditsAdded: creditsToAdd,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        createdAt: new Date().toISOString(),
        status: 'success',
        method: 'razorpay_modal_verify'
      });
    });

    if (alreadyProcessed) {
      console.log(`[VERIFY_ORDER] Payment ${razorpay_payment_id} was already handled.`);
      return NextResponse.json({ success: true, message: 'Already processed' });
    }

    console.log(`[VERIFY_ORDER] Successfully added ${creditsToAdd} credits to ${uid}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[VERIFY_ORDER] Fatal Error:', error);
    return NextResponse.json({ message: error.message || 'Verification failed' }, { status: 500 });
  }
}
