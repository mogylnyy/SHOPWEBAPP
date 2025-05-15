
import {genkit} from 'genkit';
import {openAI} from '@genkit-ai/openai'; // Ensure OpenAI plugin is used

export const ai = genkit({
  plugins: [
    openAI({
      // You can specify your API key here if not using environment variables,
      // but it's recommended to use process.env.OPENAI_API_KEY in your .env file
      // apiKey: process.env.OPENAI_API_KEY, 
    }),
  ],
  // No default model specified here, it will be in the prompt definition for Genkit flows
});

