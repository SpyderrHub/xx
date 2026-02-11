
import { NextResponse, type NextRequest } from 'next/server';
import { Cashfree } from '@/lib/cashfree';
import { adminAuth } from '@/lib/firebase-admin';

const PLAN_PRICES: Record<string, { monthly: number; yearly: number }> = {
  Creator: { monthly: 2499, yearly: 23999 },
  Pro: { monthly: 7999, yearly: 76999 },
};

export async function POST(request: NextRequest) {
  try {
    // 1. Check for Firebase Admin SDK
    if (!adminAuth) {
      console.error('Firebase Admin SDK not initialized. Check your environment variables.');
      return NextResponse.json({ message: 'Backend service unavailable: Firebase Admin SDK not configured.' }, { status: 500 });
    }

    // 2. Check for Cashfree Credentials
    if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
      console.error('Cashfree credentials missing.');
      return NextResponse.json({ message: 'Backend service unavailable: Cashfree API keys not configured.' }, { status: 500 });
    }

    // 3. Verify User Token
    const authHeader = request.headers.get('authorization');
    const idToken = authHeader?.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : null;
    
    if (!idToken) {
      return NextResponse.json({ message: 'Authentication required: No token provided.' }, { status: 401 });
    }

    let uid: string;
    let userEmail: string;
    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      uid = decodedToken.uid;
      userEmail = decodedToken.email || '';
    } catch (e: any) {
      console.error('Token verification failed:', e.message);
      return NextResponse.json({ message: 'Authentication failed: Invalid or expired session.' }, { status: 401 });
    }

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
        customer_phone: "9999999999", // Required by Cashfree
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
    const cashfreeError = error.response?.data?.message || error.message;
    console.error('Cashfree Order Error:', cashfreeError);
    
    // Specifically handle Cashfree authentication errors (wrong App ID or Secret)
    if (cashfreeError?.toLowerCase().includes('authentication') || error.response?.status === 401) {
      return NextResponse.json({ message: 'Cashfree Authentication Failed: Please check your CASHFREE_APP_ID and CASHFREE_SECRET_KEY in .env.local' }, { status: 500 });
    }

    return NextResponse.json(
      { message: cashfreeError || 'Failed to initiate payment session' },
      { status: 500 }
    );
  }
}
