import { readJsonFile } from "@/lib/admin/store";
import { DataStudio } from "@/components/admin/data-studio-v2";

export const dynamic = "force-dynamic";

export default async function AdminDataPage() {
  const content = await readJsonFile("content.json");
  const site = await readJsonFile("site.json");

  return (
    <div className="space-y-6">
      <header>
        <p className="section-kicker">content studio</p>
        <h1 className="heading text-2xl sm:text-3xl">Every element, editable.</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-dim">
          Schema-driven editing for the entire site — profile, résumé blocks,
          publications, skills, projects, services, research domains, site
          identity, socials and navigation. Saving writes
          <code className="mx-1 rounded bg-panel px-1.5 py-0.5 font-mono text-[11px]">content/data/*.json</code>
          and regenerates typed modules automatically.
        </p>
      </header>

      <DataStudio initial={{ "content.json": content, "site.json": site }} group="all" />
    </div>
  );
}
