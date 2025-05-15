import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package } from 'lucide-react';
import { PATHS } from '@/lib/constants';

type ProductCardProps = {
  product: Product;
};

function getPriceDisplay(product: Product): string {
  if (product.subProducts && product.subProducts.length > 0) {
    const prices = product.subProducts.map(sp => sp.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    if (minPrice === maxPrice) {
      return `$${minPrice.toFixed(2)}`;
    }
    return `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
  }
  return product.price ? `$${product.price.toFixed(2)}` : 'N/A';
}

export default function ProductCard({ product }: ProductCardProps) {
  const priceDisplay = getPriceDisplay(product);

  return (
    <Card className="overflow-hidden h-full flex flex-col bg-card/70 backdrop-blur-md shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
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
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-xl font-semibold mb-1 text-primary">{product.name}</CardTitle>
        <p className="text-2xl font-bold text-accent mb-2">{priceDisplay}</p>
        <CardDescription className="text-sm text-muted-foreground line-clamp-3">{product.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild variant="outline" className="w-full btn-glow">
          <Link href={`${PATHS.SHOP}/${product.category}/${product.id}`}>
            {product.subProducts && product.subProducts.length > 0 ? 'View Options' : 'View Details'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
