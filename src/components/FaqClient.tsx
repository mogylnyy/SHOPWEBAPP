'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { answerFAQ, type AnswerFAQInput, type AnswerFAQOutput } from '@/ai/flows/answer-faq';
import { Bot, HelpCircle, Loader2, Send, Terminal, Home } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import type { Locale } from '@/lib/i18n-config'; // Ensure Locale is imported if needed for useTranslation

export default function FaqClient() {
  const { t } = useTranslation(); // Locale will be picked up by useParams in useTranslation
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<AnswerFAQOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const input: AnswerFAQInput = { query };
      const result = await answerFAQ(input);
      setResponse(result);
    } catch (err) {
      console.error('FAQ Error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card/80 backdrop-blur-md shadow-xl">
      <CardHeader className="text-center">
        <HelpCircle className="mx-auto h-12 w-12 text-primary mb-2" />
        <CardTitle className="text-3xl font-bold">{t('help_page.ai_center_title')}</CardTitle>
        <CardDescription>
          {t('help_page.ai_center_subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('help_page.input_placeholder')}
              className="flex-grow text-base"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !query.trim()} className="btn-glow">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span className="sr-only">{t('help_page.send_button_sr')}</span>
            </Button>
          </div>
        </form>

        {isLoading && (
          <div className="mt-6 flex items-center justify-center text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>{t('help_page.thinking')}</span>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-6">
            <Terminal className="h-4 w-4" />
            <AlertTitle>{t('help_page.error_title')}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {response && (
          <Card className="mt-6 bg-background/50 shadow-inner">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-primary">
                <Bot className="h-6 w-6 mr-2" /> {t('help_page.ai_response_title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">{response.answer}</p>
              {response.needsSupport && (
                <a
                  href="https://t.me/iimperium_support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-purple-600 to-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:scale-105 transition mt-4"
                >
                  💬 Обратиться в поддержку
                </a>
              )}
              {/* Legacy useSolutionTool alert - will not show as useSolutionTool is always false now */}
              {response.useSolutionTool && (
                 <Alert variant="default" className="border-accent bg-accent/10">
                    <Terminal className="h-4 w-4 text-accent" />
                    <AlertTitle className="text-accent">{t('help_page.solution_alert_title')}</AlertTitle>
                    <AlertDescription className="text-accent/90">
                        {t('help_page.solution_alert_description')}
                    </AlertDescription>
                 </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
      <CardFooter className="text-center flex flex-col gap-3">
        <p className="text-xs text-muted-foreground w-full">
            {t('help_page.footer_note')}
        </p>
        <Button
          variant="outline"
          className="mx-auto mt-2 w-32"
          onClick={() => window.history.back()}
        >
          ← Назад
        </Button>
        <Button
          variant="outline"
          className="mx-auto mt-2 w-32"
          asChild
        >
          <a href="/">
            <Home className="mr-2 h-5 w-5" /> Главное меню
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
