import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SitWithThis } from "@/components/svarupa/SitWithThis";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function SitPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user) redirect("/login");
  const { id } = await params;
  const sit = await db.sitSession.findFirst({ where: { id, userId: user.id } });
  if (!sit) notFound();
  return (
    <div>
      <div className="px-6 pt-6">
        <Link href="/home" className="text-sm text-muted">
          Leave quietly
        </Link>
      </div>
      <SitWithThis question={sit.question} sitId={id} />
    </div>
  );
}
