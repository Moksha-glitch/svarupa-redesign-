import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/svarupa/EmptyState";
import { PageHeader } from "@/components/svarupa/PageHeader";
import { ReflectionComposer } from "@/components/svarupa/ReflectionComposer";
import { ReflectionCard } from "@/components/svarupa/Cards";
import { redirect } from "next/navigation";

export default async function ReflectIndexPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  const sessions = await db.reflectionSession.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: 12,
  });
  return (
    <div>
      <PageHeader title="Reflect" description="You don't have to explain it perfectly." />
      <div className="mt-10">
        <ReflectionComposer />
      </div>
      <div className="mt-14 space-y-4">
        {sessions.length ? (
          sessions.map((s) => (
            <ReflectionCard
              key={s.id}
              title={s.title || "Reflection"}
              excerpt={s.excerpt || ""}
              href={`/reflect/${s.id}`}
              status={s.status}
            />
          ))
        ) : (
          <EmptyState
            title="Nothing here yet."
            body="Begin with whatever is present. It does not have to be complete."
          />
        )}
      </div>
    </div>
  );
}
