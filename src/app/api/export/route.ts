import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [profile, journal, reflections, checkins, sadhanas, weekly] = await Promise.all([
    db.user.findUnique({
      where: { id: user.id },
      select: { email: true, name: true, createdAt: true, preferences: true },
    }),
    db.journalEntry.findMany({ where: { userId: user.id } }),
    db.reflectionSession.findMany({
      where: { userId: user.id },
      include: { messages: true, insight: true },
    }),
    db.emotionalCheckin.findMany({ where: { userId: user.id } }),
    db.sadhana.findMany({ where: { userId: user.id }, include: { items: true } }),
    db.weeklyReflection.findMany({ where: { userId: user.id } }),
  ]);
  return NextResponse.json(
    {
      exportedAt: new Date().toISOString(),
      profile,
      journal,
      reflections,
      checkins,
      sadhanas,
      weekly,
    },
    {
      headers: {
        "Content-Disposition": "attachment; filename=svarupa-export.json",
      },
    },
  );
}
