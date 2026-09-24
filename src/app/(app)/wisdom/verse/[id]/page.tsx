import Link from "next/link";
import { notFound } from "next/navigation";
import { AskTheText } from "@/components/svarupa/AskTheText";
import { Breadcrumb } from "@/components/svarupa/Breadcrumb";
import { CommentaryCard, VerseReader } from "@/components/svarupa/VerseReader";
import { saveWisdomAction, createSitAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

async function findVerse(id: string) {
  const byId = await db.scriptureVerse.findUnique({
    where: { id },
    include: {
      chapter: { include: { scripture: { include: { source: true } } } },
      themes: { include: { theme: true } },
      commentaries: true,
    },
  });
  if (byId) return byId;
  const parts = id.split("-");
  const number = Number(parts.at(-1));
  const chapter = Number(parts.at(-2));
  const slug = parts.slice(0, -2).join("-");
  if (!number || !chapter || !slug) return null;
  return db.scriptureVerse.findFirst({
    where: {
      number,
      chapter: { number: chapter, scripture: { slug } },
    },
    include: {
      chapter: { include: { scripture: { include: { source: true } } } },
      themes: { include: { theme: true } },
      commentaries: true,
    },
  });
}

export default async function VersePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const verse = await findVerse(id);
  if (!verse) notFound();
  const user = await getSession();
  const siblings = await db.scriptureVerse.findMany({
    where: { chapterId: verse.chapterId },
    orderBy: { number: "asc" },
  });
  const idx = siblings.findIndex((s) => s.id === verse.id);
  const prev = siblings[idx - 1];
  const next = siblings[idx + 1];
  const sitQ = "What are you trying to control that may not be yours to control?";

  return (
    <div className="space-y-12">
      <Breadcrumb
        items={[
          { href: "/wisdom", label: "Wisdom" },
          { href: `/wisdom/${verse.chapter.scripture.slug}`, label: verse.chapter.scripture.title },
          { label: `Chapter ${verse.chapter.number}` },
          { label: `Verse ${verse.number}` },
        ]}
      />
      <VerseReader
        citation={verse.citation}
        chapterTitle={verse.chapter.subtitle || verse.chapter.title}
        sanskrit={verse.sanskrit}
        transliteration={verse.transliteration}
        translation={verse.translation}
        translator={verse.translator}
        context={verse.context}
        provenance={verse.provenance}
        themes={verse.themes.map((t) => t.theme.name)}
      />
      <section className="space-y-4">
        <h2 className="text-h2">Commentary</h2>
        {verse.commentaries.length ? (
          verse.commentaries.map((c) => <CommentaryCard key={c.id} {...c} />)
        ) : (
          <p className="text-body">No commentary attached to this verse yet.</p>
        )}
      </section>
      <div className="flex flex-wrap gap-3">
        {user ? (
          <>
            <form action={saveWisdomAction.bind(null, verse.id)}>
              <Button variant="secondary" type="submit">
                Save
              </Button>
            </form>
            <form action={createSitAction.bind(null, sitQ, verse.id)}>
              <Button type="submit">Sit with this</Button>
            </form>
          </>
        ) : (
          <Button asChild variant="secondary">
            <Link href="/login">Enter to save or sit</Link>
          </Button>
        )}
        <Button asChild variant="ghost">
          <Link href={`/wisdom/lenses/${verse.id}`}>Explore interpretations</Link>
        </Button>
      </div>
      {user ? <AskTheText verseId={verse.id} /> : null}
      <nav className="flex justify-between text-sm text-muted" aria-label="Verse">
        {prev ? <Link href={`/wisdom/verse/${prev.id}`}>Previous verse</Link> : <span />}
        {next ? <Link href={`/wisdom/verse/${next.id}`}>Next verse</Link> : <span />}
      </nav>
    </div>
  );
}
