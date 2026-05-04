
import { NextResponse, type NextRequest } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

/**
 * Validates a 6-digit OTP and marks the user as verified.
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const idToken = authHeader?.split('Bearer ')[1];
    const { code } = await request.json();
    
    if (!idToken || !adminAuth || !adminDb) {
      return NextResponse.json({ message: 'Authorization required' }, { status: 401 });
    }

    if (!code || code.length !== 6) {
      return NextResponse.json({ message: 'Valid 6-digit code required' }, { status: 400 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const email = decodedToken.email;
    const uid = decodedToken.uid;

    if (!email) return NextResponse.json({ message: 'Email missing' }, { status: 400 });

    // 1. Retrieve OTP from Firestore
    const otpSnap = await adminDb.collection('verification_otps').doc(email).get();
    
    if (!otpSnap.exists) {
      return NextResponse.json({ message: 'No code found for this email' }, { status: 404 });
    }

    const otpData = otpSnap.data();
    
    // 2. Validate Code & Expiry
    if (otpData?.code !== code) {
      return NextResponse.json({ message: 'Invalid verification code' }, { status: 400 });
    }

    if (new Date() > new Date(otpData?.expiresAt)) {
      return NextResponse.json({ message: 'Code has expired. Please request a new one.' }, { status: 400 });
    }

    // 3. Mark User as Verified in Firestore
    await adminDb.collection('users').doc(uid).update({
      isVerified: true,
      updatedAt: new Date().toISOString()
    });

    // 4. Cleanup OTP
    await adminDb.collection('verification_otps').doc(email).delete();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
