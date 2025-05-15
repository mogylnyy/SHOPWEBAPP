'use server';

/**
 * @fileOverview An AI agent to answer FAQs.
 *
 * - answerFAQ - A function that handles the FAQ answering process.
 * - AnswerFAQInput - The input type for the answerFAQ function.
 * - AnswerFAQOutput - The return type for the answerFAQ function.
 */

import {z} from 'zod';
import OpenAI from 'openai';

// Ensure OPENAI_API_KEY is set in your environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const AnswerFAQInputSchema = z.object({
  query: z.string().describe('The user query.'),
});
export type AnswerFAQInput = z.infer<typeof AnswerFAQInputSchema>;

const AnswerFAQOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query.'),
  needsSupport: z.boolean().describe('Whether the user needs to be directed to support.'),
  useSolutionTool: z.boolean().describe('Legacy field, always false for this setup.'),
});
export type AnswerFAQOutput = z.infer<typeof AnswerFAQOutputSchema>;

export async function answerFAQ(input: AnswerFAQInput): Promise<AnswerFAQOutput> {
  const systemPrompt = `Ты — полезный ИИ-ассистент магазина цифровых подписок ИИMPERIUM SHOP.
Отвечай кратко, ясно и только на темы, связанные с магазином.

Контекст:
- Пользователи покупают подписки (ChatGPT Plus, PRO, Proxy) через WebApp.
- Оплата осуществляется через внутренний баланс, пополняемый на Lava.io.
- Существуют подварианты подписок: Продление, Готовый аккаунт, Без подписки.
- Иногда требуется ввод логина/пароля/2FA.
- Если вопрос пользователя не связан с магазином, подписками или оплатой — ответь строго фразой: "Для этого вопроса обратитесь в поддержку".`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: input.query },
      ],
    });

    const generatedAnswer = completion.choices[0]?.message?.content || "Извините, не удалось получить ответ от ИИ.";
    
    let needsSupport = false;
    const supportPhrase = "Для этого вопроса обратитесь в поддержку";

    if (generatedAnswer.includes(supportPhrase)) {
      needsSupport = true;
    }

    return {
      answer: generatedAnswer,
      needsSupport: needsSupport,
      useSolutionTool: false, 
    };

  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return {
      answer: "Произошла ошибка при обращении к AI. Пожалуйста, попробуйте позже или обратитесь в поддержку.",
      needsSupport: true,
      useSolutionTool: false,
    };
  }
}
