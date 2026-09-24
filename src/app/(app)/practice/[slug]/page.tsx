import { notFound } from "next/navigation";
import { parseJson } from "@/lib/utils";
import { db } from "@/lib/db";
import { sitWithQuestionAction } from "@/app/actions";
import { PracticePlayer } from "@/components/svarupa/PracticePlayer";
import { Breadcrumb } from "@/components/svarupa/Breadcrumb";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function PracticeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === "sadhana") notFound();
  const practice = await db.practice.findUnique({ where: { slug } });
  if (!practice) notFound();
  const steps = parseJson<string[]>(practice.steps, []);
  return (
    <article>
      <Breadcrumb
        items={[
          { href: "/practice", label: "Practice" },
          { label: practice.title },
        ]}
      />
      <p className="mt-6 text-caption">
        {practice.category} · {practice.durationMin} min
      </p>
      <h1 className="mt-3 text-h1">{practice.title}</h1>
      <p className="mt-5 max-w-xl text-body-lg">{practice.description}</p>
      <p className="mt-4 text-body">{practice.guidance}</p>
      <ol className="mt-10 list-decimal space-y-3 pl-5 text-lg">
        {steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <div className="mt-10 flex flex-wrap gap-3">
        <PracticePlayer
          practiceId={practice.id}
          title={practice.title}
          durationMin={practice.durationMin}
          guidance={practice.guidance}
        />
        {practice.sitQuestion ? (
          <form action={sitWithQuestionAction.bind(null, practice.sitQuestion)}>
            <Button variant="secondary" type="submit">
              Sit with this
            </Button>
          </form>
        ) : null}
      </div>
      <p className="mt-8 text-body-sm">
        Guided audio can live here later. For now, the practice is the sitting itself.{" "}
        <Link href="/practice" className="underline-offset-4 hover:underline">
          All practices
        </Link>
      </p>
    </article>
  );
}
