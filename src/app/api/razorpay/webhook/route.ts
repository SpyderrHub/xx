import { NextResponse } from 'next/server';

/**
 * This route has been deactivated and removed as per user request.
 * Razorpay webhooks are no longer used in this application.
 */

export async function GET() {
  return new NextResponse(null, { status: 410 });
}

export async function POST() {
  return new NextResponse(null, { status: 410 });
}
