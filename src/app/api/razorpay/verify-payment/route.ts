
import { NextResponse, type NextRequest } from 'next/server';
import crypto from 'crypto';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

const PLAN_CREDITS: Record<string, number> = {
  creator: 500000,
  pro: 2000000,
};

export async function POST(request: NextRequest) {
  if (!adminDb || !adminAuth) {
    return NextResponse.json({ message: 'Database service unavailable' }, { status: 500 });
  }

  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      planName,
      billingCycle 
    } = await request.json();

    // 1. Verify Signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) throw new Error('Razorpay secret not configured');

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ message: 'Invalid payment signature' }, { status: 400 });
    }

    // 2. Identify User
    const idToken = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!idToken) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // 3. Update User Data
    const userRef = adminDb.collection('users').doc(uid);
    const planKey = planName.toLowerCase();
    const credits = PLAN_CREDITS[planKey] || 10000;
    
    const expiryDate = new Date();
    if (billingCycle === 'yearly') {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    }

    await userRef.update({
      plan: planKey,
      credits: credits,
      paymentStatus: 'active',
      currentPeriodEnd: expiryDate.toISOString(),
      updatedAt: new Date().toISOString(),
      billingCycle: billingCycle,
    });

    // 4. Log Subscription
    await adminDb.collection('subscriptions').add({
      userId: uid,
      planId: planKey,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount: planName === 'Pro' ? (billingCycle === 'yearly' ? 950 : 99) : 29,
      status: 'active',
      startDate: new Date().toISOString(),
      expiryDate: expiryDate.toISOString(),
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Payment verification failed:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
