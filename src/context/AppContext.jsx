import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { INITIAL_SALONS } from '../data/mockData';

/**
 * Unified global state for GlamGo Mumbai.
 *
 * Exposes:
 *  - role simulation ('customer' | 'partner')
 *  - search query state (selected neighborhood + selected service type)
 *  - cart (services selected for checkout)
 *  - bookings (user bookings, dynamic)
 *  - salons state (seeded with INITIAL_SALONS via useState)
 *  - handleAddSalon / handleAddService helpers
 */

const AppContext = createContext(null);

const mockBookings = [
  {
    id: 'b1',
    salonId: 'velvet-lounge-bandra',
    salonName: 'Velvet Lounge',
    serviceId: 'vl-01',
    serviceTitle: 'Signature Cut & Blowdry',
    price: 2200,
    duration: '75 mins',
    date: '2026-06-24',
    timeSlot: '11:30 AM',
    status: 'upcoming',
    customerName: 'You',
  },
  {
    id: 'b2',
    salonId: 'velvet-lounge-bandra',
    salonName: 'Velvet Lounge',
    serviceId: 'vl-02',
    serviceTitle: 'Balayage Full Head',
    price: 11500,
    duration: '180 mins',
    date: '2026-06-29',
    timeSlot: '4:00 PM',
    status: 'upcoming',
    customerName: 'You',
  },
  {
    id: 'b3',
    salonId: 'atelier-noir-juhu',
    salonName: 'Atelier Noir',
    serviceId: 'an-01',
    serviceTitle: 'Precision Bob Cut',
    price: 2800,
    duration: '80 mins',
    date: '2026-05-20',
    timeSlot: '2:00 PM',
    status: 'completed',
    customerName: 'You',
  },
];

export function AppProvider({ children }) {
  // ---- Role simulation ----
  const [role, setRole] = useState('customer');

  // ---- Search query state ----
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('');

  // ---- Salons state (seeded with mock data) ----
  const [salons, setSalons] = useState(INITIAL_SALONS);

  /**
   * Prepend a new salon submitted from the partner onboarding page.
   * Adds sensible defaults for id/empty fields.
   */
  const handleAddSalon = useCallback((newSalon) => {
    const salon = {
      id: newSalon.id || `salon-${Date.now()}`,
      name: newSalon.name || 'Untitled Salon',
      category: newSalon.category || 'Hair & Beauty',
      neighborhood: newSalon.neighborhood || 'Bandra',
      address: newSalon.address || '',
      rating: newSalon.rating ?? 4.5,
      reviewCount: newSalon.reviewCount ?? 0,
      priceTier: newSalon.priceTier || '₹₹',
      image:
        newSalon.image ||
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
      description: newSalon.description || '',
      features: newSalon.features || [],
      services: newSalon.services || [],
    };
    setSalons((prev) => [salon, ...prev]);
  }, []);

  /**
   * Append a newly created service to a specific salon's menu.
   */
  const handleAddService = useCallback((salonId, newService) => {
    const service = {
      serviceId: newService.serviceId || `svc-${Date.now()}`,
      title: newService.title || 'New Service',
      price: Number(newService.price) || 0,
      duration: newService.duration || '30 mins',
    };
    setSalons((prev) =>
      prev.map((s) =>
        s.id === salonId ? { ...s, services: [...s.services, service] } : s,
      ),
    );
  }, []);

  // ---- Cart state ----
  const [cart, setCart] = useState([]);

  const addToCart = useCallback((item) => {
    const key = item.service.id || item.service.serviceId;
    setCart((prev) =>
      prev.some((c) => (c.service.id || c.service.serviceId) === key)
        ? prev
        : [...prev, item],
    );
  }, []);

  const removeFromCart = useCallback((serviceId) => {
    setCart((prev) =>
      prev.filter(
        (c) => (c.service.id || c.service.serviceId) !== serviceId,
      ),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.length;
  const cartTotal = cart.reduce((sum, c) => sum + (c.service.price || 0), 0);

  // ---- Bookings state ----
  const [bookings, setBookings] = useState(mockBookings);

  const placeBooking = useCallback((booking) => {
    const newBooking = {
      ...booking,
      id: `b${Date.now()}`,
      status: 'upcoming',
      customerName: booking.customerName || 'You',
    };
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  }, []);

  const cancelBooking = useCallback((id) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)),
    );
  }, []);

  // ---- Mock router state ----
  const [route, setRoute] = useState({ name: 'landing' });
  const navigate = useCallback((r) => {
    setRoute(r);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const setRoleAndRoute = useCallback((r) => {
    setRole(r);
    setRoute({ name: r === 'partner' ? 'vendor' : 'customer' });
  }, []);

  const value = useMemo(
    () => ({
      // role
      role,
      setRole: setRoleAndRoute,
      // search query state
      searchQuery,
      setSearchQuery,
      selectedNeighborhood,
      setSelectedNeighborhood,
      selectedServiceType,
      setSelectedServiceType,
      // salons + mutations
      salons,
      handleAddSalon,
      handleAddService,
      // cart
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal,
      // bookings
      bookings,
      placeBooking,
      cancelBooking,
      // router
      route,
      navigate,
    }),
    [
      role, setRoleAndRoute,
      searchQuery, selectedNeighborhood, selectedServiceType,
      salons, handleAddSalon, handleAddService,
      cart, addToCart, removeFromCart, clearCart, cartCount, cartTotal,
      bookings, placeBooking, cancelBooking,
      route, navigate,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
