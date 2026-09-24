import { redirect } from "next/navigation";
import { SettingsClient } from "@/components/svarupa/SettingsClient";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata = { robots: { index: false, follow: false } };

export default async function SettingsPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  const prefs = await db.userPreference.findUnique({ where: { userId: user.id } });
  return (
    <div>
      <h1 className="text-h1">Settings</h1>
      <p className="mt-2 text-muted">Language is English for this version. Tone and privacy live here.</p>
      <div className="mt-10">
        <SettingsClient
          prefs={{
            aiTone: prefs?.aiTone || "balanced",
            language: prefs?.language || "en",
            notificationsEnabled: prefs?.notificationsEnabled ?? true,
            theme: prefs?.theme || "system",
          }}
        />
      </div>
    </div>
  );
}
