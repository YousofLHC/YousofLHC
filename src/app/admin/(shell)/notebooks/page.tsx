import Link from "next/link";
import { readFileSync, readdirSync } from "fs";
import path from "path";
import { FileCode2, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NotebooksAdminPage() {
  const dir = path.join(process.cwd(), "public", "notebooks");
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".ipynb"))
    .sort();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <p className="font-mono text-[11px] uppercase tracking-wider text-faint">
        {files.length} notebooks · public/notebooks/*.ipynb
      </p>
      <div className="overflow-hidden rounded-xl border border-line bg-void/40">
        {files.length === 0 && <p className="p-6 font-mono text-sm text-faint">No notebooks found.</p>}
        {files.map((f, i) => (
          <div
            key={f}
            className={`flex items-center justify-between gap-4 px-5 py-3.5 ${
              i > 0 ? "border-t border-line" : ""
            }`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <FileCode2 size={16} className="shrink-0 text-cyan" />
              <span className="truncate font-mono text-sm text-ink">{f}</span>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <span className="font-mono text-xs text-faint">
                {(readFileSync(path.join(dir, f)).length / 1024).toFixed(1)} KB
              </span>
              <Link
                href={`/notebooks/${path.basename(f, ".ipynb")}`}
                className="inline-flex items-center gap-1.5 font-mono text-xs text-cyan hover:underline"
              >
                view <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        ))}
      </div>
      <p className="font-mono text-xs text-faint">
        Notebooks are authored as <span className="text-dim">.ipynb</span> files in <span className="text-dim">content/notebooks/</span> and
        copied to <span className="text-dim">public/notebooks/</span> at build time. The <span className="text-dim">Save &amp; regenerate</span> action on the
        Data page syncs them and rebuilds the generated content.
      </p>
    </div>
  );
}