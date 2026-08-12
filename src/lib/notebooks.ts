import path from "path";
import { readFileSync, readdirSync } from "fs";

const notebookRoot = path.join(process.cwd(), "public", "notebooks");

// Where Colab opens notebooks from — set these when the site repo lives elsewhere.
const ghOwner = process.env.GITHUB_PAGES_OWNER || "YousofLHC";
const ghRepo = process.env.GITHUB_PAGES_REPO || "phd-website";
const ghBranch = process.env.GITHUB_PAGES_BRANCH || "main";

export interface NotebookOutput {
  outputType: "stream" | "display_data" | "execute_result" | "error";
  name?: string;
  text?: string;
  html?: string;
  image?: string; // data URI (png/jpeg) or raw svg markup
  imageMime?: string;
  errorValue?: string;
  traceback?: string[];
}

export interface NotebookCell {
  index: number;
  cellType: "markdown" | "code";
  source: string;
  executionCount?: number;
  outputs?: NotebookOutput[];
  collapsed?: boolean;
}

export interface Notebook {
  slug: string;
  filename: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  language: string;
  kernel: string;
  nbformat: number;
  cells: NotebookCell[];
  cellCounts: { code: number; markdown: number };
  totalLines: number;
  thumbnail?: string;
  cover?: string;
}

interface RawOutput {
  output_type: string;
  name?: string;
  text?: string | string[];
  data?: Record<string, string | string[]>;
  ename?: string;
  evalue?: string;
  traceback?: string[];
}

interface RawCell {
  cell_type?: string;
  source?: string | string[];
  execution_count?: number | null;
  outputs?: RawOutput[];
  metadata?: Record<string, unknown>;
}

interface RawDoc {
  metadata?: {
    title?: string;
    description?: string;
    tags?: string[];
    date?: string;
    cover?: string;
    kernelspec?: { language?: string; display_name?: string };
    language_info?: { name?: string };
    [key: string]: unknown;
  };
  nbformat?: number;
  cells?: RawCell[];
}

function joinLines(value: string | string[] | undefined): string {
  if (!value) return "";
  if (!Array.isArray(value)) return value;
  return value
    .map((line, i) => (i < value.length - 1 && !line.endsWith("\n") ? line + "\n" : line))
    .join("");
}

function toDataUri(mime: string, b64: string): string {
  return `data:${mime};base64,${b64}`;
}

function parseOutput(o: RawOutput): NotebookOutput {
  if (o.output_type === "stream") {
    return { outputType: "stream", name: o.name, text: joinLines(o.text) };
  }
  if (o.output_type === "error") {
    return {
      outputType: "error",
      errorValue: `${o.ename}: ${o.evalue}`,
      traceback: (o.traceback || []).map((t) => t.replace(/\x1b\[[0-9;]*m/g, "")),
    };
  }
  const type = o.output_type === "execute_result" ? "execute_result" : "display_data";
  const data = o.data || {};
  const out: NotebookOutput = { outputType: type };

  if (typeof data["image/svg+xml"] === "string") {
    out.image = data["image/svg+xml"];
    out.imageMime = "image/svg+xml";
  } else if (data["image/png"]) {
    out.image = toDataUri("image/png", joinLines(data["image/png"]));
    out.imageMime = "image/png";
  } else if (data["image/jpeg"]) {
    out.image = toDataUri("image/jpeg", joinLines(data["image/jpeg"]));
    out.imageMime = "image/jpeg";
  }
  if (typeof data["text/html"] === "string") {
    out.html = data["text/html"];
  }
  if (data["text/plain"]) {
    out.text = joinLines(data["text/plain"]);
  }
  return out;
}

export function listNotebooks(): Notebook[] {
  const dir = notebookRoot;
  let files: string[] = [];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith(".ipynb"));
  } catch {
    return [];
  }
  return files
    .map((f) => parseNotebook(f))
    .filter((n): n is Notebook => n !== null)
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export function getNotebook(slug: string): Notebook | null {
  return parseNotebook(`${slug}.ipynb`);
}

export function parseNotebook(filename: string): Notebook | null {
  const file = path.join(notebookRoot, filename);
  let raw: string;
  try {
    raw = readFileSync(file, "utf8");
  } catch {
    return null;
  }

  let doc: RawDoc;
  try {
    doc = JSON.parse(raw) as RawDoc;
  } catch {
    return null;
  }

  const slug = filename.replace(/\.ipynb$/, "");
  const meta = doc?.metadata || {};
  const cellsRaw: RawCell[] = Array.isArray(doc?.cells) ? doc.cells : [];

  const cells: NotebookCell[] = cellsRaw.map((c, i) => {
    const cell: NotebookCell = {
      index: i + 1,
      cellType: c.cell_type === "markdown" ? "markdown" : "code",
      source: joinLines(c.source),
      executionCount: c.execution_count ?? undefined,
      outputs: Array.isArray(c.outputs) ? c.outputs.map(parseOutput) : undefined,
    };
    return cell;
  });

  let thumbnail: string | undefined;
  for (const cell of cells) {
    if (!thumbnail) {
      for (const out of cell.outputs || []) {
        if (out.image) {
          thumbnail = out.image;
          break;
        }
      }
    }
  }

  const cellCounts = {
    code: cells.filter((c) => c.cellType === "code").length,
    markdown: cells.filter((c) => c.cellType === "markdown").length,
  };
  const totalLines = cells.reduce((acc, c) => acc + c.source.split("\n").length, 0);
  const language = meta?.kernelspec?.language || meta?.language_info?.name || "python";

  return {
    slug,
    filename,
    title: meta?.title || slug,
    description: meta?.description || "",
    tags: Array.isArray(meta?.tags) ? meta.tags : [],
    date: meta?.date || "",
    language,
    kernel: meta?.kernelspec?.display_name || "",
    nbformat: doc?.nbformat || 4,
    cells,
    cellCounts,
    totalLines,
    thumbnail,
    cover: meta?.cover,
  };
}

export function colabUrl(slug: string): string {
  return `https://colab.research.google.com/github/${ghOwner}/${ghRepo}/blob/${ghBranch}/content/notebooks/${slug}.ipynb`;
}

/** Raw GitHub URL of a notebook in the site source repo (for the "source" link). */
export function notebookSourceUrl(slug: string): string {
  return `https://github.com/${ghOwner}/${ghRepo}/blob/${ghBranch}/content/notebooks/${slug}.ipynb`;
}

