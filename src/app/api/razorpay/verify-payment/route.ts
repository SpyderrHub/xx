import { NextResponse, type NextRequest } from 'next/server';
import crypto from 'crypto';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

const PLAN_CREDITS: Record<string, number> = {
  creator: 500000,
  pro: 2000000,
  business: 10000000,
};

export async function POST(request: NextRequest) {
  try {
    const idToken = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!adminAuth || !adminDb) {
      return NextResponse.json({ message: 'Backend services (Auth/DB) are not available.' }, { status: 500 });
    }

    await adminAuth.verifyIdToken(idToken);

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      planName,
      billingCycle,
    } = await request.json();

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ message: 'Payment verification failed: RAZORPAY_KEY_SECRET is not configured on the server.' }, { status: 500 });
    }

    // Step 1: Verify Signature using HMAC SHA256
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      console.error('Signature mismatch during payment verification');
      return NextResponse.json({ message: 'Payment verification failed: Invalid signature. This could indicate a tampered request.' }, { status: 400 });
    }

    // Step 2: Update User Subscription and Credits
    const planKey = planName.toLowerCase();
    const newCredits = PLAN_CREDITS[planKey] || 10000;
    const expiryDate = new Date();
    if (billingCycle === 'yearly') {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    }

    const userRef = adminDb.collection('users').doc(userId);
    await userRef.update({
      plan: planKey,
      credits: newCredits,
      paymentStatus: 'active',
      subscriptionId: razorpay_order_id,
      currentPeriodEnd: expiryDate.toISOString(),
      billingCycle: billingCycle,
      updatedAt: new Date().toISOString(),
    });

    // Step 3: Record transaction in a separate collection
    await adminDb.collection('subscriptions').add({
      userId,
      planId: planKey,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: 'active',
      createdAt: new Date().toISOString(),
      expiryDate: expiryDate.toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json(
      { message: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
