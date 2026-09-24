import Link from "next/link";
import { cn } from "@/lib/utils";

export function SvarupaLogo({
  className,
  href = "/",
  size = "md",
}: {
  className?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
}) {
  const text = size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-xl";
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-3 text-charcoal", className)}
      aria-label="SVARUPA home"
    >
      <span className="relative grid size-8 place-items-center" aria-hidden>
        <span className="absolute inset-0 rounded-full border border-copper/50" />
        <span className="absolute inset-1.5 rounded-full border border-terracotta/40" />
        <span className="size-1.5 rounded-full bg-terracotta/80" />
      </span>
      <span className={cn("font-serif tracking-[0.18em]", text)}>SVARUPA</span>
    </Link>
  );
}
