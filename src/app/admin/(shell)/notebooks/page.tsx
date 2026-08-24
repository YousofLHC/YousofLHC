import { listNotebookSources } from "@/lib/admin/store";
import { NotebookManager } from "@/components/admin/notebook-manager";

export const dynamic = "force-dynamic";

export default async function NotebooksAdminPage() {
  const sources = await listNotebookSources();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <p className="section-kicker">jupyter notebooks</p>
        <h1 className="heading text-2xl sm:text-3xl">Upload &amp; sync .ipynb</h1>
        <p className="mt-2 text-sm leading-6 text-dim">
          Cells render with the site pipeline — KaTeX math, mhchem chemistry,
          Prism highlighting for Python / C++ / R / bash, image &amp; HTML
          outputs, plus per-cell execution counters.
        </p>
      </header>

      <NotebookManager sources={sources} />

      <p className="font-mono text-xs leading-5 text-faint">
        Sources live in <span className="text-dim">content/notebooks/*.ipynb</span> and are
        copied to <span className="text-dim">public/notebooks/</span> while{" "}
        <span className="text-dim">src/lib/generated/notebooks.ts</span> is regenerated —
        both handled automatically on upload.
      </p>
    </div>
  );
}
