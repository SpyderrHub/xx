import { NextResponse, type NextRequest } from 'next/server';

/**
 * Proxy route for the Speech-to-Text API.
 * Forwards the audio URL from R2 to the external engine.
 */
export async function POST(request: NextRequest) {
  try {
    const { audio_url } = await request.json();

    if (!audio_url) {
      return NextResponse.json({ message: 'No audio URL provided' }, { status: 400 });
    }

    // Get the API URL from environment variables
    const externalApiUrl = process.env.STT_API_URL;
    
    if (!externalApiUrl) {
      console.error('[STT Proxy] STT_API_URL is not defined in environment variables.');
      return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
    }

    // Ensure URL has a trailing slash for consistency
    const apiUrl = externalApiUrl.replace(/\/$/, '') + '/';
    
    // Forward the URL to the external server
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ audio_url }),
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
