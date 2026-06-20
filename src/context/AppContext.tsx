import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Booking, CartItem, Role } from '../types';
import { SALONS } from '../data/salons';

type Route =
  | { name: 'landing' }
  | { name: 'search'; query?: string; neighborhood?: string }
  | { name: 'salon'; id: string }
  | { name: 'checkout' }
  | { name: 'customer' }
  | { name: 'vendor' };

interface AppContextValue {
  // routing
  route: Route;
  navigate: (r: Route) => void;
  // role simulation
  role: Role;
  setRole: (r: Role) => void;
  // bookings / cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (serviceId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  bookings: Booking[];
  placeBooking: (b: Omit<Booking, 'id' | 'status'>) => Booking;
  cancelBooking: (id: string) => void;
  // vendor CRUD menu (operates on a per-salon services copy keyed by salonId)
  vendorServices: Record<string, { id: string; name: string; price: number; durationMin: number; active: boolean }[]>;
  toggleVendorService: (salonId: string, serviceId: string) => void;
  addVendorService: (salonId: string, data: { name: string; price: number; durationMin: number }) => void;
  updateVendorService: (salonId: string, serviceId: string, data: { name?: string; price?: number; durationMin?: number }) => void;
  deleteVendorService: (salonId: string, serviceId: string) => void;
  defaultSalonId: string;
}

const AppContext = createContext<AppContextValue | null>(null);

const DEFAULT_VENDOR_SALON = 'glow-bandra';

// seed a couple of bookings so dashboards aren't empty
const seedBookings = (): Booking[] => {
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const inDays = (n: number) => { const d = new Date(today); d.setDate(d.getDate() + n); return fmt(d); };
  return [
    {
      id: 'b1',
      salonId: 'glow-bandra',
      salonName: 'Glow Atelier',
      serviceIds: ['s1'],
      serviceNames: ['Signature Cut & Blowdry'],
      total: 2200,
      date: inDays(3),
      timeSlot: '11:30 AM',
      status: 'upcoming',
      customerName: 'You',
    },
    {
      id: 'b2',
      salonId: 'lush-andheri',
      salonName: 'Lush Botanics',
      serviceIds: ['s6'],
      serviceNames: ['Aromatherapy Deep Tissue'],
      total: 3200,
      date: inDays(9),
      timeSlot: '4:00 PM',
      status: 'upcoming',
      customerName: 'You',
    },
    {
      id: 'b3',
      salonId: 'atelier-juhu',
      salonName: 'Atelier Noir',
      serviceIds: ['s10'],
      serviceNames: ['Precision Bob Cut'],
      total: 2800,
      date: inDays(-12),
      timeSlot: '2:00 PM',
      status: 'completed',
      customerName: 'You',
    },
  ];
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>({ name: 'landing' });
  const [role, setRoleState] = useState<Role>('customer');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>(seedBookings);
  const [vendorServices, setVendorServices] = useState<
    Record<string, { id: string; name: string; price: number; durationMin: number; active: boolean }[]>
  >({});

  const navigate = useCallback((r: Route) => {
    setRoute(r);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const setRole = useCallback((r: Role) => {
    setRoleState(r);
    if (r === 'owner') setRoute({ name: 'vendor' });
    else setRoute({ name: 'customer' });
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      if (prev.some((c) => c.service.id === item.service.id)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeFromCart = useCallback((serviceId: string) => {
    setCart((prev) => prev.filter((c) => c.service.id !== serviceId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.length;
  const cartTotal = cart.reduce((sum, c) => sum + c.service.price, 0);

  const placeBooking = useCallback((b: Omit<Booking, 'id' | 'status'>) => {
    const newBooking: Booking = {
      ...b,
      id: `b${Date.now()}`,
      status: 'upcoming',
    };
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  }, []);

  const cancelBooking = useCallback((id: string) => {
    setBookings((prev) =>
      prev.map((bk) => (bk.id === id ? { ...bk, status: 'cancelled' as const } : bk)),
    );
  }, []);

  // vendor CRUD
  const ensureVendorServices = useCallback(
    (salonId: string) => {
      setVendorServices((prev) => {
        if (prev[salonId]) return prev;
        const salon = SALONS.find((s) => s.id === salonId);
        if (!salon) return prev;
        return {
          ...prev,
          [salonId]: salon.services.map((s) => ({
            id: s.id,
            name: s.name,
            price: s.price,
            durationMin: s.durationMin,
            active: true,
          })),
        };
      });
    },
    [],
  );

  useEffect(() => {
    ensureVendorServices(DEFAULT_VENDOR_SALON);
  }, [ensureVendorServices]);

  const toggleVendorService = useCallback((salonId: string, serviceId: string) => {
    setVendorServices((prev) => ({
      ...prev,
      [salonId]: (prev[salonId] ?? []).map((s) =>
        s.id === serviceId ? { ...s, active: !s.active } : s,
      ),
    }));
  }, []);

  const addVendorService = useCallback(
    (salonId: string, data: { name: string; price: number; durationMin: number }) => {
      setVendorServices((prev) => ({
        ...prev,
        [salonId]: [
          ...(prev[salonId] ?? []),
          { id: `vs${Date.now()}`, ...data, active: true },
        ],
      }));
    },
    [],
  );

  const updateVendorService = useCallback(
    (salonId: string, serviceId: string, data: { name?: string; price?: number; durationMin?: number }) => {
      setVendorServices((prev) => ({
        ...prev,
        [salonId]: (prev[salonId] ?? []).map((s) =>
          s.id === serviceId ? { ...s, ...data } : s,
        ),
      }));
    },
    [],
  );

  const deleteVendorService = useCallback((salonId: string, serviceId: string) => {
    setVendorServices((prev) => ({
      ...prev,
      [salonId]: (prev[salonId] ?? []).filter((s) => s.id !== serviceId),
    }));
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      route,
      navigate,
      role,
      setRole,
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal,
      bookings,
      placeBooking,
      cancelBooking,
      vendorServices,
      toggleVendorService,
      addVendorService,
      updateVendorService,
      deleteVendorService,
      defaultSalonId: DEFAULT_VENDOR_SALON,
    }),
    [
      route, navigate, role, setRole, cart, addToCart, removeFromCart, clearCart,
      cartCount, cartTotal, bookings, placeBooking, cancelBooking, vendorServices,
      toggleVendorService, addVendorService, updateVendorService, deleteVendorService,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export type { Route };
