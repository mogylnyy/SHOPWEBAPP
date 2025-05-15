
import CategoryCard from '@/components/CategoryCard';
import { MOCK_CATEGORIES, PATHS } from '@/lib/constants';
import type { Category } from '@/types';
import { getTranslations } from '@/lib/i18n-server'; 
import type { Locale } from '@/lib/i18n-config';

// Simulate API call
async function getCategories(): Promise<Category[]> {
  return Promise.resolve(MOCK_CATEGORIES);
}

export default async function ShopCategoriesPage({ params }: { params: { locale: Locale }}) {
  const categories = await getCategories();
  const { t } = await getTranslations(params.locale); 

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">{t('shop_page.categories_title')}</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {t('shop_page.categories_subtitle')}
        </p>
      </div>

      {categories.length === 0 ? (
        <p className="text-center text-muted-foreground">{t('shop_page.no_categories_available')}</p> 
      ) : (
        <div className="grid grid-cols-2 gap-4"> {/* Changed grid classes here */}
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} locale={params.locale} />
          ))}
        </div>
      )}
    </div>
  );
}

