import { db } from "../db";
import type { RetrievedConcept, RetrievedVerse } from "./types";

const STOP = new Set([
  "the",
  "and",
  "for",
  "that",
  "this",
  "with",
  "from",
  "have",
  "what",
  "when",
  "your",
  "about",
  "just",
  "like",
  "feel",
  "feeling",
]);

export function tokenize(query: string) {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

export async function retrieveWisdom(query: string, themes: string[] = []) {
  const tokens = tokenize(query);
  const verses = await db.scriptureVerse.findMany({
    where: { published: true },
    include: {
      chapter: { include: { scripture: true } },
      themes: { include: { theme: true } },
      commentaries: true,
    },
  });

  const scored = verses
    .map((verse) => {
      const hay = [
        verse.translation,
        verse.transliteration,
        verse.context,
        verse.citation,
        verse.chapter.title,
        verse.chapter.scripture.title,
        ...verse.themes.map((t) => t.theme.name),
        ...verse.commentaries.map((c) => c.body),
      ]
        .join(" ")
        .toLowerCase();
      let score = 0;
      for (const token of tokens) {
        if (hay.includes(token)) score += 2;
      }
      for (const theme of themes) {
        if (verse.themes.some((t) => t.theme.slug === theme || t.theme.name.toLowerCase() === theme.toLowerCase())) {
          score += 4;
        }
      }
      return { verse, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const retrievedVerses: RetrievedVerse[] = scored.map(({ verse }) => ({
    id: verse.id,
    slug: `${verse.chapter.scripture.slug}-${verse.chapter.number}-${verse.number}`,
    citation: verse.citation,
    sanskrit: verse.sanskrit,
    transliteration: verse.transliteration,
    translation: verse.translation,
    translator: verse.translator,
    context: verse.context,
    provenance: verse.provenance,
    themes: verse.themes.map((t) => t.theme.name),
  }));

  const concepts = await db.wisdomConcept.findMany({ where: { published: true } });
  const retrievedConcepts: RetrievedConcept[] = concepts
    .map((concept) => {
      const hay = `${concept.name} ${concept.traditionalPerspective} ${concept.modernInterpretation}`.toLowerCase();
      let score = 0;
      for (const token of tokens) if (hay.includes(token)) score += 2;
      for (const theme of themes) if (hay.includes(theme.toLowerCase())) score += 3;
      return { concept, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ concept }) => ({
      slug: concept.slug,
      name: concept.name,
      traditionalPerspective: concept.traditionalPerspective,
      modernInterpretation: concept.modernInterpretation,
    }));

  const practices = await db.practice.findMany({ where: { published: true } });
  const retrievedPractices = practices
    .map((practice) => {
      const hay = `${practice.title} ${practice.description} ${practice.category}`.toLowerCase();
      let score = 0;
      for (const token of tokens) if (hay.includes(token)) score += 1;
      for (const theme of themes) if (hay.includes(theme.toLowerCase())) score += 2;
      return { practice, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ practice }) => ({
      title: practice.title,
      slug: practice.slug,
      description: practice.description,
    }));

  return { verses: retrievedVerses, concepts: retrievedConcepts, practices: retrievedPractices };
}

export async function getVerseBySlug(slug: string) {
  const verses = await db.scriptureVerse.findMany({
    include: {
      chapter: { include: { scripture: true } },
      themes: { include: { theme: true } },
      commentaries: true,
    },
  });
  return verses.find((v) => `${v.chapter.scripture.slug}-${v.chapter.number}-${v.number}` === slug);
}

export function verseToRetrieved(verse: NonNullable<Awaited<ReturnType<typeof getVerseBySlug>>>): RetrievedVerse {
  return {
    id: verse.id,
    slug: `${verse.chapter.scripture.slug}-${verse.chapter.number}-${verse.number}`,
    citation: verse.citation,
    sanskrit: verse.sanskrit,
    transliteration: verse.transliteration,
    translation: verse.translation,
    translator: verse.translator,
    context: verse.context,
    provenance: verse.provenance,
    themes: verse.themes.map((t) => t.theme.name),
  };
}
