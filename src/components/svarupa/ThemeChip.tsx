import Link from "next/link";
import { cn } from "@/lib/utils";

export function ThemeChip({
  label,
  href,
  className,
}: {
  label: string;
  href?: string;
  className?: string;
}) {
  const classes = cn(
    "inline-flex min-h-8 items-center rounded-full border border-border bg-surface-subtle px-3 py-1 text-xs tracking-wide text-charcoal-soft",
    className,
  );
  if (href) {
    return (
      <Link href={href} className={classes}>
        {label}
      </Link>
    );
  }
  return <span className={classes}>{label}</span>;
}
