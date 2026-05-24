import { NextResponse, type NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

/**
 * Proxy route for the specialized TTS engine at the provided IP address.
 * Bypasses Mixed Content restrictions and secures the TTS_API_KEY.
 */

async function handleSynthesis(request: NextRequest, body: any) {
  try {
    const authHeader = request.headers.get('authorization');
    const idToken = authHeader?.split('Bearer ')[1];

    if (!idToken || !adminAuth) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    // 1. Verify that the request comes from a valid user
    await adminAuth.verifyIdToken(idToken);

    // 2. Determine target API URL and credentials
    const apiUrl = 'http://152.160.24.154:12417/v1/text-to-speech';
    const apiKey = process.env.TTS_API_KEY;

    if (!apiKey) {
      console.error('[TTS Proxy] Missing TTS_API_KEY in environment variables.');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add engine authentication if key is provided
    if (apiKey) {
      headers['X-API-KEY'] = apiKey; // Or whatever header your backend expects
      // If your backend also expects the user token, you can pass it through:
      headers['Authorization'] = `Bearer ${idToken}`;
    }

    // 3. Execute request from the server side (Safe from Mixed Content)
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }
      
      return NextResponse.json(
        { message: errorData.message || errorData.detail || 'Synthesis engine returned an error' }, 
        { status: res.status }
      );
    }

    const data = await res.json();
    
    // Return the response data (containing audio_url) to the frontend
    return NextResponse.json(data);
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
  
  if (!body.text || !body.reference_audio) {
    return NextResponse.json({ message: 'Missing required query parameters' }, { status: 400 });
  }

  return handleSynthesis(request, body);
}
