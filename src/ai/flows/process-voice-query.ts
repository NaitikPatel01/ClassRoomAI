// This is an experimental implementation of TTS and might not work as expected.
'use server';
/**
 * @fileOverview Implements voice query processing to provide answers to students.
 *
 * - processVoiceQuery - A function that handles voice-based queries and returns responses.
 * - ProcessVoiceQueryInput - The input type for the processVoiceQuery function.
 * - ProcessVoiceQueryOutput - The return type for the processVoiceQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const ProcessVoiceQueryInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'The audio data URI containing the voice query.  Must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
  chatHistory: z.string().describe('The history of the conversation.'),
});
export type ProcessVoiceQueryInput = z.infer<typeof ProcessVoiceQueryInputSchema>;

const ProcessVoiceQueryOutputSchema = z.object({
  textResponse: z.string().describe('The textual response to the voice query.'),
  audioResponse: z.string().describe('The audio response to the voice query.'),
});
export type ProcessVoiceQueryOutput = z.infer<typeof ProcessVoiceQueryOutputSchema>;

export async function processVoiceQuery(input: ProcessVoiceQueryInput): Promise<ProcessVoiceQueryOutput> {
  return processVoiceQueryFlow(input);
}

const voiceQueryPrompt = ai.definePrompt({
  name: 'voiceQueryPrompt',
  input: {schema: ProcessVoiceQueryInputSchema},
  output: {schema: ProcessVoiceQueryOutputSchema},
  prompt: `You are a helpful AI assistant for students.  Answer the question based on the audio provided. Use previous context for memory.

Chat History: {{{chatHistory}}}

Audio: {{media url=audioDataUri}}

Response:`,
});

const processVoiceQueryFlow = ai.defineFlow(
  {
    name: 'processVoiceQueryFlow',
    inputSchema: ProcessVoiceQueryInputSchema,
    outputSchema: ProcessVoiceQueryOutputSchema,
  },
  async input => {
    const {output} = await voiceQueryPrompt(input);

    //Experimental TTS Implementation
    const { media } = await ai.generate({
      model: ai.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: output?.textResponse ?? 'There was an error processing your request.',
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const audioResponse = 'data:audio/wav;base64,' + (await toWav(audioBuffer));

    return {
      textResponse: output!.textResponse,
      audioResponse
    };
  }
);

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

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
