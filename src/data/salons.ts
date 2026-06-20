import type { Salon, Service } from '../types';

let sid = 0;
const svc = (
  name: string,
  category: Service['category'],
  price: number,
  durationMin: number,
  description: string,
): Service => ({ id: `s${++sid}`, name, category, price, durationMin, description });

const img = (id: number, w = 800, h = 600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

export const SALONS: Salon[] = [
  {
    id: 'glow-bandra',
    name: 'Glow Atelier',
    tagline: 'Editorial glam, rooted in Bandra',
    neighborhood: 'Bandra',
    rating: 4.9,
    reviews: 412,
    priceTier: 3,
    heroImage: img(3993449),
    gallery: [img(3993449), img(3997379), img(3997991)],
    about:
      'A boutique studio specialising in bridal glam, keratin smoothing, and high-touch facials. Our senior artists have worked backstage at Lakmé Fashion Week.',
    address: 'Waterfield Road, Bandra West, Mumbai 400050',
    openHours: 'Mon–Sun · 10:00 AM – 8:30 PM',
    badges: ['Keratin Certified', 'Lakmé Artist'],
    services: [
      svc('Signature Cut & Blowdry', 'Hair', 2200, 75, 'Consultation, precision cut, and thermal blowdry.'),
      svc('Keratin Smoothing', 'Hair', 9500, 150, 'Frizz-control keratin with bond protectant.'),
      svc('Glass Glow Facial', 'Skin', 4200, 60, 'Enzyme peel + hyaluronic infusion for luminous skin.'),
      svc('Bridal Trial Makeup', 'Makeup', 8500, 90, 'HD bridal trial with hair styling.'),
      svc('Gel Manicure', 'Nails', 1400, 45, 'Long-wear gel with custom colour.'),
    ],
  },
  {
    id: 'lush-andheri',
    name: 'Lush Botanics',
    tagline: 'Plant-based skin & spa science',
    neighborhood: 'Andheri West',
    rating: 4.7,
    reviews: 289,
    priceTier: 2,
    heroImage: img(3997991),
    gallery: [img(3997991), img(3993456), img(3997378)],
    about:
      'Clean-beauty focused spa using cold-pressed botanicals. Known for aromatherapy massage andResults-driven facials.',
    address: 'Lokhandwala Complex, Andheri West, Mumbai 400053',
    openHours: 'Tue–Sun · 11:00 AM – 9:00 PM',
    badges: ['Clean Beauty', 'Vegan'],
    services: [
      svc('Aromatherapy Deep Tissue', 'Spa', 3200, 75, 'Warm botanical oils with deep tissue release.'),
      svc('Hydra-Glow Facial', 'Skin', 3800, 60, 'Clarifying cleanse + hydrating mask.'),
      svc('Botanical Mani-Pedi Duo', 'Nails', 2200, 90, 'Herbal soak, scrub, shape and polish.'),
      svc('Beach Waves Blowout', 'Hair', 1800, 50, 'Textured blowdry with sea-salt finish.'),
    ],
  },
  {
    id: 'atelier-juhu',
    name: 'Atelier Noir',
    tagline: 'Luxury hair, by appointment',
    neighborhood: 'Juhu',
    rating: 4.8,
    reviews: 356,
    priceTier: 3,
    heroImage: img(3997378),
    gallery: [img(3997378), img(3993455), img(3997379)],
    about:
      'A members-style hair house with master colourists trained at Sassoon Academy. Tucked off Juhu Tara Road.',
    address: 'Juhu Tara Road, Juhu, Mumbai 400049',
    openHours: 'Mon–Sun · 10:00 AM – 9:00 PM',
    badges: ['Master Colourist', 'Sassoon Trained'],
    services: [
      svc('Precision Bob Cut', 'Hair', 2800, 80, 'Architectural cut with Sassoon technique.'),
      svc('Balayage Full Head', 'Hair', 11500, 180, 'Hand-painted dimension with toner.'),
      svc('Scalp Renewal Facial', 'Skin', 2600, 45, 'Detoxifying scalp treatment for hair health.'),
      svc('Luxe Pedicure', 'Nails', 1900, 60, 'Paraffin soak, callus care, and polish.'),
    ],
  },
  {
    id: 'bloom-colaba',
    name: 'Bloom & Co.',
    tagline: 'Quick-glam express studio',
    neighborhood: 'Colaba',
    rating: 4.5,
    reviews: 198,
    priceTier: 1,
    heroImage: img(3997991),
    gallery: [img(3997991), img(3993456), img(3997378)],
    about:
      'A walk-in friendly express bar near the Gateway. Fast turnarounds for blowdrys, manis, and touch-ups.',
    address: 'Colaba Causeway, Colaba, Mumbai 400001',
    openHours: 'Mon–Sat · 9:00 AM – 8:00 PM',
    badges: ['Express Service'],
    services: [
      svc('Express Blowdry', 'Hair', 900, 30, '20-minute volume blowdry.'),
      svc('Party Makeup', 'Makeup', 2500, 45, 'Smudge-proof evening glam.'),
      svc('Shape & File', 'Nails', 600, 25, 'Quick shape, file, and buff.'),
      svc('Express Facial', 'Skin', 1500, 40, 'Cleanse, steam, and glow mask.'),
    ],
  },
  {
    id: 'halo-parel',
    name: 'Halo Skin Clinic',
    tagline: 'Dermatologist-led skin & laser',
    neighborhood: 'Lower Parel',
    rating: 4.9,
    reviews: 521,
    priceTier: 3,
    heroImage: img(3997378),
    gallery: [img(3997378), img(3993455), img(3997991)],
    about:
      'A med-spa with in-house dermatologists. Known for chemical peels, laser, and clinical facials.',
    address: 'High Street Phoenix, Lower Parel, Mumbai 400013',
    openHours: 'Mon–Sun · 10:30 AM – 8:00 PM',
    badges: ['Med-Spa', 'Dermatologist Led'],
    services: [
      svc('Chemical Peel (Glycolic)', 'Skin', 5500, 60, 'Glycolic resurfacing for tone and texture.'),
      svc('Laser Hair Removal — Full Face', 'Spa', 4200, 45, 'Diode laser session, cooling gel included.'),
      svc('Acne Calm Facial', 'Skin', 3600, 60, 'Salicylic infusion for breakout-prone skin.'),
      svc('Smile Lift Express', 'Makeup', 1200, 30, 'Quick lip contour and highlight.'),
    ],
  },
  {
    id: 'mist-powai',
    name: 'Mist Studio',
    tagline: 'Neighbourhood nail & brow bar',
    neighborhood: 'Powai',
    rating: 4.6,
    reviews: 164,
    priceTier: 2,
    heroImage: img(3993456),
    gallery: [img(3993456), img(3997991), img(3997378)],
    about:
      'A calm, lakeside studio with long-wear nail art and signature brow architecture.',
    address: 'Hiranandani Gardens, Powai, Mumbai 400076',
    openHours: 'Tue–Sun · 10:00 AM – 8:30 PM',
    badges: ['Nail Art', 'Brow Studio'],
    services: [
      svc('Nail Art Extensions', 'Nails', 2600, 90, 'Custom gel extensions with hand art.'),
      svc('Brow Architecture', 'Makeup', 1400, 40, 'Mapping, wax, tint, and tweeze.'),
      svc('Keratin Lift', 'Hair', 4400, 75, 'Light keratin infusion for fine hair.'),
      svc('De-stress Head & Neck', 'Spa', 1800, 45, 'Pressure-point massage with warm oil.'),
    ],
  },
];

// end of file
