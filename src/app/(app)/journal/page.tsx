import Link from "next/link";
import { redirect } from "next/navigation";
import { JournalCard } from "@/components/svarupa/Cards";
import { EmptyState } from "@/components/svarupa/EmptyState";
import { PageHeader } from "@/components/svarupa/PageHeader";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { excerpt, formatLongDate } from "@/lib/utils";

export const metadata = { robots: { index: false, follow: false } };

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; saved?: string }>;
}) {
  const user = await getSession();
  if (!user) redirect("/login");
  const { q } = await searchParams;
  const entries = await db.journalEntry.findMany({
    where: {
      userId: user.id,
      ...(q
        ? {
            OR: [
              { freeWrite: { contains: q } },
              { whatIFelt: { contains: q } },
              { whatHappened: { contains: q } },
              { whatINoticed: { contains: q } },
            ],
          }
        : {}),
    },
    include: { themes: { include: { theme: true } } },
    orderBy: { date: "desc" },
  });
  return (
    <div>
      <PageHeader
        title="Journal"
        description="Private by default. Only you can see this."
        action={
          <Link
            href="/journal/new"
            className="inline-flex min-h-11 items-center rounded-xl bg-charcoal px-4 text-ivory"
          >
            Write something
          </Link>
        }
      />
      <form className="mt-8">
        <label className="sr-only" htmlFor="journal-search">
          Search your pages
        </label>
        <input
          id="journal-search"
          name="q"
          defaultValue={q}
          placeholder="Search your pages"
          className="writing-surface h-12 w-full px-4"
        />
      </form>
      <div className="mt-10 space-y-4">
        {entries.length ? (
          entries.map((e) => (
            <JournalCard
              key={e.id}
              date={formatLongDate(e.date)}
              excerpt={excerpt(e.whatIFelt || e.freeWrite || e.whatHappened || "A private page.")}
              href={`/journal/${e.id}`}
              favorite={e.favorite}
              tags={e.themes.map((t) => t.theme.name)}
            />
          ))
        ) : (
          <EmptyState
            title="Your journal is empty."
            body="Start with one honest sentence."
            action="Write something"
            href="/journal/new"
          />
        )}
      </div>
    </div>
  );
}
