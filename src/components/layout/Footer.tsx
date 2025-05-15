
'use client';

import { useTranslation } from '@/hooks/useTranslation';
import type { Locale } from '@/lib/i18n-config'; // Ensure Locale is imported
import { useParams } from 'next/navigation'; // To get locale if not passed

export default function Footer() {
  const params = useParams();
  // Ensure locale is correctly typed, params.locale could be string | string[]
  const currentLocale = (Array.isArray(params.locale) ? params.locale[0] : params.locale) as Locale | undefined;
  const { t } = useTranslation(currentLocale);
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-background/90 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>{t('footer.copyright').replace('{year}', currentYear.toString())}</p>
      </div>
    </footer>
  );
}
