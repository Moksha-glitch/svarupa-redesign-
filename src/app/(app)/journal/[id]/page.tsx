import { notFound, redirect } from "next/navigation";
import { deleteJournalAction, toggleFavoriteAction } from "@/app/actions";
import { Breadcrumb } from "@/components/svarupa/Breadcrumb";
import { NewJournalClient } from "@/components/svarupa/NewJournalClient";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatLongDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const metadata = { robots: { index: false, follow: false } };

export default async function JournalEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user) redirect("/login");
  const { id } = await params;
  const entry = await db.journalEntry.findFirst({ where: { id, userId: user.id } });
  if (!entry) notFound();
  const prompts = await db.journalPrompt.findMany();
  const blocks = [
    ["How I arrived", entry.howIArrived],
    ["What happened", entry.whatHappened],
    ["What I felt", entry.whatIFelt],
    ["What I noticed", entry.whatINoticed],
    ["What I want to remember", entry.whatIWantToRemember],
  ].filter(([, v]) => v);

  return (
    <article className="space-y-10">
      <Breadcrumb
        items={[
          { href: "/journal", label: "Journal" },
          { label: formatLongDate(entry.date) },
        ]}
      />
      <header>
        <p className="text-label">{formatLongDate(entry.date)}</p>
        {entry.sitQuestion ? <p className="mt-4 text-quote">{entry.sitQuestion}</p> : null}
        <h1 className="mt-4 text-h1">{entry.whatIWantToRemember || entry.whatIFelt || "A private page"}</h1>
      </header>
      {entry.freeWrite ? <p className="text-body-lg whitespace-pre-wrap">{entry.freeWrite}</p> : null}
      {blocks.map(([label, value]) => (
        <section key={label} className="border-t border-border pt-6">
          <h2 className="text-label">{label}</h2>
          <p className="mt-2 text-body whitespace-pre-wrap">{value}</p>
        </section>
      ))}
      <div className="flex gap-3">
        <form action={toggleFavoriteAction.bind(null, entry.id)}>
          <Button variant="secondary" type="submit">
            {entry.favorite ? "Remove from kept" : "Keep"}
          </Button>
        </form>
        <form action={deleteJournalAction.bind(null, entry.id)}>
          <Button variant="ghost" type="submit">
            Delete
          </Button>
        </form>
      </div>
      <section>
        <h2 className="text-h2">Continue writing</h2>
        <div className="mt-6">
          <NewJournalClient id={entry.id} prompts={prompts.map((p) => p.text)} initial={entry} />
        </div>
      </section>
    </article>
  );
}
