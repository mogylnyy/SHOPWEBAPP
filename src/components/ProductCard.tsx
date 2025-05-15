
'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { PATHS } from '@/lib/constants';
import { useTranslation } from '@/hooks/useTranslation';
import type { Locale } from '@/lib/i18n-config';

type ProductCardProps = {
  product: Product;
  locale: Locale; // Added locale prop
};

function getPriceDisplay(product: Product, t: (key: string) => string): string {
  if (product.subProducts && product.subProducts.length > 0) {
    const prices = product.subProducts.map(sp => sp.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    if (minPrice === maxPrice) {
      return `${minPrice.toFixed(2)} ₽`;
    }
    return `${minPrice.toFixed(2)} ₽ - ${maxPrice.toFixed(2)} ₽`;
  }
  return product.price ? `${product.price.toFixed(2)} ₽` : t('product_card.price_not_available');
}

export default function ProductCard({ product, locale }: ProductCardProps) {
  const { t } = useTranslation(locale);
  const priceDisplay = getPriceDisplay(product, t);

  return (
    <Card className="overflow-hidden h-full flex flex-col bg-card/70 backdrop-blur-md shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group">
      <CardHeader className="p-0">
        <div className="aspect-[3/2] relative w-full">
          <Image
            src={product.image}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint={product.dataAiHint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 flex-grow">
        <CardTitle className="text-base sm:text-lg font-semibold mb-1 text-primary group-hover:text-accent transition-colors">{product.name}</CardTitle>
        <p className="text-lg sm:text-xl font-bold text-accent mb-1 sm:mb-2">{priceDisplay}</p>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">{product.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-3 sm:p-4 pt-0 mt-auto">
        <Button asChild variant="outline" size="sm" className="w-full btn-glow text-xs sm:text-sm group-hover:bg-accent/10 group-hover:border-accent">
          <Link href={`/${locale}${PATHS.SHOP}/${product.category}/${product.id}`}>
            {product.subProducts && product.subProducts.length > 0 ? t('product_card.view_options_button') : t('product_card.view_details_button')}
            <ArrowRight className="ml-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
