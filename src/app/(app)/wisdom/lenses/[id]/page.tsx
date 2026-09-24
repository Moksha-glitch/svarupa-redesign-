import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function LensesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const traditions = await db.philosophicalTradition.findMany({ orderBy: { sortOrder: "asc" } });
  if (id === "suffering") {
    return (
      <div>
        <h1 className="font-serif text-4xl text-ink">Why do I keep suffering?</h1>
        <p className="mt-3 max-w-xl text-muted">
          Each tab is a school, not the whole of Hindu thought. None of this is a diagnosis.
        </p>
        <Lenses traditions={traditions} field="viewOnSuffering" />
      </div>
    );
  }
  const verse = await db.scriptureVerse.findUnique({
    where: { id },
    include: { commentaries: true },
  });
  if (!verse && id !== "suffering") {
    if (!traditions.length) notFound();
  }
  return (
    <div>
      <h1 className="font-serif text-4xl text-ink">Interpretations</h1>
      <p className="mt-3 text-muted">{verse?.citation || "A question held in more than one light."}</p>
      <Lenses traditions={traditions} field="summary" extra={verse?.commentaries} />
    </div>
  );
}

function Lenses({
  traditions,
  field,
  extra,
}: {
  traditions: { slug: string; name: string; summary: string; viewOnSuffering: string | null; viewOnSelf: string | null; viewOnPractice: string | null }[];
  field: "summary" | "viewOnSuffering";
  extra?: { id: string; tradition: string; kind: string; body: string }[];
}) {
  return (
    <div className="mt-10">
      <div className="flex flex-wrap gap-2">
        {traditions.map((t) => (
          <a key={t.slug} href={`#${t.slug}`} className="rounded-full border border-line px-4 py-1.5 text-sm">
            {t.name}
          </a>
        ))}
      </div>
      <div className="mt-8 space-y-10">
        {traditions.map((t) => (
          <section key={t.slug} id={t.slug} className="rounded-[1.5rem] border border-line bg-paper p-6">
            <h2 className="font-serif text-3xl">{t.name}</h2>
            <p className="mt-2 text-xs tracking-[0.14em] text-copper uppercase">Traditional perspective</p>
            <p className="mt-3 leading-relaxed text-charcoal-soft">
              {field === "viewOnSuffering" ? t.viewOnSuffering : t.summary}
            </p>
          </section>
        ))}
        {extra?.map((c) => (
          <section key={c.id} className="rounded-[1.5rem] border border-line bg-paper p-6">
            <h2 className="font-serif text-2xl">{c.tradition}</h2>
            <p className="text-xs uppercase tracking-[0.14em] text-copper">
              {c.kind === "modern" ? "Modern interpretation" : "Traditional commentary"}
            </p>
            <p className="mt-3 leading-relaxed">{c.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
