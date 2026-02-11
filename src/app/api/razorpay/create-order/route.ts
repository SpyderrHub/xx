import { NextResponse, type NextRequest } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { adminAuth } from '@/lib/firebase-admin';

const PLAN_PRICES: Record<string, { monthly: number; yearly: number }> = {
  creator: { monthly: 2900, yearly: 27800 }, // In cents/paise (USD * 100)
  pro: { monthly: 9900, yearly: 95000 },
};

export async function POST(request: NextRequest) {
  if (!razorpay) {
    return NextResponse.json({ message: 'Razorpay service is not configured. Check your environment variables (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET).' }, { status: 500 });
  }

  if (!adminAuth) {
    return NextResponse.json({ message: 'Firebase Admin SDK is not configured. Backend authentication is unavailable.' }, { status: 500 });
  }

  try {
    const authHeader = request.headers.get('authorization');
    const idToken = authHeader?.split('Bearer ')[1];

    if (!idToken) {
      return NextResponse.json({ message: 'Authentication token is missing.' }, { status: 401 });
    }

    let uid: string;
    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      uid = decodedToken.uid;
    } catch (e) {
      return NextResponse.json({ message: 'Invalid or expired authentication token.' }, { status: 401 });
    }

    const body = await request.json();
    const { planName, billingCycle } = body;

    if (!planName || !billingCycle) {
      return NextResponse.json({ message: 'Missing planName or billingCycle in request body.' }, { status: 400 });
    }

    const planKey = planName.toLowerCase();
    const planPriceObj = PLAN_PRICES[planKey];
    
    if (!planPriceObj) {
      return NextResponse.json({ message: `Invalid plan name provided: ${planName}` }, { status: 400 });
    }

    const amount = planPriceObj[billingCycle as 'monthly' | 'yearly'];
    
    if (typeof amount !== 'number') {
      return NextResponse.json({ message: `Invalid billing cycle provided: ${billingCycle}` }, { status: 400 });
    }

    const orderOptions = {
      amount: amount, // Amount in paise/cents
      currency: 'USD',
      receipt: `receipt_${uid}_${Date.now()}`,
      notes: {
        userId: uid,
        planName,
        billingCycle,
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    return NextResponse.json({ 
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    // Return a more descriptive error if possible
    const errorMessage = error.description || error.message || 'An internal error occurred while creating the order.';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
