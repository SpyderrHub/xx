import { NextResponse, type NextRequest } from 'next/server';

/**
 * Proxy route for the Speech-to-Text API.
 * Forwards multipart/form-data from the client to the external engine.
 * Using a proxy prevents CORS and mixed-content (HTTPS -> HTTP) issues.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ message: 'No audio file provided' }, { status: 400 });
    }

    // External Transcription API Endpoint
    const externalApiUrl = 'http://103.13.113.123:20014/';
    
    // Forward the request to the external server
    // Native fetch in Next.js automatically handles FormData boundaries
    const res = await fetch(externalApiUrl, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { message: errorText || 'Transcription engine returned an error' }, 
        { status: res.status }
      );
    }

    const data = await res.json();
    
    // We return the raw response to the client
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('STT Proxy Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error during transcription' }, 
      { status: 500 }
    );
  }
}
