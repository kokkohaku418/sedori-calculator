"use client";
import { PLATFORMS, type PlatformId } from "@/lib/platforms";

type Props = {
  selected: PlatformId;
  onSelect: (id: PlatformId) => void;
};

export default function PlatformTabs({ selected, onSelect }: Props) {
  const idx = Math.max(
    0,
    PLATFORMS.findIndex((p) => p.id === selected)
  );

  return (
    <div className="relative p-1 bg-ink-100 rounded-2xl">
      <div className="relative grid grid-cols-4">
        <div
          aria-hidden
          className="absolute inset-y-0 w-1/4 rounded-xl bg-white shadow-card transition-transform duration-[360ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{ transform: `translateX(${idx * 100}%)` }}
        />
        {PLATFORMS.map((p) => {
          const active = selected === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              aria-pressed={active}
              className={`relative z-10 h-[52px] rounded-xl text-[12px] sm:text-[13px] font-semibold transition-colors duration-200 ${
                active ? "text-ink-900" : "text-ink-500 hover:text-ink-700"
              }`}
            >
              <span className="block leading-none">{p.shortName}</span>
              <span className="block text-[10px] sm:text-[11px] font-normal opacity-70 mt-1">
                {p.feeRate}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
