
import { NextResponse, type NextRequest } from 'next/server';
import { s3Client, BUCKET_NAME } from '@/lib/s3-client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { adminAuth } from '@/lib/firebase-admin';

/**
 * Generates a presigned URL for secure client-side upload to R2.
 * Enforces a path structure of: {path}/{uid}/{uuid}-{fileName}
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const idToken = authHeader?.split('Bearer ')[1];
    
    if (!idToken || !adminAuth) {
      return NextResponse.json({ message: 'Unauthorized: Missing token' }, { status: 401 });
    }

    // Verify user and get UID
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const { fileName, contentType, path } = await request.json();
    
    if (!path || !fileName) {
      return NextResponse.json({ message: 'Bad Request: Path and fileName required' }, { status: 400 });
    }

    // Enforce isolation: category/uid/random-file
    const safePath = path.replace(/^\/|\/$/g, ''); // strip leading/trailing slashes
    const key = `${safePath}/${uid}/${crypto.randomUUID()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return NextResponse.json({
      presignedUrl,
      key,
      publicUrl: `${process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN}/${key}`,
    });
  } catch (error: any) {
    console.error('Presign error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
