import { NextResponse, type NextRequest } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

/**
 * Verifies the OTP and resets the user password using Admin SDK.
 */
export async function POST(request: NextRequest) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword || !adminAuth || !adminDb) {
      return NextResponse.json({ message: 'All fields required' }, { status: 400 });
    }

    // 1. Retrieve OTP from Firestore
    const otpSnap = await adminDb.collection('forgot_password_otps').doc(email).get();
    
    if (!otpSnap.exists) {
      return NextResponse.json({ message: 'Verification session expired' }, { status: 404 });
    }

    const otpData = otpSnap.data();
    
    // 2. Validate Code & Expiry
    if (otpData?.code !== code) {
      return NextResponse.json({ message: 'Invalid verification code' }, { status: 400 });
    }

    if (new Date() > new Date(otpData?.expiresAt)) {
      return NextResponse.json({ message: 'Code has expired' }, { status: 400 });
    }

    // 3. Find UID and Reset Password via Admin SDK
    const userRecord = await adminAuth.getUserByEmail(email);
    await adminAuth.updateUser(userRecord.uid, {
      password: newPassword
    });

    // 4. Cleanup
    await adminDb.collection('forgot_password_otps').doc(email).delete();

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error: any) {
    console.error('Password Reset Error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
