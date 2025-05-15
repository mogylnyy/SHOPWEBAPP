
import {genkit} from 'genkit';
// import {openAI} from '@genkit-ai/openai'; // Temporarily commented out

export const ai = genkit({
  plugins: [
    // openAI({ // Temporarily commented out due to issues with 'openai' package resolution
    //   // You can specify your API key here if not using environment variables,
    //   // but it's recommended to use process.env.OPENAI_API_KEY in your .env file
    //   // apiKey: process.env.OPENAI_API_KEY, 
    // }),
  ],
  // No default model specified here, it will be in the prompt definition for Genkit flows
});
