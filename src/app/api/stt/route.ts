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

    // Get the API URL from environment variables
    const externalApiUrl = process.env.STT_API_URL;
    
    if (!externalApiUrl) {
      console.error('[STT Proxy] STT_API_URL is not defined in environment variables.');
      return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
    }

    // Ensure URL has a trailing slash for consistency
    const apiUrl = externalApiUrl.replace(/\/$/, '') + '/';
    
    // Forward the request to the external server
    // Native fetch in Next.js automatically handles FormData boundaries
    const res = await fetch(apiUrl, {
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
