
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, User, CreditCard, HelpCircle, ArrowRight } from 'lucide-react';
import { PATHS } from '@/lib/constants';
import { useTranslation } from '@/hooks/useTranslation';
import type { Locale } from '@/lib/i18n-config';

const menuItems = [
  {
    href: PATHS.SHOP,
    labelKey: 'home_page.menu.shop.label',
    icon: <ShoppingCart className="h-6 w-6" />,
    descriptionKey: 'home_page.menu.shop.description'
  },
  {
    href: PATHS.PROFILE,
    labelKey: 'home_page.menu.profile.label',
    icon: <User className="h-6 w-6" />,
    descriptionKey: 'home_page.menu.profile.description'
  },
  {
    href: PATHS.TOP_UP,
    labelKey: 'home_page.menu.topUp.label',
    icon: <CreditCard className="h-6 w-6" />,
    descriptionKey: 'home_page.menu.topUp.description'
  },
  {
    href: PATHS.HELP,
    labelKey: 'home_page.menu.help.label',
    icon: <HelpCircle className="h-6 w-6" />,
    descriptionKey: 'home_page.menu.help.description'
  },
];

export default function HomePage({ params: { locale } }: { params: { locale: Locale } }) {
  const { t } = useTranslation(locale);

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-12">
      <div className="text-center mb-12 px-4">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
          {t('app_title')}
        </h1>
        <p className="mt-3 text-lg sm:text-xl text-muted-foreground">
          {t('home_page.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-4xl px-2 sm:px-0">
        {menuItems.map((item) => (
          <Card key={item.href} className="bg-card/80 backdrop-blur-md shadow-xl hover:shadow-primary/30 transition-shadow duration-300 group flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 sm:px-4 pt-3 pb-1">
              <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-primary group-hover:text-accent transition-colors">
                {t(item.labelKey)}
              </CardTitle>
              <div className="text-accent group-hover:text-primary transition-colors ml-2 shrink-0">
                {item.icon}
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col px-3 sm:px-4 pb-3 sm:pb-4 pt-2">
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 flex-grow">{t(item.descriptionKey)}</p>
              <Button asChild variant="outline" size="sm" className="w-full btn-glow border-primary hover:border-accent group-hover:bg-accent/10 mt-auto text-xs sm:text-sm">
                <Link href={`/${locale}${item.href}`}>
                  {t('home_page.goTo')} {t(item.labelKey)}
                  <ArrowRight className="ml-1 sm:ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
