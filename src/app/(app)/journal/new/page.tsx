import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NewJournalClient } from "@/components/svarupa/NewJournalClient";

export const metadata = { robots: { index: false, follow: false } };

export default async function NewJournalPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  const prompts = await db.journalPrompt.findMany();
  return (
    <div>
      <h1 className="text-h1">Write</h1>
      <p className="mt-2 text-muted">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
      <div className="mt-10">
        <NewJournalClient prompts={prompts.map((p) => p.text)} />
      </div>
    </div>
  );
}
