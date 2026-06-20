import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Lock,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { adaptSalons } from '../data/adapter';
import { GlassLoader, ConfirmationBadge } from '../components/GlassLoader';
import { Confetti } from '../components/Confetti';

// Hourly slots from 9:00 AM to 8:00 PM
const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
  '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM',
];

function formatFull(d: Date) {
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
}

export function BookingFlow() {
  const { cart, removeFromCart, cartTotal, clearCart, navigate, placeBooking, salons } = useApp();
  const SALONS = useMemo(() => adaptSalons(salons), [salons]);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  // local booking state: which day (0-6) and which time slot
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  // modals
  const [loader, setLoader] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // Next 7 calendar days
  const days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, []);

  const salonGroups = useMemo(() => {
    const map = new Map<string, typeof cart>();
    cart.forEach((c) => {
      if (!map.has(c.salonId)) map.set(c.salonId, []);
      map.get(c.salonId)!.push(c);
    });
    return Array.from(map.entries());
  }, [cart]);

  const primarySalon = SALONS.find((s) => s.id === salonGroups[0]?.[0]) ?? null;
  const selectedDate = selectedDay != null ? days[selectedDay] : null;
  const formattedDate = selectedDate ? selectedDate.toISOString().slice(0, 10) : '';

  // ---- Empty cart ----
  if (cart.length === 0 && !confirmed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center animate-fadeIn">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-100">
          <ShoppingBag className="h-7 w-7 text-ink-400" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-ink-900">Your cart is empty</h1>
        <p className="mt-2 text-ink-500">Add services from any salon to start a booking.</p>
        <button onClick={() => navigate({ name: 'search' })} className="btn-primary mt-6">Discover salons</button>
      </div>
    );
  }

  const steps = [
    { n: 1, label: 'Review', icon: ShoppingBag },
    { n: 2, label: 'Schedule', icon: Calendar },
    { n: 3, label: 'Pay', icon: CreditCard },
  ];

  const scheduleReady = selectedDay != null && selectedSlot !== '';
  const canContinue = step === 1 ? cart.length > 0 : step === 2 ? scheduleReady : true;

  const handleConfirm = () => {
    setLoader(true);
    // 1) Glassmorphic loader for 2 seconds
    setTimeout(() => {
      salonGroups.forEach(([salonId, items]) => {
        const s = SALONS.find((x) => x.id === salonId);
        items.forEach((i) => {
          placeBooking({
            salonId,
            salonName: s?.name ?? 'Salon',
            serviceId: i.service.id,
            serviceTitle: i.service.name,
            price: i.service.price,
            duration: `${i.service.durationMin} mins`,
            date: formattedDate,
            timeSlot: selectedSlot,
            customerName: 'You',
          });
        });
      });
      clearCart();
      setLoader(false);
      // 2) Show confirmation badge + confetti
      setConfirmed(true);
    }, 2000);
  };

  const dateLabel = selectedDate ? formatFull(selectedDate) : '';

  return (
    <div className="mx-auto max-w-5xl animate-fadeIn px-4 py-8 sm:px-6 lg:px-8">
      <button onClick={() => navigate({ name: 'search' })} className="btn-ghost mb-4 -ml-2 gap-1">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <h1 className="text-2xl font-bold text-ink-900">Complete your booking</h1>

      {/* Stepper */}
      <div className="mt-6 flex items-center gap-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const active = step === s.n;
          const done = step > s.n;
          return (
            <div key={s.n} className="flex flex-1 items-center">
              <div className="flex items-center gap-2">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${done ? 'bg-green-600 text-white' : active ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-500'}`}>
                  {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className={`text-sm font-medium ${active ? 'text-ink-900' : 'text-ink-400'}`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className="mx-3 h-px flex-1 bg-ink-200" />}
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Main step content */}
        <div>
          {/* STEP 1: REVIEW */}
          {step === 1 && (
            <div className="animate-fadeUp space-y-4">
              {salonGroups.map(([salonId, items]) => {
                const s = SALONS.find((x) => x.id === salonId);
                return (
                  <div key={salonId} className="card p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <img src={s?.heroImage} alt="" className="h-12 w-12 rounded-xl object-cover" />
                      <div>
                        <h3 className="font-bold text-ink-900">{s?.name}</h3>
                        <p className="text-xs text-ink-500">{s?.neighborhood}</p>
                      </div>
                    </div>
                    <div className="divide-y divide-ink-100">
                      {items.map((c) => (
                        <div key={c.service.id} className="flex items-center justify-between py-3">
                          <div>
                            <div className="text-sm font-semibold text-ink-800">{c.service.name}</div>
                            <div className="mt-0.5 flex items-center gap-3 text-xs text-ink-500">
                              <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {c.service.durationMin} min</span>
                              <span>{c.service.category}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-ink-900">₹{c.service.price.toLocaleString('en-IN')}</span>
                            <button onClick={() => removeFromCart(c.service.id)} className="btn-ghost px-2 text-ink-400 hover:text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* STEP 2: SCHEDULE */}
          {step === 2 && (
            <div className="animate-fadeUp">
              <div className="card p-5">
                <h3 className="font-bold text-ink-900">Pick a day</h3>
                <p className="text-xs text-ink-500">Next 7 days</p>
                <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
                  {days.map((d, i) => {
                    const isSelected = selectedDay === i;
                    const isToday = i === 0;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDay(i)}
                        className={`flex flex-col items-center gap-1 rounded-xl px-2 py-3 text-center transition-all ${isSelected ? 'bg-brand-600 text-white shadow-sm' : 'bg-ink-50 text-ink-600 hover:bg-ink-100'}`}
                      >
                        <span className="text-[11px] font-medium uppercase tracking-wide">
                          {isToday ? 'Today' : d.toLocaleDateString('en-IN', { weekday: 'short' })}
                        </span>
                        <span className="text-lg font-bold">{d.getDate()}</span>
                        <span className={`text-[10px] ${isSelected ? 'text-brand-100' : 'text-ink-400'}`}>
                          {d.toLocaleDateString('en-IN', { month: 'short' })}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-ink-900">Pick a time</h3>
                    <p className="text-xs text-ink-500">9:00 AM – 8:00 PM</p>
                  </div>
                  {selectedDate && (
                    <span className="text-xs font-medium text-brand-600">
                      {selectedDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`rounded-xl px-2 py-2.5 text-sm font-medium transition-all ${isSelected ? 'bg-brand-600 text-white shadow-sm' : 'bg-ink-50 text-ink-700 hover:bg-ink-100'}`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT */}
          {step === 3 && (
            <div className="animate-fadeUp card p-5">
              <h3 className="font-bold text-ink-900">Payment</h3>
              <p className="mt-1 text-sm text-ink-500">This is a simulated payment — no real charge.</p>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-ink-400">Card number</label>
                  <input className="input mt-1" placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-ink-400">Expiry</label>
                    <input className="input mt-1" placeholder="MM / YY" defaultValue="12 / 28" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-ink-400">CVC</label>
                    <input className="input mt-1" placeholder="123" defaultValue="123" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-ink-400">Name on card</label>
                  <input className="input mt-1" placeholder="Your name" defaultValue="Aisha M" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-ink-500">
                <Lock className="h-3.5 w-3.5" /> Secured with 256-bit encryption (demo)
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className="mt-6 flex justify-between">
            {step > 1 ? (
              <button onClick={() => setStep((s) => (s - 1) as 1 | 2)} className="btn-outline">Back</button>
            ) : <span />}
            {step < 3 ? (
              <button
                onClick={() => canContinue && setStep((s) => (s + 1) as 2 | 3)}
                disabled={!canContinue}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={handleConfirm} disabled={loader} className="btn-primary disabled:opacity-60">
                Confirm Reservation
              </button>
            )}
          </div>
        </div>

        {/* Summary sidebar */}
        <aside>
          <div className="sticky top-20 card p-5">
            <h3 className="font-bold text-ink-900">Summary</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between text-ink-500">
                <span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-ink-500">
                <span>Platform fee</span><span>₹0</span>
              </div>
              <div className="flex justify-between border-t border-ink-100 pt-2 font-bold text-ink-900">
                <span>Total</span><span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
            {step >= 2 && scheduleReady && selectedDate && (
              <div className="mt-4 rounded-xl bg-brand-50 p-3 text-sm">
                <div className="font-semibold text-brand-700">{formatFull(selectedDate)}</div>
                <div className="text-brand-600">{selectedSlot}</div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Glassmorphic loading modal */}
      {loader && primarySalon && (
        <GlassLoader message={`Securing your appointment with ${primarySalon.name}…`} />
      )}

      {/* Confirmation badge + confetti → auto route to /user/profile */}
      {confirmed && primarySalon && (
        <>
          <Confetti onDone={() => navigate({ name: 'customer' })} />
          <ConfirmationBadge
            salonName={primarySalon.name}
            dateLabel={dateLabel}
            timeSlot={selectedSlot}
          />
        </>
      )}
    </div>
  );
}
