import { NextResponse, type NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

/**
 * Secure Proxy for the specialized TTS engine.
 * Fetches the target API URL and Key from environment variables.
 * Verifies Firebase identity and FORWARDS the token to the engine.
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const idToken = authHeader?.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : null;

    if (!idToken || !adminAuth) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    // 1. Verify user identity server-side
    await adminAuth.verifyIdToken(idToken);

    // 2. Prepare request for the internal engine using .env values
    const body = await request.json();
    const apiUrl = process.env.TTS_API_URL;
    const apiKey = process.env.TTS_API_KEY;

    if (!apiUrl) {
      console.error('[TTS Proxy] TTS_API_URL is missing from environment variables.');
      return NextResponse.json({ message: 'Server configuration error: API URL missing' }, { status: 500 });
    }

    // 3. Construct headers - Forwarding Authorization is CRITICAL for the engine's token verification stage
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': authHeader as string, 
    };
    
    // Pass custom API key if configured
    if (apiKey) {
      headers['X-API-KEY'] = apiKey;
    }

    // 4. Forward request to the engine
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || data.detail || 'Synthesis engine returned an error' }, 
        { status: res.status }
      );
    }

    // 5. Return engine response (which includes audio_download_url) to the client
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('TTS Proxy Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error during synthesis proxy' }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
