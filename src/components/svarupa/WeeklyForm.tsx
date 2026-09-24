"use client";

import { saveWeeklyAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { useState } from "react";

export function WeeklyForm({
  weekly,
}: {
  weekly: {
    id: string;
    whatChanged: string | null;
    whatRepeated: string | null;
    whatSurprised: string | null;
    carryForward: string | null;
  };
}) {
  const [form, setForm] = useState({
    whatChanged: weekly.whatChanged || "",
    whatRepeated: weekly.whatRepeated || "",
    whatSurprised: weekly.whatSurprised || "",
    carryForward: weekly.carryForward || "",
  });
  const [saved, setSaved] = useState(false);
  return (
    <form
      className="space-y-6"
      onSubmit={async (e) => {
        e.preventDefault();
        await saveWeeklyAction(weekly.id, form);
        setSaved(true);
      }}
    >
      {(
        [
          ["whatChanged", "What changed?"],
          ["whatRepeated", "What repeated?"],
          ["whatSurprised", "What surprised you?"],
          ["carryForward", "One thing worth carrying forward"],
        ] as const
      ).map(([k, label]) => (
        <label key={k} className="block">
          <span className="text-h3">{label}</span>
          <Textarea
            className="mt-2"
            value={form[k]}
            onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
          />
        </label>
      ))}
      <Button type="submit">{saved ? "Kept" : "Save this week"}</Button>
    </form>
  );
}
