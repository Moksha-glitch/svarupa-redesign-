"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

async function requireAdmin() {
  const user = await getSession();
  if (!user || user.role !== "admin") redirect("/home");
  return user;
}

export async function adminToggleVerse(id: string, published: boolean) {
  await requireAdmin();
  await db.scriptureVerse.update({ where: { id }, data: { published } });
}

export async function adminUpdatePractice(
  id: string,
  data: { title: string; description: string; guidance: string; published: boolean },
) {
  await requireAdmin();
  await db.practice.update({ where: { id }, data });
}

export async function adminAddCommentary(verseId: string, form: FormData) {
  await requireAdmin();
  await db.commentary.create({
    data: {
      verseId,
      tradition: String(form.get("tradition") || ""),
      kind: String(form.get("kind") || "modern"),
      author: String(form.get("author") || "") || null,
      body: String(form.get("body") || ""),
      citation: String(form.get("citation") || "") || null,
    },
  });
}
