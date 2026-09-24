"use client";

import { useMemo, useState } from "react";
import { startReflectionAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { suggestionsAfterCompletedWord } from "@/lib/composer-prompts";
import { cn } from "@/lib/utils";

export function ReflectionComposer({
  onSubmit = startReflectionAction,
  placeholder = "What's on your mind?",
  submitLabel = "Start reflecting",
  secondary,
  sticky = false,
}: {
  onSubmit?: (text: string) => void | Promise<void>;
  placeholder?: string;
  submitLabel?: string;
  secondary?: React.ReactNode;
  sticky?: boolean;
}) {
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [dismissed, setDismissed] = useState<string | null>(null);

  const cue = useMemo(() => suggestionsAfterCompletedWord(text), [text]);
  const suggestions = cue && dismissed !== cue.key ? cue.questions : [];

  async function submit(value = text) {
    const next = value.trim();
    if (!next || pending) return;
    setPending(true);
    try {
      await onSubmit(next);
      setText("");
      setDismissed(null);
    } finally {
      setPending(false);
    }
  }

  function useQuestion(question: string) {
    setText((current) => {
      const trimmed = current.trim();
      if (!trimmed) return question;
      if (trimmed.includes(question)) return trimmed;
      return `${trimmed}\n\n${question}`;
    });
  }

  return (
    <div
      className={cn(
        "writing-surface p-4 sm:p-5",
        sticky && "sticky bottom-[4.75rem] z-20 lg:static lg:bottom-auto",
      )}
    >
      <label className="sr-only" htmlFor="reflection-composer">
        {placeholder}
      </label>
      <Textarea
        id="reflection-composer"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setDismissed(null);
        }}
        placeholder={placeholder}
        className="min-h-28 resize-y border-0 bg-transparent shadow-none focus-visible:outline-none"
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void submit();
        }}
        aria-describedby={suggestions.length ? "composer-suggestions" : undefined}
      />
      {suggestions.length ? (
        <div id="composer-suggestions" className="animate-fade-up mt-4">
          <p className="text-caption mb-2">About “{cue?.word}”</p>
          <ul className="flex flex-wrap gap-2" aria-label="Suggested questions">
            {suggestions.map((question) => (
              <li key={question}>
                <button
                  type="button"
                  onClick={() => useQuestion(question)}
                  className="min-h-11 max-w-full rounded-full border border-border bg-surface px-4 py-2 text-left text-sm text-charcoal-soft transition-colors hover:border-line-strong hover:text-ink"
                >
                  {question}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-2 text-xs text-muted underline-offset-4 hover:underline"
            onClick={() => cue && setDismissed(cue.key)}
          >
            Hide these
          </button>
        </div>
      ) : null}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button type="button" onClick={() => void submit()} disabled={pending || !text.trim()}>
          {pending ? "Listening…" : submitLabel}
        </Button>
        {secondary}
      </div>
    </div>
  );
}
