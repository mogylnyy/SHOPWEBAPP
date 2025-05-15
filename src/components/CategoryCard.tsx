
'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Category } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { PATHS } from '@/lib/constants';
import { useTranslation } from '@/hooks/useTranslation';
import type { Locale } from '@/lib/i18n-config';

type CategoryCardProps = {
  category: Category;
  locale: Locale; 
};

export default function CategoryCard({ category, locale }: CategoryCardProps) {
  const { t } = useTranslation(locale);
  return (
    <Card className="overflow-hidden h-full flex flex-col bg-card/70 backdrop-blur-md shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group">
      <CardHeader className="p-0">
        <div className="aspect-[3/2] relative w-full">
          <Image
            src={category.image}
            alt={category.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint={category.dataAiHint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 flex-grow">
        <CardTitle className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-primary group-hover:text-accent transition-colors">{category.name}</CardTitle>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground line-clamp-3">{category.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-3 sm:p-4 pt-0 mt-auto">
        <Button asChild variant="outline" size="sm" className="w-full btn-glow text-xs sm:text-sm group-hover:bg-accent/10 group-hover:border-accent">
          <Link href={`/${locale}${PATHS.SHOP}/${category.id}`}>
            {t('category_card.view_products_button')} <ArrowRight className="ml-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

