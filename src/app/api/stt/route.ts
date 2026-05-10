import { NextResponse, type NextRequest } from 'next/server';

/**
 * Proxy route for the Speech-to-Text API.
 * Forwards the audio URL to the external engine with required headers.
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const { audio_url } = await request.json();

    if (!audio_url) {
      return NextResponse.json({ message: 'No audio URL provided' }, { status: 400 });
    }

    const externalApiUrl = process.env.STT_API_URL;
    
    if (!externalApiUrl) {
      console.error('[STT Proxy] STT_API_URL is not defined in environment variables.');
      return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
    }

    const apiUrl = externalApiUrl.replace(/\/$/, '') + '/';
    
    // Forward the URL to the external server with Auth header
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '',
      },
      body: JSON.stringify({ audio_path: audio_url }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { message: errorData.detail || errorData.message || 'Transcription engine error' }, 
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('STT Proxy Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error during transcription' }, 
      { status: 500 }
    );
  }
}
