import {genkit} from 'genkit';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const ai = genkit({
  plugins: [
    // Настройка плагинов при необходимости
  ],
  // No default model specified here, it will be in the prompt definition for Genkit flows
});
