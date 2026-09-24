import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() || "";
  if (q.length < 2) return NextResponse.json({ results: [] });
  const user = await getSession();
  const like = { contains: q };

  const [verses, concepts, practices, sources] = await Promise.all([
    db.scriptureVerse.findMany({
      where: {
        published: true,
        OR: [{ translation: like }, { citation: like }, { context: like }, { transliteration: like }],
      },
      include: { chapter: { include: { scripture: true } } },
      take: 8,
    }),
    db.wisdomConcept.findMany({
      where: {
        published: true,
        OR: [{ name: like }, { traditionalPerspective: like }, { modernInterpretation: like }],
      },
      take: 6,
    }),
    db.practice.findMany({
      where: { published: true, OR: [{ title: like }, { description: like }, { category: like }] },
      take: 6,
    }),
    db.wisdomSource.findMany({
      where: { published: true, OR: [{ name: like }, { description: like }] },
      take: 6,
    }),
  ]);

  const results: { type: string; title: string; href: string; body: string }[] = [
    ...sources.map((s) => ({
      type: s.category === "text" ? "Text" : "Philosophy",
      title: s.name,
      href: `/wisdom/${s.slug}`,
      body: s.description,
    })),
    ...verses.map((v) => ({
      type: "Verse",
      title: v.citation,
      href: `/wisdom/verse/${v.id}`,
      body: v.translation,
    })),
    ...concepts.map((c) => ({
      type: "Concept",
      title: c.name,
      href: `/wisdom/concept/${c.slug}`,
      body: c.modernInterpretation,
    })),
    ...practices.map((p) => ({
      type: "Practice",
      title: p.title,
      href: `/practice/${p.slug}`,
      body: p.description,
    })),
  ];

  if (user) {
    const [journals, reflections] = await Promise.all([
      db.journalEntry.findMany({
        where: {
          userId: user.id,
          OR: [
            { freeWrite: like },
            { whatIFelt: like },
            { whatHappened: like },
            { whatINoticed: like },
          ],
        },
        take: 5,
      }),
      db.reflectionSession.findMany({
        where: { userId: user.id, OR: [{ title: like }, { excerpt: like }] },
        take: 5,
      }),
    ]);
    for (const j of journals) {
      results.push({
        type: "Journal",
        title: "Private journal",
        href: `/journal/${j.id}`,
        body: (j.whatIFelt || j.freeWrite || "").slice(0, 140),
      });
    }
    for (const r of reflections) {
      results.push({
        type: "Reflection",
        title: r.title || "Reflection",
        href: `/reflect/${r.id}`,
        body: r.excerpt || "",
      });
    }
  }

  return NextResponse.json({ results });
}
