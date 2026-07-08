import { NextResponse, type NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

/**
 * Secure Proxy for the Voice Designer engine.
 * Maps 'prompt' to 'instruct' and 'referenceText' to 'text' as requested.
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
    const apiUrl = process.env.VOICE_DESIGNER_API_URL;
    const apiKey = process.env.VOICE_DESIGNER_API_KEY;

    if (!apiUrl) {
      console.error('[Voice Designer Proxy] VOICE_DESIGNER_API_URL is missing.');
      return NextResponse.json({ message: 'Server configuration error: API URL missing' }, { status: 500 });
    }

    // 3. Construct headers - Forwarding Authorization is CRITICAL
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': authHeader as string, 
    };
    
    // Pass custom API key if configured
    if (apiKey) {
      headers['X-API-KEY'] = apiKey;
    }

    // 4. Forward request to the engine with the specific field mapping
    // User requested: voice prompt -> instruct, reference text -> text
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        instruct: body.prompt,
        text: body.referenceText
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || data.detail || 'Voice Designer engine returned an error' }, 
        { status: res.status }
      );
    }

    // 5. Return engine response to the client
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Voice Designer Proxy Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error during design proxy' }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
