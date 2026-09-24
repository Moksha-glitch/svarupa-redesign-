import Link from "next/link";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  body,
  action,
  href,
}: {
  title: string;
  body: string;
  action?: string;
  href?: string;
}) {
  return (
    <div className="surface-card px-8 py-16 text-center">
      <h2 className="text-h2">{title}</h2>
      <p className="mx-auto mt-4 max-w-md text-body">{body}</p>
      {action && href ? (
        <Link
          href={href}
          className={cn(
            "mt-8 inline-flex min-h-11 items-center rounded-xl bg-charcoal px-5 text-ivory",
          )}
        >
          {action}
        </Link>
      ) : null}
    </div>
  );
}
