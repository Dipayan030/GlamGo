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
import { useApp } from '../context/AppContext';
import { SALONS } from '../data/salons';

const TIME_SLOTS = [
  '10:30 AM', '11:30 AM', '12:30 PM', '1:30 PM',
  '3:00 PM', '4:00 PM', '5:00 PM', '6:30 PM', '7:30 PM',
];

function formatDay(d: Date) {
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
}
function formatFull(d: Date) {
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
}

export function BookingFlow() {
  const { cart, removeFromCart, cartTotal, clearCart, navigate, placeBooking } = useApp();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState<number>(2); // index into 14-day window
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [paying, setPaying] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 14 }, (_, i) => {
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

  const date = days[selectedDate];
  const formattedDate = date.toISOString().slice(0, 10);

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

  if (confirmed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center animate-fadeUp">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-ink-900">Booking confirmed!</h1>
        <p className="mt-2 text-ink-500">
          See you on <span className="font-semibold text-ink-700">{formatFull(date)}</span> at <span className="font-semibold text-ink-700">{selectedSlot}</span>.
        </p>
        <div className="mt-6 card p-5 text-left">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-400">Summary</h3>
          <div className="space-y-2 text-sm">
            {salonGroups.map(([salonId, items]) => {
              const s = SALONS.find((x) => x.id === salonId);
              return (
                <div key={salonId}>
                  <div className="font-semibold text-ink-800">{s?.name}</div>
                  {items.map((c) => (
                    <div key={c.service.id} className="flex justify-between pl-2 text-ink-600">
                      <span>{c.service.name}</span>
                      <span>₹{c.service.price.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              );
            })}
            <div className="flex justify-between border-t border-ink-100 pt-2 font-bold text-ink-900">
              <span>Total</span><span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => navigate({ name: 'customer' })} className="btn-primary">View my bookings</button>
          <button onClick={() => navigate({ name: 'search' })} className="btn-outline">Book another</button>
        </div>
      </div>
    );
  }

  const steps = [
    { n: 1, label: 'Review', icon: ShoppingBag },
    { n: 2, label: 'Schedule', icon: Calendar },
    { n: 3, label: 'Pay', icon: CreditCard },
  ];

  const canContinue = step === 1 ? cart.length > 0 : step === 2 ? !!selectedSlot : true;

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      salonGroups.forEach(([salonId, items]) => {
        const s = SALONS.find((x) => x.id === salonId);
        placeBooking({
          salonId,
          salonName: s?.name ?? 'Salon',
          serviceIds: items.map((i) => i.service.id),
          serviceNames: items.map((i) => i.service.name),
          total: items.reduce((sum, i) => sum + i.service.price, 0),
          date: formattedDate,
          timeSlot: selectedSlot,
          customerName: 'You',
        });
      });
      clearCart();
      setPaying(false);
      setConfirmed(true);
    }, 1600);
  };

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

          {step === 2 && (
            <div className="animate-fadeUp">
              <div className="card p-5">
                <h3 className="font-bold text-ink-900">Pick a date</h3>
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                  {days.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(i)}
                      className={`flex min-w-16 flex-col items-center gap-1 rounded-xl px-3 py-2.5 text-center transition-all ${selectedDate === i ? 'bg-brand-600 text-white shadow-sm' : 'bg-ink-50 text-ink-600 hover:bg-ink-100'}`}
                    >
                      <span className="text-[11px] font-medium uppercase">{i === 0 ? 'Today' : d.toLocaleDateString('en-IN', { weekday: 'short' })}</span>
                      <span className="text-sm font-bold">{d.getDate()}</span>
                    </button>
                  ))}
                </div>

                <h3 className="mt-6 font-bold text-ink-900">Available time slots</h3>
                <p className="text-xs text-ink-500">{formatFull(date)}</p>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${selectedSlot === slot ? 'bg-brand-600 text-white shadow-sm' : 'bg-ink-50 text-ink-700 hover:bg-ink-100'}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

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

          <div className="mt-6 flex justify-between">
            {step > 1 ? (
              <button onClick={() => setStep((s) => (s - 1) as 1 | 2)} className="btn-outline">Back</button>
            ) : <span />}
            {step < 3 ? (
              <button onClick={() => canContinue && setStep((s) => (s + 1) as 2 | 3)} disabled={!canContinue} className="btn-primary disabled:cursor-not-allowed disabled:opacity-40">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={handlePay} disabled={paying} className="btn-primary disabled:opacity-60">
                {paying ? 'Processing…' : `Pay ₹${cartTotal.toLocaleString('en-IN')}`}
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
            {step >= 2 && selectedSlot && (
              <div className="mt-4 rounded-xl bg-brand-50 p-3 text-sm">
                <div className="font-semibold text-brand-700">{formatFull(date)}</div>
                <div className="text-brand-600">{selectedSlot}</div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
