
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

const AnalyzeImageOutputSchema = z.object({
  isClear: z.boolean().describe("Whether the image is clear and high-quality enough for accurate identification."),
  attributes: z
    .object({
      color: z.string().optional().describe("Primary color of the plant, flower, or insect."),
      shape: z.string().optional().describe("Overall shape of the plant or cactus."),
      size: z.string().optional().describe("Approximate size of the plant."),
      bark: z.string().optional().describe("Texture of the tree bark."),
      leaf_shape: z.string().optional().describe("Shape of the tree's leaves."),
      has_fruit: z.string().optional().describe("Whether the tree has fruit or flowers."),
      flower_color: z.string().optional().describe("Color of the weed's flowers."),
      location: z.string().optional().describe("Where the weed is growing."),
      leaf_type: z.string().optional().describe("The type of leaves on the weed."),
      wings: z.string().optional().describe("Whether the insect has wings."),
      legs: z.string().optional().describe("The number of legs the insect has."),
      flowers: z.string().optional().describe("Whether the cactus has flowers visible."),
    })
    .describe(
      'The extracted visual attributes of the item in the photo, matching the quiz options.'
    ),
});
export type AnalyzeImageOutput = z.infer<typeof AnalyzeImageOutputSchema>;

export async function analyzeImage(input: AnalyzeImageInput): Promise<AnalyzeImageOutput> {
  return analyzeImageFlow(input);
}

const promptText = `
    You are an expert biologist and botanist. Your first task is to assess the quality of the provided image. If the image is blurry, out of focus, poorly lit, or if the subject is too far away to see details, set the 'isClear' flag to false. Otherwise, set it to true.

    If the image is clear, your second task is to analyze the image of a {{category}} and determine its visual characteristics based on a predefined set of questions, as if you were answering a quiz.
    Focus on the most visually distinct features of the subject in the photo.

    Based on the category "{{category}}", answer the following questions and provide the answer key for each.
    
    Category: Plant
    Questions:
    1. What is the primary color of the flower/leaves? (key: "color", options: "red", "green", "yellow", "blue", "white", "other")
    2. What is the leaf shape? (key: "shape", options: "simple", "lobed", "needle", "compound")
    3. What is the approximate size? (key: "size", options: "small", "medium", "large")
    
    Category: Tree
    Questions:
    1. What does the bark look like? (key: "bark", options: "smooth", "rough", "peeling")
    2. What is the leaf shape? (key: "leaf_shape", options: "simple", "lobed", "needle")
    3. Does it have fruit or flowers? (key: "has_fruit", options: "yes", "no")
    
    Category: Weed
    Questions:
    1. What color are the flowers, if any? (key: "flower_color", options: "red", "green", "yellow", "blue", "white", "other")
    2. Where is it growing? (key: "location", options: "lawn", "garden", "pavement")
    3. What do the leaves look like? (key: "leaf_type", options: "broad", "grassy", "toothed")

    Category: Insect
    Questions:
    1. What is the main color of the insect? (key: "color", options: "red", "green", "yellow", "blue", "white", "other")
    2. Does it have wings? (key: "wings", options: "yes", "no")
    3. How many legs does it have? (key: "legs", options: "6", "8", "more")

    Category: Cactus
    Questions:
    1. What is the overall shape of the cactus? (key: "shape", options: "columnar", "globular", "paddles")
    2. Are there flowers visible? (key: "flowers", options: "yes", "no")
    3. What color is it? (key: "color", options: "green", "blue-green", "grey-green")

    Analyze the image and determine the most appropriate option for each question corresponding to the given category.
    Your output MUST be a JSON object where keys are the attribute keys (e.g., "color", "shape") and values are the single best option chosen from the list.
    If the image is clearly a sunflower, the primary color is "yellow".

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
