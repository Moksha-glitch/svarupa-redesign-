"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

function parseSections(content: string) {
  const lines = content.split("\n");
  const sections: { title?: string; body: string }[] = [];
  let current: { title?: string; body: string } = { body: "" };

  for (const line of lines) {
    const heading = line.match(/^(?:#{2,3}\s+|\*\*)(.+?)(?:\*\*)?$/);
    if (heading && (line.startsWith("##") || (line.startsWith("**") && line.endsWith("**") && line.length < 64))) {
      if (current.body.trim() || current.title) sections.push(current);
      current = { title: heading[1].replace(/\*\*/g, "").trim(), body: "" };
    } else {
      current.body += `${line}\n`;
    }
  }
  if (current.body.trim() || current.title) sections.push(current);
  return sections.length ? sections : [{ body: content }];
}

function renderInline(content: string) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-medium text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function ConversationMessage({
  role,
  content,
  chips,
  onChip,
  kind,
}: {
  role: string;
  content: string;
  chips?: string[];
  onChip?: (chip: string) => void;
  kind?: string;
}) {
  const isUser = role === "user";
  const sections = !isUser ? parseSections(content) : [{ body: content }];
  const long = !isUser && content.length > 520 && sections.length === 1;
  const [expanded, setExpanded] = useState(!long);
  const shown = expanded ? sections : [{ body: `${content.slice(0, 360).trim()}…` }];

  return (
    <article className={cn("animate-fade-up max-w-2xl", isUser ? "ml-auto" : "mr-auto w-full")}>
      {!isUser ? (
        <p className="text-caption mb-3">{kind === "crisis" ? "Care" : "SVARUPA"}</p>
      ) : null}
      <div
        className={cn(
          "whitespace-pre-wrap text-[1.05rem] leading-[1.8]",
          isUser
            ? "rounded-[1.4rem] bg-stone px-5 py-4 text-ink"
            : kind === "crisis"
              ? "rounded-[1.4rem] border border-terracotta/30 bg-surface px-5 py-4 text-charcoal"
              : kind === "wisdom"
                ? "border-l-2 border-copper/50 pl-5 text-charcoal-soft"
                : "bg-transparent px-0 text-charcoal-soft",
        )}
      >
        {shown.map((section, index) => (
          <div key={`${section.title ?? "body"}-${index}`} className={index ? "mt-6" : undefined}>
            {section.title ? <h3 className="mb-2 text-h3">{section.title}</h3> : null}
            {renderInline(section.body.trim())}
          </div>
        ))}
      </div>
      {long ? (
        <button
          type="button"
          className="mt-3 text-sm text-charcoal-soft underline-offset-4 hover:underline"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      ) : null}
      {chips?.length && onChip ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => onChip(chip)}
              className="min-h-11 rounded-full border border-border bg-surface px-4 py-2 text-sm text-charcoal-soft transition-colors hover:border-line-strong hover:text-ink"
            >
              {chip}
            </button>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export function InsightCard({
  emotion,
  trigger,
  concern,
  theme,
  summary,
}: {
  emotion?: string | null;
  trigger?: string | null;
  concern?: string | null;
  theme?: string | null;
  summary?: string | null;
}) {
  const rows = [
    ["Emotion", emotion],
    ["Trigger", trigger],
    ["Underlying concern", concern],
    ["Theme", theme],
  ].filter(([, v]) => v);
  return (
    <section className="surface-card p-7">
      <p className="text-caption">What surfaced</p>
      <h2 className="mt-2 text-h2">A working name, not a verdict</h2>
      <dl className="mt-6 space-y-4">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-label">{k}</dt>
            <dd className="text-lg text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      {summary ? <p className="mt-6 text-body">{summary}</p> : null}
    </section>
  );
}
