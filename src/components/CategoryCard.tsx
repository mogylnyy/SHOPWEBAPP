import Link from 'next/link';
import Image from 'next/image';
import type { Category } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { PATHS } from '@/lib/constants';

type CategoryCardProps = {
  category: Category;
};

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col bg-card/70 backdrop-blur-md shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
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
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-2xl font-semibold mb-2 text-primary">{category.name}</CardTitle>
        <CardDescription className="text-muted-foreground">{category.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild variant="outline" className="w-full btn-glow">
          <Link href={`${PATHS.SHOP}/${category.id}`}>
            View Products <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
