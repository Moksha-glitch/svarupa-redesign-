import Link from "next/link";
import { WisdomCard, ScriptureCard } from "@/components/svarupa/Cards";
import { EmptyState } from "@/components/svarupa/EmptyState";
import { PageHeader } from "@/components/svarupa/PageHeader";
import { db } from "@/lib/db";

const THEMES = [
  "Dharma",
  "Karma",
  "Attachment",
  "Desire",
  "Self",
  "Purpose",
  "Suffering",
  "Equanimity",
  "Devotion",
];

export default async function WisdomPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; theme?: string }>;
}) {
  const { q, theme } = await searchParams;
  const [sources, concepts, verses, featured] = await Promise.all([
    db.wisdomSource.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    db.wisdomConcept.findMany({
      where: {
        published: true,
        ...(theme ? { theme: { name: { equals: theme } } } : {}),
      },
      include: { theme: true },
    }),
    db.scriptureVerse.findMany({
      where: { published: true },
      include: { chapter: { include: { scripture: true } }, themes: { include: { theme: true } } },
      take: 8,
    }),
    db.scriptureVerse.findFirst({
      where: { citation: "Bhagavad Gita 2.47" },
      include: { chapter: { include: { scripture: true } } },
    }),
  ]);
  const texts = sources.filter((s) => s.category === "text");
  const philosophies = sources.filter((s) => s.category === "philosophy");
  const filteredVerses = theme
    ? verses.filter((v) => v.themes.some((t) => t.theme.name === theme))
    : verses;

  return (
    <div className="page-stack">
      <PageHeader
        title="Wisdom"
        description="Begin anywhere. Search a question, a feeling, or a concept."
      />
      <form action="/wisdom">
        <label className="sr-only" htmlFor="wisdom-search">
          Search wisdom
        </label>
        <input
          id="wisdom-search"
          name="q"
          defaultValue={q}
          placeholder="attachment, dharma, fear, karma yoga…"
          className="writing-surface h-14 w-full px-5 text-lg"
        />
      </form>
      {q ? <SearchInline q={q} /> : null}

      {featured && !q ? (
        <section className="surface-card p-7 sm:p-10">
          <p className="text-caption">Featured</p>
          <h2 className="mt-3 text-h2">{featured.chapter.scripture.title}</h2>
          <p className="mt-4 text-quote">“{featured.translation}”</p>
          <p className="mt-4 text-body-sm">{featured.citation}</p>
          <Link
            href={`/wisdom/verse/${featured.id}`}
            className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-charcoal px-4 text-ivory"
          >
            Read the verse
          </Link>
        </section>
      ) : null}

      <section>
        <h2 className="text-h2">Explore by tradition</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {texts.map((t) => (
            <ScriptureCard key={t.id} title={t.name} subtitle={t.description} href={`/wisdom/${t.slug}`} />
          ))}
          {philosophies.map((t) => (
            <WisdomCard key={t.id} title={t.name} body={t.description} href={`/wisdom/${t.slug}`} kind="Philosophy" />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-h2">Explore by theme</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {THEMES.map((name) => (
            <Link
              key={name}
              href={`/wisdom?theme=${encodeURIComponent(name)}`}
              className={`min-h-11 rounded-full border px-4 py-2 text-sm ${
                theme === name
                  ? "border-charcoal bg-charcoal text-ivory"
                  : "border-border"
              }`}
            >
              {name}
            </Link>
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {concepts.map((c) => (
            <WisdomCard
              key={c.id}
              title={c.name}
              body={c.modernInterpretation}
              href={`/wisdom/concept/${c.slug}`}
              kind={c.theme?.name}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-h2">{theme ? `Verses · ${theme}` : "Selected verses"}</h2>
        <div className="mt-6 grid gap-4">
          {filteredVerses.map((v) => (
            <Link key={v.id} href={`/wisdom/verse/${v.id}`} className="surface-card p-6 transition-colors hover:border-line-strong">
              <p className="text-caption">{v.citation}</p>
              <p className="mt-2 text-quote">“{v.translation}”</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

async function SearchInline({ q }: { q: string }) {
  const like = { contains: q };
  const [verses, concepts, practices] = await Promise.all([
    db.scriptureVerse.findMany({
      where: { OR: [{ translation: like }, { citation: like }, { context: like }] },
      take: 8,
    }),
    db.wisdomConcept.findMany({
      where: { OR: [{ name: like }, { modernInterpretation: like }] },
      take: 6,
    }),
    db.practice.findMany({
      where: { OR: [{ title: like }, { description: like }] },
      take: 6,
    }),
  ]);
  if (!verses.length && !concepts.length && !practices.length) {
    return (
      <EmptyState
        title="Nothing matched exactly."
        body="Try searching for a feeling, question, concept or text."
      />
    );
  }
  return (
    <div className="space-y-3">
      {verses.map((v) => (
        <Link key={v.id} href={`/wisdom/verse/${v.id}`} className="block surface-card p-4">
          <p className="text-caption">Scripture</p>
          <p className="mt-1 font-medium">{v.citation}</p>
        </Link>
      ))}
      {concepts.map((c) => (
        <Link key={c.id} href={`/wisdom/concept/${c.slug}`} className="block surface-card p-4">
          <p className="text-caption">Wisdom</p>
          <p className="mt-1 font-medium">{c.name}</p>
        </Link>
      ))}
      {practices.map((p) => (
        <Link key={p.id} href={`/practice/${p.slug}`} className="block surface-card p-4">
          <p className="text-caption">Practice</p>
          <p className="mt-1 font-medium">{p.title}</p>
        </Link>
      ))}
    </div>
  );
}
