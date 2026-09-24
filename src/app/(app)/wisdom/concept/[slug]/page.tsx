import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { Breadcrumb } from "@/components/svarupa/Breadcrumb";
import { DepthToggle } from "@/components/svarupa/DepthToggle";

export default async function ConceptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const concept = await db.wisdomConcept.findUnique({
    where: { slug },
    include: { theme: true },
  });
  if (!concept) notFound();
  return (
    <article>
      <Breadcrumb
        items={[
          { href: "/wisdom", label: "Wisdom" },
          { label: concept.name },
        ]}
      />
      <p className="mt-6 text-caption">{concept.theme?.name || "Concept"}</p>
      <h1 className="mt-3 text-h1">{concept.name}</h1>
      <div className="mt-10">
        <DepthToggle simple={concept.modernInterpretation} deep={concept.traditionalPerspective} />
      </div>
      <p className="mt-8 text-body-sm">
        These are labelled interpretations, not a substitute for the primary text.{" "}
        <Link href="/wisdom" className="underline-offset-4 hover:underline">
          Return to the library
        </Link>
      </p>
    </article>
  );
}
