
import { NextResponse, type NextRequest } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { sendVerificationEmail } from '@/lib/mail';

/**
 * Securely generates, stores, and sends a 6-digit OTP for email verification.
 * Verifies that the request comes from an authenticated user.
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const idToken = authHeader?.split('Bearer ')[1];
    
    if (!idToken || !adminAuth || !adminDb) {
      return NextResponse.json({ message: 'Authorization required' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const email = decodedToken.email;

    if (!email) {
      return NextResponse.json({ message: 'Email not found in token' }, { status: 400 });
    }

    // 1. Generate new 6-digit code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins

    // 2. Store in Firestore (Admin SDK)
    await adminDb.collection('verification_otps').doc(email).set({
      email,
      code: otp,
      expiresAt
    });

    // 3. Send via Resend SMTP
    try {
      await sendVerificationEmail(email, otp);
    } catch (mailError: any) {
      console.error('[API] SMTP Delivery failed:', mailError);
      // We still return success if stored in DB, but with a warning or debug info in dev
      return NextResponse.json({ 
        success: true, 
        message: 'Code generated, but email delivery failed. Check server logs.',
        debugCode: process.env.NODE_ENV === 'development' ? otp : undefined 
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Verification email sent successfully.',
      debugCode: process.env.NODE_ENV === 'development' ? otp : undefined 
    });
  } catch (error: any) {
    console.error('Resend OTP Error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
