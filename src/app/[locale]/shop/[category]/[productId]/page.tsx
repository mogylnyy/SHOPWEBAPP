
'use client'; 

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import PurchaseForm from '@/components/PurchaseForm';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, PATHS } from '@/lib/constants';
import type { Product, Category } from '@/types'; // Removed SubProduct as it's part of Product
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Home, Tag } from 'lucide-react'; // Removed Package
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTranslation } from '@/hooks/useTranslation';
import type { Locale } from '@/lib/i18n-config';

// Simulate API calls
function getProductDetails(productId: string): Product | undefined {
  return MOCK_PRODUCTS.find(p => p.id === productId);
}

function getCategoryDetails(categoryId: string): Category | undefined {
  return MOCK_CATEGORIES.find(c => c.id === categoryId);
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { t, locale } = useTranslation(params.locale as Locale);

  const productId = typeof params.productId === 'string' ? params.productId : '';
  const categoryId = typeof params.category === 'string' ? params.category : '';

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [selectedSubProductId, setSelectedSubProductId] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    if (productId) {
      const fetchedProduct = getProductDetails(productId);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
        if (fetchedProduct.subProducts && fetchedProduct.subProducts.length > 0) {
          setSelectedSubProductId(fetchedProduct.subProducts[0].id);
        }
         const fetchedCategory = getCategoryDetails(fetchedProduct.category);
         if(fetchedCategory) setCategory(fetchedCategory);

      } else {
        router.push(`/${locale}${PATHS.SHOP}`);
      }
    }
  }, [productId, router, categoryId, locale]);


  if (!product || !category) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-4">{t('product_details_page.loading_text')}</p>
      </div>
    );
  }

  const selectedSubProduct = product.subProducts?.find(sp => sp.id === selectedSubProductId);
  const displayPrice = selectedSubProduct?.price ?? product.price ?? 0;

  return (
    <div className="space-y-8">
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
        <Link href={`/${locale}${PATHS.HOME}`} className="hover:text-primary transition-colors flex items-center">
          <Home className="h-4 w-4 mr-1" /> {t('product_details_page.home_breadcrumb')}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/${locale}${PATHS.SHOP}`} className="hover:text-primary transition-colors">
          {t('product_details_page.shop_breadcrumb')}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/${locale}${PATHS.SHOP}/${category.id}`} className="hover:text-primary transition-colors">
          {category.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <Card className="bg-card/70 backdrop-blur-md shadow-xl">
          <CardHeader>
            <div className="aspect-square relative w-full rounded-t-lg overflow-hidden mb-4"> {/* Changed aspect ratio */}
              <Image
                src={product.image}
                alt={product.name}
                layout="fill"
                objectFit="contain" // Changed objectFit
                data-ai-hint={product.dataAiHint}
              />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">{product.name}</CardTitle>
            <CardDescription className="text-lg text-muted-foreground pt-1">{product.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-3xl font-bold text-accent my-4">
              <Tag className="h-7 w-7 mr-2 text-primary" /> {displayPrice.toFixed(2)} ₽
            </div>

            {product.subProducts && product.subProducts.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3 text-foreground">{t('product_details_page.select_option_title')}</h3>
                <RadioGroup 
                  value={selectedSubProductId} 
                  onValueChange={setSelectedSubProductId}
                  className="space-y-2"
                >
                  {product.subProducts.map(sub => (
                    <Label
                      key={sub.id}
                      htmlFor={sub.id}
                      className={`flex items-center justify-between p-4 rounded-md border cursor-pointer transition-all hover:border-primary ${selectedSubProductId === sub.id ? 'border-primary ring-2 ring-primary bg-primary/10' : 'border-border bg-background/30'}`}
                    >
                       <div className="flex items-center space-x-3">
                        <RadioGroupItem value={sub.id} id={sub.id} />
                        <span className="font-medium text-foreground">{sub.name}</span>
                      </div>
                      <span className="font-semibold text-accent">{sub.price.toFixed(2)} ₽</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            )}
            {selectedSubProduct?.description && (
              <p className="mt-4 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                <strong>{t('product_details_page.option_details_prefix')}</strong> {selectedSubProduct.description}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex items-start justify-center md:pt-4">
          <PurchaseForm product={product} selectedSubProduct={selectedSubProduct} />
        </div>
      </div>
    </div>
  );
}
