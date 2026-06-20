// Unified mock database for GlamGo Mumbai.
// Seed data: 9 highly realistic salons across real Mumbai localities.

const unsplash = (id, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const INITIAL_SALONS = [
  {
    id: 'velvet-lounge-bandra',
    name: 'Velvet Lounge',
    category: 'Hair & Beauty',
    neighborhood: 'Bandra',
    address: '12 Carter Road, Bandra West, Mumbai 400050',
    rating: 4.9,
    reviewCount: 412,
    priceTier: '₹₹₹',
    image: unsplash('1560066984-138dadb4c0b8'),
    description:
      'An editorial hair house on Carter Road where Lakmé-trained stylists craft precision cuts and lived-in color. Step off the seafront and into a calm, light-filled studio built for slow, considered beauty.',
    features: ['Valet Parking', 'Air Conditioned', 'Free WiFi', 'Complimentary Beverage'],
    services: [
      { serviceId: 'vl-01', title: 'Signature Cut & Blowdry', price: 2200, duration: '75 mins' },
      { serviceId: 'vl-02', title: 'Balayage Full Head', price: 11500, duration: '180 mins' },
      { serviceId: 'vl-03', title: 'Keratin Smoothing', price: 9500, duration: '150 mins' },
      { serviceId: 'vl-04', title: 'Glass Glow Facial', price: 4200, duration: '60 mins' },
      { serviceId: 'vl-05', title: 'Bridal Trial Makeup', price: 8500, duration: '90 mins' },
    ],
  },
  {
    id: 'lush-botanics-andheri',
    name: 'Lush Botanics',
    category: 'Spa & Skin',
    neighborhood: 'Andheri West',
    address: 'Lokhandwala Complex, Andheri West, Mumbai 400053',
    rating: 4.7,
    reviewCount: 289,
    priceTier: '₹₹',
    image: unsplash('1540555700478-4be289fbecef'),
    description:
      'A clean-beauty spa using cold-pressed botanicals and aromatherapy oils, tucked inside Lokhandwala. Known for results-driven facials and unhurried de-stress rituals.',
    features: ['Air Conditioned', 'Vegan Products', 'Steam Room', 'Free WiFi'],
    services: [
      { serviceId: 'lb-01', title: 'Aromatherapy Deep Tissue', price: 3200, duration: '75 mins' },
      { serviceId: 'lb-02', title: 'Hydra-Glow Facial', price: 3800, duration: '60 mins' },
      { serviceId: 'lb-03', title: 'Botanical Mani-Pedi Duo', price: 2200, duration: '90 mins' },
      { serviceId: 'lb-04', title: 'De-stress Head & Neck', price: 1800, duration: '45 mins' },
    ],
  },
  {
    id: 'atelier-noir-juhu',
    name: 'Atelier Noir',
    category: 'Luxury Hair',
    neighborhood: 'Juhu',
    address: 'Juhu Tara Road, Juhu, Mumbai 400049',
    rating: 4.8,
    reviewCount: 356,
    priceTier: '₹₹₹',
    image: unsplash('1521590832167-7bcbfa71d497'),
    description:
      'A members-style hair house off Juhu Tara Road, led by Sassoon-trained master colourists. Appointment-only, with a quiet bar and a focus on architectural, low-maintenance color.',
    features: ['Valet Parking', 'Air Conditioned', 'Members Lounge', 'Master Colourist'],
    services: [
      { serviceId: 'an-01', title: 'Precision Bob Cut', price: 2800, duration: '80 mins' },
      { serviceId: 'an-02', title: 'Balayage Full Head', price: 11500, duration: '180 mins' },
      { serviceId: 'an-03', title: 'Scalp Renewal Treatment', price: 2600, duration: '45 mins' },
      { serviceId: 'an-04', title: 'Luxe Pedicure', price: 1900, duration: '60 mins' },
    ],
  },
  {
    id: 'bloom-co-colaba',
    name: 'Bloom & Co.',
    category: 'Express Glam',
    neighborhood: 'Colaba',
    address: 'Colaba Causeway, Colaba, Mumbai 400001',
    rating: 4.5,
    reviewCount: 198,
    priceTier: '₹',
    image: unsplash('1633681926022-84e2dd43fa6d'),
    description:
      'A walk-in friendly express bar near the Gateway, built for fast blowdrys, on-the-go manicures, and last-minute party glam. No appointment needed, friendly prices, quick turnarounds.',
    features: ['Air Conditioned', 'Walk-in Friendly', 'Express Service'],
    services: [
      { serviceId: 'bc-01', title: 'Express Blowdry', price: 900, duration: '30 mins' },
      { serviceId: 'bc-02', title: 'Party Makeup', price: 2500, duration: '45 mins' },
      { serviceId: 'bc-03', title: 'Shape & File', price: 600, duration: '25 mins' },
      { serviceId: 'bc-04', title: 'Express Facial', price: 1500, duration: '40 mins' },
    ],
  },
  {
    id: 'halo-skin-parel',
    name: 'Halo Skin Clinic',
    category: 'Med-Spa',
    neighborhood: 'Lower Parel',
    address: 'High Street Phoenix, Lower Parel, Mumbai 400013',
    rating: 4.9,
    reviewCount: 521,
    priceTier: '₹₹₹',
    image: unsplash('1570172619644-dfd03ed5d881'),
    description:
      'A dermatologist-led med-spa inside High Street Phoenix, specialising in chemical peels, laser, and clinical facials. Every treatment is supervised by an in-house dermatologist for safe, visible results.',
    features: ['Dermatologist Led', 'Air Conditioned', 'Laser Certified', 'Free WiFi'],
    services: [
      { serviceId: 'hl-01', title: 'Chemical Peel (Glycolic)', price: 5500, duration: '60 mins' },
      { serviceId: 'hl-02', title: 'Laser Hair Removal — Full Face', price: 4200, duration: '45 mins' },
      { serviceId: 'hl-03', title: 'Acne Calm Facial', price: 3600, duration: '60 mins' },
      { serviceId: 'hl-04', title: 'Smile Lift Express', price: 1200, duration: '30 mins' },
    ],
  },
  {
    id: 'mist-studio-powai',
    name: 'Mist Studio',
    category: 'Nails & Brows',
    neighborhood: 'Powai',
    address: 'Hiranandani Gardens, Powai, Mumbai 400076',
    rating: 4.6,
    reviewCount: 164,
    priceTier: '₹₹',
    image: unsplash('1604654898228-8b5ad2973173'),
    description:
      'A calm, lakeside studio in Hiranandani known for long-wear nail art and signature brow architecture. Soft lighting, herbal tea, and artists who treat every lash and line with intention.',
    features: ['Air Conditioned', 'Nail Art', 'Brow Studio', 'Free WiFi'],
    services: [
      { serviceId: 'ms-01', title: 'Nail Art Extensions', price: 2600, duration: '90 mins' },
      { serviceId: 'ms-02', title: 'Brow Architecture', price: 1400, duration: '40 mins' },
      { serviceId: 'ms-03', title: 'Keratin Lift', price: 4400, duration: '75 mins' },
      { serviceId: 'ms-04', title: 'De-stress Head & Neck', price: 1800, duration: '45 mins' },
    ],
  },
  {
    id: 'saavi-bridal-malad',
    name: 'Saavi Bridal Studio',
    category: 'Bridal & Makeup',
    neighborhood: 'Malad',
    address: 'Malad Link Road, Malad West, Mumbai 400064',
    rating: 4.8,
    reviewCount: 273,
    priceTier: '₹₹₹',
    image: unsplash('1560869625316-8a5b9e4d4c7b'),
    description:
      'A dedicated bridal atelier in Malad specialising in HD bridal makeup, draping, and multi-day wedding looks. Each bridal package includes a pre-trial, skin prep plan, and on-location option.',
    features: ['Air Conditioned', 'Bridal Suite', 'On-location Available', 'Free WiFi'],
    services: [
      { serviceId: 'sv-01', title: 'HD Bridal Makeup', price: 18000, duration: '120 mins' },
      { serviceId: 'sv-02', title: 'Bridal Trial', price: 8500, duration: '90 mins' },
      { serviceId: 'sv-03', title: 'Reception Glam', price: 12000, duration: '90 mins' },
      { serviceId: 'sv-04', title: 'Saree Draping', price: 1500, duration: '30 mins' },
    ],
  },
  {
    id: 'glow-express-dadar',
    name: 'Glow Express Dadar',
    category: 'Family Salon',
    neighborhood: 'Dadar',
    address: 'Dadar West, Shivaji Park, Mumbai 400028',
    rating: 4.4,
    reviewCount: 311,
    priceTier: '₹',
    image: unsplash('1522335789203-aabd1fc54bc9'),
    description:
      'A neighbourhood family salon near Shivaji Park offering honest pricing and quick services for all ages. From kids cuts to festive facials, a reliable everyday choice for the community.',
    features: ['Air Conditioned', 'Family Friendly', 'Kids Cuts', 'Walk-in Friendly'],
    services: [
      { serviceId: 'ge-01', title: 'Haircut (Adult)', price: 600, duration: '30 mins' },
      { serviceId: 'ge-02', title: 'Haircut (Kids)', price: 400, duration: '20 mins' },
      { serviceId: 'ge-03', title: 'Festive Facial', price: 1800, duration: '50 mins' },
      { serviceId: 'ge-04', title: 'Threading (Full Face)', price: 350, duration: '20 mins' },
    ],
  },
  {
    id: 'serene-worli',
    name: 'Serene Wellness Spa',
    category: 'Spa & Wellness',
    neighborhood: 'Worli',
    address: 'Worli Sea Face, Worli, Mumbai 400018',
    rating: 4.9,
    reviewCount: 387,
    priceTier: '₹₹₹',
    image: unsplash('1544161515-4ab6ce6db874'),
    description:
      'An ocean-facing wellness spa at Worli Sea Face offering deep-tissue therapies, hot stone rituals, and couples suites. Quiet rooms, trained therapists, and a salt-water relaxation lounge.',
    features: ['Sea View', 'Couples Suite', 'Steam & Sauna', 'Valet Parking'],
    services: [
      { serviceId: 'sr-01', title: 'Deep Tissue Therapy', price: 4500, duration: '75 mins' },
      { serviceId: 'sr-02', title: 'Hot Stone Ritual', price: 5200, duration: '90 mins' },
      { serviceId: 'sr-03', title: 'Couples Retreat (per couple)', price: 9500, duration: '90 mins' },
      { serviceId: 'sr-04', title: 'Foot Reflexology', price: 2200, duration: '45 mins' },
    ],
  },
];

export const NEIGHBORHOODS = [
  ...new Set(INITIAL_SALONS.map((s) => s.neighborhood)),
].sort();

export const CATEGORIES = [
  ...new Set(INITIAL_SALONS.map((s) => s.category)),
].sort();
