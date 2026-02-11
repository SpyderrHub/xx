
import { NextResponse, type NextRequest } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { adminAuth } from '@/lib/firebase-admin';

// Map plan types to Razorpay Plan IDs from environment variables
const RAZORPAY_PLAN_MAP: Record<string, string | undefined> = {
  'creator_monthly': process.env.RAZORPAY_PLAN_CREATOR_MONTHLY,
  'creator_yearly': process.env.RAZORPAY_PLAN_CREATOR_YEARLY,
  'pro_monthly': process.env.RAZORPAY_PLAN_PRO_MONTHLY,
  'pro_yearly': process.env.RAZORPAY_PLAN_PRO_YEARLY,
};

export async function POST(request: NextRequest) {
  if (!razorpay) {
    return NextResponse.json({ message: 'Razorpay keys not configured' }, { status: 500 });
  }

  try {
    const idToken = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!adminAuth) {
      return NextResponse.json({ message: 'Auth service not available' }, { status: 500 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const { planType } = await request.json();

    const planId = RAZORPAY_PLAN_MAP[planType];
    if (!planId) {
      return NextResponse.json({ message: `Invalid plan type: ${planType}` }, { status: 400 });
    }

    // Create Razorpay Subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: planType.includes('yearly') ? 1 : 12,
      notes: {
        userId: uid,
        planType: planType,
      },
    });

    return NextResponse.json({ 
      subscriptionId: subscription.id,
      keyId: process.env.RAZORPAY_KEY_ID 
    });
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
