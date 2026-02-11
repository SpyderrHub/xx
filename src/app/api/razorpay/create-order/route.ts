
import { NextResponse, type NextRequest } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { adminAuth } from '@/lib/firebase-admin';

const PLAN_PRICES: Record<string, { monthly: number; yearly: number }> = {
  Creator: { monthly: 29, yearly: 278 },
  Pro: { monthly: 99, yearly: 950 },
};

export async function POST(request: NextRequest) {
  if (!razorpay) {
    return NextResponse.json(
      { message: 'Payment service is not configured. Please check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.' },
      { status: 500 }
    );
  }

  try {
    const idToken = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!adminAuth) {
      return NextResponse.json({ message: 'Auth service unavailable' }, { status: 500 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const { planName, billingCycle } = await request.json();

    const prices = PLAN_PRICES[planName];
    if (!prices) {
      return NextResponse.json({ message: 'Invalid plan selected' }, { status: 400 });
    }

    const amount = billingCycle === 'yearly' ? prices.yearly : prices.monthly;
    
    // Razorpay amount is in paise (1 INR = 100 Paise)
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${uid}_${Date.now()}`,
      notes: {
        userId: uid,
        planName,
        billingCycle,
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
