
import { NextResponse, type NextRequest } from 'next/server';
import crypto from 'crypto';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

const REFERRAL_REWARD_CREDITS = 5000;

export async function POST(request: NextRequest) {
  try {
    const idToken = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!adminAuth || !adminDb) {
      return NextResponse.json({ message: 'Backend services not available' }, { status: 500 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
      planType,
    } = await request.json();

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ message: 'Secret key not configured' }, { status: 500 });
    }

    // Verify signature for Subscriptions: payment_id + "|" + subscription_id
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_payment_id + '|' + razorpay_subscription_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    const planName = planType.split('_')[0];
    const billingCycle = planType.split('_')[1];
    
    const creditsMap: Record<string, number> = {
      starter: 50000,
      creator: 300000,
      pro: 1000000,
    };

    const newCredits = creditsMap[planName] || 10000;
    const expiryDate = new Date();
    if (billingCycle === 'yearly') {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    }

    // Use a transaction to update the user's plan and potentially reward the referrer
    await adminDb.runTransaction(async (transaction) => {
      const userRef = adminDb.collection('users').doc(uid);
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists) throw new Error("User document not found");
      const userData = userDoc.data();
      const previousPlan = userData?.plan || 'free';
      const referredBy = userData?.referredBy;

      // 1. Update the Buyer's Data
      transaction.update(userRef, {
        plan: planName,
        credits: newCredits,
        paymentStatus: 'active',
        subscriptionId: razorpay_subscription_id,
        currentPeriodEnd: expiryDate.toISOString(),
        billingCycle: billingCycle,
        updatedAt: new Date().toISOString(),
      });

      // 2. Handle Referral Reward (Only if it's the first purchase)
      if (referredBy && previousPlan === 'free') {
        const referrerRef = adminDb.collection('users').doc(referredBy);
        const referrerDoc = await transaction.get(referrerRef);

        if (referrerDoc.exists) {
          const currentReferrerCredits = referrerDoc.data()?.credits || 0;
          const currentReferralCount = referrerDoc.data()?.referralCount || 0;
          
          // Add 5000 credits to referrer and increment count
          transaction.update(referrerRef, {
            credits: currentReferrerCredits + REFERRAL_REWARD_CREDITS,
            referralCount: currentReferralCount + 1,
            updatedAt: new Date().toISOString()
          });

          // Update the referral log in the referrer's collection to 'completed'
          const referralLogRef = adminDb.collection('users').doc(referredBy).collection('referrals').doc(uid);
          transaction.update(referralLogRef, {
            status: 'completed',
            completedAt: new Date().toISOString(),
            rewardClaimed: true
          });
        }
      }

      // 3. Log the subscription event
      const subLogRef = adminDb.collection('user_subscriptions').doc();
      transaction.set(subLogRef, {
        userId: uid,
        planType,
        razorpaySubscriptionId: razorpay_subscription_id,
        razorpayPaymentId: razorpay_payment_id,
        status: 'active',
        startDate: new Date().toISOString(),
        nextBillingDate: expiryDate.toISOString(),
        createdAt: new Date().toISOString(),
      });
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ message: error.message || 'Verification failed' }, { status: 500 });
  }
}
