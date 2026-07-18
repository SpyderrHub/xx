
import { NextResponse } from 'next/server';

/**
 * Endpoint for one-time top-up verification.
 * Deactivated as per user request to remove top-ups.
 */
export async function POST() {
  return NextResponse.json({ message: 'Top-ups are no longer available.' }, { status: 410 });
}
