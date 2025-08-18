
'use server';
/**
 * @fileOverview An AI flow to generate an image based on a species name and category.
 *
 * - generateImage - A function that handles the image generation process.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateImageInputSchema = z.object({
  name: z.string().describe('The common name of the species.'),
  category: z.string().describe('The category of the species (e.g., Plant, Insect).'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
    imageDataUri: z.string().describe("The generated image as a data URI. It must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async ({ name, category }) => {
    const prompt = `Generate a realistic, high-quality, vibrant, detailed photo of a ${name}, which is a type of ${category}. The subject should be clearly visible and centered. The background should be natural and slightly blurred.`;
    
    try {
      const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      if (!media?.url) {
        throw new Error('Image generation failed to return a valid data URI.');
      }

      return { imageDataUri: media.url };

    } catch (error: any) {
        console.error(`[Image Generation Error] Failed for species "${name}", falling back to placeholder. Error:`, error.message);
        // Fallback to a placeholder image instead of throwing an error
        return { imageDataUri: 'https://placehold.co/600x400.png' };
    }
  }
);
