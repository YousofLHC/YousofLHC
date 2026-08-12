import "katex/contrib/mhchem";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import { CodeBlock } from "@/components/ui/code-block";
import { Lightbox } from "@/components/ui/lightbox";
import type { Notebook, NotebookCell } from "@/lib/notebooks";

function MarkdownCell({ source }: { source: string }) {
  return (
    <div className="rich max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false, trust: false }]]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}

function OutputView({ output }: { output: NonNullable<NotebookCell["outputs"]>[number] }) {
  if (output.outputType === "stream") {
    return (
      <pre className="overflow-x-auto border-l-2 border-emerald/50 bg-emerald/5 px-4 py-3 font-mono text-[12.5px] leading-6 text-emerald/90">
        {output.text}
      </pre>
    );
  }

  if (output.outputType === "error") {
    return (
      <div className="overflow-x-auto rounded-lg border border-magenta/40 bg-magenta/5 px-4 py-3">
        <p className="mb-2 font-mono text-xs font-semibold text-magenta">
          ⛔ {output.errorValue}
        </p>
        {(output.traceback ?? []).slice(-3).map((line, i) => (
          <pre key={i} className="font-mono text-[11.5px] leading-5 text-dim">
            {line}
          </pre>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {output.html && (
        <div className="overflow-x-auto rounded-lg border border-line bg-white/95 px-4 py-3 text-sm text-neutral-900 [&_table]:w-full">
          <div dangerouslySetInnerHTML={{ __html: output.html }} />
        </div>
      )}
      {output.image && (
        output.imageMime === "image/svg+xml" ? (
          <div
            className="overflow-x-auto rounded-lg border border-line bg-white p-3"
            dangerouslySetInnerHTML={{ __html: output.image }}
          />
        ) : (
          <Lightbox src={output.image} alt="notebook output" />
        )
      )}
      {output.text && (
        <pre className="overflow-x-auto border-l-2 border-cyan/40 bg-panel/40 px-4 py-3 font-mono text-[12.5px] leading-6 text-ink/90">
          {output.text}
        </pre>
      )}
    </div>
  );
}

export function NotebookViewer({ notebook }: { notebook: Notebook }) {
  return (
    <div className="space-y-8">
      {notebook.cells.map((cell) => (
        <section key={cell.index} className="group relative">
          <div className="mb-2 flex items-center gap-2 font-mono text-[11px] text-faint">
            <span
              className={`rounded px-1.5 py-0.5 ${
                cell.cellType === "code"
                  ? "bg-cyan/15 text-cyan"
                  : "bg-violet/15 text-violet"
              }`}
            >
              {cell.cellType === "code" ? "code" : "md"}
            </span>
            <span>cell {cell.index}</span>
            {cell.cellType === "code" && cell.executionCount != null && (
              <span className="text-emerald">✓ executed #{cell.executionCount}</span>
            )}
          </div>

          {cell.cellType === "markdown" ? (
            <MarkdownCell source={cell.source} />
          ) : (
            <CodeBlock code={cell.source} language={notebook.language} showLineNumbers />
          )}

          {cell.outputs && cell.outputs.length > 0 && (
            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-faint">
                <span className="h-px w-4 bg-line-strong" />
                output
              </div>
              {cell.outputs.map((o, i) => (
                <OutputView key={i} output={o} />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
