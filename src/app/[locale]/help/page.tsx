
import FaqClient from '@/components/FaqClient';
import { getTranslations } from '@/lib/i18n-server';
import type { Locale } from '@/lib/i18n-config';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Added Card imports
import { HelpCircle } from 'lucide-react'; // For consistency with FaqClient style

export default async function HelpPage({ params: { locale } }: { params: { locale: Locale } }) {
  const { t } = await getTranslations(locale);

  const faqItems = [
    {
      id: "q1",
      questionKey: "help_page.faq.q1_question",
      answerKey: "help_page.faq.q1_answer"
    },
    {
      id: "q2",
      questionKey: "help_page.faq.q2_question",
      answerKey: "help_page.faq.q2_answer"
    },
    {
      id: "q3",
      questionKey: "help_page.faq.q3_question",
      answerKey: "help_page.faq.q3_answer"
    },
    {
      id: "q4",
      questionKey: "help_page.faq.q4_question",
      answerKey: "help_page.faq.q4_answer"
    },
    {
      id: "q5",
      questionKey: "help_page.faq.q5_question",
      answerKey: "help_page.faq.q5_answer"
    },
    {
      id: "q6",
      questionKey: "help_page.faq.q6_question",
      answerKey: "help_page.faq.q6_answer"
    }
  ];

  return (
    <div className="space-y-12"> {/* Increased spacing between AI client and FAQ */}
      <FaqClient />

      <Card className="w-full max-w-2xl mx-auto bg-card/80 backdrop-blur-md shadow-xl">
        <CardHeader className="text-center">
          <HelpCircle className="mx-auto h-10 w-10 text-primary mb-2" /> {/* Smaller icon */}
          <CardTitle className="text-2xl font-bold">
            {t('help_page.faq.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map(item => (
              <AccordionItem value={item.id} key={item.id} className="border-border/50">
                <AccordionTrigger className="text-left text-base font-medium hover:text-accent py-4">
                  {t(item.questionKey)}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {t(item.answerKey)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
