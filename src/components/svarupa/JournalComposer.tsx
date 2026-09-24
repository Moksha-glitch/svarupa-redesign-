"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";

export function JournalComposer({
  initial,
  prompts,
  onSave,
}: {
  initial?: {
    howIArrived?: string | null;
    whatHappened?: string | null;
    whatIFelt?: string | null;
    whatINoticed?: string | null;
    whatIWantToRemember?: string | null;
    freeWrite?: string | null;
  };
  prompts?: string[];
  onSave: (data: {
    howIArrived: string;
    whatHappened: string;
    whatIFelt: string;
    whatINoticed: string;
    whatIWantToRemember: string;
    freeWrite: string;
  }) => void | Promise<void>;
}) {
  const [form, setForm] = useState({
    howIArrived: initial?.howIArrived ?? "",
    whatHappened: initial?.whatHappened ?? "",
    whatIFelt: initial?.whatIFelt ?? "",
    whatINoticed: initial?.whatINoticed ?? "",
    whatIWantToRemember: initial?.whatIWantToRemember ?? "",
    freeWrite: initial?.freeWrite ?? "",
  });
  const [pending, setPending] = useState(false);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const savedTimer = useRef<number | null>(null);

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setStatus("saving");
  }

  useEffect(() => {
    if (status !== "saving") return;
    if (savedTimer.current) window.clearTimeout(savedTimer.current);
    savedTimer.current = window.setTimeout(() => setStatus("saved"), 600);
    return () => {
      if (savedTimer.current) window.clearTimeout(savedTimer.current);
    };
  }, [form, status]);

  const words = Object.values(form).join(" ").trim().split(/\s+/).filter(Boolean).length;

  return (
    <form
      className="space-y-8"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        await onSave(form);
        setPending(false);
        setStatus("saved");
      }}
    >
      <div className="flex items-center justify-between text-body-sm">
        <p>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
        <p aria-live="polite">{status === "saved" ? "Saved" : status === "saving" ? "Saving…" : `${words} words`}</p>
      </div>
      {prompts?.length ? (
        <div>
          <p className="text-label">A prompt, if you want one</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {prompts.slice(0, 4).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPrompt(p)}
                className="min-h-11 rounded-full border border-border px-3 py-1.5 text-left text-sm text-charcoal-soft hover:border-line-strong"
              >
                {p}
              </button>
            ))}
          </div>
          {prompt ? <p className="mt-4 text-quote">{prompt}</p> : null}
        </div>
      ) : null}
      {(
        [
          ["howIArrived", "How I arrived"],
          ["whatHappened", "What happened"],
          ["whatIFelt", "What I felt"],
          ["whatINoticed", "What I noticed"],
          ["whatIWantToRemember", "What I want to remember"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="block">
          <span className="text-label">{label}</span>
          <Textarea
            value={form[key]}
            onChange={(e) => set(key, e.target.value)}
            className="mt-2 min-h-24"
          />
        </label>
      ))}
      <label className="block">
        <span className="text-label">Free writing</span>
        <Textarea
          value={form.freeWrite}
          onChange={(e) => set("freeWrite", e.target.value)}
          className="mt-2 min-h-48"
          placeholder="Start with one honest sentence."
        />
      </label>
      <Button type="submit" disabled={pending}>
        {pending ? "Keeping…" : "Keep this private"}
      </Button>
    </form>
  );
}
