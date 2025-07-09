'use server';

/**
 * @fileOverview Text query processing flow for the ClassroomAI assistant.
 *
 * - processTextQuery - Processes text-based questions and provides explanations or solutions.
 * - ProcessTextQueryInput - The input type for the processTextQuery function.
 * - ProcessTextQueryOutput - The return type for the processTextQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProcessTextQueryInputSchema = z.object({
  query: z.string().describe('The text-based question from the student.'),
  chatHistory: z.string().describe('The history of the conversation.'),
});
export type ProcessTextQueryInput = z.infer<typeof ProcessTextQueryInputSchema>;

const ProcessTextQueryOutputSchema = z.object({
  answer: z.string().describe('The answer to the student question.'),
});
export type ProcessTextQueryOutput = z.infer<typeof ProcessTextQueryOutputSchema>;

export async function processTextQuery(input: ProcessTextQueryInput): Promise<ProcessTextQueryOutput> {
  return processTextQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processTextQueryPrompt',
  input: {schema: ProcessTextQueryInputSchema},
  output: {schema: ProcessTextQueryOutputSchema},
  prompt: `You are a helpful AI assistant for students.  Answer the following question:

Question: {{{query}}}

Chat History:
{{{chatHistory}}}
`,
});

const processTextQueryFlow = ai.defineFlow(
  {
    name: 'processTextQueryFlow',
    inputSchema: ProcessTextQueryInputSchema,
    outputSchema: ProcessTextQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
