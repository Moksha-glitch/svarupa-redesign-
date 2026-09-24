"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, PenLine, User, Wind } from "lucide-react";
import { NAV_ACCOUNT, NAV_DESKTOP, NAV_MOBILE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { SvarupaLogo } from "./SvarupaLogo";

const icons: Record<string, typeof Home> = {
  Home,
  Reflect: PenLine,
  Wisdom: BookOpen,
  Practice: Wind,
  Me: User,
};

function isActive(pathname: string, href: string) {
  if (href === "/home") return pathname === "/home";
  if (href === "/me") return pathname === "/me" || pathname.startsWith("/me/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNavigation({
  userName,
}: {
  userName?: string | null;
}) {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-border bg-surface/70 px-5 py-8 lg:flex">
      <SvarupaLogo href="/home" />
      <p className="mt-8 text-sm leading-relaxed text-muted">
        {userName ? `${userName}, look within.` : "Look within."}
      </p>
      <nav className="mt-10 flex flex-col gap-1" aria-label="Primary">
        {NAV_DESKTOP.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-xl px-3 py-2.5 text-[1.05rem] transition-colors",
                active
                  ? "bg-stone font-medium text-ink shadow-[inset_3px_0_0_var(--charcoal)]"
                  : "text-charcoal-soft hover:bg-stone/50 hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8 border-t border-border pt-6">
        <nav className="flex flex-col gap-1" aria-label="Account">
          {NAV_ACCOUNT.map((item) => {
            const active =
              item.href === "/me"
                ? pathname === "/me"
                : isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm transition-colors",
                  active ? "bg-stone font-medium text-ink" : "text-muted hover:bg-stone/50 hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/search"
            className={cn(
              "rounded-xl px-3 py-2 text-sm transition-colors",
              pathname.startsWith("/search") ? "bg-stone font-medium text-ink" : "text-muted hover:text-ink",
            )}
          >
            Search
          </Link>
        </nav>
      </div>
      <p className="mt-auto pt-8 text-xs leading-5 text-muted">
        A reflection companion — not a therapist.
      </p>
    </aside>
  );
}

export function BottomNavigation() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-ivory/92 px-1 pb-[max(0.55rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-md lg:hidden"
      aria-label="Primary"
    >
      <ul className="grid grid-cols-5">
        {NAV_MOBILE.map((item) => {
          const Icon = icons[item.label] ?? Home;
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[0.68rem] tracking-wide",
                  active ? "font-medium text-ink" : "text-muted",
                )}
              >
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-full",
                    active && "bg-stone",
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
