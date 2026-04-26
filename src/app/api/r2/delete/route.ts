
import { NextResponse, type NextRequest } from 'next/server';
import { s3Client, BUCKET_NAME } from '@/lib/s3-client';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const idToken = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!idToken || !adminAuth) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const { key } = await request.json();

    // Verification: Ensure user is only deleting their own files
    // Key format: path/{uid}/uuid-filename
    if (!key.includes(`/${uid}/`)) {
      return NextResponse.json({ message: 'Forbidden: Cannot delete files belonging to other users' }, { status: 403 });
    }

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('R2 Delete error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
