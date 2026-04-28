
import { NextResponse } from 'next/server';

/**
 * This route has been deactivated and removed as per user request.
 * Razorpay webhooks are no longer used in this application.
 * Returns 410 Gone with 1-year cache.
 */

export async function GET() {
  return new NextResponse(null, { 
    status: 410,
    headers: { 'Cache-Control': 'public, max-age=31536000, immutable' }
  });
}

export async function POST() {
  return new NextResponse(null, { status: 410 });
}
