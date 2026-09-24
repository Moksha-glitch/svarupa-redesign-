"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { resetPasswordAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SvarupaLogo } from "@/components/svarupa/SvarupaLogo";

function Form() {
  const params = useSearchParams();
  const [state, action, pending] = useActionState(resetPasswordAction, null);
  return (
    <form action={action} className="mt-8 space-y-4">
      <input type="hidden" name="token" value={params.get("token") || ""} />
      <Input name="password" type="password" placeholder="New password" minLength={8} required />
      <Button type="submit" disabled={pending}>
        Set new password
      </Button>
      {state && "error" in state && state.error ? (
        <p className="text-sm text-terracotta">{state.error}</p>
      ) : null}
      {state && "ok" in state ? (
        <p className="text-sm text-muted">
          Password updated. You can <a href="/login">enter</a> now.
        </p>
      ) : null}
    </form>
  );
}

export default function ResetPage() {
  return (
    <main className="paper-grain mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6">
      <SvarupaLogo />
      <h1 className="mt-12 font-serif text-4xl text-ink">Choose again</h1>
      <Suspense>
        <Form />
      </Suspense>
    </main>
  );
}
