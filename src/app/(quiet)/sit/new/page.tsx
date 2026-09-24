import { redirect } from "next/navigation";
import { createSitAction } from "@/app/actions";
import { getSession } from "@/lib/auth";

export default async function NewSitPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; verse?: string }>;
}) {
  const user = await getSession();
  if (!user) redirect("/login");
  const { q, verse } = await searchParams;
  await createSitAction(q || "What feels most true right now?", verse || undefined);
}
