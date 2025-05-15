'use server';

/**
 * @fileOverview An AI agent to answer FAQs using a Genkit-configured model.
 *
 * - answerFAQ - A function that handles the FAQ answering process.
 * - AnswerFAQInput - The input type for the answerFAQ function.
 * - AnswerFAQOutput - The return type for the answerFAQ function.
 */

import {ai}from '@/ai/genkit';
import {z} from 'genkit';

const AnswerFAQInputSchema = z.object({
  query: z.string().describe('The user query.'),
});
export type AnswerFAQInput = z.infer<typeof AnswerFAQInputSchema>;

// Updated output schema for the flow
const AnswerFAQOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query.'),
  needsSupport: z.boolean().describe('Whether the user needs to be directed to support.'),
  useSolutionTool: z.boolean().describe('Legacy field, always false for this setup.'),
});
export type AnswerFAQOutput = z.infer<typeof AnswerFAQOutputSchema>;

export async function answerFAQ(input: AnswerFAQInput): Promise<AnswerFAQOutput> {
  return answerFAQFlow(input);
}

// Schema for the LLM's direct output
const LLMResponseSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the user query.'),
});

const faqPrompt = ai.definePrompt({
  name: 'answerFAQPrompt', // Renamed from answerFAQOpenAIPrompt
  input: {schema: AnswerFAQInputSchema},
  output: {schema: LLMResponseSchema}, // LLM only outputs the answer string
  config: {
    model: 'googleai/gemini-1.5-flash-latest', // Switched to a Google AI model
    // You can add other model parameters here, e.g., temperature
    // temperature: 0.7,
  },
  system: `Ты — полезный ИИ-ассистент магазина цифровых подписок QuickBuy TG (ИИMPERIUM SHOP).
Отвечай кратко, ясно и только на темы, связанные с магазином.

Контекст:
- Пользователи покупают подписки (ChatGPT Plus, PRO, Proxy) через WebApp.
- Оплата осуществляется через внутренний баланс, пополняемый на Lava.io.
- Существуют подварианты подписок: Продление, Готовый аккаунт, Без подписки.
- Иногда требуется ввод логина/пароля/2FA.
- Если вопрос пользователя не связан с магазином, подписками или оплатой — ответь строго фразой: "Для этого вопроса обратитесь в поддержку".`,
  prompt: `{{{query}}}`, // User's query directly
});

const answerFAQFlow = ai.defineFlow(
  {
    name: 'answerFAQFlow',
    inputSchema: AnswerFAQInputSchema,
    outputSchema: AnswerFAQOutputSchema, // Flow outputs the extended schema
  },
  async (input: AnswerFAQInput) => {
    const llmResponse = await faqPrompt(input); // Changed from gptPrompt to faqPrompt
    // Ensure that output is not null and is of the expected type.
    const answer = llmResponse.output?.answer || "Извините, не удалось получить ответ от ИИ.";

    const needsSupport = answer.includes("Для этого вопроса обратитесь в поддержку");

    return {
      answer,
      needsSupport,
      useSolutionTool: false, // This tool is no longer used.
    };
  }
);
