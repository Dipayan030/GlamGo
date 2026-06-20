import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Clock,
  MapPin,
  Plus,
  Star,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { adaptSalons } from '../data/adapter';
import type { Service, ServiceCategory } from '../types';
import { Rating } from '../components/SalonCard';

const CATEGORY_ORDER: ServiceCategory[] = ['Hair', 'Skin', 'Nails', 'Makeup', 'Spa'];

export function SalonDetailsPage() {
  const { route, navigate, addToCart, cart, salons } = useApp();
  const SALONS = useMemo(() => adaptSalons(salons), [salons]);
  const salonId = route.name === 'salon' ? route.id : '';
  const salon = useMemo(() => SALONS.find((s) => s.id === salonId), [SALONS, salonId]);
  const [activeImg, setActiveImg] = useState(0);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  if (!salon) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Salon not found</h1>
        <button onClick={() => navigate({ name: 'search' })} className="btn-primary mt-6">Back to discover</button>
      </div>
    );
  }

  const inCart = (id: string) => cart.some((c) => c.service.id === id) || addedIds.has(id);

  const handleAdd = (svc: Service) => {
    addToCart({ salonId: salon.id, service: svc });
    setTimeout(() => setAddedIds((p) => { const n = new Set(p); n.delete(svc.id); return n; }), 1400);
  };

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: salon.services.filter((s) => s.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="mx-auto max-w-7xl animate-fadeIn px-4 py-6 sm:px-6 lg:px-8">
      <button onClick={() => navigate({ name: 'search' })} className="btn-ghost mb-4 -ml-2 gap-1">
        <ArrowLeft className="h-4 w-4" /> Back to discover
      </button>

      {/* Gallery */}
      <div className="grid gap-3 lg:grid-cols-[2fr_1fr]">
        <div className="overflow-hidden rounded-3xl shadow-card">
          <img src={salon.gallery[activeImg]} alt={salon.name} className="h-72 w-full object-cover sm:h-96" />
        </div>
        <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
          {salon.gallery.map((g, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`overflow-hidden rounded-2xl ring-2 transition-all ${activeImg === i ? 'ring-brand-500' : 'ring-transparent hover:ring-ink-200'}`}
            >
              <img src={g} alt="" className="h-24 w-full object-cover sm:h-28 lg:h-32" />
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold text-ink-900">{salon.name}</h1>
            <span className="chip bg-ink-100 text-ink-600">{salon.neighborhood}</span>
          </div>
          <p className="mt-1 text-ink-500">{salon.tagline}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-600">
            <Rating value={salon.rating} reviews={salon.reviews} />
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-ink-400" /> {salon.address}</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-ink-400" /> {salon.openHours}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {salon.badges.map((b) => (
              <span key={b} className="chip bg-brand-50 text-brand-700"><Star className="h-3 w-3" /> {b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* About */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <h2 className="text-xl font-bold text-ink-900">About</h2>
          <p className="mt-2 leading-relaxed text-ink-600">{salon.about}</p>

          <h2 className="mt-8 text-xl font-bold text-ink-900">Services menu</h2>
          <div className="mt-4 space-y-6">
            {grouped.map((g) => (
              <div key={g.category}>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-ink-400">
                  <span className="h-px flex-1 bg-ink-100" />
                  {g.category}
                  <span className="h-px flex-1 bg-ink-100" />
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {g.items.map((svc) => {
                    const added = inCart(svc.id);
                    return (
                      <div key={svc.id} className="card flex items-center justify-between gap-3 p-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="truncate font-semibold text-ink-900">{svc.name}</h4>
                          </div>
                          <p className="mt-0.5 line-clamp-2 text-xs text-ink-500">{svc.description}</p>
                          <div className="mt-2 flex items-center gap-3 text-xs text-ink-500">
                            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {svc.durationMin} min</span>
                            <span className="font-semibold text-ink-700">₹{svc.price.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAdd(svc)}
                          className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold transition-all ${added ? 'bg-green-50 text-green-700 ring-1 ring-green-200' : 'bg-brand-600 text-white hover:bg-brand-700'}`}
                        >
                          {added ? <span className="inline-flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Added</span> : <span className="inline-flex items-center gap-1"><Plus className="h-3.5 w-3.5" /> Add</span>}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky CTA */}
        <aside className="lg:block">
          <div className="sticky top-20 card p-5">
            <h3 className="font-bold text-ink-900">Ready to book?</h3>
            <p className="mt-1 text-sm text-ink-500">Add services to your booking and pick a slot that works.</p>
            <div className="mt-4 space-y-2 text-sm">
              {cart.filter((c) => c.salonId === salon.id).length > 0 ? (
                cart.filter((c) => c.salonId === salon.id).map((c) => (
                  <div key={c.service.id} className="flex justify-between text-ink-600">
                    <span className="truncate">{c.service.name}</span>
                    <span className="font-semibold">₹{c.service.price.toLocaleString('en-IN')}</span>
                  </div>
                ))
              ) : (
                <p className="text-ink-400">No services selected yet.</p>
              )}
            </div>
            <button
              onClick={() => navigate({ name: 'checkout' })}
              disabled={cart.filter((c) => c.salonId === salon.id).length === 0}
              className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue to booking
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
