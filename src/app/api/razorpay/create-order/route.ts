import { NextResponse, type NextRequest } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { adminAuth } from '@/lib/firebase-admin';

// Prices matching the Subscription Page UI and Topup UI (in INR)
const PLAN_PRICES: Record<string, { monthly: number; yearly: number }> = {
  Starter: { monthly: 149, yearly: 1490 },
  Creator: { monthly: 399, yearly: 3990 },
  Pro: { monthly: 999, yearly: 9990 },
};

const TOPUP_PRICES: Record<string, number> = {
  'topup_25k': 49,
  'topup_50k': 99,
  'topup_100k': 149,
};

export async function POST(request: NextRequest) {
  if (!razorpay) {
    return NextResponse.json(
      { message: 'Razorpay is not configured. Please check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env.local file.' },
      { status: 500 }
    );
  }

  try {
    const idToken = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ message: 'Authentication required. Please log in again.' }, { status: 410 });
    }

    if (!adminAuth) {
      return NextResponse.json({ message: 'Firebase Admin SDK not initialized. Check your environment variables.' }, { status: 500 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const { planName, billingCycle } = await request.json();

    let amount = 0;
    
    // Check if it's a Top-up pack
    if (billingCycle === 'one-time') {
      amount = TOPUP_PRICES[planName];
      if (!amount) {
        return NextResponse.json({ message: `Invalid top-up pack: ${planName}` }, { status: 400 });
      }
    } else {
      // It's a standard subscription order (if used for one-time payment instead of subscription API)
      const prices = PLAN_PRICES[planName];
      if (!prices) {
        return NextResponse.json({ message: `Invalid plan selected: ${planName}` }, { status: 400 });
      }
      amount = billingCycle === 'yearly' ? prices.yearly : prices.monthly;
    }

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
      { message: error.description || error.message || 'Failed to create payment order' },
      { status: error.statusCode || 500 }
    );
  }
}
