import Link from "next/link";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/svarupa/EmptyState";
import { InnerMap, WeeklyReflectionView } from "@/components/svarupa/InnerMap";
import { PageHeader } from "@/components/svarupa/PageHeader";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { logoutAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

export const metadata = { robots: { index: false, follow: false } };

export default async function MePage() {
  const user = await getSession();
  if (!user) redirect("/login");
  const [sadhana, stats, weekly, saved, journals, reflections] = await Promise.all([
    db.sadhana.findFirst({ where: { userId: user.id, status: "active" } }),
    db.userThemeStat.findMany({
      where: { userId: user.id },
      include: { theme: true },
    }),
    db.weeklyReflection.findMany({ where: { userId: user.id }, orderBy: { weekStart: "desc" }, take: 1 }),
    db.savedWisdom.findMany({
      where: { userId: user.id },
      include: { verse: true },
      take: 5,
    }),
    db.journalEntry.count({ where: { userId: user.id } }),
    db.reflectionSession.count({ where: { userId: user.id } }),
  ]);
  const rolled = Object.values(
    stats.reduce<Record<string, { name: string; count: number }>>((acc, s) => {
      acc[s.themeId] = acc[s.themeId] || { name: s.theme.name, count: 0 };
      acc[s.themeId].count += s.count;
      return acc;
    }, {}),
  ).sort((a, b) => b.count - a.count);

  return (
    <div className="page-stack">
      <PageHeader title="Profile" description={user.name || user.email || "Your space"} />

      <section className="grid gap-3 sm:grid-cols-3">
        <Link href="/journal" className="surface-card p-5 transition-colors hover:border-line-strong">
          <p className="text-label">Journal</p>
          <p className="mt-2 text-body">{journals ? `${journals} private pages` : "Nothing written yet"}</p>
        </Link>
        <Link href="/reflect" className="surface-card p-5 transition-colors hover:border-line-strong">
          <p className="text-label">Reflections</p>
          <p className="mt-2 text-body">{reflections ? `${reflections} conversations` : "A place to begin"}</p>
        </Link>
        <Link href="/me/inner-map" className="surface-card p-5 transition-colors hover:border-line-strong">
          <p className="text-label">Your reflections</p>
          <p className="mt-2 text-body">{rolled.length ? "Themes you've returned to" : "Patterns will appear over time"}</p>
        </Link>
      </section>

      {sadhana ? (
        <section>
          <h2 className="text-h2">Current Sadhana</h2>
          <Link href={`/practice/sadhana/${sadhana.id}`} className="mt-4 block surface-card p-6">
            <p className="text-h3">{sadhana.name}</p>
            <p className="mt-1 text-muted">
              {sadhana.durationMin} minutes · {sadhana.timeOfDay}
            </p>
          </Link>
        </section>
      ) : (
        <EmptyState
          title="Your practice starts small."
          body="A daily Sadhana can wait until something feels natural."
          action="Explore practices"
          href="/practice"
        />
      )}

      <section>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-h2">Themes you've returned to</h2>
          <Link href="/me/inner-map" className="text-sm text-copper underline-offset-4 hover:underline">
            Inner map
          </Link>
        </div>
        {rolled.length ? (
          <>
            <div className="mt-6">
              <InnerMap items={rolled.slice(0, 5)} />
            </div>
            <p className="mt-4 text-body-sm">
              These are themes appearing frequently in your reflections. They are not diagnoses or conclusions.
            </p>
          </>
        ) : (
          <p className="mt-4 text-body">Patterns will gather here as you return.</p>
        )}
      </section>

      <section>
        <h2 className="text-h2">Saved wisdom</h2>
        {saved.length ? (
          <ul className="mt-4 space-y-2">
            {saved.map((s) => (
              <li key={s.id}>
                <Link href={`/wisdom/verse/${s.verseId}`} className="underline-offset-4 hover:underline">
                  {s.verse?.citation}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-body">Nothing saved yet. When something speaks to you, keep it here.</p>
        )}
      </section>

      {weekly[0] ? (
        <section>
          <WeeklyReflectionView {...weekly[0]} />
        </section>
      ) : null}

      <section className="flex flex-wrap gap-3">
        <Link href="/me/settings" className="inline-flex min-h-11 items-center rounded-xl border border-border px-4">
          Settings
        </Link>
        <Link href="/me/week" className="inline-flex min-h-11 items-center rounded-xl border border-border px-4">
          This week
        </Link>
        <Link href="/search" className="inline-flex min-h-11 items-center rounded-xl border border-border px-4">
          Search
        </Link>
        {user.role === "admin" ? (
          <Link href="/admin" className="inline-flex min-h-11 items-center rounded-xl border border-border px-4">
            Admin
          </Link>
        ) : null}
        <form action={logoutAction}>
          <Button variant="ghost" type="submit">
            Leave
          </Button>
        </form>
      </section>
    </div>
  );
}
