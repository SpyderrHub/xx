import { NextResponse, type NextRequest } from 'next/server';
import { s3Client, BUCKET_NAME, getPublicDomain } from '@/lib/s3-client';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { adminAuth } from '@/lib/firebase-admin';

/**
 * Generates a presigned URL for secure client-side upload to R2.
 * Also generates a temporary signedReadUrl for secure access by external engines.
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
    const allowedRoots = ['voices', 'avatars', 'users', 'stt'];
    
    if (!allowedRoots.includes(safePath)) {
      return NextResponse.json({ message: 'Invalid storage root.' }, { status: 400 });
    }

    // Cache System: Every file gets a unique path via UUID. 
    const key = `${safePath}/${uid}/${crypto.randomUUID()}-${fileName}`;
    
    // Enforcement: Map paths to specific MIME types
    let mimeType = contentType || 'application/octet-stream';
    if (safePath === 'avatars' || safePath === 'users') {
      mimeType = 'image/webp';
    } else if (safePath === 'voices' || safePath === 'stt') {
      if (!contentType?.startsWith('audio/')) {
         mimeType = 'audio/mpeg';
      }
    }

    // 1. Create Upload URL (PUT)
    const putCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: mimeType,
      CacheControl: 'public, max-age=31536000, immutable',
    });

    // 2. Create Read URL (GET) - Valid for 1 hour
    const getCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const [presignedUrl, signedReadUrl] = await Promise.all([
      getSignedUrl(s3Client, putCommand, { expiresIn: 3600 }),
      getSignedUrl(s3Client, getCommand, { expiresIn: 3600 }),
    ]);

    const publicDomain = getPublicDomain();

    return NextResponse.json({
      presignedUrl,
      signedReadUrl,
      key,
      publicUrl: publicDomain ? `${publicDomain}/${key}` : key,
      enforcedMimeType: mimeType
    });
  } catch (error: any) {
    console.error('Presign error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
