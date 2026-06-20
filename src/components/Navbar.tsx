import { useEffect, useRef, useState } from 'react';
import {
  Calendar,
  ChevronDown,
  LayoutDashboard,
  Scissors,
  ShoppingBag,
  Sparkles,
  Store,
  User,
} from 'lucide-react';
import { useApp, type Route } from '../context/AppContext';

function useClickOutside<T extends HTMLElement>(onOutside: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onOutside]);
  return ref;
}

export function Navbar() {
  const { route, navigate, role, setRole, cartCount } = useApp();
  const [roleOpen, setRoleOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const roleRef = useClickOutside<HTMLDivElement>(() => setRoleOpen(false));

  const isActive = (r: Route) => route.name === r.name;

  const navLinks: { label: string; route: Route; icon: typeof Scissors; ownerOnly?: boolean }[] = [
    { label: 'Discover', route: { name: 'search' }, icon: Sparkles },
    { label: 'Bookings', route: { name: 'customer' }, icon: Calendar },
    { label: 'Salon Studio', route: { name: 'vendor' }, icon: Store, ownerOnly: true },
  ];

  const visibleLinks = navLinks.filter((l) => !l.ownerOnly || role === 'owner');

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => navigate({ name: 'landing' })}
          className="flex items-center gap-2"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
            <Scissors className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-ink-900">
            GlamGo<span className="text-brand-600"> Mumbai</span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {visibleLinks.map((l) => {
            const Icon = l.icon;
            const active = isActive(l.route);
            return (
              <button
                key={l.label}
                onClick={() => navigate(l.route)}
                className={`btn-ghost gap-1.5 ${active ? 'bg-brand-50 text-brand-700' : ''}`}
              >
                <Icon className="h-4 w-4" />
                {l.label}
              </button>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate({ name: 'checkout' })}
            className="relative btn-outline px-3.5"
            aria-label="Cart"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Role toggle */}
          <div className="relative" ref={roleRef}>
            <button
              onClick={() => setRoleOpen((o) => !o)}
              className="btn-outline gap-1.5"
            >
              {role === 'customer' ? <User className="h-4 w-4" /> : <LayoutDashboard className="h-4 w-4" />}
              <span className="hidden sm:inline capitalize">
                {role === 'customer' ? 'Customer' : 'Salon Owner'}
              </span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${roleOpen ? 'rotate-180' : ''}`} />
            </button>
            {roleOpen && (
              <div className="absolute right-0 top-12 w-60 animate-fadeUp rounded-2xl border border-ink-100 bg-white p-2 shadow-pop">
                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink-400">Simulate Role</p>
                <button
                  onClick={() => { setRole('customer'); setRoleOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-ink-50 ${role === 'customer' ? 'bg-brand-50' : ''}`}
                >
                  <User className="h-4 w-4 text-brand-600" />
                  <div>
                    <div className="text-sm font-semibold text-ink-800">Customer</div>
                    <div className="text-xs text-ink-500">Book & track appointments</div>
                  </div>
                </button>
                <button
                  onClick={() => { setRole('owner'); setRoleOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-ink-50 ${role === 'owner' ? 'bg-brand-50' : ''}`}
                >
                  <Store className="h-4 w-4 text-brand-600" />
                  <div>
                    <div className="text-sm font-semibold text-ink-800">Salon Owner</div>
                    <div className="text-xs text-ink-500">Manage bookings & menu</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="btn-ghost px-2 md:hidden"
            aria-label="Menu"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="border-t border-ink-100 bg-white px-4 py-3 md:hidden">
          {visibleLinks.map((l) => {
            const Icon = l.icon;
            return (
              <button
                key={l.label}
                onClick={() => { navigate(l.route); setMobileOpen(false); }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-ink-700 hover:bg-ink-50"
              >
                <Icon className="h-4 w-4 text-brand-600" />
                {l.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
