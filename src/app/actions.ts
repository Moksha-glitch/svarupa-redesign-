"use server";

import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, clearSession, getSession, hashPassword, verifyPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { monthKey, parseJson } from "@/lib/utils";
import type { SessionState } from "@/lib/ai/types";
import { getAIProvider } from "@/lib/ai";
import { retrieveWisdom } from "@/lib/ai/rag";

const emailSchema = z.string().email();

function databaseUnavailable(error: unknown) {
  return (
    !!error &&
    typeof error === "object" &&
    "name" in error &&
    (error as { name: string }).name === "PrismaClientInitializationError"
  );
}

export async function signupAction(_: unknown, form: FormData) {
  const email = String(form.get("email") || "").toLowerCase().trim();
  const password = String(form.get("password") || "");
  const name = String(form.get("name") || "").trim();
  if (!emailSchema.safeParse(email).success) return { error: "Please use a valid email." };
  if (password.length < 8) return { error: "Use at least eight characters." };
  let user;
  try {
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) return { error: "An account with that email already exists." };
    user = await db.user.create({
      data: {
        email,
        name: name || null,
        passwordHash: await hashPassword(password),
        preferences: { create: {} },
      },
    });
  } catch (error) {
    if (databaseUnavailable(error)) {
      return { error: "The database isn't connected on this deployment yet." };
    }
    throw error;
  }
  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    onboardingCompleted: false,
  });
  redirect("/onboarding");
}

export async function loginAction(_: unknown, form: FormData) {
  const email = String(form.get("email") || "").toLowerCase().trim();
  const password = String(form.get("password") || "");
  const next = String(form.get("next") || "/home");
  const user = await db.user.findUnique({ where: { email } });
  if (!user?.passwordHash) return { error: "Those details weren't recognized." };
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return { error: "Those details weren't recognized." };
  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    onboardingCompleted: user.onboardingCompleted,
  });
  redirect(user.onboardingCompleted ? next || "/home" : "/onboarding");
}

export async function demoLoginAction() {
  const user = await db.user.findUnique({ where: { email: "demo@svarupa.app" } });
  if (!user) redirect("/login?error=demo");
  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    onboardingCompleted: user.onboardingCompleted,
  });
  redirect("/home");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}

export async function forgotPasswordAction(_: unknown, form: FormData) {
  const email = String(form.get("email") || "").toLowerCase().trim();
  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return { ok: true, message: "If that email is with us, a reset path will be ready." };
  }
  const token = randomBytes(32).toString("hex");
  await db.passwordReset.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    },
  });
  const url = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;
  return {
    ok: true,
    message: "If that email is with us, a reset path will be ready.",
    devLink: process.env.NODE_ENV === "production" ? undefined : url,
  };
}

export async function resetPasswordAction(_: unknown, form: FormData) {
  const token = String(form.get("token") || "");
  const password = String(form.get("password") || "");
  if (password.length < 8) return { error: "Use at least eight characters." };
  const row = await db.passwordReset.findUnique({ where: { token } });
  if (!row || row.expiresAt < new Date()) return { error: "This reset link is no longer valid." };
  await db.user.update({
    where: { id: row.userId },
    data: { passwordHash: await hashPassword(password) },
  });
  await db.passwordReset.delete({ where: { id: row.id } });
  return { ok: true };
}

export async function completeOnboardingAction(data: {
  reasons: string[];
  topics: string[];
  familiarity: string;
  tone: string;
}) {
  const user = await getSession();
  if (!user) redirect("/login");
  await db.userPreference.upsert({
    where: { userId: user.id },
    update: {
      reasons: JSON.stringify(data.reasons),
      exploreTopics: JSON.stringify(data.topics),
      philosophyFamiliarity: data.familiarity,
      aiTone: data.tone,
    },
    create: {
      userId: user.id,
      reasons: JSON.stringify(data.reasons),
      exploreTopics: JSON.stringify(data.topics),
      philosophyFamiliarity: data.familiarity,
      aiTone: data.tone,
    },
  });
  await db.user.update({ where: { id: user.id }, data: { onboardingCompleted: true } });
  await createSession({ ...user, onboardingCompleted: true });
  redirect("/home");
}

export async function saveCheckinAction(emotion: string, custom?: string) {
  const user = await getSession();
  if (!user) redirect("/login");
  await db.emotionalCheckin.create({
    data: { userId: user.id, emotion, customEmotion: custom || null },
  });
}

export async function startReflectionAction(text: string) {
  const user = await getSession();
  if (!user) redirect("/login");
  const session = await db.reflectionSession.create({
    data: {
      userId: user.id,
      title: text.slice(0, 48),
      excerpt: text.slice(0, 180),
      status: "active",
      state: JSON.stringify({ stage: "listen", turn: 0, themes: [] } satisfies SessionState),
    },
  });
  await db.reflectionMessage.create({
    data: { sessionId: session.id, role: "user", content: text },
  });
  await runAssistantTurn(user.id, session.id, text);
  redirect(`/reflect/${session.id}`);
}

export async function runAssistantTurn(userId: string, sessionId: string, userMessage: string) {
  const session = await db.reflectionSession.findFirst({
    where: { id: sessionId, userId },
    include: { messages: { orderBy: { createdAt: "asc" } }, insight: true },
  });
  if (!session) throw new Error("Not found");
  const prefs = await db.userPreference.findUnique({ where: { userId } });
  const stats = await db.userThemeStat.findMany({
    where: { userId },
    include: { theme: true },
    orderBy: { count: "desc" },
    take: 6,
  });
  const state = parseJson<SessionState>(session.state, { stage: "listen", turn: 0, themes: [] });
  const retrieved = await retrieveWisdom(userMessage, state.themes);
  const result = await getAIProvider().complete({
    messages: session.messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    userMessage,
    state,
    tone: prefs?.aiTone || "balanced",
    familiarity: prefs?.philosophyFamiliarity || "new",
    retrieved,
    userContext: {
      recurringThemes: stats.map((s) => s.theme.name),
      reasons: parseJson<string[]>(prefs?.reasons, []),
    },
  });

  await db.reflectionMessage.create({
    data: {
      sessionId,
      role: "assistant",
      content: result.content,
      chips: result.chips ? JSON.stringify(result.chips) : null,
      kind: result.kind,
      meta: JSON.stringify({ verseSlug: result.verseSlug, sitQuestion: result.sitQuestion, sources: result.sources }),
    },
  });
  await db.reflectionSession.update({
    where: { id: sessionId },
    data: {
      state: JSON.stringify(result.state),
      status: result.kind === "crisis" ? "active" : session.status,
      updatedAt: new Date(),
    },
  });
  if (result.insight) {
    await db.reflectionInsight.upsert({
      where: { sessionId },
      update: result.insight,
      create: { sessionId, ...result.insight },
    });
    if (result.insight.theme) {
      const theme = await db.theme.findFirst({
        where: { name: { equals: result.insight.theme } },
      });
      if (theme) {
        const key = monthKey();
        await db.userThemeStat.upsert({
          where: { userId_themeId_monthKey: { userId, themeId: theme.id, monthKey: key } },
          update: { count: { increment: 1 }, lastSeen: new Date() },
          create: { userId, themeId: theme.id, monthKey: key, count: 1 },
        });
      }
    }
  }
  return result;
}

export async function sendReflectionAction(sessionId: string, text: string) {
  const user = await getSession();
  if (!user) redirect("/login");
  const owned = await db.reflectionSession.findFirst({ where: { id: sessionId, userId: user.id } });
  if (!owned) throw new Error("Not found");
  await db.reflectionMessage.create({
    data: { sessionId, role: "user", content: text },
  });
  return runAssistantTurn(user.id, sessionId, text);
}

export async function completeSessionAction(sessionId: string) {
  const user = await getSession();
  if (!user) return;
  await db.reflectionSession.updateMany({
    where: { id: sessionId, userId: user.id },
    data: { status: "completed" },
  });
}

export async function saveJournalAction(id: string | null, data: {
  howIArrived: string;
  whatHappened: string;
  whatIFelt: string;
  whatINoticed: string;
  whatIWantToRemember: string;
  freeWrite: string;
  sitQuestion?: string;
  source?: string;
}) {
  const user = await getSession();
  if (!user) redirect("/login");
  if (id) {
    const owned = await db.journalEntry.findFirst({ where: { id, userId: user.id } });
    if (!owned) throw new Error("Not found");
    await db.journalEntry.update({ where: { id }, data });
    return id;
  }
  const created = await db.journalEntry.create({
    data: { userId: user.id, ...data, source: data.source || "journal" },
  });
  return created.id;
}

export async function toggleFavoriteAction(id: string) {
  const user = await getSession();
  if (!user) return;
  const entry = await db.journalEntry.findFirst({ where: { id, userId: user.id } });
  if (!entry) return;
  await db.journalEntry.update({ where: { id }, data: { favorite: !entry.favorite } });
}

export async function deleteJournalAction(id: string) {
  const user = await getSession();
  if (!user) return;
  await db.journalEntry.deleteMany({ where: { id, userId: user.id } });
  redirect("/journal");
}

export async function completePracticeAction(practiceId: string, durationMin: number) {
  const user = await getSession();
  if (!user) redirect("/login");
  await db.practiceSession.create({
    data: { userId: user.id, practiceId, durationMin },
  });
}

export async function adoptSadhanaAction(templateId: string) {
  const user = await getSession();
  if (!user) redirect("/login");
  const template = await db.sadhana.findFirst({
    where: { id: templateId, isTemplate: true },
    include: { items: true },
  });
  if (!template) return;
  await db.sadhana.updateMany({ where: { userId: user.id, status: "active" }, data: { status: "paused" } });
  const created = await db.sadhana.create({
    data: {
      userId: user.id,
      name: template.name,
      timeOfDay: template.timeOfDay,
      durationMin: template.durationMin,
      description: template.description,
      status: "active",
      items: {
        create: template.items.map((i) => ({
          order: i.order,
          title: i.title,
          durationMin: i.durationMin,
          practiceId: i.practiceId,
        })),
      },
    },
  });
  redirect(`/practice/sadhana/${created.id}`);
}

export async function toggleSadhanaAction(id: string) {
  const user = await getSession();
  if (!user) return;
  const row = await db.sadhana.findFirst({ where: { id, userId: user.id } });
  if (!row) return;
  await db.sadhana.update({
    where: { id },
    data: { status: row.status === "active" ? "paused" : "active" },
  });
}

export async function completeSadhanaAction(id: string) {
  const user = await getSession();
  if (!user) return;
  const row = await db.sadhana.findFirst({ where: { id, userId: user.id } });
  if (!row) return;
  await db.practiceSession.create({
    data: { userId: user.id, sadhanaId: id, durationMin: row.durationMin },
  });
}

export async function createSitAction(question: string, verseId?: string) {
  const user = await getSession();
  if (!user) redirect("/login");
  const sit = await db.sitSession.create({
    data: { userId: user.id, question, verseId },
  });
  redirect(`/sit/${sit.id}`);
}

export async function sitWithQuestionAction(question: string) {
  await createSitAction(question);
}

export async function finishSitAction(id: string, durationMin: number, writing: string) {
  const user = await getSession();
  if (!user) redirect("/login");
  const sit = await db.sitSession.findFirst({ where: { id, userId: user.id } });
  if (!sit) throw new Error("Not found");
  const journal = await db.journalEntry.create({
    data: {
      userId: user.id,
      source: "sit",
      sitQuestion: sit.question,
      freeWrite: writing,
      whatINoticed: writing,
      whatIWantToRemember: sit.question,
    },
  });
  await db.sitSession.update({
    where: { id },
    data: { completed: true, durationMin, journalId: journal.id },
  });
  redirect(`/journal/${journal.id}`);
}

export async function saveWisdomAction(verseId: string) {
  const user = await getSession();
  if (!user) redirect("/login");
  const existing = await db.savedWisdom.findFirst({ where: { userId: user.id, verseId } });
  if (existing) {
    await db.savedWisdom.delete({ where: { id: existing.id } });
    return;
  }
  await db.savedWisdom.create({ data: { userId: user.id, verseId } });
}

export async function updatePreferencesAction(data: {
  aiTone?: string;
  language?: string;
  notificationsEnabled?: boolean;
  theme?: string;
}) {
  const user = await getSession();
  if (!user) return;
  await db.userPreference.upsert({
    where: { userId: user.id },
    update: data,
    create: { userId: user.id, ...data },
  });
}

export async function saveWeeklyAction(id: string, data: {
  whatChanged: string;
  whatRepeated: string;
  whatSurprised: string;
  carryForward: string;
}) {
  const user = await getSession();
  if (!user) return;
  await db.weeklyReflection.updateMany({ where: { id, userId: user.id }, data });
}

export async function deleteAccountAction() {
  const user = await getSession();
  if (!user) redirect("/login");
  await db.user.delete({ where: { id: user.id } });
  await clearSession();
  redirect("/");
}
