import { NextResponse, type NextRequest } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { adminAuth } from '@/lib/firebase-admin';

// Map internal plan names to Razorpay Plan IDs for both monthly and yearly cycles
// TODO: Replace these placeholder IDs with your actual Razorpay Plan IDs from your dashboard.
const RAZORPAY_PLANS: Record<string, { monthly: string; yearly: string }> = {
  Creator: {
    monthly: process.env.RAZORPAY_PLAN_ID_CREATOR_MONTHLY || 'plan_OMg6A8a5tJ4VqP',
    yearly: process.env.RAZORPAY_PLAN_ID_CREATOR_YEARLY || 'plan_placeholder_creator_yearly',
  },
  Pro: {
    monthly: process.env.RAZORPAY_PLAN_ID_PRO_MONTHLY || 'plan_OMg7s5Z9g6g4sX',
    yearly: process.env.RAZORPAY_PLAN_ID_PRO_YEARLY || 'plan_placeholder_pro_yearly',
  },
  Business: {
    monthly: process.env.RAZORPAY_PLAN_ID_BUSINESS_MONTHLY || 'plan_OMg8p2gY8d6Z4T',
    yearly: process.env.RAZORPAY_PLAN_ID_BUSINESS_YEARLY || 'plan_placeholder_business_yearly',
  },
};


export async function POST(request: NextRequest) {
  if (!razorpay) {
    console.error('Razorpay is not initialized. Check your environment variables.');
    return NextResponse.json(
      { message: 'Payment service is not configured. Please contact support.' },
      { status: 500 }
    );
  }

  if (!adminAuth) {
    console.error('Firebase Admin SDK is not initialized. Check your environment variables.');
    return NextResponse.json(
      { message: 'Authentication service is not configured. Please contact support.' },
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

    const { planName, billingCycle } = await request.json();

    if (!planName || !billingCycle || !['monthly', 'yearly'].includes(billingCycle)) {
        return NextResponse.json({ message: 'Invalid plan or billing cycle specified.' }, { status: 400 });
    }

    const planGroup = RAZORPAY_PLANS[planName];
    if (!planGroup) {
      return NextResponse.json({ message: 'Invalid plan specified.' }, { status: 400 });
    }

    const razorpayPlanId = planGroup[billingCycle as 'monthly' | 'yearly'];
    if (!razorpayPlanId || razorpayPlanId.includes('placeholder')) {
        return NextResponse.json({ message: `Plan ID for ${planName} (${billingCycle}) is not configured.`}, { status: 400 });
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: razorpayPlanId,
      customer_notify: 1,
      quantity: 1,
      total_count: billingCycle === 'yearly' ? 12 : 24, // 12 cycles for yearly, 24 for monthly
      notes: {
        firebase_uid: uid,
        plan_name: planName,
        billing_cycle: billingCycle,
      },
    });

    return NextResponse.json({ subscriptionId: subscription.id });
  } catch (error: any) {
    console.error('Error creating Razorpay subscription:', error);
    // Provide a more descriptive error from Razorpay if available
    const errorMessage = error.error?.description || error.message || 'An error occurred while creating the subscription.';
    const statusCode = error.statusCode || 500;
    
    return NextResponse.json(
      { message: errorMessage },
      { status: statusCode }
    );
  }
}
