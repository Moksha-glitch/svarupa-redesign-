"use client";

import { useTheme } from "next-themes";
import { updatePreferencesAction, deleteAccountAction } from "@/app/actions";
import { AI_TONES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function SettingsClient({
  prefs,
}: {
  prefs: {
    aiTone: string;
    language: string;
    notificationsEnabled: boolean;
    theme: string;
  };
}) {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [tone, setTone] = useState(prefs.aiTone);
  const [notify, setNotify] = useState(prefs.notificationsEnabled);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const selectedTheme = theme || prefs.theme;

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-h2">Voice</h2>
        <div className="mt-4 space-y-2">
          {AI_TONES.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={tone === t.id}
              onClick={async () => {
                setTone(t.id);
                await updatePreferencesAction({ aiTone: t.id });
                toast("Saved");
              }}
              className={cn(
                "block w-full rounded-2xl border px-4 py-3 text-left",
                tone === t.id ? "border-charcoal bg-stone font-medium" : "border-border hover:border-line-strong",
              )}
            >
              <p>{t.label}</p>
              <p className="mt-1 text-body-sm">{t.body}</p>
            </button>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-h2">Appearance</h2>
        <p className="mt-2 text-body-sm">Light, dark, or whatever your system is using.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["light", "dark", "system"].map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={selectedTheme === t}
              className={cn(
                "min-h-11 rounded-full border px-4 py-2 text-sm capitalize",
                selectedTheme === t
                  ? "border-charcoal bg-charcoal text-ivory"
                  : "border-border",
              )}
              onClick={() => {
                setTheme(t);
                void updatePreferencesAction({ theme: t });
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-h2">Notifications</h2>
        <p className="mt-2 text-muted">Never a streak. Something like: a quiet moment is waiting for you.</p>
        <Button
          className="mt-4"
          variant="secondary"
          onClick={async () => {
            const next = !notify;
            setNotify(next);
            await updatePreferencesAction({ notificationsEnabled: next });
            toast(next ? "Gentle reminders on" : "Reminders off");
          }}
        >
          {notify ? "Gentle reminders on" : "Reminders off"}
        </Button>
      </section>
      <section>
        <h2 className="text-h2">Privacy</h2>
        <p className="mt-2 max-w-xl text-muted">
          Journal and reflections are yours. They are not public URLs, and they are not shown to other people.
        </p>
        <a href="/api/export" className="mt-4 inline-flex min-h-11 items-center rounded-xl border border-border px-4">
          Export my data
        </a>
      </section>
      <section>
        <h2 className="text-h2">Delete account</h2>
        <p className="mt-2 text-muted">This removes your inner world from SVARUPA.</p>
        {confirmDelete ? (
          <form action={deleteAccountAction} className="mt-4">
            <Button type="submit" variant="terracotta">
              Yes, delete everything
            </Button>
          </form>
        ) : (
          <Button className="mt-4" variant="ghost" onClick={() => setConfirmDelete(true)}>
            Delete account
          </Button>
        )}
      </section>
    </div>
  );
}
