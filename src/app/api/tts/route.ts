import { NextResponse, type NextRequest } from 'next/server';

/**
 * Proxy route for the TTS API to bypass browser CORS and SSL restrictions
 * associated with raw IP addresses and non-standard ports.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    
    // The target synthesis engine endpoint
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://58.224.7.137:45153/v1/text-to-speech').replace(/\/$/, '') + '/';
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Pass along authorization if provided
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
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('TTS Proxy Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error during synthesis request' }, 
      { status: 500 }
    );
  }
}
