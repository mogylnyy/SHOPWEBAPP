
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
    <div className="flex flex-col items-center justify-center min-h-full py-8">
      <div className="text-center mb-10 px-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
          {t('app_title')}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-muted-foreground">
          {t('home_page.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto px-2 sm:max-w-lg md:max-w-xl">
        {menuItems.map((item) => {
          const IconComponent = item.iconComponent;
          return (
            <Card key={item.href} className="bg-card/80 backdrop-blur-md shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group flex flex-col overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4">
                <CardTitle className="text-base sm:text-lg font-semibold text-primary group-hover:text-accent transition-colors">
                  {t(item.labelKey)}
                </CardTitle>
                <div className="text-accent group-hover:text-primary transition-colors">
                  <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 flex-grow">{t(item.descriptionKey)}</p>
                <Button
                  asChild
                  variant="outline"
                  size="sm" // Smaller button
                  className="w-full btn-glow border-primary hover:border-accent group-hover:bg-accent/10 mt-auto text-xs sm:text-sm"
                >
                  <Link href={`/${locale}${item.href}`}>
                    {t('home_page.goToShort')}
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
