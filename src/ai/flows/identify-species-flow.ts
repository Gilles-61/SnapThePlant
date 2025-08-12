
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
import { findSpeciesByName } from '@/lib/mock-database';

const IdentifySpeciesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, tree, weed, or insect as a data URI. It must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  category: z.string().describe("The category of the item in the photo (e.g., 'Plant', 'Insect')."),
});
export type IdentifySpeciesInput = z.infer<typeof IdentifySpeciesInputSchema>;


const IdentifySpeciesOutputSchema = z.object({
  name: z.string().describe('The common name of the identified species (e.g., "Monstera Deliciosa", "Honey Bee").'),
  scientificName: z.string().describe('The scientific name of the identified species (e.g., "Monstera deliciosa", "Apis mellifera").'),
  isPoisonous: z.boolean().describe('Whether the species is known to be poisonous, venomous, or otherwise harmful to humans or common pets.'),
  isNew: z.boolean().describe('Whether the identified species is new and not present in the database.'),
  keyInformation: z.string().describe("A brief, interesting paragraph about the identified species."),
  toxicityWarning: z.string().optional().describe("If the species is poisonous, a brief warning about its toxic effects. Null if not applicable."),
  careTips: z.array(z.object({
    title: z.string().describe("The type of care tip, e.g., 'Watering', 'Sunlight', 'Soil', 'Fertilizer', 'Environment', 'Extra Tips'."),
    description: z.string().describe("The detailed care tip description."),
  })).optional().describe("An array of care tips for the plant or species. This should be empty for insects.")
});
export type IdentifySpeciesOutput = z.infer<typeof IdentifySpeciesOutputSchema>;


export async function identifySpecies(input: IdentifySpeciesInput): Promise<IdentifySpeciesOutput> {
  return identifySpeciesFlow(input);
}

const AISchema = IdentifySpeciesOutputSchema.omit({ isNew: true });
type AIOutputType = z.infer<typeof AISchema>;


const promptText = `
    You are an expert biologist and botanist. Your main goal is to identify the species in the provided image.

    Analyze the image of a {{category}} and identify its common name and scientific name.
    
    Also provide a brief, interesting paragraph of 'keyInformation' about the species.

    Determine if the species is known to be poisonous, venomous, or otherwise harmful to humans or common pets (like cats and dogs). If you are unsure, default to 'false'.
    If it IS poisonous, provide a brief 'toxicityWarning'. Otherwise, leave it null.

    If the category is a Plant, Tree, Weed, Cactus, or Succulent, provide a list of 'careTips'. The titles for the tips should be standard, such as 'Watering', 'Sunlight', and 'Soil'. If the category is 'Insect', provide an empty array for careTips.

    Do not guess. Only return a species you can confidently identify from the image. If the image is unclear or you cannot make a confident identification, return an empty object.

    Photo: {{media url=photoDataUri}}
`;


const identifySpeciesPrompt = ai.definePrompt({
  name: 'identifySpeciesPrompt',
  input: { schema: IdentifySpeciesInputSchema },
  output: { schema: AISchema },
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

    const match = findSpeciesByName(output.name);
    const isNew = !match;

    return {
        ...output,
        isNew,
    };
  }
);
