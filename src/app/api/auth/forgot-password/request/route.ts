import { NextResponse, type NextRequest } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { sendForgotPasswordEmail } from '@/lib/mail';

/**
 * Handles the initial "forgot password" request.
 * Generates an OTP and sends it to the provided email if the user exists.
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !adminAuth || !adminDb) {
      return NextResponse.json({ message: 'Valid email required' }, { status: 400 });
    }

    // 1. Verify user existence
    try {
      await adminAuth.getUserByEmail(email);
    } catch (e: any) {
      // Security practice: Don't explicitly say the email doesn't exist to prevent enumeration,
      // but in this dev-heavy studio environment, we'll return a clear error for better UX.
      return NextResponse.json({ message: 'No account found with this email' }, { status: 404 });
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // 3. Store in specific "forgot_password_otps" collection
    await adminDb.collection('forgot_password_otps').doc(email).set({
      email,
      code: otp,
      expiresAt,
      createdAt: new Date().toISOString()
    });

    // 4. Send Email
    try {
      await sendForgotPasswordEmail(email, otp);
    } catch (mailError: any) {
      console.error('[FORGOT_PASSWORD] SMTP Delivery failed:', mailError);
      return NextResponse.json({ 
        success: true, 
        message: 'Code generated, but email delivery failed.',
        debugCode: process.env.NODE_ENV === 'development' ? otp : undefined 
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Password reset code sent.',
      debugCode: process.env.NODE_ENV === 'development' ? otp : undefined 
    });
  } catch (error: any) {
    console.error('Forgot Password Request Error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
