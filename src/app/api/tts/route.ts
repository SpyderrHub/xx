
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Proxy route for the TTS API to bypass browser CORS and SSL restrictions.
 * Supports both GET and POST methods for flexible integration and caching.
 * Uses NEXT_PUBLIC_API_URL from environment variables.
 */

async function handleSynthesis(request: NextRequest, body: any) {
  try {
    const authHeader = request.headers.get('authorization');
    
    // Get URL from env or fallback to provided IP
    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://58.224.7.137:45153/v1/text-to-speech';
    
    // Ensure clean URL formatting
    const apiUrl = baseApiUrl.replace(/\/$/, '') + '/';
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Pass along authorization if provided (usually Firebase ID Token)
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Execute request from the server side
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.text();
      return NextResponse.json(
        { message: errorData || 'Synthesis engine returned an error' }, 
        { status: res.status }
      );
    }

    const data = await res.json();
    
    // Return with aggressive 1-year caching for the synthesized output
    // max-age=31536000 is exactly 1 year.
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('TTS Proxy Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error during synthesis request' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return handleSynthesis(request, body);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const body = Object.fromEntries(searchParams.entries());
  
  // Basic validation: ensure we have required synthesis params
  if (!body.text || !body.voice_id) {
    return NextResponse.json({ message: 'Missing required query parameters: text and voice_id' }, { status: 400 });
  }

  return handleSynthesis(request, body);
}
