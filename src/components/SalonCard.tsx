import { Star } from 'lucide-react';
import type { Salon } from '../types';

const tierLabel: Record<number, string> = { 1: '₹', 2: '₹₹', 3: '₹₹₹' };

export function Rating({ value, reviews }: { value: number; reviews?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink-800">
      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
      {value.toFixed(1)}
      {reviews != null && <span className="font-normal text-ink-400">({reviews})</span>}
    </span>
  );
}

export function PriceTier({ tier }: { tier: number }) {
  return (
    <span className="chip bg-ink-100 text-ink-600">{tierLabel[tier]}</span>
  );
}

export function SalonCard({ salon, onOpen }: { salon: Salon; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="group card overflow-hidden text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-pop"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={salon.heroImage}
          alt={salon.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="absolute left-3 top-3 chip bg-white/90 text-ink-700 backdrop-blur">
          {salon.neighborhood}
        </span>
        <span className="absolute right-3 top-3"><PriceTier tier={salon.priceTier} /></span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-ink-900">{salon.name}</h3>
            <p className="mt-0.5 line-clamp-1 text-sm text-ink-500">{salon.tagline}</p>
          </div>
          <Rating value={salon.rating} reviews={salon.reviews} />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {salon.badges.slice(0, 2).map((b) => (
            <span key={b} className="chip bg-brand-50 text-brand-700">{b}</span>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-ink-100 pt-3">
          <span className="text-sm text-ink-500">From ₹{Math.min(...salon.services.map((s) => s.price)).toLocaleString('en-IN')}</span>
          <span className="text-sm font-semibold text-brand-600 transition-colors group-hover:text-brand-700">View →</span>
        </div>
      </div>
    </button>
  );
}
