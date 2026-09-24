"use client";

import { useActionState } from "react";
import { forgotPasswordAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SvarupaLogo } from "@/components/svarupa/SvarupaLogo";

export default function ForgotPage() {
  const [state, action, pending] = useActionState(forgotPasswordAction, null);
  return (
    <main className="paper-grain mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6">
      <SvarupaLogo />
      <h1 className="mt-12 font-serif text-4xl text-ink">Reset, gently</h1>
      <form action={action} className="mt-8 space-y-4">
        <Input name="email" type="email" placeholder="Email" required />
        <Button type="submit" disabled={pending}>
          Send a reset path
        </Button>
      </form>
      {state && "message" in state ? <p className="mt-4 text-sm text-muted">{state.message}</p> : null}
      {state && "devLink" in state && state.devLink ? (
        <p className="mt-3 break-all text-sm">
          Development link:{" "}
          <a className="underline" href={state.devLink}>
            {state.devLink}
          </a>
        </p>
      ) : null}
    </main>
  );
}
