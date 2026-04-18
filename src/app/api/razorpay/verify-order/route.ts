import { NextResponse, type NextRequest } from 'next/server';
import crypto from 'crypto';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

const TOPUP_CREDITS: Record<string, number> = {
  'topup_25k': 25000,
  'topup_50k': 50000,
  'topup_100k': 100000,
};

export async function POST(request: NextRequest) {
  try {
    const idToken = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 410 });
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

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ message: 'Secret key not configured' }, { status: 500 });
    }

    // 1. Verify Razorpay Signature for Order
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    // 2. Identify Credit Amount
    const creditsToAdd = TOPUP_CREDITS[topupType];
    if (!creditsToAdd) {
      return NextResponse.json({ message: 'Invalid top-up pack' }, { status: 400 });
    }

    // 3. Atomically Update User Credits
    const userRef = adminDb.collection('users').doc(uid);
    
    await adminDb.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) throw new Error("User document does not exist");
      
      const currentCredits = userDoc.data()?.credits || 0;
      
      transaction.update(userRef, {
        credits: currentCredits + creditsToAdd,
        lastTopupAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Log the top-up transaction
      const topupRef = adminDb.collection('user_topups').doc();
      transaction.set(topupRef, {
        userId: uid,
        packId: topupType,
        creditsAdded: creditsToAdd,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        createdAt: new Date().toISOString(),
        status: 'success'
      });
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error verifying order payment:', error);
    return NextResponse.json({ message: error.message || 'Verification failed' }, { status: 500 });
  }
}
