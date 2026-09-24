"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignupForm() {
  const [state, action, pending] = useActionState(signupAction, null);
  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="text-sm text-muted">Name</span>
        <Input name="name" autoComplete="name" className="mt-1" />
      </label>
      <label className="block">
        <span className="text-sm text-muted">Email</span>
        <Input name="email" type="email" autoComplete="email" required className="mt-1" />
      </label>
      <label className="block">
        <span className="text-sm text-muted">Password</span>
        <Input name="password" type="password" autoComplete="new-password" required className="mt-1" minLength={8} />
      </label>
      {state && "error" in state && state.error ? (
        <p className="text-sm text-terracotta" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creating…" : "Begin"}
      </Button>
      <a
        href="/api/auth/google"
        className="flex h-11 items-center justify-center rounded-xl border border-line text-sm text-charcoal-soft"
      >
        Continue with Google
      </a>
      <p className="text-center text-sm text-muted">
        Already here?{" "}
        <Link href="/login" className="underline-offset-4 hover:underline">
          Enter
        </Link>
      </p>
    </form>
  );
}
