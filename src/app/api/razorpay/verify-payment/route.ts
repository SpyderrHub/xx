
import { NextResponse, type NextRequest } from 'next/server';
import crypto from 'crypto';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

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
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
      planType,
    } = await request.json();

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ message: 'Secret key not configured' }, { status: 500 });
    }

    // Verify signature for Subscriptions: payment_id + "|" + subscription_id
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_payment_id + '|' + razorpay_subscription_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    // Update User Credits and Plan
    const planName = planType.split('_')[0];
    const billingCycle = planType.split('_')[1];
    
    const creditsMap: Record<string, number> = {
      creator: 500000,
      pro: 2000000,
    };

    const newCredits = creditsMap[planName] || 10000;
    const expiryDate = new Date();
    if (billingCycle === 'yearly') {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    }

    const userRef = adminDb.collection('users').doc(uid);
    await userRef.update({
      plan: planName,
      credits: newCredits,
      paymentStatus: 'active',
      subscriptionId: razorpay_subscription_id,
      currentPeriodEnd: expiryDate.toISOString(),
      billingCycle: billingCycle,
      updatedAt: new Date().toISOString(),
    });

    // Save to user_subscriptions collection as requested
    await adminDb.collection('user_subscriptions').add({
      userId: uid,
      planType,
      razorpaySubscriptionId: razorpay_subscription_id,
      razorpayPaymentId: razorpay_payment_id,
      status: 'active',
      startDate: new Date().toISOString(),
      nextBillingDate: expiryDate.toISOString(),
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ message: error.message || 'Verification failed' }, { status: 500 });
  }
}
