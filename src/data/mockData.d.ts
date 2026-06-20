export type ServiceType =
  | 'Hair'
  | 'Skin'
  | 'Nails'
  | 'Makeup'
  | 'Spa';

export interface MockService {
  serviceId: string;
  title: string;
  price: number;
  duration: string;
}

export interface MockSalon {
  id: string;
  name: string;
  category: string;
  neighborhood: string;
  address: string;
  rating: number;
  reviewCount: number;
  priceTier: '₹' | '₹₹' | '₹₹₹';
  image: string;
  description: string;
  features: string[];
  services: MockService[];
}

export const INITIAL_SALONS: MockSalon[];
export const NEIGHBORHOODS: string[];
export const CATEGORIES: string[];
