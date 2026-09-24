export function InnerMap({
  items,
}: {
  items: { name: string; count: number }[];
}) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div className="space-y-5">
      {items.map((item) => (
        <div key={item.name}>
          <div className="mb-1.5 flex items-baseline justify-between">
            <p className="text-sm tracking-[0.16em] text-ink uppercase">{item.name}</p>
            <p className="text-xs text-muted">{item.count}</p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-stone">
            <div
              className="h-full rounded-full bg-copper/70"
              style={{ width: `${Math.max(8, (item.count / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function WeeklyReflectionView({
  summary,
  whatChanged,
  whatRepeated,
  whatSurprised,
  carryForward,
}: {
  summary: string;
  whatChanged?: string | null;
  whatRepeated?: string | null;
  whatSurprised?: string | null;
  carryForward?: string | null;
}) {
  const blocks = [
    ["What changed?", whatChanged],
    ["What repeated?", whatRepeated],
    ["What surprised you?", whatSurprised],
    ["One thing worth carrying forward", carryForward],
  ].filter(([, v]) => v);
  return (
    <article className="surface-card p-7 sm:p-10">
      <p className="text-caption">Your week</p>
      <p className="mt-4 text-quote">{summary}</p>
      <div className="mt-8 space-y-6">
        {blocks.map(([k, v]) => (
          <section key={k}>
            <h3 className="text-sm text-muted">{k}</h3>
            <p className="mt-1 text-lg leading-relaxed text-charcoal-soft">{v}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
