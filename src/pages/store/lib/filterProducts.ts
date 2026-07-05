import type { StoreProduct } from '../../../models/product.model';

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'newest';

export interface FilterOptions {
  category: string; // 'todos' or a category name
  search: string;
  maxPrice: number;
  sort: SortOption;
}

/**
 * Pure filter + sort used by StoreCatalogue. Extracted so it can be unit
 * tested without mounting the component or a StoreContext.
 */
export function filterAndSortProducts(products: StoreProduct[], options: FilterOptions): StoreProduct[] {
  const { category, search, maxPrice, sort } = options;
  const query = search.trim().toLowerCase();

  const filtered = products.filter((p) => {
    if (category !== 'todos' && p.category !== category) return false;
    if (p.price > maxPrice) return false;
    if (query) {
      return (
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        (p.subcategory ?? '').toLowerCase().includes(query)
      );
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'newest':
        return b.createdAt.localeCompare(a.createdAt);
      default:
        return 0;
    }
  });

  return sorted;
}
