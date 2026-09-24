"use client";

import { useRouter } from "next/navigation";
import { saveJournalAction } from "@/app/actions";
import { JournalComposer } from "@/components/svarupa/JournalComposer";

type JournalDraft = {
  howIArrived?: string | null;
  whatHappened?: string | null;
  whatIFelt?: string | null;
  whatINoticed?: string | null;
  whatIWantToRemember?: string | null;
  freeWrite?: string | null;
};

export function NewJournalClient({
  id,
  prompts,
  initial,
}: {
  id?: string | null;
  prompts: string[];
  initial?: JournalDraft;
}) {
  const router = useRouter();
  return (
    <JournalComposer
      prompts={prompts}
      initial={initial}
      onSave={async (data) => {
        const saved = await saveJournalAction(id ?? null, data);
        router.push(`/journal/${saved}`);
      }}
    />
  );
}
