import Link from "next/link";
import { ThemeChip } from "./ThemeChip";

export function WisdomCard({
  title,
  body,
  citation,
  href,
  kind,
}: {
  title: string;
  body: string;
  citation?: string;
  href: string;
  kind?: string;
}) {
  return (
    <Link href={href} className="group flex h-full flex-col surface-card p-6 transition-colors hover:border-line-strong">
      {kind ? <p className="text-caption">{kind}</p> : null}
      <h3 className="mt-3 text-h3 leading-snug">{title}</h3>
      <p className="mt-3 flex-1 text-body">{body}</p>
      {citation ? <p className="mt-5 text-body-sm text-charcoal-soft">{citation}</p> : null}
    </Link>
  );
}

export function ScriptureCard({
  title,
  subtitle,
  href,
  themes,
}: {
  title: string;
  subtitle: string;
  href: string;
  themes?: string[];
}) {
  return (
    <Link href={href} className="block surface-card p-7 transition-colors hover:border-line-strong">
      <h3 className="text-h2">{title}</h3>
      <p className="mt-3 max-w-xl text-body-lg">{subtitle}</p>
      {themes?.length ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {themes.map((t) => (
            <ThemeChip key={t} label={t} />
          ))}
        </div>
      ) : null}
    </Link>
  );
}

export function PracticeCard({
  title,
  category,
  durationMin,
  description,
  href,
  purpose,
  difficulty,
}: {
  title: string;
  category: string;
  durationMin: number;
  description: string;
  href: string;
  purpose?: string;
  difficulty?: string;
}) {
  return (
    <Link href={href} className="block surface-card p-6 transition-colors hover:border-line-strong">
      <p className="text-caption">
        {category} · {durationMin} min{difficulty ? ` · ${difficulty}` : ""}
      </p>
      <h3 className="mt-3 text-h3">{title}</h3>
      <p className="mt-2 text-body">{description}</p>
      {purpose ? <p className="mt-3 text-body-sm">For {purpose}</p> : null}
    </Link>
  );
}

export function SadhanaCard({
  name,
  timeOfDay,
  durationMin,
  remaining,
  href,
}: {
  name: string;
  timeOfDay: string;
  durationMin: number;
  remaining?: string;
  href: string;
}) {
  return (
    <Link href={href} className="block surface-card p-6 transition-colors hover:border-line-strong">
      <p className="text-caption">{timeOfDay}</p>
      <h3 className="mt-2 text-h3">{name}</h3>
      <p className="mt-2 text-muted">
        {durationMin} minutes{remaining ? ` · ${remaining}` : ""}
      </p>
    </Link>
  );
}

export function JournalCard({
  date,
  excerpt,
  href,
  favorite,
  tags,
}: {
  date: string;
  excerpt: string;
  href: string;
  favorite?: boolean;
  tags?: string[];
}) {
  return (
    <Link href={href} className="block surface-card p-6 transition-colors hover:border-line-strong">
      <div className="flex items-center justify-between gap-3">
        <p className="text-label">{date}</p>
        {favorite ? <span className="text-caption">Kept</span> : null}
      </div>
      <p className="mt-3 text-body-lg text-charcoal-soft">{excerpt}</p>
      {tags?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((t) => (
            <ThemeChip key={t} label={t} />
          ))}
        </div>
      ) : null}
    </Link>
  );
}

export function ReflectionCard({
  title,
  excerpt,
  href,
  status,
}: {
  title: string;
  excerpt: string;
  href: string;
  status?: string;
}) {
  return (
    <Link href={href} className="block surface-card p-6 transition-colors hover:border-line-strong">
      {status === "active" ? (
        <p className="text-caption">Continue where you left off</p>
      ) : (
        <p className="text-caption text-muted">Reflection</p>
      )}
      <h3 className="mt-2 text-h3">{title}</h3>
      <p className="mt-2 text-body">{excerpt}</p>
    </Link>
  );
}
