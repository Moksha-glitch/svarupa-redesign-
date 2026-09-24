export function LoadingState({ label = "Reflecting…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-3 text-muted" role="status" aria-live="polite">
      <span className="animate-breathe size-2.5 rounded-full bg-copper" aria-hidden />
      <span className="text-sm tracking-wide">{label}</span>
    </div>
  );
}
