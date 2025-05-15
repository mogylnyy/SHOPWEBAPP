'use server';

/**
 * @fileOverview An AI agent to answer FAQs.
 *
 * - answerFAQ - A function that handles the FAQ answering process.
 * - AnswerFAQInput - The input type for the answerFAQ function.
 * - AnswerFAQOutput - The return type for the answerFAQ function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerFAQInputSchema = z.object({
  query: z.string().describe('The user query.'),
});
export type AnswerFAQInput = z.infer<typeof AnswerFAQInputSchema>;

const AnswerFAQOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query.'),
  useSolutionTool: z.boolean().describe('Whether to use the solution tool or not'),
});
export type AnswerFAQOutput = z.infer<typeof AnswerFAQOutputSchema>;

export async function answerFAQ(input: AnswerFAQInput): Promise<AnswerFAQOutput> {
  return answerFAQFlow(input);
}

const findSolutionTool = ai.defineTool({
  name: 'findSolution',
  description: 'Returns a potential solution to the user query.',
  inputSchema: z.object({
    query: z.string().describe('The user query.'),
  }),
  outputSchema: z.string(),
},
async (input) => {
  // Placeholder implementation for finding a solution.
  // In a real application, this would likely involve querying a database or external API.
  return `A potential solution to your query: ${input.query}`;
});

const prompt = ai.definePrompt({
  name: 'answerFAQPrompt',
  input: {schema: AnswerFAQInputSchema},
  output: {schema: AnswerFAQOutputSchema},
  tools: [findSolutionTool],
  system: `You are a helpful AI assistant that answers user queries related to the QuickBuy TG application. If the user's question can be solved by finding a specific solution, set the useSolutionTool field to true and use the findSolution tool to get the solution. Otherwise, provide a direct answer to the query and set the useSolutionTool field to false.`,
  prompt: `User query: {{{query}}}`,
});

const answerFAQFlow = ai.defineFlow(
  {
    name: 'answerFAQFlow',
    inputSchema: AnswerFAQInputSchema,
    outputSchema: AnswerFAQOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
