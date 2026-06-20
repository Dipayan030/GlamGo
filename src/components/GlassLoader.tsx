import { CheckCircle2 } from 'lucide-react';

/**
 * Full-screen glassmorphic loading modal. Backdrop blur + translucent card,
 * animated spinner ring, and a descriptive message.
 */
export function GlassLoader({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center animate-fadeIn">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-xl" />
      <div className="relative flex flex-col items-center rounded-3xl border border-white/40 bg-white/70 px-12 py-12 shadow-pop backdrop-blur-2xl">
        {/* Spinner */}
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full border-4 border-ink-200" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-brand-600 border-r-brand-400" />
          <div className="absolute inset-2 rounded-full bg-brand-50/60" />
        </div>
        <p className="mt-6 max-w-xs text-center text-sm font-semibold text-ink-800">
          {message}
        </p>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-ink-500">
          <CheckCircle2 className="h-3.5 w-3.5 text-brand-500" />
          Securing your slot
        </div>
      </div>
    </div>
  );
}

/**
 * Full-screen confirmation with a big animated check badge + optional confetti.
 */
export function ConfirmationBadge({
  salonName,
  dateLabel,
  timeSlot,
}: {
  salonName: string;
  dateLabel: string;
  timeSlot: string;
}) {
  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center animate-fadeIn">
      <div className="absolute inset-0 bg-ink-900/30 backdrop-blur-md" />
      <div className="relative w-full max-w-md animate-fadeUp px-6">
        <div className="flex flex-col items-center rounded-3xl border border-white/50 bg-white/85 px-8 py-12 text-center shadow-pop backdrop-blur-2xl">
          <div className="relative">
            <span className="absolute inset-0 animate-ping rounded-full bg-green-400/40" />
            <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
              <CheckCircle2 className="h-12 w-12" strokeWidth={2.5} />
            </span>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-ink-900">You're booked!</h2>
          <p className="mt-2 text-sm text-ink-600">
            Confirmed at <span className="font-semibold text-ink-800">{salonName}</span>
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-full bg-ink-100 px-4 py-2 text-sm font-semibold text-ink-700">
            {dateLabel} · {timeSlot}
          </div>
          <p className="mt-4 text-xs text-ink-500">Redirecting to your bookings…</p>
        </div>
      </div>
    </div>
  );
}
