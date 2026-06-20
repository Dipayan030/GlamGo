import { useMemo, useState } from 'react';
import { Calendar, CheckCircle2, Clock, Eye, MapPin, Plus, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { adaptSalons } from '../data/adapter';

type Tab = 'upcoming' | 'past';

export function CustomerDashboard() {
  const { bookings, navigate, cancelBooking, salons } = useApp();
  const SALONS = useMemo(() => adaptSalons(salons), [salons]);
  const [tab, setTab] = useState<Tab>('upcoming');

  const upcoming = bookings.filter((b) => b.status === 'upcoming' || b.status === 'cancelled');
  const past = bookings.filter((b) => b.status === 'completed');
  const list = tab === 'upcoming' ? upcoming : past;

  return (
    <div className="mx-auto max-w-5xl animate-fadeIn px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">My bookings</h1>
          <p className="mt-1 text-sm text-ink-500">Track your upcoming and past appointments</p>
        </div>
        <button onClick={() => navigate({ name: 'search' })} className="btn-primary">
          <Plus className="h-4 w-4" /> New booking
        </button>
      </div>

      <div className="mt-6 inline-flex rounded-full bg-ink-100 p-1">
        <button
          onClick={() => setTab('upcoming')}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${tab === 'upcoming' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500'}`}
        >
          Upcoming ({upcoming.length})
        </button>
        <button
          onClick={() => setTab('past')}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${tab === 'past' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500'}`}
        >
          Past ({past.length})
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {list.length === 0 ? (
          <div className="card flex flex-col items-center justify-center p-12 text-center">
            <Calendar className="h-10 w-10 text-ink-300" />
            <h3 className="mt-3 font-semibold text-ink-800">
              {tab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings yet'}
            </h3>
            <p className="mt-1 text-sm text-ink-500">When you book, they'll show up here.</p>
            <button onClick={() => navigate({ name: 'search' })} className="btn-primary mt-4">Discover salons</button>
          </div>
        ) : (
          list.map((b) => {
            const salon = SALONS.find((s) => s.id === b.salonId);
            const cancelled = b.status === 'cancelled';
            return (
              <div key={b.id} className={`card overflow-hidden ${cancelled ? 'opacity-60' : ''}`}>
                <div className="flex flex-col sm:flex-row">
                  <img src={salon?.heroImage ?? ''} alt="" className="h-36 w-full object-cover sm:h-auto sm:w-40" />
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-ink-900">{b.salonName}</h3>
                          {b.status === 'cancelled' ? (
                            <span className="chip bg-red-50 text-red-600"><XCircle className="h-3 w-3" /> Cancelled</span>
                          ) : b.status === 'completed' ? (
                            <span className="chip bg-green-50 text-green-600"><CheckCircle2 className="h-3 w-3" /> Completed</span>
                          ) : (
                            <span className="chip bg-brand-50 text-brand-700"><Clock className="h-3 w-3" /> Upcoming</span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-ink-500">{salon?.neighborhood}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-ink-400">Total</div>
                        <div className="font-bold text-ink-900">₹{(b.price ?? 0).toLocaleString('en-IN')}</div>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-600">
                      <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4 text-ink-400" />
                        {new Date(b.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </span>
                      <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-ink-400" /> {b.timeSlot}</span>
                      <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-ink-400" /> {salon?.address.split(',')[0]}</span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="chip bg-ink-100 text-ink-600">{b.serviceTitle}</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {b.status === 'upcoming' && (
                        <button onClick={() => cancelBooking(b.id)} className="btn-outline text-sm text-red-600 hover:bg-red-50 hover:border-red-200">
                          Cancel booking
                        </button>
                      )}
                      <button onClick={() => navigate({ name: 'salon', id: b.salonId })} className="btn-ghost text-sm">
                        <Eye className="h-4 w-4" /> View salon
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
