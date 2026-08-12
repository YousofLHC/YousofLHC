import type { Metadata } from "next";
import Link from "next/link";
import { NotebookText } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { KnowledgeHub } from "@/components/knowledge/knowledge-hub";
import { listArticles } from "@/lib/mdx";
import { listNotebooks } from "@/lib/notebooks";

export const metadata: Metadata = {
  title: "Notes & Notebooks",
  description:
    "One knowledge hub — organized study notes with LaTeX math and diagrams, plus interactive Jupyter notebooks you can open and run in Colab.",
};

export default async function NotesPage() {
  const notes = await listArticles("notes");
  const notebooks = listNotebooks().map(({ slug, title, description, tags, date, language, cellCounts, thumbnail }) => ({
    slug,
    title,
    description,
    tags,
    date,
    language,
    cellCounts,
    thumbnail,
  }));

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-28">
      <Reveal>
        <p className="section-kicker">knowledge hub</p>
        <h1 className="heading mt-3 max-w-3xl text-4xl sm:text-5xl">
          Notes & <span className="text-grad-cyan">notebooks</span>
        </h1>
        <p className="mt-4 max-w-2xl text-dim">
          Everything I study and run, in one place — structured study notes with LaTeX math
          and diagrams, plus interactive notebooks you can open and execute in Colab.
        </p>
      </Reveal>

      <KnowledgeHub notes={notes} notebooks={notebooks} />

      <Reveal>
        <div className="mt-16 flex items-center gap-3 rounded-2xl border border-line bg-panel/50 p-6">
          <NotebookText size={18} className="text-cyan" />
          <p className="text-sm text-dim">
            Want a full course worth of notes on a topic? Request it through the{" "}
            <Link href="/connect" className="text-cyan hover:underline">
              contact form
            </Link>{" "}
            — I often turn requested topics into illustrated notebooks.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
