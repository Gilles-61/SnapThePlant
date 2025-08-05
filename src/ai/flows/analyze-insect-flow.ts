
'use server';
/**
 * @fileOverview An AI flow to analyze an insect image and extract visual attributes.
 *
 * - analyzeInsect - A function that handles the insect analysis process.
 * - AnalyzeInsectInput - The input type for the analyzeInsect function.
 * - AnalyzeInsectOutput - The return type for the analyzeInsect function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AnalyzeInsectInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of an insect as a data URI. It must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeInsectInput = z.infer<typeof AnalyzeInsectInputSchema>;

const AttributeSchema = z.object({
  key: z.string().describe('The name of the visual attribute (e.g., "color", "wings").'),
  value: z.string().describe('The value of the visual attribute (e.g., "orange", "yes").'),
});

const AnalyzeInsectOutputSchema = z.object({
  isPoisonous: z.boolean().describe('Whether the insect is venomous, poisonous, or otherwise harmful to humans (e.g., through stings or bites).'),
  attributes: z
    .array(AttributeSchema)
    .describe(
      'A list of key-value pairs describing the most distinct visual attributes of the insect in the photo.'
    ),
});
export type AnalyzeInsectOutput = z.infer<typeof AnalyzeInsectOutputSchema>;

export async function analyzeInsect(input: AnalyzeInsectInput): Promise<AnalyzeInsectOutput> {
  return analyzeInsectFlow(input);
}

const promptText = `
    You are an expert entomologist. Your main goal is to analyze the provided image of an insect, determine if it is harmful to humans, and extract its most distinct visual attributes based on the database schema.

    Analyze the image of the insect and describe its visual characteristics. Pay close attention to details that are key for identification.
    
    The database uses the following attribute keys: "color", "wings", and "legs".
    - For "color", describe the most dominant color.
    - For "wings", specify "yes" or "no".
    - For "legs", specify "6", "8", or "more".

    If the image is a close-up or partial view (e.g., only the head), focus on the visible features and be cautious. Do not guess attributes that are not visible.

    Most importantly, determine if the insect is known to be venomous, poisonous, or can cause harm to humans (like a bee sting or ant bite) and set the 'isPoisonous' boolean field accordingly. If you are unsure, default to 'false'.

    Your output MUST be a JSON object containing the "isPoisonous" key and the "attributes" key, which holds an array of key-value objects. For example: { "isPoisonous": true, "attributes": [{ "key": "color", "value": "yellow" }, { "key": "wings", "value": "yes" }, { "key": "legs", "value": "6" }] }

    Photo: {{media url=photoDataUri}}
`;


const analyzeInsectPrompt = ai.definePrompt({
  name: 'analyzeInsectPrompt',
  input: { schema: AnalyzeInsectInputSchema },
  output: { schema: AnalyzeInsectOutputSchema },
  prompt: promptText,
});

const analyzeInsectFlow = ai.defineFlow(
  {
    name: 'analyzeInsectFlow',
    inputSchema: AnalyzeInsectInputSchema,
    outputSchema: AnalyzeInsectOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeInsectPrompt(input);
    if (!output) {
      throw new Error("The AI model failed to return a valid analysis.");
    }
    return output;
  }
);
