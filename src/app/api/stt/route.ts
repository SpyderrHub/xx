import { NextResponse, type NextRequest } from 'next/server';

/**
 * Proxy route for the Speech-to-Text API.
 * Forwards the audio URL to the external engine with required headers.
 * 
 * Increased maxDuration to 600s (10 minutes) to allow for very long transcription tasks.
 */
export const maxDuration = 600;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const { audio_url } = await request.json();

    if (!audio_url) {
      return NextResponse.json({ message: 'No audio source provided' }, { status: 400 });
    }

    const apiUrl = process.env.STT_API_URL;
    
    if (!apiUrl) {
      console.error(`[STT Proxy] API URL is not defined in environment variables.`);
      return NextResponse.json({ message: 'Server configuration error: API URL missing' }, { status: 500 });
    }

    // Forward the URL to the external server with Auth header
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '',
      },
      body: JSON.stringify({ audio_path: audio_url }),
    });

    const contentType = res.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) {
        return NextResponse.json(
          { message: data.detail || data.message || 'Transcription engine error' }, 
          { status: res.status }
        );
      }
      return NextResponse.json(data);
    } else {
      const textData = await res.text();
      
      if (!res.ok) {
        if (res.status === 504 || res.status === 502) {
           return NextResponse.json({ 
             message: 'The transcription engine timed out.',
             success: false,
             stage: 'TIMEOUT'
           }, { status: res.status });
        }

        return NextResponse.json(
          { message: `Engine error (${res.status}): ${textData.substring(0, 100)}` },
          { status: res.status }
        );
      }
      
      if (textData.includes('<html')) {
        return NextResponse.json({ 
          message: 'The engine is processing...',
          success: false,
          stage: 'PROCESSING'
        });
      }

      return NextResponse.json({ text: textData, success: true, stage: 'COMPLETED' });
    }
  } catch (error: any) {
    console.error('STT Proxy Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error during transcription' }, 
      { status: 500 }
    );
  }
}
