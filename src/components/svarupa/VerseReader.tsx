"use client";

import { useState } from "react";
import { ThemeChip } from "./ThemeChip";
import { cn } from "@/lib/utils";

const SIZES = ["text-base", "text-lg", "text-xl"] as const;
const HEIGHTS = ["leading-relaxed", "leading-loose", "leading-[2]"] as const;

export function VerseReader({
  citation,
  chapterTitle,
  sanskrit,
  transliteration,
  translation,
  translator,
  context,
  themes,
  provenance,
}: {
  citation: string;
  chapterTitle?: string;
  sanskrit: string;
  transliteration: string;
  translation: string;
  translator: string;
  context: string;
  themes?: string[];
  provenance: string;
}) {
  const [showSanskrit, setShowSanskrit] = useState(true);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [size, setSize] = useState(1);
  const [height, setHeight] = useState(1);

  return (
    <article className="space-y-10">
      {chapterTitle ? <p className="text-caption">{chapterTitle}</p> : null}
      <h1 className="text-h1">{citation}</h1>
      {provenance !== "verified" ? (
        <p className="rounded-xl border border-border bg-surface-subtle px-4 py-3 text-body-sm">
          This item is labelled placeholder and should not be treated as a verified verse.
        </p>
      ) : (
        <p className="text-body-sm">Source: verified public-domain translation.</p>
      )}

      <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Reading options">
        <Toggle pressed={showSanskrit} onClick={() => setShowSanskrit((v) => !v)}>
          Sanskrit
        </Toggle>
        <Toggle pressed={showTransliteration} onClick={() => setShowTransliteration((v) => !v)}>
          Transliteration
        </Toggle>
        <Toggle pressed={showTranslation} onClick={() => setShowTranslation((v) => !v)}>
          Translation
        </Toggle>
        <button
          type="button"
          className="min-h-11 rounded-full border border-border px-3 text-sm"
          onClick={() => setSize((n) => (n + 1) % SIZES.length)}
        >
          Text size
        </button>
        <button
          type="button"
          className="min-h-11 rounded-full border border-border px-3 text-sm"
          onClick={() => setHeight((n) => (n + 1) % HEIGHTS.length)}
        >
          Line height
        </button>
      </div>

      <div className={cn("space-y-10", SIZES[size], HEIGHTS[height])}>
        {showSanskrit ? (
          <section>
            <h2 className="text-caption">Original text</h2>
            <p className="text-scripture mt-3">{sanskrit}</p>
          </section>
        ) : null}
        {showTransliteration ? (
          <section>
            <h2 className="text-caption">Transliteration</h2>
            <p className="mt-3 italic text-charcoal-soft">{transliteration}</p>
          </section>
        ) : null}
        {showTranslation ? (
          <section>
            <h2 className="text-caption">Translation</h2>
            <p className="mt-3 text-quote">“{translation}”</p>
            <p className="mt-3 text-body-sm">Translation · {translator}</p>
          </section>
        ) : null}
        <section>
          <h2 className="text-caption">Context</h2>
          <p className="prose-svarupa mt-3">{context}</p>
        </section>
      </div>
      {themes?.length ? (
        <section>
          <h2 className="text-caption">Related themes</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {themes.map((t) => (
              <ThemeChip key={t} label={t} href={`/wisdom?theme=${encodeURIComponent(t)}`} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}

function Toggle({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-full border px-3 text-sm",
        pressed ? "border-charcoal bg-stone font-medium text-ink" : "border-border text-muted",
      )}
    >
      {children}
    </button>
  );
}

export function CommentaryCard({
  kind,
  tradition,
  author,
  body,
  citation,
}: {
  kind: string;
  tradition: string;
  author?: string | null;
  body: string;
  citation?: string | null;
}) {
  const label =
    kind === "traditional"
      ? "Traditional commentary"
      : kind === "modern"
        ? "SVARUPA reflection"
        : "AI-generated reflection";
  return (
    <article
      className={cn(
        "p-6",
        kind === "traditional"
          ? "rounded-[1.5rem] border border-border bg-surface"
          : kind === "modern"
            ? "rounded-[1.5rem] border-l-2 border-copper/50 bg-surface-subtle"
            : "rounded-[1.5rem] border border-dashed border-border bg-surface",
      )}
    >
      <p className="text-caption">{label}</p>
      <p className="mt-2 text-body-sm">
        {tradition}
        {author ? ` · ${author}` : ""}
      </p>
      <p className="mt-4 text-body">{body}</p>
      {citation ? <p className="mt-3 text-xs text-muted">Reference · {citation}</p> : null}
    </article>
  );
}
