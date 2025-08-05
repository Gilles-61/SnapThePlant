
'use server';
/**
 * @fileOverview An AI flow to analyze an image and extract visual attributes.
 *
 * - analyzeImage - A function that handles the image analysis process.
 * - AnalyzeImageInput - The input type for the analyzeImage function.
 * - AnalyzeImageOutput - The return type for the analyzeImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { categories } from '@/lib/categories';

const AnalyzeImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, tree, weed, or insect as a data URI. It must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  category: z.enum(categories.map(c => c.name) as [string, ...string[]]).describe("The category of the item in the photo."),
});
export type AnalyzeImageInput = z.infer<typeof AnalyzeImageInputSchema>;

const AttributeSchema = z.object({
  key: z.string().describe('The name of the visual attribute (e.g., "color", "leaf_shape").'),
  value: z.string().describe('The value of the visual attribute (e.g., "green", "lobed").'),
});

const AnalyzeImageOutputSchema = z.object({
  attributes: z
    .array(AttributeSchema)
    .describe(
      'A list of key-value pairs describing the most distinct visual attributes of the item in the photo.'
    ),
});
export type AnalyzeImageOutput = z.infer<typeof AnalyzeImageOutputSchema>;

export async function analyzeImage(input: AnalyzeImageInput): Promise<AnalyzeImageOutput> {
  return analyzeImageFlow(input);
}

const promptText = `
    You are an expert biologist and botanist. Your main goal is to analyze the provided image and extract its most distinct visual attributes as an array of key-value pairs.

    Analyze the image of a {{category}} and describe its visual characteristics. 
    Focus on objective, observable features. Prioritize the overall form and structure (like leaf shape, bark texture, or wing presence) over color, as colors can sometimes be misleading.
    The attribute keys should be simple and descriptive (e.g., "color", "leaf_shape", "bark_texture").
    The attribute values should be simple, single words if possible (e.g., "green", "lobed", "smooth").

    Here are some examples of good attributes for different categories:
    - Plant: "color", "shape", "size"
    - Tree: "bark", "leaf_shape", "has_fruit"
    - Weed: "flower_color", "location", "leaf_type"
    - Insect: "main_color", "has_wings", "number_of_legs"
    - Cactus: "shape", "flowers", "color"
    - Succulent: "color", "shape", "texture"
    
    Do not guess. Only return attributes you can confidently identify from the image.
    Your output MUST be a JSON object containing the "attributes" key, which holds an array of key-value objects. For example: [{ "key": "color", "value": "green" }]

    Photo: {{media url=photoDataUri}}
`;


const analyzeImagePrompt = ai.definePrompt({
  name: 'analyzeImagePrompt',
  input: { schema: AnalyzeImageInputSchema },
  output: { schema: AnalyzeImageOutputSchema },
  prompt: promptText,
});

const analyzeImageFlow = ai.defineFlow(
  {
    name: 'analyzeImageFlow',
    inputSchema: AnalyzeImageInputSchema,
    outputSchema: AnalyzeImageOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeImagePrompt(input);
    if (!output) {
      throw new Error("The AI model failed to return a valid analysis.");
    }
    return output;
  }
);
