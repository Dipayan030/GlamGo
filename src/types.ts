export type Role = 'customer' | 'owner';

export type Neighborhood =
  | 'Bandra'
  | 'Andheri West'
  | 'Lower Parel'
  | 'Juhu'
  | 'Colaba'
  | 'Powai';

export type ServiceCategory =
  | 'Hair'
  | 'Skin'
  | 'Nails'
  | 'Makeup'
  | 'Spa';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number; // INR
  durationMin: number;
  description: string;
}

export interface Salon {
  id: string;
  name: string;
  tagline: string;
  neighborhood: Neighborhood;
  rating: number;
  reviews: number;
  priceTier: 1 | 2 | 3; // ₹, ₹₹, ₹₹₹
  heroImage: string;
  gallery: string[];
  about: string;
  address: string;
  openHours: string;
  services: Service[];
  badges: string[];
}

export interface CartItem {
  salonId: string;
  service: Service;
}

export interface Booking {
  id: string;
  salonId: string;
  salonName: string;
  serviceIds: string[];
  serviceNames: string[];
  total: number;
  date: string;       // ISO date
  timeSlot: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  customerName: string;
}
