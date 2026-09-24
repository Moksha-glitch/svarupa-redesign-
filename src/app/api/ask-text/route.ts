import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAIProvider } from "@/lib/ai";
import { db } from "@/lib/db";
import { verseToRetrieved } from "@/lib/ai/rag";

export async function POST(req: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { verseId, question } = await req.json();
  if (!verseId || !question) return NextResponse.json({ error: "Missing" }, { status: 400 });
  const verse = await db.scriptureVerse.findUnique({
    where: { id: verseId },
    include: {
      chapter: { include: { scripture: true } },
      themes: { include: { theme: true } },
      commentaries: true,
    },
  });
  if (!verse) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const prefs = await db.userPreference.findUnique({ where: { userId: user.id } });
  const result = await getAIProvider().askText({
    question: String(question),
    verse: verseToRetrieved(verse),
    commentaries: verse.commentaries,
    tone: prefs?.aiTone || "balanced",
  });
  return NextResponse.json(result);
}
