import { readJsonFile } from "@/lib/admin/store";
import { ResumeStudio } from "@/components/admin/resume-studio";

export const dynamic = "force-dynamic";

export default async function AdminResumePage() {
  const content = await readJsonFile("content.json");
  const site = await readJsonFile("site.json");

  return (
    <div className="space-y-6">
      <header>
        <p className="section-kicker">résumé studio</p>
        <h1 className="heading text-2xl sm:text-3xl">Your CV, precision-crafted.</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-dim">
          Every résumé block — education, experience with bullet details,
          publications (authors · venue · BibTeX), awards, certifications,
          skills with levels, languages — edited live against a real preview.
          Inline <code className="rounded bg-panel px-1.5 py-0.5 font-mono text-[11px]">\(\LaTeX\)</code> and{" "}
          <code className="rounded bg-panel px-1.5 py-0.5 font-mono text-[11px]">\ce{}</code> supported.
        </p>
      </header>

      <ResumeStudio initial={{ "content.json": content, "site.json": site }} />
    </div>
  );
}
