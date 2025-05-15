
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, User, CreditCardIcon, HelpCircle, ArrowRight } from 'lucide-react'; // Ensure CreditCardIcon is imported if it's distinct from CreditCard
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
    iconComponent: CreditCardIcon, // Using CreditCardIcon as it's more standard for payment related items than just CreditCard
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
    <div className="flex flex-col items-center justify-center min-h-full py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-12 px-4">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
          {t('app_title')}
        </h1>
        <p className="mt-2 sm:mt-3 text-md sm:text-xl text-muted-foreground">
          {t('home_page.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full max-w-md mx-auto px-1 sm:max-w-2xl sm:gap-4">
        {menuItems.map((item) => {
          const IconComponent = item.iconComponent;
          return (
            <Card key={item.href} className="bg-card/70 backdrop-blur-md shadow-lg group flex flex-col overflow-hidden rounded-lg transition-shadow duration-300 hover:shadow-primary/25">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2 sm:p-3">
                <CardTitle className="text-xs sm:text-sm md:text-base font-semibold text-primary group-hover:text-accent transition-colors">
                  {t(item.labelKey)}
                </CardTitle>
                <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-accent group-hover:text-primary transition-colors ml-1 shrink-0" />
              </CardHeader>
              <CardContent className="flex-grow flex flex-col p-2 sm:p-3 pt-1 sm:pt-1">
                <p className="text-[10px] sm:text-xs leading-tight sm:leading-normal text-muted-foreground mb-2 flex-grow">{t(item.descriptionKey)}</p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full btn-glow border-primary hover:border-accent group-hover:bg-accent/10 mt-auto !text-[10px] sm:!text-xs !h-7 sm:!h-8 !px-2 !py-1"
                >
                  <Link href={`/${locale}${item.href}`}>
                    {t('home_page.goToShort')}
                    <ArrowRight className="ml-1 h-3 w-3" />
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
