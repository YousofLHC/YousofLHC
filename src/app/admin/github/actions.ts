"use server";

import { createHash } from "node:crypto";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import { requireAdmin } from "@/lib/admin/store";
import {
  getGhToken, hasGhToken, setGhToken, clearGhToken,
} from "@/lib/admin/gh-token";

/** Resolve the working token (cookie → env) or throw a friendly error. */
async function requireToken(): Promise<string> {
  const t = await getGhToken();
  if (!t) throw new Error("Not connected — paste a token in the Connect tab.");
  return t;
}

export interface GhConnectionStatus {
  connected: boolean;
  viaEnv: boolean;
  login: string | null;
}

export interface ActionResult<T = void> {
  ok: boolean;
  error?: string;
  data?: T;
}

const execAsync = promisify(exec);

async function guard<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    await requireAdmin();
    return { ok: true, data: await fn() };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e && String((e as { digest?: string }).digest).startsWith("NEXT_REDIRECT")) {
      throw e;
    }
    return { ok: false, error: e instanceof Error ? e.message : "Unexpected error" };
  }
}

const GH = "https://api.github.com";

async function ghApi(token: string, method: string, url: string, body?: unknown): Promise<{ status: number; json: unknown; rateLimit: number | null }> {
  const res = await fetch(`${GH}${url}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "phd-website-admin",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const rate = Number(res.headers.get("x-ratelimit-remaining") ?? "-1");
  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  if (!res.ok) {
    const msg =
      (json as { message?: string } | null)?.message ??
      `${res.status} ${res.statusText}`;
    const err = new Error(`GitHub API ${res.status}: ${msg}`) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return { status: res.status, json, rateLimit: rate >= 0 ? rate : null };
}

export interface GhUser {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  plan: string | null;
  scopes: string[];
}

export async function ghConnect(input: { token: string }): Promise<ActionResult<GhUser>> {
  return guard(async () => {
    const token = input.token.trim();
    if (!token) throw new Error("Token is required");
    const { json } = await ghApi(token, "GET", "/user");
    const u = json as { login: string; name: string | null; avatar_url: string; html_url: string; plan?: { name?: string } };
    // valid — persist securely server-side (encrypted httpOnly cookie)
    await setGhToken(token, u.login);
    return {
      login: u.login,
      name: u.name,
      avatar_url: u.avatar_url,
      html_url: u.html_url,
      plan: u.plan?.name ?? null,
      scopes: [],
    };
  });
}

export async function ghStatus(): Promise<GhConnectionStatus> {
  const viaCookie = await hasGhToken();
  const envToken = process.env.GITHUB_TOKEN?.trim();
  if (!viaCookie && !envToken) return { connected: false, viaEnv: false, login: null };
  try {
    const token = await requireToken();
    const { json } = await ghApi(token, "GET", "/user");
    return {
      connected: true,
      viaEnv: !viaCookie,
      login: (json as { login?: string }).login ?? null,
    };
  } catch {
    return { connected: false, viaEnv: Boolean(envToken), login: null };
  }
}

export async function ghDisconnect(): Promise<ActionResult> {
  return guard(async () => {
    await clearGhToken();
  });
}
export interface GhRepo {
  name: string;
  full_name: string;
  html_url: string;
  default_branch: string;
  private: boolean;
  description: string | null;
  pushed_at: string | null;
  pages_enabled: boolean;
}

export async function listRepos(): Promise<ActionResult<GhRepo[]>> {
  return guard(async () => {
    const token = await requireToken();
    const { json } = await ghApi(token, "GET", "/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator");
    return (json as Array<{
      name: string;
      full_name: string;
      html_url: string;
      default_branch: string;
      private: boolean;
      description: string | null;
      pushed_at: string | null;
      has_pages: boolean;
    }>).map((r) => ({
      name: r.name,
      full_name: r.full_name,
      html_url: r.html_url,
      default_branch: r.default_branch,
      private: r.private,
      description: r.description,
      pushed_at: r.pushed_at,
      pages_enabled: r.has_pages,
    }));
  });
}

export async function createRepo(
  input: { name: string; description?: string; isPrivate?: boolean }
): Promise<ActionResult<GhRepo>> {
  return guard(async () => {
    const token = await requireToken();
    const name = input.name.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "-");
    if (!name) throw new Error("Repo name is required");
    const { json } = await ghApi(token, "POST", "/user/repos", {
      name,
      description: input.description?.trim() || null,
      private: Boolean(input.isPrivate),
      auto_init: true,
    });
    const r = json as { name: string; full_name: string; html_url: string; default_branch: string; private: boolean; description: string | null };
    return {
      name: r.name,
      full_name: r.full_name,
      html_url: r.html_url,
      default_branch: r.default_branch,
      private: r.private,
      description: r.description,
      pushed_at: null,
      pages_enabled: false,
    };
  });
}

/** Run the static export build (npm run build:pages) and return the tail of its output. */
export async function buildStaticExport(input: { basePath?: string } = {}): Promise<ActionResult<{ tail: string }>> {
  return guard(async () => {
    const script = path.join(process.cwd(), "scripts", "export-static.mjs");
    if (!existsSync(script)) throw new Error("export-static.mjs not found — run this on a full install");
    const basePath = input.basePath?.trim();
    // The admin server process may run under `next dev`, which sets
    // NODE_ENV=development. Inheriting that into a production export build
    // breaks prerendering (_global-error: useContext of null), so we force a
    // clean production environment for the child npm process.
    const cleanEnv: Record<string, string | undefined> = { ...process.env };
    delete cleanEnv.NODE_ENV;
    if (basePath) cleanEnv.PAGES_BASE_PATH = basePath;
    const { stdout, stderr } = await execAsync(`npm run build:pages`, {
      cwd: process.cwd(),
      timeout: 5 * 60 * 1000,
      maxBuffer: 4 * 1024 * 1024,
      env: { ...cleanEnv, NODE_ENV: "production" },
    });
    const full = `${stdout}\n${stderr}`;
    const lines = full.split(/\r?\n/).filter(Boolean);
    const tail = lines.slice(-14).join("\n");
    if (!existsSync(path.join(process.cwd(), "out", "index.html"))) {
      throw new Error(`Export produced no out/index.html\n${tail}`);
    }
    return { tail };
  });
}

interface LocalFile {
  rel: string;
  content: Buffer;
  blobSha: string;
}

function localManifest(): LocalFile[] {
  const root = path.join(process.cwd(), "out");
  if (!existsSync(path.join(root, "index.html"))) {
    throw new Error("out/ is missing — run the export build first");
  }
  const out: LocalFile[] = [];
  const walk = (dir: string, prefix: string) => {
    for (const f of readdirSync(dir)) {
      const full = path.join(dir, f);
      const rel = prefix ? `${prefix}/${f}` : f;
      if (statSync(full).isDirectory()) {
        walk(full, rel);
      } else {
        const content = readFileSync(full);
        out.push({
          rel,
          content,
          blobSha: createHash("sha1").update(`blob ${content.length}\0`).update(content).digest("hex"),
        });
      }
    }
  };
  walk(root, "");
  return out;
}


export interface DeploySummary {
  branch: string;
  uploaded: number;
  updated: number;
  deleted: number;
  unchanged: number;
  pagesUrl?: string;
  pagesStatus?: string;
}

export interface DeployProgress {
  stage: "branch" | "tree" | "upload" | "prune" | "pages" | "done";
  current: number;
  total: number;
  detail?: string;
}

let deployProg: DeployProgress | null = null;

export async function deployProgress(): Promise<ActionResult<DeployProgress | null>> {
  return guard(async () => deployProg);
}

async function ensureBranch(token: string, owner: string, repo: string, branch: string): Promise<void> {
  const exists = await ghApi(token, "GET", `/repos/${owner}/${repo}/branches/${encodeURIComponent(branch)}`)
    .then(() => true)
    .catch(() => false);
  if (exists) return;
  const repoInfo = (await ghApi(token, "GET", `/repos/${owner}/${repo}`)).json as { default_branch: string };
  const def = await ghApi(token, "GET", `/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(repoInfo.default_branch)}`);
  const sha = (def.json as { object: { sha: string } }).object.sha;
  await ghApi(token, "POST", `/repos/${owner}/${repo}/git/refs`, {
    ref: `refs/heads/${branch}`,
    sha,
  });
}

export async function deployToPages(
  input: { owner: string; repo: string; branch: string; cname?: string; prune?: boolean }
): Promise<ActionResult<DeploySummary>> {
  return guard(async () => {
    const token = await requireToken();
    const owner = input.owner.trim();
    const repo = input.repo.trim();
    const branch = (input.branch || "gh-pages").trim();
    if (!owner || !repo) throw new Error("owner and repo are required");

    const setProg = (p: DeployProgress) => {
      deployProg = p;
    };

    const manifest = localManifest();
    const byRel = new Map(manifest.map((f) => [f.rel, f]));
    setProg({ stage: "branch", current: 0, total: 1, detail: `branch ${branch}` });

    await ensureBranch(token, owner, repo, branch);

    setProg({ stage: "tree", current: 0, total: manifest.length, detail: "diffing remote tree" });
    const treeRes = await ghApi(token, "GET", `/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`)
      .then((r) => ({ tree: (r.json as { tree: Array<{ path: string; sha: string; type: string }> }).tree, ok: true }))
      .catch(() => ({ tree: [], ok: false }));
    const existing = new Map<string, string>();
    for (const e of treeRes.tree) {
      if (e.type === "blob") existing.set(e.path, e.sha);
    }

    const chunk = <T,>(arr: T[], size: number): T[][] => {
      const out: T[][] = [];
      for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
      return out;
    };

    // Internal Turbopack export aux files must never reach the repo.
    const isAuxPath = (rel: string) => rel.includes("__next.") || rel === "index.txt";

    const uploads: LocalFile[] = [];
    const skips: string[] = [];
    for (const f of manifest) {
      if (isAuxPath(f.rel)) continue;
      const remoteSha = existing.get(f.rel);
      if (remoteSha === f.blobSha) skips.push(f.rel);
      else uploads.push(f);
    }

    const deletes: string[] = [];
    if (input.prune !== false) {
      const droppedAux = new Set([...existing.keys()].filter(isAuxPath));
      for (const [rel] of existing) {
        if (rel.startsWith(".git") || (rel === "CNAME" && input.cname)) continue;
        if (!byRel.has(rel) && !droppedAux.has(rel)) deletes.push(rel);
      }
    }

    setProg({ stage: "upload", current: 0, total: Math.max(1, uploads.length), detail: "uploading blobs" });
    let uploadedCount = 0;
    for (const batch of chunk(uploads, 6)) {
      await Promise.all(
        batch.map(async (f) => {
          await ghApi(token, "POST", `/repos/${owner}/${repo}/git/blobs`, {
            content: f.content.toString("base64"),
            encoding: "base64",
          });
          uploadedCount++;
          setProg({ stage: "upload", current: uploadedCount, total: uploads.length, detail: f.rel });
        })
      );
    }

    setProg({ stage: "prune", current: deletes.length, total: Math.max(1, deletes.length), detail: "building new tree" });
    const nextTree: Array<{ path: string; mode: "100644"; type: "blob"; sha: string }> = [];
    const localSha = new Map(manifest.map((f) => [f.rel, f.blobSha]));
    for (const [rel, sha] of existing) {
      if (deletes.includes(rel)) continue;
      if (localSha.has(rel) || isAuxPath(rel)) continue;
      nextTree.push({ path: rel, mode: "100644", type: "blob", sha });
    }
    for (const f of manifest) {
      if (isAuxPath(f.rel)) continue;
      nextTree.push({ path: f.rel, mode: "100644", type: "blob", sha: f.blobSha });
    }

    const tip = await ghApi(token, "GET", `/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(branch)}`);
    const parentSha = (tip.json as { object: { sha: string } }).object.sha;
    const tree = await ghApi(token, "POST", `/repos/${owner}/${repo}/git/trees`, { tree: nextTree });
    const treeSha = (tree.json as { sha: string }).sha;
    const commit = await ghApi(token, "POST", `/repos/${owner}/${repo}/git/commits`, {
      message: `deploy site (${manifest.length - skips.length} files)`,
      tree: treeSha,
      parents: [parentSha],
    });
    const commitSha = (commit.json as { sha: string }).sha;
    const ref = await ghApi(token, "PATCH", `/repos/${owner}/${repo}/git/refs/heads/${encodeURIComponent(branch)}`, {
      sha: commitSha,
      force: true,
    });
    if (ref.status !== 200) throw new Error(`branch update failed (${ref.status})`);

    const summary: DeploySummary = {
      branch,
      uploaded: uploads.filter((f) => !existing.has(f.rel)).length,
      updated: uploads.filter((f) => existing.has(f.rel)).length,
      deleted: deletes.length,
      unchanged: skips.length,
    };

    setProg({ stage: "pages", current: 1, total: 1, detail: "enabling GitHub Pages" });
    const pages = await ghApi(token, "POST", `/repos/${owner}/${repo}/pages`, {
      source: { branch, path: "/" },
    }).catch(() => ghApi(token, "GET", `/repos/${owner}/${repo}/pages`));

    const pagesJson = pages.json as { html_url?: string; status?: string };
    summary.pagesUrl = pagesJson.html_url;
    summary.pagesStatus = pagesJson.status;

    if (input.cname) {
      await ghApi(token, "PUT", `/repos/${owner}/${repo}/pages`, { cname: input.cname });
    }

    setProg({ stage: "done", current: 1, total: 1, detail: summary.pagesUrl });

    return summary;
  });
}

export interface PagesBuildInfo {
  status: string | null;
  error: string | null;
  duration: number | null;
  updatedAt: string | null;
}

export interface PagesStatus {
  htmlUrl: string | null;
  status: string | null;
  lastBuild: PagesBuildInfo | null;
  builds: PagesBuildInfo[];
  customDomain: string | null;
  httpsEnforced: boolean | null;
}

export async function pagesStatus(
  owner: string,
  repo: string
): Promise<ActionResult<PagesStatus>> {
  return guard(async () => {
    const token = await requireToken();
    const r = await ghApi(token, "GET", `/repos/${owner}/${repo}/pages`).catch(() => null);
    if (!r) {
      return { htmlUrl: null, status: null, lastBuild: null, builds: [], customDomain: null, httpsEnforced: null };
    }
    const p = r.json as {
      html_url?: string;
      status?: string;
      cname?: string;
      https_enforced?: boolean;
    };
    const builds = await ghApi(token, "GET", `/repos/${owner}/${repo}/pages/builds?per_page=8`).catch(() => null);
    const list: PagesBuildInfo[] = builds
      ? (builds.json as Array<{
          status?: string;
          error?: { message?: string };
          duration?: number;
          updated_at?: string;
        }>).map((b) => ({
          status: b.status ?? null,
          error: b.error?.message ?? null,
          duration: b.duration ?? null,
          updatedAt: b.updated_at ?? null,
        }))
      : [];
    return {
      htmlUrl: p.html_url ?? null,
      status: p.status ?? null,
      customDomain: p.cname ?? null,
      httpsEnforced: p.https_enforced ?? null,
      lastBuild: list[0] ?? null,
      builds: list,
    };
  });
}

export interface SiteCheck {
  status: number;
  ms: number;
  size: number;
  url: string;
}

/** Actually fetch the published site and report HTTP status + timing. */
export async function checkSite(url: string): Promise<ActionResult<SiteCheck>> {
  return guard(async () => {
    if (!/^https?:\/\//.test(url)) throw new Error("Site URL must start with http:// or https://");
    const t0 = Date.now();
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    });
    const body = await res.arrayBuffer();
    return { status: res.status, ms: Date.now() - t0, size: body.byteLength, url };
  });
}

export async function deleteBranchOnGh(
  owner: string,
  repo: string,
  branch: string
): Promise<ActionResult> {
  return guard(async () => {
    const token = await requireToken();
    await ghApi(token, "DELETE", `/repos/${owner}/${repo}/git/refs/heads/${encodeURIComponent(branch)}`);
  });
}

