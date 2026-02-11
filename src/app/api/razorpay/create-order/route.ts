
import { NextResponse, type NextRequest } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { adminAuth } from '@/lib/firebase-admin';

const PLAN_PRICES: Record<string, { monthly: number; yearly: number }> = {
  Creator: { monthly: 2900, yearly: 27800 }, // In cents/paise (USD * 100)
  Pro: { monthly: 9900, yearly: 95000 },
};

export async function POST(request: NextRequest) {
  if (!razorpay) {
    return NextResponse.json({ message: 'Razorpay not configured' }, { status: 500 });
  }

  try {
    const idToken = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!idToken || !adminAuth) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const { planName, billingCycle } = await request.json();

    const planPriceObj = PLAN_PRICES[planName];
    if (!planPriceObj) {
      return NextResponse.json({ message: 'Invalid plan' }, { status: 400 });
    }

    const amount = planPriceObj[billingCycle as 'monthly' | 'yearly'];

    const order = await razorpay.orders.create({
      amount: amount, // Amount in paise/cents
      currency: 'USD',
      receipt: `receipt_${uid}_${Date.now()}`,
      notes: {
        userId: uid,
        planName,
        billingCycle,
      },
    });

    return NextResponse.json({ 
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
