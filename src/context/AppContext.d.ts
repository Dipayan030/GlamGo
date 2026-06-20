import type { ReactNode } from 'react';
import type { MockSalon, MockService } from '../data/mockData';

export type Role = 'customer' | 'partner';

export type Route =
  | { name: 'landing' }
  | { name: 'search'; query?: string; neighborhood?: string }
  | { name: 'salon'; id: string }
  | { name: 'checkout' }
  | { name: 'customer' }
  | { name: 'vendor' };

export interface CartItem {
  salonId: string;
  service: {
    id: string;
    name: string;
    category: string;
    price: number;
    durationMin: number;
    description: string;
  };
}

export interface Booking {
  id: string;
  salonId: string;
  salonName: string;
  serviceId: string;
  serviceTitle: string;
  price: number;
  duration: string;
  date: string;
  timeSlot: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  customerName: string;
}

export interface AppContextValue {
  role: Role;
  setRole: (r: Role) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedNeighborhood: string;
  setSelectedNeighborhood: (n: string) => void;
  selectedServiceType: string;
  setSelectedServiceType: (s: string) => void;
  salons: MockSalon[];
  handleAddSalon: (salon: Partial<MockSalon> & { name: string }) => void;
  handleAddService: (salonId: string, service: Partial<MockService> & { title: string; price: number }) => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (serviceId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  bookings: Booking[];
  placeBooking: (booking: Partial<Booking> & { salonId: string }) => Booking;
  cancelBooking: (id: string) => void;
  route: Route;
  navigate: (r: Route) => void;
}

export declare function useApp(): AppContextValue;
export declare function AppProvider({ children }: { children: ReactNode }): JSX.Element;
