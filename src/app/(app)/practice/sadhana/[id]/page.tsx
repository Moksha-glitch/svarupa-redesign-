import { notFound, redirect } from "next/navigation";
import { adoptSadhanaAction, completeSadhanaAction, toggleSadhanaAction } from "@/app/actions";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";

export default async function SadhanaPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user) redirect("/login");
  const { id } = await params;
  const sadhana = await db.sadhana.findFirst({
    where: { id, OR: [{ userId: user.id }, { isTemplate: true }] },
    include: { items: { orderBy: { order: "asc" } } },
  });
  if (!sadhana) notFound();
  const mine = sadhana.userId === user.id;
  return (
    <article>
      <p className="text-caption">{sadhana.timeOfDay}</p>
      <h1 className="mt-3 text-h1">{sadhana.name}</h1>
      <p className="mt-4 text-xl text-muted">{sadhana.description}</p>
      <p className="mt-2 text-sm text-muted">{sadhana.durationMin} minutes · not a streak</p>
      <ol className="mt-10 space-y-4">
        {sadhana.items.map((item, i) => (
          <li key={item.id} className="surface-card p-5">
            <p className="text-label">{String(i + 1).padStart(2, "0")}</p>
            <p className="text-h3">{item.title}</p>
            <p className="text-sm text-muted">{item.durationMin} min</p>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap gap-3">
        {mine ? (
          <>
            <form action={completeSadhanaAction.bind(null, sadhana.id)}>
              <Button type="submit">Begin / complete today</Button>
            </form>
            <form action={toggleSadhanaAction.bind(null, sadhana.id)}>
              <Button variant="secondary" type="submit">
                {sadhana.status === "active" ? "Pause" : "Restart"}
              </Button>
            </form>
          </>
        ) : (
          <form action={adoptSadhanaAction.bind(null, sadhana.id)}>
            <Button type="submit">Make this my Sadhana</Button>
          </form>
        )}
      </div>
    </article>
  );
}
