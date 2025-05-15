import CategoryCard from '@/components/CategoryCard';
import { MOCK_CATEGORIES } from '@/lib/constants';
import type { Category } from '@/types';

// Simulate API call
async function getCategories(): Promise<Category[]> {
  // In a real app, fetch from your API:
  // const res = await fetch('/api/categories');
  // const data = await res.json();
  // return data;
  return Promise.resolve(MOCK_CATEGORIES);
}

export default async function ShopCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">Product Categories</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Explore our range of digital products and services.
        </p>
      </div>

      {categories.length === 0 ? (
        <p className="text-center text-muted-foreground">No categories available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
