import { PracticeCard, SadhanaCard } from "@/components/svarupa/Cards";
import { EmptyState } from "@/components/svarupa/EmptyState";
import { PageHeader } from "@/components/svarupa/PageHeader";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const GROUPS = [
  ["breath", "Breath"],
  ["meditation", "Meditation"],
  ["reflection", "Reflection"],
  ["action", "Mindful action"],
  ["devotion", "Mantra & devotion"],
] as const;

function difficultyFor(minutes: number) {
  if (minutes <= 5) return "Gentle";
  if (minutes <= 12) return "Steady";
  return "Deep";
}

export default async function PracticePage() {
  const user = await getSession();
  if (!user) redirect("/login");
  const [practices, templates, mine] = await Promise.all([
    db.practice.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    db.sadhana.findMany({ where: { isTemplate: true }, include: { items: { orderBy: { order: "asc" } } } }),
    db.sadhana.findMany({ where: { userId: user.id }, include: { items: true } }),
  ]);
  return (
    <div className="page-stack">
      <PageHeader title="Practice" description="Your practice starts small." />
      {mine.length ? (
        <section>
          <h2 className="text-h2">My Sadhana</h2>
          <div className="mt-5 grid gap-4">
            {mine.map((s) => (
              <SadhanaCard
                key={s.id}
                name={s.name}
                timeOfDay={s.timeOfDay}
                durationMin={s.durationMin}
                href={`/practice/sadhana/${s.id}`}
              />
            ))}
          </div>
        </section>
      ) : (
        <EmptyState
          title="Your practice starts small."
          body="Choose something you can return to. If you miss a day, return when you're ready."
          action="Explore practices"
          href="#practices"
        />
      )}
      <section>
        <h2 className="text-h2">Sadhana templates</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {templates.map((s) => (
            <SadhanaCard
              key={s.id}
              name={s.name}
              timeOfDay={s.timeOfDay}
              durationMin={s.durationMin}
              href={`/practice/sadhana/${s.id}`}
            />
          ))}
        </div>
      </section>
      <div id="practices" className="space-y-14">
        {GROUPS.map(([key, label]) => {
          const items = practices.filter((p) => p.category === key);
          if (!items.length) return null;
          return (
            <section key={key}>
              <h2 className="text-h2">{label}</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {items.map((p) => (
                  <PracticeCard
                    key={p.id}
                    title={p.title}
                    category={p.category}
                    durationMin={p.durationMin}
                    description={p.description}
                    difficulty={difficultyFor(p.durationMin)}
                    href={`/practice/${p.slug}`}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
