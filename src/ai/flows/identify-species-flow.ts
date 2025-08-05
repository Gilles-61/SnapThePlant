'use server';
/**
 * @fileOverview An AI flow to identify a species from an image.
 *
 * - identifySpecies - A function that handles the species identification process.
 * - IdentifySpeciesInput - The input type for the identifySpecies function.
 * - IdentifySpeciesOutput - The return type for the identifySpecies function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const IdentifySpeciesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, tree, weed, or insect as a data URI. It must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  category: z.string().describe("The category of the item in the photo (e.g., 'Plant', 'Insect')."),
});
export type IdentifySpeciesInput = z.infer<typeof IdentifySpeciesInputSchema>;


const IdentifySpeciesOutputSchema = z.object({
  name: z.string().describe('The common name of the identified species (e.g., "Monstera Deliciosa", "Honey Bee").'),
  scientificName: z.string().describe('The scientific name of the identified species (e.g., "Monstera deliciosa", "Apis mellifera").'),
  isPoisonous: z.boolean().describe('Whether the species is known to be poisonous, venomous, or otherwise harmful to humans or common pets.'),
});
export type IdentifySpeciesOutput = z.infer<typeof IdentifySpeciesOutputSchema>;


export async function identifySpecies(input: IdentifySpeciesInput): Promise<IdentifySpeciesOutput> {
  return identifySpeciesFlow(input);
}

const promptText = `
    You are an expert biologist and botanist. Your main goal is to identify the species in the provided image and determine if it is poisonous.

    Analyze the image of a {{category}} and identify its common name and scientific name.
    
    Also, determine if the species is known to be poisonous, venomous, or otherwise harmful to humans or common pets (like cats and dogs). If you are unsure, default to 'false'.

    Your output MUST be a JSON object containing the "name", "scientificName", and "isPoisonous" keys.

    For example: { "name": "Monarch Butterfly", "scientificName": "Danaus plexippus", "isPoisonous": true }

    Do not guess. Only return a species you can confidently identify from the image. If the image is unclear or you cannot make a confident identification, return an empty object.

    Photo: {{media url=photoDataUri}}
`;


const identifySpeciesPrompt = ai.definePrompt({
  name: 'identifySpeciesPrompt',
  input: { schema: IdentifySpeciesInputSchema },
  output: { schema: IdentifySpeciesOutputSchema },
  prompt: promptText,
});

const identifySpeciesFlow = ai.defineFlow(
  {
    name: 'identifySpeciesFlow',
    inputSchema: IdentifySpeciesInputSchema,
    outputSchema: IdentifySpeciesOutputSchema,
  },
  async (input) => {
    const { output } = await identifySpeciesPrompt(input);
    if (!output) {
      throw new Error("The AI model failed to return a valid identification.");
    }
    return output;
  }
);
