"use client";

import { useActionState } from "react";
import Link from "next/link";
import { demoLoginAction, loginAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, null);
  return (
    <div className="space-y-6">
      <form action={action} className="space-y-4">
        <input type="hidden" name="next" value={next || "/home"} />
        <label className="block">
          <span className="text-sm text-muted">Email</span>
          <Input name="email" type="email" autoComplete="email" required className="mt-1" />
        </label>
        <label className="block">
          <span className="text-sm text-muted">Password</span>
          <Input name="password" type="password" autoComplete="current-password" required className="mt-1" />
        </label>
        {state && "error" in state && state.error ? (
          <p className="text-sm text-terracotta" role="alert">
            {state.error}
          </p>
        ) : null}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Entering…" : "Enter"}
        </Button>
      </form>
      <a
        href="/api/auth/google"
        className="flex h-11 items-center justify-center rounded-xl border border-line text-sm text-charcoal-soft"
      >
        Continue with Google
      </a>
      <form action={demoLoginAction}>
        <Button type="submit" variant="ghost" className="w-full">
          Continue with a sample journey
        </Button>
      </form>
      <p className="text-center text-sm text-muted">
        <Link href="/forgot-password" className="underline-offset-4 hover:underline">
          Forgot password
        </Link>
        <span className="mx-2">·</span>
        <Link href="/signup" className="underline-offset-4 hover:underline">
          Create a space
        </Link>
      </p>
    </div>
  );
}
