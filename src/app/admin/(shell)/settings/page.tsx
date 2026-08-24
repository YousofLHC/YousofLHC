import { readJsonFile } from "@/lib/admin/store";
import { DataStudio } from "@/components/admin/data-studio-v2";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const site = await readJsonFile("site.json");
  const content = await readJsonFile("content.json");

  return (
    <div className="space-y-6">
      <header>
        <p className="section-kicker">site settings</p>
        <h1 className="heading text-2xl sm:text-3xl">Identity · socials · navigation</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-dim">
          Everything in <code className="rounded bg-panel px-1.5 py-0.5 font-mono text-[11px]">content/data/site.json</code> —
          name, tagline, meta description, canonical URL, email, availability,
          Calendly/Formspree, social links (12 presets + unlimited custom) and
          the navbar order.
        </p>
      </header>

      <DataStudio
        initial={{ "content.json": content, "site.json": site }}
        group="site"
      />
    </div>
  );
}
