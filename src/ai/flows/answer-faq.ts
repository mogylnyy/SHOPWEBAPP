'use server';

/**
 * @fileOverview An AI agent to answer FAQs using Google AI (Gemini).
 *
 * - answerFAQ - A function that handles the FAQ answering process.
 * - AnswerFAQInput - The input type for the answerFAQ function.
 * - AnswerFAQOutput - The return type for the answerFAQ function.
 */

import {ai}from '@/ai/genkit';
import {z}from 'genkit';

const AnswerFAQInputSchema = z.object({
  query: z.string().describe('The user query.'),
});
export type AnswerFAQInput = z.infer<typeof AnswerFAQInputSchema>;

// This schema now also includes needsSupport, which the prompt will try to set.
const AnswerFAQOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query.'),
  needsSupport: z.boolean().describe('Whether the user needs to be directed to support.'),
  useSolutionTool: z.boolean().describe('Legacy field, always false for this setup, but kept for schema consistency if model attempts to set it.'),
});
export type AnswerFAQOutput = z.infer<typeof AnswerFAQOutputSchema>;

export async function answerFAQ(input: AnswerFAQInput): Promise<AnswerFAQOutput> {
  return answerFAQFlow(input);
}

const faqGeminiPrompt = ai.definePrompt({
  name: 'answerFAQGeminiPrompt',
  input: {schema: AnswerFAQInputSchema},
  output: {schema: AnswerFAQOutputSchema}, // Model will attempt to fill this schema
  config: {
    model: 'googleai/gemini-1.5-flash-latest', // Using a Gemini model
  },
  system: `Ты — полезный ИИ-ассистент магазина цифровых подписок QuickBuy TG (ИИMPERIUM SHOP).
Отвечай кратко, ясно и только на темы, связанные с магазином.

Контекст:
- Пользователи покупают подписки (ChatGPT Plus, PRO, Proxy) через WebApp.
- Оплата осуществляется через внутренний баланс, пополняемый на Lava.io.
- Существуют подварианты подписок: Продление, Готовый аккаунт, Без подписки.
- Иногда требуется ввод логина/пароля/2FA.

Твоя задача также определить, нуждается ли пользователь в прямой поддержке.
Если вопрос пользователя не связан с магазином, подписками или оплатой — ответь строго фразой: "Для этого вопроса обратитесь в поддержку." и установи 'needsSupport' в true.
Если вопрос касается очень специфических проблем с аккаунтом, которые ты не можешь решить, или сложных нерешенных проблем, также установи 'needsSupport' в true.
В остальных случаях, если ты можешь дать ответ по теме магазина, установи 'needsSupport' в false.
Поле 'useSolutionTool' должно быть всегда false.`,
  prompt: `{{{query}}}`, // User's query directly
});

const answerFAQFlow = ai.defineFlow(
  {
    name: 'answerFAQFlow',
    inputSchema: AnswerFAQInputSchema,
    outputSchema: AnswerFAQOutputSchema,
  },
  async (input: AnswerFAQInput) => {
    const llmResponse = await faqGeminiPrompt(input);
    const output = llmResponse.output;

    if (!output) {
      return {
        answer: "Извините, не удалось получить ответ от ИИ.",
        needsSupport: true, // Default to needing support if no output
        useSolutionTool: false,
      };
    }
    
    const modelAnswer = output.answer || "Извините, нет ответа от ИИ.";
    // Use the model's determination for needsSupport, but ensure if the specific phrase is used, it's true.
    let finalNeedsSupport = output.needsSupport || false; 
    if (modelAnswer.includes("Для этого вопроса обратитесь в поддержку")) {
        finalNeedsSupport = true;
    }

    return {
      answer: modelAnswer,
      needsSupport: finalNeedsSupport,
      useSolutionTool: false, // Explicitly false as per requirements
    };
  }
);
