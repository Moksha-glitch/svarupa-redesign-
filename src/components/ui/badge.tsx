import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface-subtle px-3 py-1 text-caption",
        className,
      )}
    >
      {children}
    </span>
  );
}
