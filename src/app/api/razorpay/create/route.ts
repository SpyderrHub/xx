import { NextResponse, type NextRequest } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { adminAuth } from '@/lib/firebase-admin';

// Map internal plan names to Razorpay Plan IDs
// TODO: Replace these placeholder IDs with your actual Razorpay Plan IDs from your dashboard.
const RAZORPAY_PLANS: Record<string, string> = {
  Creator: process.env.RAZORPAY_PLAN_ID_CREATOR || 'plan_OMg6A8a5tJ4VqP',
  Pro: process.env.RAZORPAY_PLAN_ID_PRO || 'plan_OMg7s5Z9g6g4sX',
  Business: process.env.RAZORPAY_PLAN_ID_BUSINESS || 'plan_OMg8p2gY8d6Z4T',
};

export async function POST(request: NextRequest) {
  if (!razorpay) {
    console.error('Razorpay is not initialized. Check your environment variables.');
    return NextResponse.json(
      { message: 'Payment service is not configured. Please contact support.' },
      { status: 500 }
    );
  }

  try {
    const idToken = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const { planName } = await request.json();

    if (!planName || !RAZORPAY_PLANS[planName]) {
      return NextResponse.json({ message: 'Invalid plan specified.' }, { status: 400 });
    }

    const razorpayPlanId = RAZORPAY_PLANS[planName];

    const subscription = await razorpay.subscriptions.create({
      plan_id: razorpayPlanId,
      customer_notify: 1,
      quantity: 1,
      total_count: 12, // For a yearly plan, adjust as needed
      notes: {
        firebase_uid: uid,
        plan_name: planName,
      },
    });

    return NextResponse.json({ subscriptionId: subscription.id });
  } catch (error: any) {
    console.error('Error creating Razorpay subscription:', error);
    return NextResponse.json(
      { message: error.message || 'An error occurred while creating the subscription.' },
      { status: 500 }
    );
  }
}
