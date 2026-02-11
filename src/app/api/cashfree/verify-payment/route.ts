
import { NextResponse, type NextRequest } from 'next/server';
import { Cashfree } from '@/lib/cashfree';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

const PLAN_CREDITS: Record<string, number> = {
  creator: 500000,
  pro: 2000000,
  business: 10000000,
};

export async function POST(request: NextRequest) {
  try {
    const idToken = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!idToken || !adminAuth || !adminDb) {
      return NextResponse.json({ message: 'Unauthorized or service unavailable' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const { orderId, planName, billingCycle } = await request.json();

    // Fetch order status from Cashfree
    const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
    const payments = response.data;
    
    // Find the successful payment
    const successPayment = payments.find((p: any) => p.payment_status === 'SUCCESS');

    if (!successPayment) {
      return NextResponse.json({ success: false, message: 'No successful payment found for this order.' });
    }

    // Update User Subscription and Credits
    const planKey = planName.toLowerCase();
    const newCredits = PLAN_CREDITS[planKey] || 10000;
    const expiryDate = new Date();
    if (billingCycle === 'yearly') {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    }

    const userRef = adminDb.collection('users').doc(uid);
    await userRef.update({
      plan: planKey,
      credits: newCredits,
      paymentStatus: 'active',
      subscriptionId: orderId,
      currentPeriodEnd: expiryDate.toISOString(),
      billingCycle: billingCycle,
      updatedAt: new Date().toISOString(),
    });

    // Record transaction
    await adminDb.collection('subscriptions').add({
      userId: uid,
      planId: planKey,
      paymentId: successPayment.cf_payment_id,
      orderId: orderId,
      amount: successPayment.payment_amount,
      status: 'active',
      createdAt: new Date().toISOString(),
      expiryDate: expiryDate.toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Cashfree Verification Error:', error.response?.data || error.message);
    return NextResponse.json(
      { message: error.response?.data?.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
