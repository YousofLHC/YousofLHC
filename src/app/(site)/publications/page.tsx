import type { Metadata } from "next";
import { ExternalLink, FileText } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { publications } from "@/lib/data";

export const metadata: Metadata = {
  title: "Publications",
  description:
    "Academic publications, preprints and reports — anomaly detection, message passing, optimization and machine learning.",
};

const statusColor: Record<string, string> = {
  published: "text-emerald border-emerald/40 bg-emerald/10",
  "in-press": "text-cyan border-cyan/40 bg-cyan/10",
  preprint: "text-violet border-violet/40 bg-violet/10",
  "under-review": "text-amber border-amber/40 bg-amber/10",
};

export default function PublicationsPage() {
  const sorted = [...publications].sort((a, b) =>
    (b.year || "").localeCompare(a.year || "")
  );

  return (
    <div className="mx-auto max-w-4xl px-5 pb-24 pt-28">
      <Reveal>
        <p className="section-kicker">research / publications</p>
        <h1 className="heading mt-3 max-w-3xl text-4xl sm:text-5xl">
          Publications <span className="text-grad-cyan">&amp; preprints</span>
        </h1>
        <p className="mt-4 max-w-2xl text-dim">
          Papers, thesis work, and reports on anomaly detection, message passing,
          optimization and machine learning. Entries are sample placeholders —
          edit them from the admin panel.
        </p>
      </Reveal>

      <div className="mt-10 space-y-4">
        {sorted.map((p, i) => (
          <Reveal key={`${p.year}-${p.title}`} delay={Math.min(i * 0.05, 0.3)}>
            <article className="card group p-5 transition-all hover:border-cyan/40">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="max-w-2xl">
                  <h3 className="font-medium leading-snug text-ink">
                    <span className="text-cyan">[{p.year}]</span> {p.title}
                  </h3>
                  <p className="mt-1.5 font-mono text-xs text-faint">{p.authors}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-dim">
                    <FileText size={12} className="text-faint" />
                    {p.venue}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${statusColor[p.status]}`}
                >
                  {p.status}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-panel-2 px-2 py-0.5 font-mono text-[10px] text-dim"
                  >
                    {t}
                  </span>
                ))}
                {p.cite && (
                  <span className="ml-auto flex items-center gap-1 font-mono text-[10px] text-faint">
                    <ExternalLink size={10} />
                    {p.cite}
                  </span>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}