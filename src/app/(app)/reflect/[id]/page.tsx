import { ReflectClient } from "@/components/svarupa/ReflectClient";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";

export const metadata = { robots: { index: false, follow: false } };

export default async function ReflectSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSession();
  if (!user) redirect("/login");
  const { id } = await params;
  const session = await db.reflectionSession.findFirst({
    where: { id, userId: user.id },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      insight: true,
    },
  });
  if (!session) notFound();
  return (
    <div>
      <h1 className="text-h1">Reflect</h1>
      <p className="mt-2 text-muted">You don't have to explain it perfectly.</p>
      <div className="mt-10">
        <ReflectClient
          sessionId={session.id}
          initialMessages={session.messages}
          insight={session.insight}
        />
      </div>
    </div>
  );
}
