import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;       // % horizontal launch position
  delay: number;   // ms
  duration: number;// ms
  color: string;
  size: number;    // px
  drift: number;   // px horizontal drift
  rotate: number;   // deg
}

const COLORS = ['#6366f1', '#a5b4fc', '#fbbf24', '#34d399', '#f472b6', '#60a5fa'];

/**
 * Lightweight dependency-free confetti burst. Renders a fixed overlay of
 * animated paper particles for ~1.6s, then calls onDone.
 */
export function Confetti({ onDone }: { onDone?: () => void }) {
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      delay: Math.random() * 200,
      duration: 900 + Math.random() * 900,
      color: COLORS[i % COLORS.length],
      size: 6 + Math.random() * 8,
      drift: (Math.random() - 0.5) * 200,
      rotate: Math.random() * 360,
    })),
  );

  useEffect(() => {
    const t = setTimeout(() => onDone?.(), 1700);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translate(0, -10vh) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--drift), 110vh) rotate(var(--rot)); opacity: 0; }
        }
      `}</style>
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 block"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size * 1.6,
            backgroundColor: p.color,
            borderRadius: 2,
            // @ts-expect-error custom props are valid in inline styles
            '--drift': `${p.drift}px`,
            '--rot': `${p.rotate}deg`,
            animation: `confetti-fall ${p.duration}ms ${p.delay}ms ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}
