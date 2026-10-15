import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  ChartPie,
  Coins,
  CreditCard,
  Landmark,
  PiggyBank,
  Receipt,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { cn } from "cn";

interface Planet {
  angle: number;
  icon: LucideIcon;
}

interface Orbit {
  size: number;
  duration: number;
  isReverse: boolean;
  planets: readonly Planet[];
}

// size in px, duration in seconds, planet angle in degrees
const ORBITS: readonly Orbit[] = [
  { size: 320, duration: 40, isReverse: false, planets: [{ angle: 30, icon: Wallet }] },
  {
    size: 520,
    duration: 60,
    isReverse: true,
    planets: [
      { angle: 120, icon: PiggyBank },
      { angle: 300, icon: Coins },
    ],
  },
  {
    size: 720,
    duration: 80,
    isReverse: false,
    planets: [
      { angle: 210, icon: ChartPie },
      { angle: 20, icon: CreditCard },
    ],
  },
  {
    size: 920,
    duration: 100,
    isReverse: true,
    planets: [
      { angle: 60, icon: TrendingUp },
      { angle: 170, icon: Receipt },
      { angle: 270, icon: Target },
    ],
  },
  {
    size: 1120,
    duration: 120,
    isReverse: false,
    planets: [
      { angle: 140, icon: Landmark },
      { angle: 330, icon: Banknote },
    ],
  },
];

export function OrbitBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        "[mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_78%)]",
        className,
      )}
    >
      <div className="absolute top-1/2 left-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6359E9]/20 blur-3xl" />

      {ORBITS.map((orbit) => {
        const spinStyle = {
          animationDuration: `${orbit.duration}s`,
          animationDirection: orbit.isReverse ? "reverse" : "normal",
        } as const;
        // Counter-spin keeps icons upright while their orbit rotates
        const counterSpinStyle = {
          animationDuration: `${orbit.duration}s`,
          animationDirection: orbit.isReverse ? "normal" : "reverse",
        } as const;

        return (
          <div
            key={orbit.size}
            className="absolute top-1/2 left-1/2 rounded-full border border-[#6359E9]/15 motion-safe:animate-spin"
            style={{
              ...spinStyle,
              width: orbit.size,
              height: orbit.size,
              marginTop: -orbit.size / 2,
              marginLeft: -orbit.size / 2,
            }}
          >
            {orbit.planets.map(({ angle, icon: Icon }) => (
              <span
                key={angle}
                className="absolute top-1/2 left-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${orbit.size / 2}px) rotate(${-angle}deg)`,
                }}
              >
                <span
                  className="flex size-11 items-center justify-center rounded-xl bg-white/90 text-[#6359E9] shadow-[0_4px_20px_rgba(99,89,233,0.25)] ring-1 ring-[#6359E9]/10 motion-safe:animate-spin"
                  style={counterSpinStyle}
                >
                  <Icon className="size-5" strokeWidth={2} />
                </span>
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}
