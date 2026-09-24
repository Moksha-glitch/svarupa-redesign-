import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

export default async function SourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const source = await db.wisdomSource.findUnique({
    where: { slug },
    include: {
      scriptures: {
        include: {
          chapters: {
            include: { verses: { orderBy: { number: "asc" } } },
            orderBy: { number: "asc" },
          },
        },
      },
    },
  });
  const tradition = !source
    ? await db.philosophicalTradition.findUnique({ where: { slug } })
    : null;
  if (!source && !tradition) notFound();

  if (tradition) {
    return (
      <article>
        <p className="text-caption">Traditional perspective · one school among others</p>
        <h1 className="mt-3 text-h1">{tradition.name}</h1>
        <p className="mt-6 text-xl leading-relaxed text-charcoal-soft">{tradition.summary}</p>
        <section className="mt-10 space-y-6">
          <div>
            <h2 className="text-h3">On suffering</h2>
            <p className="mt-2 leading-relaxed text-muted">{tradition.viewOnSuffering}</p>
          </div>
          <div>
            <h2 className="text-h3">On self</h2>
            <p className="mt-2 leading-relaxed text-muted">{tradition.viewOnSelf}</p>
          </div>
          <div>
            <h2 className="text-h3">On practice</h2>
            <p className="mt-2 leading-relaxed text-muted">{tradition.viewOnPractice}</p>
          </div>
        </section>
        <Link href={`/wisdom/lenses/suffering`} className="mt-10 inline-block text-sm text-copper">
          Compare lenses on suffering
        </Link>
      </article>
    );
  }

  return (
    <article>
      <p className="text-caption">{source!.category}</p>
      <h1 className="mt-3 text-h1">{source!.name}</h1>
      <p className="mt-6 max-w-2xl text-xl leading-relaxed text-charcoal-soft">{source!.description}</p>
      {source!.tradition ? <p className="mt-3 text-sm text-muted">{source!.tradition}</p> : null}
      <div className="mt-12 space-y-10">
        {source!.scriptures.map((book) => (
          <section key={book.id}>
            <h2 className="text-h2">{book.title}</h2>
            <p className="mt-2 text-muted">{book.description}</p>
            {book.chapters.map((ch) => (
              <div key={ch.id} className="mt-8">
                <h3 className="text-lg">
                  Chapter {ch.number} · {ch.title}
                </h3>
                <p className="text-sm text-muted">{ch.subtitle}</p>
                <ul className="mt-4 space-y-3">
                  {ch.verses.map((v) => (
                    <li key={v.id}>
                      <Link href={`/wisdom/verse/${v.id}`} className="block surface-card p-5 transition-colors hover:border-line-strong">
                        <p className="text-sm text-copper">{v.citation}</p>
                        <p className="mt-1 font-serif text-xl leading-snug">“{v.translation}”</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
