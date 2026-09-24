"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/svarupa/EmptyState";
import { PageHeader } from "@/components/svarupa/PageHeader";

type Result = { type: string; title: string; href: string; body: string };

const SUGGESTIONS = ["attachment", "dharma", "fear", "purpose", "breath"];
const RECENTS_KEY = "svarupa-recent-searches";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [pending, setPending] = useState(false);
  const [recents, setRecents] = useState<string[]>([]);

  useEffect(() => {
    try {
      setRecents(JSON.parse(localStorage.getItem(RECENTS_KEY) || "[]"));
    } catch {
      setRecents([]);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (q.trim().length < 2) {
        setResults([]);
        setPending(false);
        return;
      }
      setPending(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
      setPending(false);
      const next = [q.trim(), ...recents.filter((item) => item !== q.trim())].slice(0, 5);
      setRecents(next);
      localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
    }, 220);
    return () => clearTimeout(t);
  }, [q]);

  const groups = results.reduce<Record<string, Result[]>>((acc, item) => {
    acc[item.type] = acc[item.type] || [];
    acc[item.type].push(item);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        title="Search"
        description="Scripture, ideas, practices — and your private pages, only for you."
      />
      <label className="sr-only" htmlFor="global-search">
        Search SVARUPA
      </label>
      <input
        id="global-search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="attachment, dharma, fear, purpose…"
        className="writing-surface mt-8 h-14 w-full px-5 text-lg"
        autoFocus
      />
      {!q ? (
        <div className="mt-8 space-y-6">
          <div>
            <p className="text-label">Try</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="min-h-11 rounded-full border border-border px-4 text-sm"
                  onClick={() => setQ(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          {recents.length ? (
            <div>
              <p className="text-label">Recent</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {recents.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="min-h-11 rounded-full border border-border px-4 text-sm"
                    onClick={() => setQ(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
      {pending ? <p className="mt-8 text-body-sm">Looking…</p> : null}
      {!pending && q.trim().length >= 2 && !results.length ? (
        <div className="mt-8">
          <EmptyState
            title="Nothing matched exactly."
            body="Try searching for a feeling, question, concept or text."
          />
        </div>
      ) : null}
      <div className="mt-8 space-y-8">
        {Object.entries(groups).map(([type, items]) => (
          <section key={type}>
            <h2 className="text-caption">{type}</h2>
            <ul className="mt-3 space-y-3">
              {items.map((r) => (
                <li key={r.href + r.title}>
                  <Link href={r.href} className="block surface-card p-5 transition-colors hover:border-line-strong">
                    <p className="text-h3">{r.title}</p>
                    <p className="mt-1 line-clamp-2 text-muted">{r.body}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
