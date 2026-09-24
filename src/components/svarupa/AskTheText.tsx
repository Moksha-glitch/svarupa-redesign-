"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";

const SUGGESTIONS = [
  "Why does this verse say this?",
  "What does this verse mean in context?",
  "How does Advaita interpret this?",
  "What does this teaching have to do with attachment?",
];

export function AskTheText({ verseId }: { verseId: string }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<{ content: string; sources: { label: string; citation: string }[] } | null>(null);
  const [pending, setPending] = useState(false);

  async function ask(q: string) {
    setPending(true);
    setQuestion(q);
    const res = await fetch("/api/ask-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verseId, question: q }),
    });
    const data = await res.json();
    setAnswer(data);
    setPending(false);
  }

  return (
    <section className="surface-card p-6 sm:p-8">
      <h2 className="text-h2">Ask the text</h2>
      <p className="mt-2 text-muted">Answers stay with this verse and its sources. No invented lines.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            className="min-h-11 rounded-full border border-border px-3 py-1.5 text-sm"
            onClick={() => void ask(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <form
        className="mt-4"
        onSubmit={(e) => {
          e.preventDefault();
          void ask(question);
        }}
      >
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask in your own words"
          className="min-h-24"
        />
        <Button type="submit" className="mt-3" disabled={pending || !question.trim()}>
          {pending ? "Looking…" : "Ask"}
        </Button>
      </form>
      {answer?.content ? (
        <div className="prose-svarupa mt-6 whitespace-pre-wrap">{answer.content}</div>
      ) : null}
      {answer?.sources?.length ? (
        <ul className="mt-6 space-y-1 text-sm text-muted">
          {answer.sources.map((s) => (
            <li key={s.label + s.citation}>
              <span className="text-charcoal-soft">{s.label}:</span> {s.citation}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
