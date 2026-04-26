
import { NextResponse, type NextRequest } from 'next/server';
import { s3Client, BUCKET_NAME, getPublicDomain } from '@/lib/s3-client';
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

    if (!s3Client || !BUCKET_NAME) {
      return NextResponse.json({ 
        message: 'Storage configuration missing. Please set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_BUCKET_NAME in .env.local' 
      }, { status: 500 });
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

    // Ensure we use a consistent Content-Type for the signature
    const mimeType = contentType || 'application/octet-stream';

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: mimeType,
    });

    // Generate signed URL (expires in 1 hour)
    // The signature will include the Content-Type, so the client MUST send the same header.
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    const publicDomain = getPublicDomain();

    return NextResponse.json({
      presignedUrl,
      key,
      publicUrl: publicDomain ? `${publicDomain}/${key}` : key,
    });
  } catch (error: any) {
    console.error('Presign error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
