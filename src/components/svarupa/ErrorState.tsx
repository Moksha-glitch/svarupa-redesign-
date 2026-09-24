import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ErrorState({
  title = "Something went wrong.",
  body = "Check your connection and try again.",
  onRetry,
  backHref = "/home",
  backLabel = "Go back",
}: {
  title?: string;
  body?: string;
  onRetry?: () => void;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="surface-card px-8 py-14 text-center" role="alert">
      <h2 className="text-h2">{title}</h2>
      <p className="mx-auto mt-4 max-w-md text-body">{body}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {onRetry ? (
          <Button type="button" onClick={onRetry}>
            Try again
          </Button>
        ) : null}
        <Button asChild variant="secondary">
          <Link href={backHref}>{backLabel}</Link>
        </Button>
      </div>
    </div>
  );
}
