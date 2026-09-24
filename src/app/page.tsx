import Link from "next/link";
import { Atmosphere } from "@/components/svarupa/Atmosphere";
import { SvarupaLogo } from "@/components/svarupa/SvarupaLogo";

const stages = [
  { name: "Notice", body: "What are you feeling?" },
  { name: "Understand", body: "What is underneath it?" },
  { name: "Explore", body: "What can wisdom teach you about it?" },
  { name: "Practice", body: "What can you do with that understanding?" },
];

const texts = [
  { name: "Bhagavad Gita", body: "Action, duty, and the fruit of work — read with context, not as a slogan." },
  { name: "Upanishads", body: "Questions of self and world, cited verse by verse." },
  { name: "Yoga Sutras", body: "A map of the mind's movements, not a studio timetable." },
  { name: "Vedanta", body: "More than one school. Identity, qualified identity, difference." },
  { name: "Sankhya", body: "Seer and seen. A different grammar of the person." },
  { name: "Bhakti", body: "Love as a path — lived in many tongues, not one aesthetic." },
];

const themes = [
  { name: "Control", n: 80 },
  { name: "Fear", n: 62 },
  { name: "Comparison", n: 54 },
  { name: "Purpose", n: 90 },
  { name: "Attachment", n: 48 },
  { name: "Relationships", n: 40 },
];

const practices = ["Meditation", "Breathwork", "Pranayama", "Self-inquiry", "Journaling", "Mantra", "Mindful action"];

export default function LandingPage() {
  return (
    <div className="paper-grain relative min-h-dvh overflow-hidden">
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <SvarupaLogo />
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/explore" className="text-charcoal-soft hover:text-ink">
            Wisdom
          </Link>
          <Link href="/login" className="text-charcoal-soft hover:text-ink">
            Enter
          </Link>
          <Link
            href="/signup"
            className="inline-flex min-h-11 items-center rounded-xl bg-charcoal px-4 text-ivory "
          >
            Begin
          </Link>
        </nav>
      </header>

      <section className="relative mx-auto min-h-[88dvh] max-w-6xl px-6 pb-24 pt-8 sm:pt-16">
        <Atmosphere />
        <div className="relative z-10 mx-auto max-w-3xl pt-10 text-center sm:pt-20">
          <p className="text-xs tracking-[0.35em] text-copper uppercase">Look within.</p>
          <h1 className="mt-6 text-display">SVARUPA</h1>
          <p className="mx-auto mt-8 max-w-xl text-body-lg sm:text-2xl">
            A quiet space to understand what you're feeling, explore ancient wisdom, and build
            practices for everyday life.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex min-h-12 items-center rounded-xl bg-charcoal px-6 text-ivory "
            >
              Begin your journey
            </Link>
            <Link
              href="/explore"
              className="inline-flex min-h-12 items-center rounded-xl border border-border px-6 text-charcoal"
            >
              Explore the wisdom
            </Link>
          </div>
          <p className="mt-8 text-sm text-muted">Modern reflection. Ancient wisdom.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">
          Sometimes you don't need advice.
        </h2>
        <p className="mt-6 text-xl leading-relaxed text-charcoal-soft">
          Sometimes you need a place to slow down, understand what is happening inside you, and see
          your situation from another perspective.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-xs tracking-[0.2em] text-copper uppercase">The SVARUPA approach</p>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {stages.map((stage, i) => (
            <div key={stage.name} className="surface-card p-6">
              <p className="text-sm text-muted">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-4 font-serif text-3xl text-ink">{stage.name}</h3>
              <p className="mt-3 text-charcoal-soft">{stage.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="max-w-2xl font-serif text-4xl text-ink">Ancient wisdom, contextualized</h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          SVARUPA offers context and more than one reading. No school is presented as the whole of
          Indian thought.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {texts.map((t) => (
            <article key={t.name} className="surface-card p-6">
              <h3 className="font-serif text-2xl text-ink">{t.name}</h3>
              <p className="mt-3 leading-relaxed text-muted">{t.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="font-serif text-4xl text-ink">Your inner map</h2>
        <p className="mt-3 text-lg text-muted">Recurring themes — not diagnoses.</p>
        <div className="mt-10 space-y-5">
          {themes.map((t) => (
            <div key={t.name}>
              <p className="mb-1.5 text-sm tracking-[0.16em] uppercase">{t.name}</p>
              <div className="h-2 rounded-full bg-stone">
                <div className="h-full rounded-full bg-copper/70" style={{ width: `${t.n}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-serif text-4xl text-ink">Practice</h2>
        <p className="mt-3 max-w-xl text-lg text-muted">Small enough to return to. Not a streak to defend.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {practices.map((p) => (
            <span key={p} className="rounded-full border border-border bg-surface px-4 py-2 text-sm">
              {p}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="font-serif text-4xl text-ink">Your inner world belongs to you.</h2>
        <p className="mt-6 text-lg leading-relaxed text-charcoal-soft">
          Journal entries and reflections are private. They are not a feed. They are not indexed for
          other people. SVARUPA is a companion for looking inward — not a licensed therapist, and not
          a diagnostic tool.
        </p>
        <Link
          href="/signup"
          className="mt-10 inline-flex min-h-12 items-center rounded-xl bg-charcoal px-6 text-ivory "
        >
          Begin your journey
        </Link>
      </section>
    </div>
  );
}
