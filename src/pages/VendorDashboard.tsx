import { useState } from 'react';
import {
  Calendar,
  Check,
  Clock,
  Grid3x3,
  Pencil,
  Plus,
  Store,
  Trash2,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SALONS } from '../data/salons';

type Tab = 'bookings' | 'menu' | 'overview';

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      className={`relative h-6 w-11 rounded-full transition-colors ${on ? 'bg-brand-600' : 'bg-ink-200'}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

export function VendorDashboard() {
  const { bookings, defaultSalonId, vendorServices, toggleVendorService, addVendorService, updateVendorService, deleteVendorService } = useApp();
  const [tab, setTab] = useState<Tab>('overview');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newSvc, setNewSvc] = useState({ name: '', price: '', durationMin: '' });
  const [editDraft, setEditDraft] = useState<{ name: string; price: string; durationMin: string }>({ name: '', price: '', durationMin: '' });

  const salon = SALONS.find((s) => s.id === defaultSalonId);
  const services = vendorServices[defaultSalonId] ?? [];
  const upcomingBookings = bookings.filter((b) => b.status === 'upcoming');

  const revenue = bookings.filter((b) => b.status !== 'cancelled').reduce((s, b) => s + b.total, 0);

  const startEdit = (id: string) => {
    const svc = services.find((s) => s.id === id);
    if (!svc) return;
    setEditingId(id);
    setEditDraft({ name: svc.name, price: String(svc.price), durationMin: String(svc.durationMin) });
  };
  const saveEdit = () => {
    if (!editingId) return;
    updateVendorService(defaultSalonId, editingId, {
      name: editDraft.name,
      price: Number(editDraft.price) || 0,
      durationMin: Number(editDraft.durationMin) || 0,
    });
    setEditingId(null);
  };
  const handleAdd = () => {
    if (!newSvc.name || !newSvc.price) return;
    addVendorService(defaultSalonId, {
      name: newSvc.name,
      price: Number(newSvc.price) || 0,
      durationMin: Number(newSvc.durationMin) || 30,
    });
    setNewSvc({ name: '', price: '', durationMin: '' });
    setShowAdd(false);
  };

  const tabs: { id: Tab; label: string; icon: typeof Calendar }[] = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'menu', label: 'Menu manager', icon: Grid3x3 },
  ];

  return (
    <div className="mx-auto max-w-6xl animate-fadeIn px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <img src={salon?.heroImage} alt="" className="h-14 w-14 rounded-2xl object-cover" />
        <div>
          <h1 className="text-2xl font-bold text-ink-900">{salon?.name} <span className="text-ink-400">· Studio</span></h1>
          <p className="text-sm text-ink-500">{salon?.neighborhood} · Partner dashboard</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <div className="flex items-center gap-2 text-ink-500"><Calendar className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-wide">Upcoming</span></div>
          <div className="mt-2 text-2xl font-bold text-ink-900">{upcomingBookings.length}</div>
          <div className="text-xs text-ink-500">appointments this cycle</div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 text-ink-500"><TrendingUp className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-wide">Revenue (booked)</span></div>
          <div className="mt-2 text-2xl font-bold text-ink-900">₹{revenue.toLocaleString('en-IN')}</div>
          <div className="text-xs text-ink-500">all-time confirmed</div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 text-ink-500"><Users className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-wide">Active services</span></div>
          <div className="mt-2 text-2xl font-bold text-ink-900">{services.filter((s) => s.active).length}/{services.length}</div>
          <div className="text-xs text-ink-500">live on marketplace</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-1 rounded-full bg-ink-100 p-1 sm:inline-flex">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all ${tab === t.id ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'}`}
            >
              <Icon className="h-4 w-4" /> {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {tab === 'overview' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card p-5">
              <h3 className="font-bold text-ink-900">Next up</h3>
              <div className="mt-4 space-y-3">
                {upcomingBookings.slice(0, 4).map((b) => (
                  <div key={b.id} className="flex items-center justify-between rounded-xl bg-ink-50 p-3">
                    <div>
                      <div className="text-sm font-semibold text-ink-800">{b.salonName}</div>
                      <div className="text-xs text-ink-500">{b.serviceNames.join(', ')}</div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="font-semibold text-ink-700">{new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                      <div className="text-ink-500">{b.timeSlot}</div>
                    </div>
                  </div>
                ))}
                {upcomingBookings.length === 0 && <p className="text-sm text-ink-400">No upcoming appointments.</p>}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-bold text-ink-900">Menu snapshot</h3>
              <div className="mt-4 space-y-2">
                {services.slice(0, 5).map((s) => (
                  <div key={s.id} className="flex items-center justify-between text-sm">
                    <span className={s.active ? 'text-ink-700' : 'text-ink-400 line-through'}>{s.name}</span>
                    <span className="font-semibold text-ink-700">₹{s.price.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'bookings' && (
          <div className="card overflow-hidden">
            <div className="border-b border-ink-100 p-5"><h3 className="font-bold text-ink-900">All bookings</h3></div>
            <div className="divide-y divide-ink-100">
              {bookings.map((b) => (
                <div key={b.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-semibold text-ink-900">{b.salonName}</div>
                    <div className="text-xs text-ink-500">{b.serviceNames.join(' · ')}</div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="inline-flex items-center gap-1 text-ink-600">
                      <Calendar className="h-4 w-4 text-ink-400" />
                      {new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="inline-flex items-center gap-1 text-ink-600">
                      <Clock className="h-4 w-4 text-ink-400" /> {b.timeSlot}
                    </span>
                    <span className={`chip ${b.status === 'upcoming' ? 'bg-brand-50 text-brand-700' : b.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {b.status}
                    </span>
                    <span className="font-semibold text-ink-900">₹{b.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && <div className="p-8 text-center text-sm text-ink-400">No bookings yet.</div>}
            </div>
          </div>
        )}

        {tab === 'menu' && (
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-ink-900">Service menu</h3>
              <button onClick={() => setShowAdd((v) => !v)} className="btn-primary text-sm">
                <Plus className="h-4 w-4" /> Add service
              </button>
            </div>

            {showAdd && (
              <div className="mt-4 grid gap-3 rounded-xl bg-ink-50 p-4 sm:grid-cols-4">
                <input className="input sm:col-span-1" placeholder="Service name" value={newSvc.name} onChange={(e) => setNewSvc({ ...newSvc, name: e.target.value })} />
                <input className="input" type="number" placeholder="Price ₹" value={newSvc.price} onChange={(e) => setNewSvc({ ...newSvc, price: e.target.value })} />
                <input className="input" type="number" placeholder="Duration min" value={newSvc.durationMin} onChange={(e) => setNewSvc({ ...newSvc, durationMin: e.target.value })} />
                <div className="flex gap-2">
                  <button onClick={handleAdd} className="btn-primary flex-1 text-sm"><Check className="h-4 w-4" /> Save</button>
                  <button onClick={() => setShowAdd(false)} className="btn-ghost px-3"><X className="h-4 w-4" /></button>
                </div>
              </div>
            )}

            <div className="mt-4 divide-y divide-ink-100">
              {services.map((s) => (
                <div key={s.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  {editingId === s.id ? (
                    <div className="grid flex-1 gap-2 sm:grid-cols-3">
                      <input className="input" value={editDraft.name} onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })} />
                      <input className="input" type="number" value={editDraft.price} onChange={(e) => setEditDraft({ ...editDraft, price: e.target.value })} />
                      <input className="input" type="number" value={editDraft.durationMin} onChange={(e) => setEditDraft({ ...editDraft, durationMin: e.target.value })} />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div>
                        <div className={`font-semibold ${s.active ? 'text-ink-900' : 'text-ink-400 line-through'}`}>{s.name}</div>
                        <div className="text-xs text-ink-500">{s.durationMin} min · ₹{s.price.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs text-ink-500">
                      <span>{s.active ? 'Live' : 'Hidden'}</span>
                      <Toggle on={s.active} onClick={() => toggleVendorService(defaultSalonId, s.id)} />
                    </div>
                    {editingId === s.id ? (
                      <>
                        <button onClick={saveEdit} className="btn-primary px-3 py-1.5 text-sm"><Check className="h-4 w-4" /></button>
                        <button onClick={() => setEditingId(null)} className="btn-ghost px-2"><X className="h-4 w-4" /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(s.id)} className="btn-ghost px-2"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => deleteVendorService(defaultSalonId, s.id)} className="btn-ghost px-2 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {services.length === 0 && <div className="py-8 text-center text-sm text-ink-400">No services yet. Add your first one.</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
