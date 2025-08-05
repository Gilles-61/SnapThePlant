'use server';

/**
 * @fileOverview This file defines a Genkit flow for enhancing plant identification with user-provided context.
 *
 * The flow takes an image data URI and a text description as input, and returns a
 * species name with its confidence score, key information, and links for further reading.
 *
 * - enhanceIdentificationContext - A function that handles the plant identification process.
 * - EnhanceIdentificationContextInput - The input type for the enhanceIdentificationContext function.
 * - EnhanceIdentificationContextOutput - The return type for the enhanceIdentificationContext function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceIdentificationContextInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('The user provided description of the plant.'),
});
export type EnhanceIdentificationContextInput = z.infer<typeof EnhanceIdentificationContextInputSchema>;

const EnhanceIdentificationContextOutputSchema = z.object({
  speciesName: z.string().describe('The identified species name.'),
  confidenceScore: z.number().describe('The confidence score of the identification.'),
  keyInformation: z.string().describe('Key information about the identified species.'),
  furtherReading: z.string().describe('Links for further reading about the identified species.'),
});
export type EnhanceIdentificationContextOutput = z.infer<typeof EnhanceIdentificationContextOutputSchema>;

export async function enhanceIdentificationContext(
  input: EnhanceIdentificationContextInput
): Promise<EnhanceIdentificationContextOutput> {
  return enhanceIdentificationContextFlow(input);
}

const enhanceIdentificationContextPrompt = ai.definePrompt({
  name: 'enhanceIdentificationContextPrompt',
  input: {schema: EnhanceIdentificationContextInputSchema},
  output: {schema: EnhanceIdentificationContextOutputSchema},
  prompt: `You are an expert botanist. You will identify the species of a plant based on a photo and a user-provided description.

  Description: {{{description}}}
  Photo: {{media url=photoDataUri}}

  Return the species name, confidence score, key information, and links for further reading.
  `,
});

const enhanceIdentificationContextFlow = ai.defineFlow(
  {
    name: 'enhanceIdentificationContextFlow',
    inputSchema: EnhanceIdentificationContextInputSchema,
    outputSchema: EnhanceIdentificationContextOutputSchema,
  },
  async input => {
    const {output} = await enhanceIdentificationContextPrompt(input);
    return output!;
  }
);
