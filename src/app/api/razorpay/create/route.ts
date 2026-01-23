import { NextResponse, type NextRequest } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { adminAuth } from '@/lib/firebase-admin';

// Map internal plan names to Razorpay Plan IDs
const RAZORPAY_PLANS: Record<string, string> = {
  Creator: process.env.RAZORPAY_PLAN_ID_CREATOR || '',
  Pro: process.env.RAZORPAY_PLAN_ID_PRO || '',
  Business: process.env.RAZORPAY_PLAN_ID_BUSINESS || '',
};

export async function POST(request: NextRequest) {
  try {
    const idToken = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const { planName } = await request.json();

    if (!planName || !RAZORPAY_PLANS[planName]) {
      return new NextResponse('Invalid plan specified.', { status: 400 });
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
    return new NextResponse(
      'An error occurred while creating the subscription.',
      { status: 500 }
    );
  }
}
