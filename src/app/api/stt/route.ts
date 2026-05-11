import { NextResponse, type NextRequest } from 'next/server';

/**
 * Proxy route for the Speech-to-Text API.
 * Dynamically routes requests to standard or YouTube endpoints based on payload.
 * 
 * Set maxDuration to 600s (10 minutes) to allow for long transcription tasks.
 */
export const maxDuration = 600;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const { audio_url, isYoutube } = await request.json();

    if (!audio_url) {
      return NextResponse.json({ message: 'No source URL provided' }, { status: 400 });
    }

    // Determine the target endpoint from environment variables
    const standardUrl = process.env.STT_API_URL;
    const youtubeUrl = process.env.YOUTUBE_STT_API_URL || 'http://103.13.113.123:20014/v1/youtube-to-text';
    
    const apiUrl = isYoutube ? youtubeUrl : standardUrl;
    
    if (!apiUrl) {
      console.error(`[STT Proxy] Target API URL is not defined.`);
      return NextResponse.json({ message: 'Server configuration error: API URL missing' }, { status: 500 });
    }

    console.log(`[STT Proxy] Routing to ${isYoutube ? 'YouTube' : 'Standard'} API: ${apiUrl}`);

    // Forward the request and wait for the final response
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '',
      },
      body: JSON.stringify({ audio_path: audio_url }),
    });

    const contentType = res.headers.get('content-type');
    
    // Check if the response is JSON
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
      // If it's not JSON, read as text
      const textData = await res.text();
      
      if (!res.ok) {
        // Handle common gateway/timeout codes
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
      
      // If result is plain text, wrap it for the frontend
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
