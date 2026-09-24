import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sendReflectionAction } from "@/app/actions";
import { db } from "@/lib/db";
import { runAssistantTurn } from "@/app/actions";

export async function POST(req: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const message = String(body.message || "").trim();
  if (!message) return NextResponse.json({ error: "Empty" }, { status: 400 });

  if (!body.sessionId) {
    const session = await db.reflectionSession.create({
      data: {
        userId: user.id,
        title: message.slice(0, 48),
        excerpt: message.slice(0, 180),
        status: "active",
        state: JSON.stringify({ stage: "listen", turn: 0, themes: [] }),
      },
    });
    await db.reflectionMessage.create({
      data: { sessionId: session.id, role: "user", content: message },
    });
    const result = await runAssistantTurn(user.id, session.id, message);
    return NextResponse.json({ sessionId: session.id, ...result });
  }

  const result = await sendReflectionAction(body.sessionId, message);
  return NextResponse.json({ sessionId: body.sessionId, ...result });
}
