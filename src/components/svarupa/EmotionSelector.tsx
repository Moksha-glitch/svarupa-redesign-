"use client";

import { EMOTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function EmotionSelector({
  value,
  onChange,
  custom,
  onCustom,
}: {
  value?: string;
  onChange: (emotion: string) => void;
  custom?: string;
  onCustom?: (v: string) => void;
}) {
  return (
    <div>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="How are you arriving"
      >
        {EMOTIONS.map((emotion) => {
          const active = value === emotion;
          return (
            <button
              key={emotion}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(emotion)}
              className={cn(
                "min-h-11 rounded-full border px-4 py-2 text-sm transition-colors",
                active
                  ? "border-charcoal bg-charcoal font-medium text-ivory"
                  : "border-border bg-surface text-charcoal-soft hover:border-line-strong hover:text-ink",
              )}
            >
              {emotion}
            </button>
          );
        })}
      </div>
      {onCustom ? (
        <label className="mt-4 block">
          <span className="sr-only">Something else</span>
          <input
            value={custom ?? ""}
            onChange={(e) => onCustom(e.target.value)}
            placeholder="Something else"
            className="w-full border-0 border-b border-border bg-transparent py-2 text-base text-ink placeholder:text-muted focus-visible:outline-none"
          />
        </label>
      ) : null}
    </div>
  );
}
