
import { NextResponse, type NextRequest } from 'next/server';
import { s3Client, BUCKET_NAME, getPublicDomain } from '@/lib/s3-client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { adminAuth } from '@/lib/firebase-admin';

/**
 * Generates a presigned URL for secure client-side upload to R2.
 * Enforces a unique, versioned path and aggressive 1-year immutable caching.
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const idToken = authHeader?.split('Bearer ')[1];
    
    if (!idToken || !adminAuth) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!s3Client || !BUCKET_NAME) {
      return NextResponse.json({ 
        message: 'Storage configuration missing.' 
      }, { status: 500 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const { fileName, contentType, path } = await request.json();
    
    if (!path || !fileName) {
      return NextResponse.json({ message: 'Path and fileName required' }, { status: 400 });
    }

    const safePath = path.replace(/^\/|\/$/g, '').toLowerCase();
    const allowedRoots = ['voices', 'avatars', 'users'];
    
    if (!allowedRoots.includes(safePath)) {
      return NextResponse.json({ message: 'Invalid storage root.' }, { status: 400 });
    }

    // Cache System: Every file gets a unique path via UUID. 
    // This allows us to use 'immutable' safely as a new version will always have a new URL.
    const key = `${safePath}/${uid}/${crypto.randomUUID()}-${fileName}`;
    const mimeType = contentType || 'application/octet-stream';

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: mimeType,
      // Aggressive 1-year immutable caching for all R2 assets
      CacheControl: 'public, max-age=31536000, immutable',
    });

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
