
'use server';

/**
 * @fileOverview An AI agent to answer FAQs.
 * TEMPORARILY MODIFIED: OpenAI import is commented out due to "Module not found" error.
 * This version returns a mock response. Please resolve the 'openai' package installation.
 *
 * - answerFAQ - A function that handles the FAQ answering process.
 * - AnswerFAQInput - The input type for the answerFAQ function.
 * - AnswerFAQOutput - The return type for the answerFAQ function.
 */

import {z} from 'zod';
// import OpenAI from 'openai'; // Temporarily commented out due to "Module not found" error

// Ensure OPENAI_API_KEY is set in your environment variables
// const openai = new OpenAI({ // Temporarily commented out
//   apiKey: process.env.OPENAI_API_KEY,
// });

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
  console.warn(
    "OpenAI integration in answerFAQ is temporarily disabled due to a 'Module not found' error. Returning mock response. Please ensure the 'openai' package is correctly installed by running 'npm install'."
  );

  // Mock response to allow the app to run and to test the 'needsSupport' logic
  if (input.query.toLowerCase().includes("бизнес") || input.query.toLowerCase().includes("business") || input.query.toLowerCase().includes("другой вопрос")) {
    return {
      answer: "Для этого вопроса обратитесь в поддержку. (Временно используется мок-ответ, т.к. OpenAI модуль не найден)",
      needsSupport: true,
      useSolutionTool: false,
    };
  }

  return {
    answer: `ИИ-ассистент временно недоступен (ошибка модуля OpenAI). Пожалуйста, проверьте установку пакета 'openai'. Ваш вопрос: "${input.query}".`,
    needsSupport: false, // Or true if you want to always show support button during this state
    useSolutionTool: false,
  };

  /*
  // Original OpenAI logic (temporarily disabled until 'openai' module is resolved):
  const systemPrompt = `Ты — полезный ИИ-ассистент магазина цифровых подписок QuickBuy TG (ИИMPERIUM SHOP).
Отвечай кратко, ясно и только на темы, связанные с магазином.

Контекст:
- Пользователи покупают подписки (ChatGPT Plus, PRO, Proxy) через WebApp.
- Оплата осуществляется через внутренний баланс, пополняемый на Lava.io.
- Существуют подварианты подписок: Продление, Готовый аккаунт, Без подписки.
- Иногда требуется ввод логина/пароля/2FA.
- Если вопрос пользователя не связан с магазином, подписками или оплатой — ответь строго фразой: "Для этого вопроса обратитесь в поддержку".`;

  try {
    // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Ensure this is initialized if re-enabled
    // const completion = await openai.chat.completions.create({
    //   model: 'gpt-3.5-turbo-0125',
    //   messages: [
    //     { role: 'system', content: systemPrompt },
    //     { role: 'user', content: input.query },
    //   ],
    // });

    // const generatedAnswer = completion.choices[0]?.message?.content || "Извините, не удалось получить ответ от ИИ.";
    
    // let needsSupport = false;
    // const supportPhrase = "Для этого вопроса обратитесь в поддержку";

    // if (generatedAnswer.includes(supportPhrase)) {
    //   needsSupport = true;
    // }

    // return {
    //   answer: generatedAnswer,
    //   needsSupport: needsSupport,
    //   useSolutionTool: false, 
    // };

  } catch (error) {
    console.error("Error calling OpenAI API (currently disabled due to module error):", error);
    return {
      answer: "Произошла ошибка при обращении к AI (модуль OpenAI не найден). Пожалуйста, попробуйте позже или обратитесь в поддержку.",
      needsSupport: true,
      useSolutionTool: false,
    };
  }
  */
}
