'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { answerFAQ, type AnswerFAQInput, type AnswerFAQOutput } from '@/ai/flows/answer-faq';
import { Bot, HelpCircle, Loader2, Send, Terminal, ExternalLink } from 'lucide-react';

export default function FaqClient() {
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
        <CardTitle className="text-3xl font-bold">AI-Powered Help Center</CardTitle>
        <CardDescription>
          Ask a question and our AI assistant will try to help you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., How do I top up my balance?"
              className="flex-grow text-base"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !query.trim()} className="btn-glow">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </form>

        {isLoading && (
          <div className="mt-6 flex items-center justify-center text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Thinking...</span>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-6">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {response && (
          <Card className="mt-6 bg-background/50 shadow-inner">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-primary">
                <Bot className="h-6 w-6 mr-2" /> AI Response
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">{response.answer}</p>
              {response.useSolutionTool && (
                 <Alert variant="default" className="border-accent bg-accent/10">
                    <Terminal className="h-4 w-4 text-accent" />
                    <AlertTitle className="text-accent">Potential Solution Found</AlertTitle>
                    <AlertDescription className="text-accent/90">
                        Our AI found a relevant solution. For more details, you might want to check our knowledge base or contact support.
                        {/* Example of how you might link to a solution, if applicable
                        <Button variant="link" asChild className="p-0 h-auto text-accent hover:underline">
                           <a href="/solutions/example" target="_blank">View Solution Details <ExternalLink className="inline-block ml-1 h-3 w-3"/></a>
                        </Button>
                        */}
                    </AlertDescription>
                 </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
      <CardFooter className="text-center">
        <p className="text-xs text-muted-foreground w-full">
            AI responses are for informational purposes. For critical issues, please contact support.
        </p>
      </CardFooter>
    </Card>
  );
}
