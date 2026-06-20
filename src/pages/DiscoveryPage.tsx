import { useMemo, useState } from 'react';
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react';
import { useApp, type Route } from '../context/AppContext';
import { SALONS } from '../data/salons';
import type { Neighborhood, ServiceCategory } from '../types';
import { SalonCard } from '../components/SalonCard';

const NEIGHBORHOODS: Neighborhood[] = ['Bandra', 'Andheri West', 'Lower Parel', 'Juhu', 'Colaba', 'Powai'];
const CATEGORIES: ServiceCategory[] = ['Hair', 'Skin', 'Nails', 'Makeup', 'Spa'];

export function DiscoveryPage() {
  const { route, navigate } = useApp();
  const initial = route.name === 'search' ? route : { query: '', neighborhood: '' };

  const [query, setQuery] = useState(initial.query ?? '');
  const [neighborhood, setNeighborhood] = useState<string>(initial.neighborhood ?? '');
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [priceMax, setPriceMax] = useState(12000);
  const [sort, setSort] = useState<'rating' | 'price-low' | 'price-high'>('rating');
  const [mobileFilters, setMobileFilters] = useState(false);

  const toggleCategory = (c: ServiceCategory) =>
    setCategories((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));

  const results = useMemo(() => {
    let list = SALONS.filter((s) => {
      if (neighborhood && s.neighborhood !== neighborhood) return false;
      if (minRating > 0 && s.rating < minRating) return false;
      const maxService = Math.max(...s.services.map((sv) => sv.price));
      if (maxService > priceMax) return false;
      if (categories.length > 0 && !s.services.some((sv) => categories.includes(sv.category))) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = [s.name, s.tagline, s.neighborhood, ...s.services.map((sv) => sv.name), ...s.badges]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === 'rating') return b.rating - a.rating;
      const aMin = Math.min(...a.services.map((sv) => sv.price));
      const bMin = Math.min(...b.services.map((sv) => sv.price));
      return sort === 'price-low' ? aMin - bMin : bMin - aMin;
    });
    return list;
  }, [query, neighborhood, categories, minRating, priceMax, sort]);

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">Neighborhood</h3>
        <div className="space-y-1.5">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-600">
            <input type="radio" name="nbhd" checked={!neighborhood} onChange={() => setNeighborhood('')} className="accent-brand-600" />
            All areas
          </label>
          {NEIGHBORHOODS.map((n) => (
            <label key={n} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-600">
              <input type="radio" name="nbhd" checked={neighborhood === n} onChange={() => setNeighborhood(n)} className="accent-brand-600" />
              {n}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">Minimum rating</h3>
        <div className="flex gap-2">
          {[0, 4.5, 4.7, 4.9].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${minRating === r ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'}`}
            >
              {r === 0 ? 'Any' : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">Price range</h3>
        <input
          type="range"
          min={500}
          max={12000}
          step={500}
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          className="w-full accent-brand-600"
        />
        <div className="mt-1 flex justify-between text-xs text-ink-500">
          <span>₹500</span>
          <span className="font-semibold text-ink-700">Up to ₹{priceMax.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">Service type</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => toggleCategory(c)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${categories.includes(c) ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => { setNeighborhood(''); setCategories([]); setMinRating(0); setPriceMax(12000); setQuery(''); }}
        className="btn-outline w-full"
      >
        Reset filters
      </button>
    </div>
  );

  const goSalon = (id: string): Route => ({ name: 'salon', id });

  return (
    <div className="mx-auto max-w-7xl animate-fadeIn px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Discover salons</h1>
          <p className="mt-1 text-sm text-ink-500">{results.length} studios matching your filters</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search salons or services"
              className="input pl-9 sm:w-64"
            />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="input w-auto">
            <option value="rating">Top rated</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
          <button onClick={() => setMobileFilters(true)} className="btn-outline px-3 lg:hidden">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-6 flex gap-8">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-20 card p-5">
            <div className="mb-4 flex items-center gap-2 text-ink-700">
              <Filter className="h-4 w-4" /> <span className="text-sm font-semibold">Filters</span>
            </div>
            {filterPanel}
          </div>
        </aside>

        {/* Grid */}
        <div className="min-w-0 flex-1">
          {results.length === 0 ? (
            <div className="card flex flex-col items-center justify-center p-12 text-center">
              <Search className="h-10 w-10 text-ink-300" />
              <h3 className="mt-3 font-semibold text-ink-800">No salons found</h3>
              <p className="mt-1 text-sm text-ink-500">Try adjusting your filters or search.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((s) => (
                <SalonCard key={s.id} salon={s} onOpen={() => navigate(goSalon(s.id))} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setMobileFilters(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] animate-fadeUp overflow-y-auto rounded-t-3xl bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filters</h2>
              <button onClick={() => setMobileFilters(false)} className="btn-ghost px-2"><X className="h-5 w-5" /></button>
            </div>
            {filterPanel}
            <button onClick={() => setMobileFilters(false)} className="btn-primary mt-6 w-full">Show {results.length} results</button>
          </div>
        </div>
      )}
    </div>
  );
}
