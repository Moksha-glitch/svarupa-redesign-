"use client";

import { useEffect, useState } from "react";
import { completePracticeAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { EmotionSelector } from "@/components/svarupa/EmotionSelector";
import { cn } from "@/lib/utils";

export function PracticePlayer({
  practiceId,
  title,
  durationMin,
  guidance,
}: {
  practiceId: string;
  title: string;
  durationMin: number;
  guidance: string;
}) {
  const total = durationMin * 60;
  const [open, setOpen] = useState(false);
  const [remaining, setRemaining] = useState(total);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [emotion, setEmotion] = useState<string>();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!running || done) return;
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setDone(true);
          setRunning(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, done]);

  const m = Math.floor(remaining / 60);
  const s = String(remaining % 60).padStart(2, "0");

  async function finish() {
    await completePracticeAction(practiceId, durationMin);
    setSaved(true);
  }

  if (!open) {
    return (
      <Button type="button" onClick={() => setOpen(true)}>
        Begin
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background paper-grain">
      <div className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center px-6 py-10 text-center">
        <p className="text-caption">{title}</p>
        <p className="mt-2 text-body-sm">{durationMin} minutes</p>
        {!done ? (
          <>
            <p className="mt-8 text-body-lg">Prepare yourself.</p>
            <p className="measure mt-3 text-body">{guidance}</p>
            <div className="relative mt-12 grid size-52 place-items-center">
              <span className="animate-breathe absolute inset-0 rounded-full border border-copper/30" />
              <span className="animate-breathe absolute inset-6 rounded-full border border-terracotta/25 [animation-delay:1.2s]" />
              <p className="font-serif text-4xl tabular-nums text-ink">
                {m}:{s}
              </p>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  if (remaining === 0) setRemaining(total);
                  setRunning((v) => !v);
                }}
              >
                {remaining === 0 ? "Begin again" : running ? "Pause" : "Begin"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Leave quietly
              </Button>
            </div>
          </>
        ) : (
          <div className="w-full text-left">
            <h2 className="text-h2 text-center">Practice complete.</h2>
            <p className="mt-3 text-center text-body">How do you feel now?</p>
            <div className={cn("mt-8")}>
              <EmotionSelector value={emotion} onChange={setEmotion} />
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button type="button" disabled={saved} onClick={() => void finish()}>
                {saved ? "Kept" : "Keep this"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Return
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
