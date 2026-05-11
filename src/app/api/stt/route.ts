
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Proxy route for the Speech-to-Text API.
 * Forwards the audio URL to the external engine with required headers.
 * Supports standard STT and specialized YouTube-to-text endpoints.
 */
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
      console.error(`[STT Proxy] API URL for ${isYoutube ? 'YouTube' : 'Standard'} is not defined.`);
      return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
    }

    // Handle trailing slashes carefully:
    // If it's a root IP/domain, ensure one slash.
    // If it's a specific path endpoint, don't force a trailing slash.
    const apiUrl = targetBaseUrl.includes('/v1/') 
      ? targetBaseUrl 
      : targetBaseUrl.replace(/\/$/, '') + '/';
    
    // Forward the URL to the external server with Auth header
    // Body uses audio_path as the common interface for both endpoints
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '',
      },
      body: JSON.stringify({ audio_path: audio_url }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { message: data.detail || data.message || 'Transcription engine error' }, 
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('STT Proxy Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error during transcription' }, 
      { status: 500 }
    );
  }
}
