import { NextResponse } from 'next/server';

/**
 * This route has been removed to resolve Vercel deployment duration errors.
 */

export async function GET() {
  return new NextResponse(null, { status: 410 });
}

export async function POST() {
  return new NextResponse(null, { status: 410 });
}
