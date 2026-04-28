
import { NextResponse } from 'next/server';

/**
 * Legacy endpoint deactivated.
 * Returns 410 Gone with 1-year cache for any GET checks.
 */

export async function GET() {
  return new NextResponse(null, { 
    status: 410,
    headers: { 'Cache-Control': 'public, max-age=31536000, immutable' }
  });
}

export async function POST() {
  return NextResponse.json({ message: 'This endpoint is no longer active.' }, { status: 410 });
}
