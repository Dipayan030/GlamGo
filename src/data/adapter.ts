import type { Salon as RichSalon, ServiceCategory, Neighborhood } from '../types';

/**
 * Adapter: maps a salon from the mockData.js spec shape
 * (priceTier '₹' string, services with title/duration)
 * into the richer shape the existing UI components render
 * (numeric priceTier, gallery, badges, tagline, services with category/durationMin).
 *
 * This lets the new unified context drive the polished UI without
 * rewriting every page that was built against the richer shape.
 */

const TIER_TO_NUMBER: Record<string, number> = { '₹': 1, '₹₹': 2, '₹₹₹': 3 };

// Map category strings to one of the canonical ServiceCategory values
// used by SalonDetailsPage's grouped menu.
const CATEGORY_MAP: Record<string, ServiceCategory> = {
  hair: 'Hair',
  'hair & beauty': 'Hair',
  'luxury hair': 'Hair',
  spa: 'Spa',
  'spa & skin': 'Spa',
  'spa & wellness': 'Spa',
  med: 'Spa',
  'med-spa': 'Spa',
  skin: 'Skin',
  nails: 'Nails',
  'nails & brows': 'Nails',
  makeup: 'Makeup',
  'bridal & makeup': 'Makeup',
  'express glam': 'Makeup',
  'family salon': 'Hair',
};

function guessCategory(salonCategory: string, serviceTitle: string): ServiceCategory {
  const cat = (salonCategory || '').toLowerCase();
  if (cat in CATEGORY_MAP) return CATEGORY_MAP[cat];
  const t = serviceTitle.toLowerCase();
  if (/(haircut|blowdry|balayage|keratin|bob|hair)/.test(t)) return 'Hair';
  if (/(facial|peel|acne|glow|skin)/.test(t)) return 'Skin';
  if (/(nail|manicure|pedicure|mani-pedi|brow|lash)/.test(t)) return 'Nails';
  if (/(makeup|bridal|reception|glam|drape|trial)/.test(t)) return 'Makeup';
  if (/(massage|tissue|spa|reflex|stone|aroma|relax|detox)/.test(t)) return 'Spa';
  return 'Hair';
}

function parseDuration(duration: string): number {
  if (!duration) return 30;
  const m = String(duration).match(/(\d+)/);
  return m ? Number(m[1]) : 30;
}

export function adaptSalon(raw: any): RichSalon {
  const numericTier = TIER_TO_NUMBER[raw.priceTier] ?? 2;

  const services: RichSalon['services'] = (raw.services || []).map((s: any) => ({
    id: String(s.serviceId),
    name: s.title,
    category: guessCategory(raw.category || '', s.title || ''),
    price: Number(s.price) || 0,
    durationMin: parseDuration(s.duration),
    description: `${s.title} · ${s.duration}`,
  }));

  const gallery = [
    raw.image,
    'https://images.unsplash.com/photo-1560066984-138dadb4c0b8?auto=format&fit=crop&w=800&h=600&q=80',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&h=600&q=80',
  ];

  return {
    id: raw.id,
    name: raw.name,
    tagline: raw.description ? raw.description.split('.')[0].trim() + '.' : raw.category,
    neighborhood: (raw.neighborhood as Neighborhood) || 'Bandra',
    rating: Number(raw.rating) || 4.5,
    reviews: Number(raw.reviewCount) || 0,
    priceTier: numericTier as 1 | 2 | 3,
    heroImage: raw.image,
    gallery,
    about: raw.description || '',
    address: raw.address || `${raw.neighborhood}, Mumbai`,
    openHours: 'Mon–Sun · 10:00 AM – 8:00 PM',
    services,
    badges: (raw.features || []).slice(0, 3),
  };
}

export function adaptSalons(list: any[]): RichSalon[] {
  return list.map(adaptSalon);
}
