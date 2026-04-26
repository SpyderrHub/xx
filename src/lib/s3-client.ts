
import { S3Client } from '@aws-sdk/client-s3';

/**
 * Cloudflare R2 S3-Compatible Client.
 * Credentials must be provided in .env.local.
 */

const getS3Client = () => {
  const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
  const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
  const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;

  if (!ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
    return null;
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
  });
};

export const s3Client = getS3Client();
export const BUCKET_NAME = process.env.R2_BUCKET_NAME;

/**
 * Sanitizes and returns the public domain for R2 assets.
 */
export const getPublicDomain = () => {
  const domain = process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN;
  if (!domain) return '';
  return domain.replace(/\/$/, ''); // Remove trailing slash
};
