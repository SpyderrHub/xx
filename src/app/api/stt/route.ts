
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Proxy route for the Speech-to-Text API.
 * Forwards the audio URL to the external engine with required headers.
 * Supports standard STT and specialized YouTube-to-text endpoints.
 * 
 * Increased maxDuration to 120s to allow for long transcription tasks.
 */
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const { audio_url, isYoutube } = await request.json();

    if (!audio_url) {
      return NextResponse.json({ message: 'No audio source provided' }, { status: 400 });
    }

    // Select the appropriate URL from environment variables
    const standardUrl = process.env.STT_API_URL;
    const youtubeUrl = process.env.YOUTUBE_STT_API_URL;
    
    let targetBaseUrl = isYoutube ? youtubeUrl : standardUrl;
    
    if (!targetBaseUrl) {
      console.error(`[STT Proxy] API URL for ${isYoutube ? 'YouTube' : 'Standard'} is not defined in environment variables.`);
      return NextResponse.json({ message: 'Server configuration error: API URL missing' }, { status: 500 });
    }

    // Ensure clean URL formatting (handle trailing slashes)
    const apiUrl = targetBaseUrl.replace(/\/$/, '') + (targetBaseUrl.includes('/v1/') ? '' : '/');
    
    console.log(`[STT Proxy] Forwarding to: ${apiUrl}`);

    // Forward the URL to the external server with Auth header
    // The backend expects "audio_path" as the key
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '',
      },
      body: JSON.stringify({ audio_path: audio_url }),
    });

    // Check if the response is JSON or something else (like HTML error page)
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
      // Handle non-JSON responses (HTML errors, plain text)
      const textData = await res.text();
      
      // Log for debugging
      console.warn(`[STT Proxy] Received non-JSON response from ${apiUrl}:`, textData.substring(0, 100));

      if (!res.ok) {
        return NextResponse.json(
          { message: `Engine error (${res.status}): ${textData.substring(0, 100)}` },
          { status: res.status }
        );
      }
      
      // If it's success (200) but not JSON, wrap it. 
      // If it looks like HTML, the engine might be serving a wait-page.
      if (textData.includes('<html')) {
        return NextResponse.json({ 
          message: 'The engine returned a temporary status page. The transcription is likely in progress.',
          success: false,
          stage: 'PROCESSING'
        });
      }

      return NextResponse.json({ text: textData, success: true });
    }
  } catch (error: any) {
    console.error('STT Proxy Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error during transcription' }, 
      { status: 500 }
    );
  }
}
