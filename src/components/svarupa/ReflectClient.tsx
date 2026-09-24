"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { completeSessionAction, createSitAction } from "@/app/actions";
import { ConversationMessage, InsightCard } from "@/components/svarupa/Conversation";
import { ErrorState } from "@/components/svarupa/ErrorState";
import { LoadingState } from "@/components/svarupa/LoadingState";
import { ReflectionComposer } from "@/components/svarupa/ReflectionComposer";
import { parseJson } from "@/lib/utils";

type Msg = {
  id: string;
  role: string;
  content: string;
  chips: string | null;
  kind: string;
  meta: string | null;
};

export function ReflectClient({
  sessionId,
  initialMessages,
  insight,
}: {
  sessionId: string;
  initialMessages: Msg[];
  insight?: {
    emotion?: string | null;
    trigger?: string | null;
    concern?: string | null;
    theme?: string | null;
    summary?: string | null;
  } | null;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [localInsight, setLocalInsight] = useState(insight);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<string | null>(null);

  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    setOffline(!navigator.onLine);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  async function send(text: string) {
    if (busy) return;
    setBusy(true);
    setError(null);
    setLastAttempt(text);
    const optimistic: Msg = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      chips: null,
      kind: "text",
      meta: null,
    };
    setMessages((m) => [...m, optimistic]);
    try {
      const res = await fetch("/api/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: text }),
      });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.content,
          chips: data.chips ? JSON.stringify(data.chips) : null,
          kind: data.kind,
          meta: JSON.stringify(data),
        },
      ]);
      if (data.insight) setLocalInsight(data.insight);
      router.refresh();
    } catch {
      setError("Something interrupted the conversation.");
    } finally {
      setBusy(false);
    }
  }

  async function onChip(chip: string) {
    if (chip === "Sit with this" || ["1 min", "3 min", "5 min", "10 min"].includes(chip)) {
      const last = messages.at(-1);
      const meta = parseJson<{ sitQuestion?: string }>(last?.meta, {});
      const q =
        meta.sitQuestion ||
        "What are you trying to control that may not be yours to control?";
      await createSitAction(q);
      return;
    }
    if (chip === "Write in the journal" || chip === "Write instead") {
      router.push("/journal/new");
      return;
    }
    if (chip === "Read the verse" || chip === "Understand the teaching" || chip === "Explore interpretations") {
      const last = [...messages].reverse().find((m) => m.kind === "wisdom");
      const meta = parseJson<{ verseSlug?: string }>(last?.meta, {});
      if (meta.verseSlug) {
        router.push(`/wisdom/verse/${meta.verseSlug}`);
        return;
      }
      router.push("/wisdom");
      return;
    }
    if (chip === "That's enough for now" || chip === "Come back later") {
      await completeSessionAction(sessionId);
      router.push("/home");
      return;
    }
    await send(chip);
  }

  return (
    <div className="space-y-10">
      {offline ? (
        <p className="surface-card px-4 py-3 text-body-sm" role="status">
          You're offline. Your saved reflections are still available.
        </p>
      ) : null}
      {messages.map((m) => (
        <ConversationMessage
          key={m.id}
          role={m.role}
          content={m.content}
          kind={m.kind}
          chips={parseJson<string[] | undefined>(m.chips, undefined)}
          onChip={m.role === "assistant" ? onChip : undefined}
        />
      ))}
      {busy ? <LoadingState label="Reflecting…" /> : null}
      {error ? (
        <ErrorState
          title={error}
          body="You can try the last thought again, or leave this for later."
          onRetry={() => lastAttempt && void send(lastAttempt)}
          backHref="/reflect"
          backLabel="Leave quietly"
        />
      ) : null}
      {localInsight ? <InsightCard {...localInsight} /> : null}
      <ReflectionComposer
        placeholder="Take your time."
        submitLabel="Send"
        onSubmit={send}
        sticky
      />
    </div>
  );
}
