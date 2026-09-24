"use client";

import { useState } from "react";
import { CommentaryCard } from "./VerseReader";

export function DepthToggle({
  simple,
  deep,
}: {
  simple: string;
  deep: string;
}) {
  const [mode, setMode] = useState<"simple" | "deep">("simple");
  return (
    <div>
      <div className="flex gap-2" role="group" aria-label="Reading depth">
        <button
          type="button"
          aria-pressed={mode === "simple"}
          onClick={() => setMode("simple")}
          className={`min-h-11 rounded-full border px-4 text-sm ${mode === "simple" ? "border-charcoal bg-stone font-medium" : "border-border"}`}
        >
          Simple
        </button>
        <button
          type="button"
          aria-pressed={mode === "deep"}
          onClick={() => setMode("deep")}
          className={`min-h-11 rounded-full border px-4 text-sm ${mode === "deep" ? "border-charcoal bg-stone font-medium" : "border-border"}`}
        >
          Deep
        </button>
      </div>
      <div className="mt-6">
        {mode === "simple" ? (
          <CommentaryCard kind="modern" tradition="SVARUPA reflection" body={simple} />
        ) : (
          <CommentaryCard kind="traditional" tradition="Traditional perspective" body={deep} />
        )}
      </div>
    </div>
  );
}
