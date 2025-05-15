
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, User, CreditCardIcon, HelpCircle, ArrowRight } from 'lucide-react';
import { PATHS } from '@/lib/constants';
import { useTranslation } from '@/hooks/useTranslation';
import type { Locale } from '@/lib/i18n-config';
import type { LucideIcon } from 'lucide-react';

interface MenuItem {
  href: string;
  labelKey: string;
  iconComponent: LucideIcon;
  descriptionKey: string;
}

const menuItems: MenuItem[] = [
  {
    href: PATHS.SHOP,
    labelKey: 'home_page.menu.shop.label',
    iconComponent: ShoppingCart,
    descriptionKey: 'home_page.menu.shop.description'
  },
  {
    href: PATHS.PROFILE,
    labelKey: 'home_page.menu.profile.label',
    iconComponent: User,
    descriptionKey: 'home_page.menu.profile.description'
  },
  {
    href: PATHS.TOP_UP,
    labelKey: 'home_page.menu.topUp.label',
    iconComponent: CreditCardIcon,
    descriptionKey: 'home_page.menu.topUp.description'
  },
  {
    href: PATHS.HELP,
    labelKey: 'home_page.menu.help.label',
    iconComponent: HelpCircle,
    descriptionKey: 'home_page.menu.help.description'
  },
];

export default function HomePage({ params: { locale } }: { params: { locale: Locale } }) {
  const { t } = useTranslation(locale);

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-12">
      <div className="text-center mb-12 px-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
          {t('app_title')}
        </h1>
        <p className="mt-3 text-lg sm:mt-4 sm:text-xl text-muted-foreground">
          {t('home_page.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 w-full max-w-4xl px-4">
        {menuItems.map((item) => {
          const IconComponent = item.iconComponent;
          return (
            <Card key={item.href} className="bg-card/80 backdrop-blur-md shadow-xl hover:shadow-primary/30 transition-shadow duration-300 group flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-semibold text-primary group-hover:text-accent transition-colors">
                  {t(item.labelKey)}
                </CardTitle>
                <div className="text-accent group-hover:text-primary transition-colors">
                  <IconComponent className="h-8 w-8" />
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-muted-foreground mb-6 flex-grow">{t(item.descriptionKey)}</p>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full btn-glow border-primary hover:border-accent group-hover:bg-accent/10 mt-auto"
                >
                  <Link href={`/${locale}${item.href}`}>
                    {`${t('home_page.goTo')} ${t(item.labelKey)}`}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
