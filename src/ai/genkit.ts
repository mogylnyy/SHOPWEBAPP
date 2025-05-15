import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai'; // Changed from openAI to googleAI

export const ai = genkit({
  plugins: [
    googleAI(), // Initialize with Google AI plugin
  ],
  // You might want to set a default Google AI model here if needed,
  // or specify it directly in your flows/prompts.
  // model: 'googleai/gemini-1.5-flash-latest',
});
