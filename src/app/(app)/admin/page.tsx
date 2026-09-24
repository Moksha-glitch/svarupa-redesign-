import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminAddCommentary, adminToggleVerse, adminUpdatePractice } from "@/app/admin-actions";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
  const user = await getSession();
  if (!user || user.role !== "admin") redirect("/home");
  const [verses, practices] = await Promise.all([
    db.scriptureVerse.findMany({
      include: { chapter: { include: { scripture: true } }, commentaries: true },
      orderBy: { citation: "asc" },
    }),
    db.practice.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  return (
    <div className="space-y-16">
      <div>
        <h1 className="font-serif text-5xl text-ink">Content</h1>
        <p className="mt-2 text-muted">
          Provenance matters. Label original text, translation, traditional commentary, and modern interpretation separately.
        </p>
      </div>
      <section>
        <h2 className="font-serif text-3xl">Verses</h2>
        <div className="mt-6 space-y-6">
          {verses.map((v) => (
            <article key={v.id} className="rounded-2xl border border-line bg-paper p-5">
              <p className="text-sm text-copper">{v.citation}</p>
              <p className="mt-1 text-sm text-muted">
                {v.translator} · {v.provenance} · {v.published ? "published" : "hidden"}
              </p>
              <p className="mt-2 font-deva text-lg">{v.sanskrit}</p>
              <form action={adminToggleVerse.bind(null, v.id, !v.published)} className="mt-3">
                <Button variant="secondary" type="submit">
                  {v.published ? "Unpublish" : "Publish"}
                </Button>
              </form>
              <form action={adminAddCommentary.bind(null, v.id)} className="mt-4 grid gap-2">
                <input name="tradition" placeholder="Tradition" className="writing-surface h-10 px-3 text-sm" />
                <select name="kind" className="writing-surface h-10 px-3 text-sm">
                  <option value="traditional">Traditional commentary</option>
                  <option value="modern">Modern interpretation</option>
                </select>
                <input name="author" placeholder="Author" className="writing-surface h-10 px-3 text-sm" />
                <textarea name="body" placeholder="Commentary body" className="writing-surface min-h-20 px-3 py-2 text-sm" />
                <input name="citation" placeholder="Citation" className="writing-surface h-10 px-3 text-sm" />
                <Button type="submit" size="sm">
                  Add commentary
                </Button>
              </form>
            </article>
          ))}
        </div>
      </section>
      <section>
        <h2 className="font-serif text-3xl">Practices</h2>
        <div className="mt-6 space-y-6">
          {practices.map((p) => (
            <form
              key={p.id}
              className="rounded-2xl border border-line bg-paper p-5 space-y-2"
              action={async (form) => {
                "use server";
                await adminUpdatePractice(p.id, {
                  title: String(form.get("title")),
                  description: String(form.get("description")),
                  guidance: String(form.get("guidance")),
                  published: form.get("published") === "on",
                });
              }}
            >
              <input name="title" defaultValue={p.title} className="writing-surface h-10 w-full px-3" />
              <textarea name="description" defaultValue={p.description} className="writing-surface min-h-16 w-full px-3 py-2" />
              <textarea name="guidance" defaultValue={p.guidance} className="writing-surface min-h-16 w-full px-3 py-2" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="published" defaultChecked={p.published} />
                Published
              </label>
              <Button type="submit" size="sm">
                Save practice
              </Button>
            </form>
          ))}
        </div>
      </section>
    </div>
  );
}
