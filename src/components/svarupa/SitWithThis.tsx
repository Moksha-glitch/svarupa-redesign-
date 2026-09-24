"use client";

import { useEffect, useMemo, useState } from "react";
import { finishSitAction } from "@/app/actions";
import { cn } from "@/lib/utils";

const DURATIONS = [1, 3, 5, 10];

export function BreathingTimer({
  durationMin = 3,
  label = "Breathe",
}: {
  durationMin?: number;
  label?: string;
}) {
  const total = durationMin * 60;
  const [remaining, setRemaining] = useState(total);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const m = Math.floor(remaining / 60);
  const s = String(remaining % 60).padStart(2, "0");

  return (
    <div className="flex flex-col items-center py-10">
      <div className="relative grid size-52 place-items-center">
        <span className="animate-breathe absolute inset-0 rounded-full border border-copper/30" />
        <span className="animate-breathe absolute inset-6 rounded-full border border-terracotta/25 [animation-delay:1.2s]" />
        <p className="font-serif text-4xl tabular-nums text-ink">
          {m}:{s}
        </p>
      </div>
      <p className="mt-6 text-muted">{label}</p>
      <button
        type="button"
        className="mt-6 text-sm text-charcoal-soft underline-offset-4 hover:underline"
        onClick={() => {
          if (remaining === 0) setRemaining(total);
          setRunning((v) => !v);
        }}
      >
        {remaining === 0 ? "Begin again" : running ? "Pause" : "Begin"}
      </button>
    </div>
  );
}

export function SitWithThis({
  question,
  sitId,
}: {
  question: string;
  sitId: string;
}) {
  const [duration, setDuration] = useState(3);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [writing, setWriting] = useState("");
  const [remaining, setRemaining] = useState(180);
  const total = useMemo(() => duration * 60, [duration]);

  useEffect(() => {
    setRemaining(total);
  }, [total]);

  useEffect(() => {
    if (!started || done) return;
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setDone(true);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [started, done]);

  const quiet = started && remaining / total < 0.45;

  return (
    <div
      className={cn(
        "mx-auto flex min-h-[70dvh] max-w-2xl flex-col items-center justify-center px-4 text-center transition-opacity duration-[4000ms]",
        quiet && "opacity-70",
      )}
    >
      <p className="text-xs tracking-[0.2em] text-copper uppercase">Sit with this</p>
      <h1 className="mt-6 font-serif text-3xl leading-snug text-ink sm:text-4xl">{question}</h1>
      {!started ? (
        <>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                aria-pressed={duration === d}
                className={cn(
                  "min-h-11 rounded-full border px-4 py-2 text-sm",
                  duration === d
                    ? "border-charcoal bg-charcoal font-medium text-ivory"
                    : "border-border",
                )}
              >
                {d} min
              </button>
            ))}
          </div>
          <button
            type="button"
            className="mt-8 min-h-12 rounded-xl bg-charcoal px-6 py-3 text-ivory"
            onClick={() => setStarted(true)}
          >
            Begin
          </button>
        </>
      ) : null}
      {started && !done ? (
        <p className="mt-12 font-serif text-2xl tabular-nums text-muted">
          {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}
        </p>
      ) : null}
      {done ? (
        <form
          className="mt-12 w-full text-left"
          onSubmit={(e) => {
            e.preventDefault();
            void finishSitAction(sitId, duration, writing);
          }}
        >
          <label htmlFor="came-up" className="font-serif text-2xl text-ink">
            What came up?
          </label>
          <textarea
            id="came-up"
            value={writing}
            onChange={(e) => setWriting(e.target.value)}
            className="writing-surface mt-4 min-h-40 w-full px-5 py-4 text-lg"
            placeholder="Nothing has to be complete."
          />
          <button
            type="submit"
            className="mt-4 min-h-12 rounded-xl bg-charcoal px-5 py-3 text-ivory"
          >
            Keep this
          </button>
        </form>
      ) : null}
    </div>
  );
}
