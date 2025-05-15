import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai'; // Reverted to googleAI

export const ai = genkit({
  plugins: [
    googleAI(), // Initialize with GoogleAI plugin
  ],
  // model: 'googleai/gemini-pro', // Example default model
});
