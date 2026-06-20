import { useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarCheck,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { adaptSalons } from '../data/adapter';
import { NEIGHBORHOODS } from '../data/mockData.js';
import { SalonCard } from '../components/SalonCard';

export function LandingPage() {
  const { salons, navigate } = useApp();
  const SALONS = useMemo(() => adaptSalons(salons), [salons]);
  const [query, setQuery] = useState('');
  const [neighborhood, setNeighborhood] = useState<string>('');

  const featured = useMemo(() => SALONS.slice(0, 3), [SALONS]);
  const trending = useMemo(
    () => [...SALONS].sort((a, b) => b.rating - a.rating).slice(0, 3),
    [],
  );

  const submitSearch = () => {
    navigate({ name: 'search', query, neighborhood });
  };

  return (
    <div className="animate-fadeIn">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 via-white to-ink-50" />
        <div className="absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="absolute -left-32 top-20 -z-10 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pb-24 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-fadeUp">
              <span className="chip bg-white text-brand-700 shadow-card ring-1 ring-brand-100">
                <MapPin className="h-3.5 w-3.5" /> Now live in Mumbai
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
                Beauty, on your{' '}
                <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                  block.
                </span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-ink-600 sm:text-lg">
                Discover and book trusted salons, spas, and studios across Bandra, Juhu, and Lower Parel. Real reviews, instant slots, zero calls.
              </p>

              {/* Search bar */}
              <div className="mt-8 flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-pop ring-1 ring-ink-100 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-2 px-2">
                  <Search className="h-5 w-5 shrink-0 text-ink-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
                    placeholder="Try 'keratin', 'bridal', 'deep tissue'"
                    className="w-full bg-transparent py-2 text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none"
                  />
                </div>
                <div className="hidden h-8 w-px bg-ink-100 sm:block" />
                <div className="flex items-center gap-2 px-2">
                  <MapPin className="h-5 w-5 shrink-0 text-ink-400" />
                  <select
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full bg-transparent py-2 text-sm text-ink-700 focus:outline-none sm:w-40"
                  >
                    <option value="">All areas</option>
                    {NEIGHBORHOODS.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <button onClick={submitSearch} className="btn-primary shrink-0">
                  Search <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ink-500">
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-brand-600" /> Verified studios</span>
                <span className="inline-flex items-center gap-1.5"><CalendarCheck className="h-4 w-4 text-brand-600" /> Instant booking</span>
                <span className="inline-flex items-center gap-1.5"><Star className="h-4 w-4 text-amber-400" /> 4.7+ avg rating</span>
              </div>
            </div>

            {/* Hero collage */}
            <div className="relative hidden animate-fadeUp lg:block" style={{ animationDelay: '0.1s' }}>
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop"
                  alt="Salon"
                  className="h-80 w-full rounded-3xl object-cover shadow-pop"
                />
                <div className="space-y-4">
                  <img
                    src="https://images.pexels.com/photos/3997991/pexels-photo-3997991.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop"
                    alt="Facial"
                    className="h-36 w-full rounded-3xl object-cover shadow-card"
                  />
                  <img
                    src="https://images.pexels.com/photos/3997378/pexels-photo-3997378.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop"
                    alt="Spa"
                    className="h-36 w-full rounded-3xl object-cover shadow-card"
                  />
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-pop ring-1 ring-ink-100">
                <div className="flex -space-x-2">
                  {[3993449, 3997378, 3997991].map((id) => (
                    <img key={id} src={`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop`} alt="" className="h-9 w-9 rounded-full border-2 border-white object-cover" />
                  ))}
                </div>
                <div>
                  <div className="text-sm font-bold text-ink-900">12,000+ bookings</div>
                  <div className="text-xs text-ink-500">made this month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Neighborhood grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink-900">Find by neighborhood</h2>
            <p className="mt-1 text-sm text-ink-500">Curated studios across the city</p>
          </div>
          <button onClick={submitSearch} className="link-muted text-sm font-semibold">View all →</button>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {NEIGHBORHOODS.map((n, i) => (
            <button
              key={n}
              onClick={() => navigate({ name: 'search', neighborhood: n })}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-card ring-1 ring-ink-100"
            >
              <img
                src={`https://images.pexels.com/photos/${[3993449, 3997991, 3997378, 3993456, 3993455, 3997379][i]}/pexels-photo-${[3993449, 3997991, 3997378, 3993456, 3993455, 3997379][i]}.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop`}
                alt={n}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-ink-900/10 to-transparent" />
              <span className="absolute bottom-3 left-3 text-sm font-semibold text-white">{n}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-600" />
            <h2 className="text-2xl font-bold text-ink-900">Featured this week</h2>
          </div>
          <button onClick={() => navigate({ name: 'search' })} className="link-muted text-sm font-semibold">Browse all →</button>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((s) => (
            <SalonCard key={s.id} salon={s} onOpen={() => navigate({ name: 'salon', id: s.id })} />
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="mx-auto max-w-7xl px-4 py-8 pb-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-brand-600" />
          <h2 className="text-2xl font-bold text-ink-900">Top rated near you</h2>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trending.map((s) => (
            <SalonCard key={s.id} salon={s} onOpen={() => navigate({ name: 'salon', id: s.id })} />
          ))}
        </div>
      </section>
    </div>
  );
}
