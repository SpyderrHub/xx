
import { NextResponse, type NextRequest } from 'next/server';
import { s3Client, BUCKET_NAME } from '@/lib/s3-client';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { adminAuth } from '@/lib/firebase-admin';

/**
 * Securely deletes an object from R2.
 * Verifies that the object key belongs to the authenticated user.
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const idToken = authHeader?.split('Bearer ')[1];
    
    if (!idToken || !adminAuth) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const { key } = await request.json();

    if (!key) {
      return NextResponse.json({ message: 'Key required' }, { status: 400 });
    }

    // Verification: Ensure key follows path structure and belongs to this user
    // Expected structure: category/uid/...
    const keyParts = key.split('/');
    if (keyParts.length < 2 || keyParts[1] !== uid) {
      return NextResponse.json({ 
        message: 'Forbidden: You can only delete your own assets' 
      }, { status: 403 });
    }

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('R2 Delete error:', error);
    return NextResponse.json({ message: error.message || 'Deletion Error' }, { status: 500 });
  }
}
