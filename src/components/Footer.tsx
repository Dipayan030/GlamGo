import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="text-base font-bold text-ink-900">GlamGo Mumbai</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-ink-500">
              Beauty, on your block. Discover trusted salons, spas, and studios across Mumbai — book in seconds.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-400">Explore</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink-600">
              <li>Bandra</li><li>Andheri West</li><li>Lower Parel</li><li>Juhu</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-400">For Salons</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink-600">
              <li>List your business</li><li>Partner dashboard</li><li>Pricing</li><li>Support</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-ink-100 pt-6 text-xs text-ink-400 sm:flex-row">
          <p>© {new Date().getFullYear()} GlamGo Mumbai. Demo experience.</p>
          <p>Crafted with care for the city of dreams.</p>
        </div>
      </div>
    </footer>
  );
}
