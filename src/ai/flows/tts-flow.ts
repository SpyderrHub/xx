
'use server';
/**
 * @fileOverview Genkit Flow for generating speech from text.
 * 
 * - generateSpeech - A function that converts text to high-quality audio.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';

const TTSInputSchema = z.object({
  text: z.string().describe('The text to be converted into speech.'),
  voiceName: z.string().optional().default('Algenib').describe('The prebuilt voice to use.'),
});

const TTSOutputSchema = z.object({
  audioDataUri: z.string().describe('The generated audio as a base64-encoded WAV data URI.'),
});

export async function generateSpeech(input: z.infer<typeof TTSInputSchema>) {
  return generateSpeechFlow(input);
}

const generateSpeechFlow = ai.defineFlow(
  {
    name: 'generateSpeechFlow',
    inputSchema: TTSInputSchema,
    outputSchema: TTSOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: input.voiceName },
          },
        },
      },
      prompt: input.text,
    });

    if (!media || !media.url) {
      throw new Error('No audio media returned from the model.');
    }

    // Media URL is base64 PCM data
    const base64Pcm = media.url.substring(media.url.indexOf(',') + 1);
    const pcmBuffer = Buffer.from(base64Pcm, 'base64');

    // Convert PCM to WAV
    const wavBase64 = await toWav(pcmBuffer);
    
    return {
      audioDataUri: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);

/**
 * Helper to convert PCM buffer to a base64-encoded WAV string.
 */
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
