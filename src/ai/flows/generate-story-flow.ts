
'use server';
/**
 * @fileOverview An AI flow to generate a short story about a species.
 *
 * - generateStory - A function that handles the story generation process.
 * - GenerateStoryInput - The input type for the generateStory function.
 * - GenerateStoryOutput - The return type for the generateStory function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateStoryInputSchema = z.object({
  name: z.string().describe('The common name of the species.'),
  category: z.string().describe('The category of the species (e.g., Plant, Insect).'),
});
export type GenerateStoryInput = z.infer<typeof GenerateStoryInputSchema>;

const GenerateStoryOutputSchema = z.object({
    story: z.string().describe("A short, imaginative story for children about the species."),
});
export type GenerateStoryOutput = z.infer<typeof GenerateStoryOutputSchema>;

export async function generateStory(input: GenerateStoryInput): Promise<GenerateStoryOutput> {
  return generateStoryFlow(input);
}

const generateStoryFlow = ai.defineFlow(
  {
    name: 'generateStoryFlow',
    inputSchema: GenerateStoryInputSchema,
    outputSchema: GenerateStoryOutputSchema,
  },
  async ({ name, category }) => {
    const prompt = `Write a short, imaginative, and simple story for a child (around 5-7 years old) about a ${name}, which is a type of ${category}. The story should be 3-4 paragraphs long and have a whimsical or adventurous tone. Make sure the story is engaging and easy to understand for a young audience.`;
    
    try {
      const { output } = await ai.generate({
        prompt,
        model: 'googleai/gemini-1.5-flash-latest',
        output: {
            schema: GenerateStoryOutputSchema,
        }
      });

      if (!output?.story) {
        throw new Error('Story generation failed to return a valid story.');
      }

      return { story: output.story };

    } catch (error: any) {
        console.error(`[Story Generation Error] Failed for species "${name}". Error:`, error.message);
        return { story: `Once upon a time, in a sunny garden, there was a lovely ${name}. It was a very special ${category} that loved to watch the world go by.` };
    }
  }
);
