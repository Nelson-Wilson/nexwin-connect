import { describe, it, expect } from 'vitest';
import { filterAndSortProducts } from './filterProducts';
import type { StoreProduct } from '../../../models/product.model';

function makeProduct(overrides: Partial<StoreProduct>): StoreProduct {
  return {
    id: overrides.id ?? Math.random().toString(36),
    businessId: 'biz_1',
    name: 'Produto',
    category: 'Vestidos',
    price: 100,
    description: '',
    status: 'disponivel',
    images: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('filterAndSortProducts', () => {
  const products: StoreProduct[] = [
    makeProduct({ id: 'a', name: 'Vestido Floral', category: 'Vestidos', price: 500, createdAt: '2026-01-01T00:00:00.000Z' }),
    makeProduct({ id: 'b', name: 'Sapato Preto', category: 'Calçado', price: 1200, createdAt: '2026-02-01T00:00:00.000Z' }),
    makeProduct({ id: 'c', name: 'Vestido de Festa', category: 'Vestidos', price: 2000, createdAt: '2026-03-01T00:00:00.000Z', description: 'edição limitada' }),
  ];

  it('returns all products for "todos" with no filters', () => {
    const result = filterAndSortProducts(products, { category: 'todos', search: '', maxPrice: 9999, sort: 'default' });
    expect(result).toHaveLength(3);
  });

  it('filters by category', () => {
    const result = filterAndSortProducts(products, { category: 'Vestidos', search: '', maxPrice: 9999, sort: 'default' });
    expect(result.map((p) => p.id)).toEqual(['a', 'c']);
  });

  it('filters by max price', () => {
    const result = filterAndSortProducts(products, { category: 'todos', search: '', maxPrice: 1000, sort: 'default' });
    expect(result.map((p) => p.id)).toEqual(['a']);
  });

  it('matches search text against name and description, case-insensitively', () => {
    const byName = filterAndSortProducts(products, { category: 'todos', search: 'sapato', maxPrice: 9999, sort: 'default' });
    expect(byName.map((p) => p.id)).toEqual(['b']);

    const byDescription = filterAndSortProducts(products, { category: 'todos', search: 'EDIÇÃO', maxPrice: 9999, sort: 'default' });
    expect(byDescription.map((p) => p.id)).toEqual(['c']);
  });

  it('sorts by price ascending and descending', () => {
    const asc = filterAndSortProducts(products, { category: 'todos', search: '', maxPrice: 9999, sort: 'price-asc' });
    expect(asc.map((p) => p.id)).toEqual(['a', 'b', 'c']);

    const desc = filterAndSortProducts(products, { category: 'todos', search: '', maxPrice: 9999, sort: 'price-desc' });
    expect(desc.map((p) => p.id)).toEqual(['c', 'b', 'a']);
  });

  it('sorts by name A-Z', () => {
    const result = filterAndSortProducts(products, { category: 'todos', search: '', maxPrice: 9999, sort: 'name-asc' });
    expect(result.map((p) => p.id)).toEqual(['b', 'c', 'a']); // Sapato, Vestido de Festa, Vestido Floral
  });

  it('sorts by newest first', () => {
    const result = filterAndSortProducts(products, { category: 'todos', search: '', maxPrice: 9999, sort: 'newest' });
    expect(result.map((p) => p.id)).toEqual(['c', 'b', 'a']);
  });

  it('does not mutate the original array', () => {
    const original = [...products];
    filterAndSortProducts(products, { category: 'todos', search: '', maxPrice: 9999, sort: 'price-desc' });
    expect(products).toEqual(original);
  });
});
