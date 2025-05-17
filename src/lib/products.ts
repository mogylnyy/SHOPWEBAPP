import { prisma } from '@/lib/prisma';
import type { Product } from '@/types';

function mapDbProductToProduct(dbProduct: any): Product {
  return {
    id: dbProduct.code || String(dbProduct.id),
    name: dbProduct.name,
    description: dbProduct.description || '',
    price: typeof dbProduct.price === 'object' && 'toNumber' in dbProduct.price ? dbProduct.price.toNumber() : Number(dbProduct.price),
    category: dbProduct.category,
    image: dbProduct.image || 'https://placehold.co/600x400.png', // Заглушка, если нет поля
    subProducts: [], // Пока нет поддержки вариантов из БД
    requiresAuthDetails: false, // Заглушка
    dataAiHint: '', // Заглушка
  };
}

export async function getProductsByCategory(categoryCode: string): Promise<Product[]> {
  const dbProducts = await prisma.products.findMany({
    where: { category: { code: categoryCode }, active: true },
    orderBy: { id: 'asc' },
    include: { category: true },
  });
  return dbProducts.map(mapDbProductToProduct);
} 