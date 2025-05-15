
import ProductCard from '@/components/ProductCard';
import { MOCK_CATEGORIES, MOCK_PRODUCTS, PATHS } from '@/lib/constants';
import type { Category, Product } from '@/types';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { getTranslations } from '@/lib/i18n-server'; // Changed from useTranslation
import type { Locale } from '@/lib/i18n-config';
import { i18n } from '@/lib/i18n-config';


// Simulate API calls
async function getCategoryDetails(categoryId: string): Promise<Category | undefined> {
  return Promise.resolve(MOCK_CATEGORIES.find(cat => cat.id === categoryId));
}

async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  return Promise.resolve(MOCK_PRODUCTS.filter(prod => prod.category === categoryId));
}

export default async function CategoryProductsPage({ params }: { params: { category: string; locale: Locale } }) {
  const categoryId = params.category;
  const { t } = getTranslations(params.locale); // Changed from useTranslation
  const category = await getCategoryDetails(categoryId);
  const products = await getProductsByCategory(categoryId);

  if (!category) {
    return <p className="text-center text-destructive">{t('category_page.category_not_found')}</p>;
  }

  return (
    <div className="space-y-8">
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
        <Link href={`/${params.locale}${PATHS.HOME}`} className="hover:text-primary transition-colors flex items-center">
          <Home className="h-4 w-4 mr-1" /> {t('category_page.home_breadcrumb')}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/${params.locale}${PATHS.SHOP}`} className="hover:text-primary transition-colors">
          {t('category_page.shop_breadcrumb')}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">{category.name}</span> {/* Category name usually not translated or from CMS */}
      </nav>

      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">{category.name}</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {category.description} {/* Category description usually not translated or from CMS */}
        </p>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-muted-foreground">{t('category_page.no_products_found')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={params.locale} />
          ))}
        </div>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  // Only 'ru' locale is supported now
  const locale = i18n.defaultLocale;
  return MOCK_CATEGORIES.map(category => ({
    category: category.id,
    locale: locale,
  }));
}
