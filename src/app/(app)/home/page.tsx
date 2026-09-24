import Link from "next/link";
import { HomeCheckin, HomeReflect } from "@/components/svarupa/HomeClient";
import { ReflectionCard, SadhanaCard } from "@/components/svarupa/Cards";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { greetingForHour } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await getSession();
  if (!user) redirect("/login");
  const hour = new Date().getHours();
  const [open, sadhana, thought] = await Promise.all([
    db.reflectionSession.findFirst({
      where: { userId: user.id, status: "active" },
      orderBy: { updatedAt: "desc" },
    }),
    db.sadhana.findFirst({
      where: { userId: user.id, status: "active" },
      include: { items: true },
    }),
    db.scriptureVerse.findFirst({
      where: { citation: "Bhagavad Gita 2.47" },
      include: { chapter: { include: { scripture: true } } },
    }),
  ]);

  return (
    <div className="page-stack">
      <HomeReflect greeting={greetingForHour(hour)} />
      <HomeCheckin />
      {open ? (
        <section>
          <h2 className="mb-4 text-h2">Continue reflecting</h2>
          <ReflectionCard
            title={open.title || "Unfinished conversation"}
            excerpt={open.excerpt || ""}
            href={`/reflect/${open.id}`}
            status="active"
          />
        </section>
      ) : null}
      {thought ? (
        <section className="surface-card p-7 sm:p-10">
          <p className="text-caption">A thought for today</p>
          <p className="mt-4 text-quote">
            You can give yourself fully to an action without knowing exactly how the outcome will unfold.
          </p>
          <p className="mt-4 text-body-sm">
            {thought.citation} · A SVARUPA reflection, offered beside a verified translation — not as the verse itself.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/wisdom/verse/${thought.id}`}
              className="inline-flex min-h-11 items-center rounded-xl bg-charcoal px-4 text-ivory"
            >
              Read verse
            </Link>
            <Link
              href={`/sit/new?q=${encodeURIComponent("What are you trying to control that may not be yours to control?")}&verse=${thought.id}`}
              className="inline-flex min-h-11 items-center rounded-xl border border-border px-4"
            >
              Sit with this
            </Link>
          </div>
        </section>
      ) : null}
      {sadhana ? (
        <section>
          <h2 className="mb-4 text-h2">Your practice</h2>
          <SadhanaCard
            name={sadhana.name}
            timeOfDay={sadhana.timeOfDay}
            durationMin={sadhana.durationMin}
            remaining={`${sadhana.durationMin} minutes`}
            href={`/practice/sadhana/${sadhana.id}`}
          />
        </section>
      ) : null}
    </div>
  );
}
