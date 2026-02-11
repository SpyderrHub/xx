import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'Payment service is disabled.' }, { status: 404 });
}
