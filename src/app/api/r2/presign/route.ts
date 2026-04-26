
import { NextResponse, type NextRequest } from 'next/server';
import { s3Client, BUCKET_NAME } from '@/lib/s3-client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const idToken = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!idToken || !adminAuth) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const { fileName, contentType, path } = await request.json();
    
    // Enforce folder structure: uploads/{uid}/{path}/{fileName}
    const key = `${path}/${uid}/${crypto.randomUUID()}-${fileName}`;

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
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
