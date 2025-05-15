
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
    icon: <ShoppingCart className="h-8 w-8" />,
    descriptionKey: 'home_page.menu.shop.description'
  },
  {
    href: PATHS.PROFILE,
    labelKey: 'home_page.menu.profile.label',
    icon: <User className="h-8 w-8" />,
    descriptionKey: 'home_page.menu.profile.description'
  },
  {
    href: PATHS.TOP_UP,
    labelKey: 'home_page.menu.topUp.label',
    icon: <CreditCard className="h-8 w-8" />,
    descriptionKey: 'home_page.menu.topUp.description'
  },
  {
    href: PATHS.HELP,
    labelKey: 'home_page.menu.help.label',
    icon: <HelpCircle className="h-8 w-8" />,
    descriptionKey: 'home_page.menu.help.description'
  },
];

export default function HomePage({ params: { locale } }: { params: { locale: Locale } }) {
  const { t } = useTranslation(locale);

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
          {t('app_title')}
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          {t('home_page.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
        {menuItems.map((item) => (
          <Card key={item.href} className="bg-card/80 backdrop-blur-md shadow-xl hover:shadow-primary/30 transition-shadow duration-300 group flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold text-primary group-hover:text-accent transition-colors">
                {t(item.labelKey)}
              </CardTitle>
              <div className="text-accent group-hover:text-primary transition-colors">
                {item.icon}
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <p className="text-muted-foreground mb-4 flex-grow">{t(item.descriptionKey)}</p>
              <Button asChild variant="outline" className="w-full btn-glow border-primary hover:border-accent group-hover:bg-accent/10 mt-auto">
                <Link href={`/${locale}${item.href}`}>
                  {t('home_page.goTo')} {t(item.labelKey)}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
