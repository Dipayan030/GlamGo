import { useEffect, useMemo, useState } from 'react';
import {
  Filter,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { adaptSalons } from '../data/adapter';
import { NEIGHBORHOODS } from '../data/mockData.js';
import { SalonCard } from '../components/SalonCard';
import type { Route } from '../components/routeTypes';
import {
  countActiveFilters,
  DEFAULT_FILTERS,
  filterSalons,
  sortSalons,
  type DiscoveryFilters,
  type SortOption,
} from '../utils/filterSalons';

const PRICE_TIERS = [
  { value: 1, label: '₹', hint: 'Budget' },
  { value: 2, label: '₹₹', hint: 'Mid-range' },
  { value: 3, label: '₹₹₹', hint: 'Premium' },
] as const;

const RATING_PRESETS = [
  { min: 0, max: 5, label: 'Any' },
  { min: 4.0, max: 5, label: '4.0+' },
  { min: 4.5, max: 5, label: '4.5+' },
  { min: 4.7, max: 5, label: '4.7+' },
  { min: 4.9, max: 5, label: '4.9+' },
] as const;

export function DiscoveryPage() {
  const { route, navigate, salons, setSearchQuery } = useApp();
  const initial = route.name === 'search' ? route : { query: '', neighborhood: '' };

  const [filters, setFilters] = useState<DiscoveryFilters>(() => ({
    ...DEFAULT_FILTERS,
    query: initial.query ?? '',
    neighborhoods: initial.neighborhood ? [initial.neighborhood] : [],
  }));
  const [sort, setSort] = useState<SortOption>('rating');
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    setSearchQuery(filters.query);
  }, [filters.query, setSearchQuery]);

  useEffect(() => {
    if (!mobileFilters) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileFilters]);

  const adaptedSalons = useMemo(() => adaptSalons(salons), [salons]);
  const adaptedById = useMemo(
    () => new Map(adaptedSalons.map((s) => [s.id, s])),
    [adaptedSalons],
  );

  const results = useMemo(() => {
    const filtered = filterSalons(salons, filters);
    return sortSalons(filtered, sort);
  }, [salons, filters, sort]);

  const activeFilterCount = countActiveFilters(filters);

  const patchFilters = (patch: Partial<DiscoveryFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  const toggleNeighborhood = (n: string) =>
    patchFilters({
      neighborhoods: filters.neighborhoods.includes(n)
        ? filters.neighborhoods.filter((x) => x !== n)
        : [...filters.neighborhoods, n],
    });

  const togglePriceTier = (tier: number) =>
    patchFilters({
      priceTiers: filters.priceTiers.includes(tier)
        ? filters.priceTiers.filter((t) => t !== tier)
        : [...filters.priceTiers, tier],
    });

  const clearFilters = () => {
    setFilters({ ...DEFAULT_FILTERS });
    setSort('rating');
  };

  const ratingPreset =
    RATING_PRESETS.find(
      (p) => p.min === filters.minRating && p.max === filters.maxRating,
    ) ?? RATING_PRESETS[0];

  const filterPanel = (
    <div className="space-y-6">
      {/* Neighborhood checkboxes */}
      <div>
        <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">
          <MapPin className="h-3.5 w-3.5" /> Neighborhood
        </h3>
        <div className="max-h-48 space-y-1.5 overflow-y-auto pr-1">
          {NEIGHBORHOODS.map((n) => (
            <label
              key={n}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1 text-sm text-ink-600 transition-colors hover:bg-ink-50"
            >
              <input
                type="checkbox"
                checked={filters.neighborhoods.includes(n)}
                onChange={() => toggleNeighborhood(n)}
                className="h-4 w-4 rounded accent-brand-600"
              />
              {n}
            </label>
          ))}
        </div>
      </div>

      {/* Rating range */}
      <div>
        <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">
          <Star className="h-3.5 w-3.5" /> Rating range
        </h3>
        <div className="flex flex-wrap gap-2">
          {RATING_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() =>
                patchFilters({ minRating: preset.min, maxRating: preset.max })
              }
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                ratingPreset.label === preset.label
                  ? 'bg-brand-600 text-white'
                  : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        {filters.minRating > 0 && (
          <p className="mt-2 text-xs text-ink-500">
            Showing salons rated {filters.minRating.toFixed(1)} –{' '}
            {filters.maxRating.toFixed(1)}
          </p>
        )}
      </div>

      {/* Price tier checkboxes */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
          Price tier
        </h3>
        <div className="space-y-1.5">
          {PRICE_TIERS.map(({ value, label, hint }) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1 text-sm text-ink-600 transition-colors hover:bg-ink-50"
            >
              <input
                type="checkbox"
                checked={filters.priceTiers.includes(value)}
                onChange={() => togglePriceTier(value)}
                className="h-4 w-4 rounded accent-brand-600"
              />
              <span className="font-medium">{label}</span>
              <span className="text-ink-400">{hint}</span>
            </label>
          ))}
        </div>
      </div>

      <button type="button" onClick={clearFilters} className="btn-outline w-full">
        Clear Filters
      </button>
    </div>
  );

  const goSalon = (id: string): Route => ({ name: 'salon', id });

  return (
    <div className="mx-auto max-w-7xl animate-fadeIn px-4 py-8 sm:px-6 lg:px-8">
      {/* Header + search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Discover salons</h1>
          <p className="mt-1 text-sm text-ink-500">
            {results.length} studio{results.length !== 1 ? 's' : ''} matching your
            filters
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              value={filters.query}
              onChange={(e) => patchFilters({ query: e.target.value })}
              placeholder="Try 'haircut', 'bridal', 'facial'…"
              className="input w-full pl-9 sm:w-72"
              aria-label="Search salons by category or service"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="input w-auto flex-1 sm:flex-none"
              aria-label="Sort results"
            >
              <option value="rating">Top rated</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>

            <button
              type="button"
              onClick={() => setMobileFilters(true)}
              className="btn-outline relative shrink-0 px-3 lg:hidden"
              aria-label="Open filters"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="card sticky top-20 p-5">
            <div className="mb-4 flex items-center gap-2 text-ink-700">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-semibold">Filters</span>
              {activeFilterCount > 0 && (
                <span className="chip bg-brand-50 text-brand-700">
                  {activeFilterCount} active
                </span>
              )}
            </div>
            {filterPanel}
          </div>
        </aside>

        {/* Results grid */}
        <div className="min-w-0 flex-1">
          {results.length === 0 ? (
            <div className="relative overflow-hidden rounded-3xl border border-dashed border-ink-200 bg-gradient-to-b from-white via-brand-50/20 to-white px-6 py-16 text-center sm:py-20">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-100/40 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-amber-100/30 blur-3xl" />

              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-brand-50 ring-1 ring-brand-100">
                <Sparkles className="h-9 w-9 text-brand-500" />
              </div>

              <h3 className="relative mt-6 text-xl font-bold text-ink-900">
                No salons found
              </h3>
              <p className="relative mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-500">
                {filters.query.trim() ? (
                  <>
                    Nothing matched &ldquo;{filters.query.trim()}&rdquo; with your
                    current filters. Try a different service name, category, or broaden
                    your search.
                  </>
                ) : (
                  <>
                    No studios match your current filters. Try selecting fewer
                    neighborhoods, lowering the rating threshold, or adding more price
                    tiers.
                  </>
                )}
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="btn-primary relative mt-8"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((raw) => {
                const salon = adaptedById.get(raw.id);
                if (!salon) return null;
                return (
                  <SalonCard
                    key={salon.id}
                    salon={salon}
                    onOpen={() => navigate(goSalon(salon.id))}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm"
            onClick={() => setMobileFilters(false)}
            aria-hidden="true"
          />
          <div className="absolute bottom-0 left-0 right-0 flex max-h-[90vh] animate-fadeUp flex-col rounded-t-3xl bg-white shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-ink-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-ink-900">Filters</h2>
                {activeFilterCount > 0 && (
                  <span className="chip bg-brand-50 text-brand-700">
                    {activeFilterCount} active
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setMobileFilters(false)}
                className="btn-ghost px-2"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">{filterPanel}</div>

            <div className="shrink-0 border-t border-ink-100 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => setMobileFilters(false)}
                className="btn-primary w-full"
              >
                Show {results.length} result{results.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
