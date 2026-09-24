import Link from "next/link";
import { redirect } from "next/navigation";
import { InnerMap } from "@/components/svarupa/InnerMap";
import { PageHeader } from "@/components/svarupa/PageHeader";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata = { robots: { index: false, follow: false } };

export default async function InnerMapPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  const stats = await db.userThemeStat.findMany({
    where: { userId: user.id },
    include: { theme: true },
    orderBy: { monthKey: "desc" },
  });
  const totals = Object.values(
    stats.reduce<Record<string, { name: string; count: number }>>((acc, s) => {
      acc[s.themeId] = acc[s.themeId] || { name: s.theme.name, count: 0 };
      acc[s.themeId].count += s.count;
      return acc;
    }, {}),
  ).sort((a, b) => b.count - a.count);

  const months = [...new Set(stats.map((s) => s.monthKey))].sort().reverse();

  return (
    <div>
      <PageHeader
        title="Your reflections"
        description="These are themes appearing frequently in your reflections. They are not diagnoses or conclusions."
        crumbs={[
          { href: "/me", label: "Profile" },
          { label: "Inner map" },
        ]}
      />
      <div className="mt-12">
        {totals.length ? <InnerMap items={totals} /> : <p className="text-body">Patterns will gather here as you return.</p>}
      </div>
      <section className="mt-16 space-y-8">
        <h2 className="text-h2">Timeline</h2>
        {months.map((m) => {
          const rows = stats.filter((s) => s.monthKey === m).sort((a, b) => b.count - a.count);
          const top = rows[0];
          const [year, month] = m.split("-");
          const label = new Date(Number(year), Number(month) - 1).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          });
          return (
            <article key={m}>
              <h3 className="text-h3">{label}</h3>
              <p className="text-muted">
                {top ? `${top.theme.name} appeared frequently.` : "A quieter month."}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {rows.map((r) => (
                  <Link
                    key={r.themeId + m}
                    href={`/journal?q=${encodeURIComponent(r.theme.name)}`}
                    className="min-h-11 rounded-full border border-border px-3 py-1 text-sm"
                  >
                    {r.theme.name}
                  </Link>
                ))}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
