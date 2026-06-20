import type { MockSalon } from '../data/mockData';

const TIER_TO_NUMBER: Record<string, number> = { '₹': 1, '₹₹': 2, '₹₹₹': 3 };

export type DiscoveryFilters = {
  query: string;
  neighborhoods: string[];
  minRating: number;
  maxRating: number;
  priceTiers: number[];
};

export type SortOption = 'rating' | 'price-low' | 'price-high';

/** Returns true when the search query matches salon category or any service title. */
export function matchesSearchQuery(salon: MockSalon, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const categoryMatch = salon.category.toLowerCase().includes(q);
  const serviceMatch = salon.services.some((s) =>
    s.title.toLowerCase().includes(q),
  );
  const nameMatch = salon.name.toLowerCase().includes(q);

  return categoryMatch || serviceMatch || nameMatch;
}

export function filterSalons(
  salons: MockSalon[],
  filters: DiscoveryFilters,
): MockSalon[] {
  return salons.filter((salon) => {
    if (
      filters.neighborhoods.length > 0 &&
      !filters.neighborhoods.includes(salon.neighborhood)
    ) {
      return false;
    }

    if (salon.rating < filters.minRating || salon.rating > filters.maxRating) {
      return false;
    }

    if (filters.priceTiers.length > 0) {
      const tier = TIER_TO_NUMBER[salon.priceTier] ?? 2;
      if (!filters.priceTiers.includes(tier)) return false;
    }

    if (!matchesSearchQuery(salon, filters.query)) return false;

    return true;
  });
}

export function sortSalons(
  salons: MockSalon[],
  sort: SortOption,
): MockSalon[] {
  return [...salons].sort((a, b) => {
    if (sort === 'rating') return b.rating - a.rating;
    const aMin = Math.min(...a.services.map((s) => s.price));
    const bMin = Math.min(...b.services.map((s) => s.price));
    return sort === 'price-low' ? aMin - bMin : bMin - aMin;
  });
}

export function countActiveFilters(filters: DiscoveryFilters): number {
  let count = 0;
  if (filters.query.trim()) count += 1;
  if (filters.neighborhoods.length > 0) count += filters.neighborhoods.length;
  if (filters.minRating > 0 || filters.maxRating < 5) count += 1;
  if (filters.priceTiers.length > 0) count += filters.priceTiers.length;
  return count;
}

export const DEFAULT_FILTERS: DiscoveryFilters = {
  query: '',
  neighborhoods: [],
  minRating: 0,
  maxRating: 5,
  priceTiers: [],
};
