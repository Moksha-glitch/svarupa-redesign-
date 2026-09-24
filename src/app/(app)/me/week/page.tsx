import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { startOfWeek } from "@/lib/utils";
import { PageHeader } from "@/components/svarupa/PageHeader";
import { WeeklyForm } from "@/components/svarupa/WeeklyForm";

export default async function WeekPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  const weekStart = startOfWeek();
  let weekly = await db.weeklyReflection.findFirst({
    where: { userId: user.id, weekStart },
  });
  if (!weekly) {
    const stats = await db.userThemeStat.findMany({
      where: { userId: user.id },
      include: { theme: true },
      orderBy: { count: "desc" },
      take: 3,
    });
    const names = stats.map((s) => s.theme.name.toLowerCase());
    weekly = await db.weeklyReflection.create({
      data: {
        userId: user.id,
        weekStart,
        summary: names.length
          ? `You returned to questions about ${names.join(", ").replace(/, ([^,]*)$/, " and $1")}.`
          : "This week was quiet. That is also a pattern.",
      },
    });
  }
  return (
    <div>
      <PageHeader
        title="Your week"
        description={weekly.summary}
        crumbs={[
          { href: "/me", label: "Profile" },
          { label: "This week" },
        ]}
      />
      <div className="mt-10">
        <WeeklyForm weekly={weekly} />
      </div>
    </div>
  );
}
