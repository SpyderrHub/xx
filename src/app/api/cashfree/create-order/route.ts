
import { NextResponse, type NextRequest } from 'next/server';
import { Cashfree } from '@/lib/cashfree';
import { adminAuth } from '@/lib/firebase-admin';

const PLAN_PRICES: Record<string, { monthly: number; yearly: number }> = {
  Creator: { monthly: 2499, yearly: 23999 },
  Pro: { monthly: 7999, yearly: 76999 },
};

export async function POST(request: NextRequest) {
  try {
    const idToken = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!idToken || !adminAuth) {
      return NextResponse.json({ message: 'Unauthorized or service unavailable' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const userEmail = decodedToken.email || '';

    const { planName, billingCycle } = await request.json();
    const prices = PLAN_PRICES[planName];

    if (!prices) {
      return NextResponse.json({ message: 'Invalid plan selected' }, { status: 400 });
    }

    const amount = billingCycle === 'yearly' ? prices.yearly : prices.monthly;
    const orderId = `order_${uid}_${Date.now()}`;

    const requestBody = {
      order_amount: amount,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: uid,
        customer_email: userEmail,
        customer_phone: "9999999999", // Placeholder as Cashfree requires a phone number
      },
      order_meta: {
        return_url: `${request.nextUrl.origin}/dashboard/subscription?order_id={order_id}`,
        notify_url: `${request.nextUrl.origin}/api/cashfree/webhook`,
        payment_methods: "cc,dc,nb,upi"
      },
      order_note: `${planName} Plan (${billingCycle})`
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", requestBody);
    
    return NextResponse.json({
      payment_session_id: response.data.payment_session_id,
      order_id: response.data.order_id,
    });
  } catch (error: any) {
    console.error('Cashfree Order Error:', error.response?.data || error.message);
    return NextResponse.json(
      { message: error.response?.data?.message || 'Failed to initiate payment session' },
      { status: 500 }
    );
  }
}
