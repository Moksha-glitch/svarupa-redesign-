import Link from "next/link";
import { AppShell } from "@/components/svarupa/AppShell";
import { SvarupaLogo } from "@/components/svarupa/SvarupaLogo";
import { getSession } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) {
    return (
      <div className="paper-grain min-h-dvh">
        <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <SvarupaLogo />
          <Link href="/login" className="rounded-xl bg-charcoal px-4 py-2 text-sm text-ivory">
            Enter
          </Link>
        </header>
        <main id="main" className="mx-auto w-full max-w-5xl px-5 pb-16 sm:px-8">{children}</main>
      </div>
    );
  }
  return <AppShell userName={user.name}>{children}</AppShell>;
}
