"use client";

import { useEffect, useState } from "react";
import {
  Globe,
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  XCircle,
  Rocket,
  RefreshCw,
  FolderGit2,
  Plus,
  ExternalLink,
  Activity,
  ShieldCheck,
  Trash2,
  GitBranch,
  FileCode2,
  Clock3,
} from "lucide-react";
import {
  validateGhToken,
  listRepos,
  createRepo,
  buildStaticExport,
  deployToPages,
  deployProgress,
  pagesStatus,
  checkSite,
  type GhUser,
  type GhRepo,
  type DeploySummary,
  type DeployProgress,
  type PagesStatus,
  type SiteCheck,
} from "@/app/admin/github/actions";

const TOKEN_KEY = "yg_gh_token";

type Tab = "connect" | "repos" | "deploy" | "live";

function Field({
  label,
  value,
  onChange,
  placeholder,
  list,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  list?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-faint">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        list={list}
        spellCheck={false}
        className="w-full rounded-lg border border-line bg-void/40 px-3 py-2 text-sm text-ink placeholder:text-faint focus:border-cyan/60 focus:outline-none focus:ring-1 focus:ring-cyan/40"
      />
    </label>
  );
}

const STATUS_COLOR: Record<string, string> = {
  built: "text-emerald border-emerald/40 bg-emerald/10",
  running: "text-amber border-amber/40 bg-amber/10",
  queued: "text-amber border-amber/40 bg-amber/10",
  none: "text-faint border-line bg-panel/40",
};

export function GitHubStudio() {
  const [tab, setTab] = useState<Tab>("connect");
  const [token, setToken] = useState<string>(() =>
    typeof window !== "undefined" ? (localStorage.getItem(TOKEN_KEY) ?? "") : ""
  );
  const [showToken, setShowToken] = useState(false);
  const [user, setUser] = useState<GhUser | null>(null);
  const [repos, setRepos] = useState<GhRepo[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [branch, setBranch] = useState("gh-pages");
  const [cname, setCname] = useState("");
  const [prune, setPrune] = useState(true);
  const [rebuild, setRebuild] = useState(true);

  const [log, setLog] = useState<string[]>([]);
  const [lastDeploy, setLastDeploy] = useState<DeploySummary | null>(null);
  const [prog, setProg] = useState<DeployProgress | null>(null);

  const [newRepoName, setNewRepoName] = useState("");
  const [newRepoDesc, setNewRepoDesc] = useState("");
  const [newRepoPrivate, setNewRepoPrivate] = useState(false);

  const [live, setLive] = useState<PagesStatus | null>(null);
  const [liveOwner, setLiveOwner] = useState("");
  const [liveRepo, setLiveRepo] = useState("");
  const [liveLoaded, setLiveLoaded] = useState(false);
  const [siteUrl, setSiteUrl] = useState("");
  const [site, setSite] = useState<SiteCheck | null>(null);
  const [siteChecked, setSiteChecked] = useState(false);
  const [siteBusy, setSiteBusy] = useState(false);

  const pushLog = (...lines: string[]) => {
    setLog((prev) => [...prev, ...lines].slice(-40));
  };

  const persistToken = (t: string) => {
    setToken(t);
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  };

  async function connect() {
    if (!token.trim()) return;
    setBusy(true);
    setError(null);
    const res = await validateGhToken(token.trim());
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Connection failed");
      setUser(null);
      return;
    }
    setUser(res.data ?? null);
    persistToken(token.trim());
    setOwner(res.data?.login ?? "");
    setLiveOwner(res.data?.login ?? "");
    pushLog(`connected as @${res.data?.login}`);
  }

  async function disconnect() {
    persistToken("");
    setUser(null);
    setRepos([]);
    setLive(null);
    setLiveLoaded(false);
    pushLog("disconnected");
  }

  async function loadRepos() {
    if (!token.trim()) return;
    setBusy(true);
    setError(null);
    const res = await listRepos(token);
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Failed to list repos");
      return;
    }
    setRepos(res.data ?? []);
    pushLog(`loaded ${res.data?.length ?? 0} repositories`);
  }

  async function makeRepo() {
    if (!token.trim() || !newRepoName.trim()) return;
    setBusy(true);
    setError(null);
    const res = await createRepo(token, {
      name: newRepoName,
      description: newRepoDesc,
      isPrivate: newRepoPrivate,
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Failed to create repo");
      return;
    }
    const r = res.data!;
    setOwner(r.full_name.split("/")[0]);
    setRepo(r.name);
    setNewRepoName("");
    setNewRepoDesc("");
    pushLog(`created ${r.full_name} (${r.private ? "private" : "public"})`);
    await loadRepos();
    setTab("deploy");
  }

  async function deploy() {
    if (!token.trim() || !owner.trim() || !repo.trim()) return;
    setBusy(true);
    setError(null);
    setLastDeploy(null);
    setLog([]);
    pushLog("→ starting GitHub Pages deployment…");
    try {
      // For user.github.io/org.github.io repos Next exports with bare paths;
      // any other repo lives at /<repo> on Pages and needs a basePath.
      const basePath = repo.toLowerCase().endsWith(".github.io") ? undefined : `/${repo}`;
      if (basePath) pushLog(`basePath: ${basePath} (assets must live under this subpath)`);
      const doDeploy = async () => {
        const out = await deployToPages(token, { owner, repo, branch, cname, prune: prune });
        if (!out.ok) throw new Error(out.error ?? "deploy failed");
        const d = out.data!;
        setLastDeploy(d);
        pushLog(
          `uploaded ${d.uploaded} · updated ${d.updated} · deleted ${d.deleted} · unchanged ${d.unchanged}`,
          d.pagesUrl ? `pages: ${d.pagesUrl}` : "pages: not detected yet",
          d.pagesStatus ? `status: ${d.pagesStatus}` : ""
        );
      };
      if (rebuild) {
        pushLog("building static export (npm run build:pages)…");
        const b = await buildStaticExport({ basePath });
        if (!b.ok) throw new Error(b.error ?? "export build failed");
        pushLog("static export ok —", `out/${b.data?.tail ? "tail below" : ""}`.trim());
        if (b.data?.tail) pushLog(...b.data.tail.split("\n").filter(Boolean).slice(-6));
        await doDeploy();
      } else {
        pushLog("using existing out/ (rebuild disabled)");
        await doDeploy();
      }
      pushLog("✓ done — Pages build takes ~1 min, watch the Live tab.");
      setLiveOwner(owner);
      setLiveRepo(repo);
      if (lastDeploy?.pagesUrl) setSiteUrl(lastDeploy.pagesUrl);
      setLiveLoaded(false);
      setProg(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Deploy failed");
    } finally {
      setBusy(false);
    }
  }

  async function refreshLive() {
    if (!token.trim() || !liveOwner.trim() || !liveRepo.trim()) return;
    const res = await pagesStatus(token, liveOwner, liveRepo);
    if (res.ok) {
      setLive(res.data ?? null);
      setLiveLoaded(true);
      if (res.data?.htmlUrl && !siteUrl) setSiteUrl(res.data.htmlUrl);
    }
  }

  useEffect(() => {
    if (!busy) return;
    const id = setInterval(async () => {
      const p = await deployProgress();
      if (p.ok && p.data) setProg(p.data);
    }, 600);
    return () => clearInterval(id);
  }, [busy]);

  useEffect(() => {
    if (tab !== "live") return;
    const t = setTimeout(refreshLive, 0);
    const id = setInterval(refreshLive, 8000);
    return () => {
      clearTimeout(t);
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, liveOwner, liveRepo, token]);

  useEffect(() => {
    if (tab !== "live" || !siteUrl.trim()) return;
    const t = setTimeout(refreshSite, 0);
    const id = setInterval(refreshSite, 15000);
    return () => {
      clearTimeout(t);
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, siteUrl, token]);

  async function refreshSite() {
    if (!siteUrl.trim() || siteBusy) return;
    setSiteBusy(true);
    const res = await checkSite(siteUrl.trim());
    setSiteBusy(false);
    if (res.ok) {
      setSite(res.data ?? null);
      setSiteChecked(true);
    }
  }

  const tabs: { id: Tab; label: string; icon: typeof Globe }[] = [
    { id: "connect", label: "Connect", icon: KeyRound },
    { id: "repos", label: "Repositories", icon: FolderGit2 },
    { id: "deploy", label: "Deploy", icon: Rocket },
    { id: "live", label: "Live status", icon: Activity },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-kicker">deployment</p>
          <h1 className="heading mt-2 flex items-center gap-2 text-3xl">
            <Globe size={26} className="text-ink" /> GitHub Studio
          </h1>
          <p className="mt-2 text-sm text-dim">
            Connect any GitHub account, create repositories and publish your static site to{" "}
            <span className="font-mono text-xs text-cyan">github.io</span> — fully automatic,
            straight from this admin panel. The main dynamic site is untouched.
          </p>
        </div>
        {user && (
          <div className="flex items-center gap-3 rounded-xl border border-line bg-panel/60 px-4 py-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatar_url}
              alt=""
              width={36}
              height={36}
              className="rounded-full ring-2 ring-cyan/40"
            />
            <div>
              <p className="text-sm font-semibold text-ink">@{user.login}</p>
              <p className="font-mono text-[10px] text-faint">{user.name ?? user.login} · {user.plan ?? "free"} plan</p>
            </div>
            <button
              onClick={disconnect}
              className="rounded-md p-1.5 text-faint transition-colors hover:bg-magenta/10 hover:text-magenta"
              title="Disconnect"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </header>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-magenta/40 bg-magenta/5 p-4 text-sm text-dim">
          <XCircle size={16} className="mt-0.5 shrink-0 text-magenta" />
          <span className="font-mono text-xs whitespace-pre-wrap">{error}</span>
        </div>
      )}

      <div className="flex w-max gap-1 rounded-xl border border-line bg-panel/80 p-1 backdrop-blur-md">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider transition-all ${
              tab === t.id ? "bg-cyan/15 text-cyan" : "text-dim hover:bg-panel-2 hover:text-ink"
            }`}
          >
            <t.icon size={13} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ---------- connect ---------- */}
      {tab === "connect" && (
        <div className="card max-w-2xl p-6">
          <h2 className="heading flex items-center gap-2 text-lg">
            <KeyRound size={16} className="text-cyan" /> Personal Access Token
          </h2>
          <p className="mt-2 text-sm leading-6 text-dim">
            Create a token at{" "}
            <a href="https://github.com/settings/tokens" target="_blank" className="text-cyan underline decoration-cyan/40 underline-offset-4">
              github.com/settings/tokens
            </a>{" "}
            — a <b className="text-ink">fine-grained token</b> with <code className="rounded bg-panel-2 px-1 font-mono text-[11px] text-cyan">Contents: Read/Write</code> and{" "}
            <code className="rounded bg-panel-2 px-1 font-mono text-[11px] text-cyan">Pages: Read/Write</code> on the repos you want to publish, or a{" "}
            <b className="text-ink">classic token</b> with the <code className="rounded bg-panel-2 px-1 font-mono text-[11px] text-cyan">repo</code> scope.
            The token stays in your browser (localStorage) and is sent only to the GitHub API through this server — it is never logged.
          </p>
          <div className="mt-5 flex items-end gap-2">
            <div className="flex-1">
              <Field
                label="GitHub token"
                type={showToken ? "text" : "password"}
                value={token}
                onChange={(v) => {
                  setToken(v);
                  setError(null);
                }}
                placeholder="ghp_… or github_pat_…"
              />
            </div>
            <button
              onClick={() => setShowToken((s) => !s)}
              className="mb-1 rounded-lg border border-line bg-panel-2/50 p-2.5 text-faint transition-colors hover:text-ink"
              title={showToken ? "Hide" : "Show"}
            >
              {showToken ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
            <button onClick={connect} disabled={busy || !token.trim()} className="btn btn-primary disabled:opacity-50">
              {busy ? <Loader2 size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
              Validate & connect
            </button>
          </div>
          {user && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald/40 bg-emerald/10 px-3 py-2 font-mono text-xs text-emerald">
              <CheckCircle2 size={13} /> authenticated as @{user.login} — token works
            </div>
          )}
        </div>
      )}

      {/* ---------- repositories ---------- */}
      {tab === "repos" && (
        <div className="card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="heading flex items-center gap-2 text-lg">
              <FolderGit2 size={16} className="text-violet" /> Repositories
            </h2>
            <button onClick={loadRepos} disabled={busy || !token.trim()} className="btn btn-ghost py-2 text-xs disabled:opacity-50">
              <RefreshCw size={13} className={busy ? "animate-spin" : ""} /> Refresh
            </button>
          </div>
          {repos.length > 0 ? (
            <div className="mt-4 divide-y divide-line">
              {repos.map((r) => (
                <div key={r.full_name} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-panel-2 text-faint">
                      <FolderGit2 size={14} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{r.full_name}</p>
                      <p className="truncate font-mono text-[11px] text-faint">
                        {r.description ?? "—"} · default: {r.default_branch}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {r.private && (
                      <span className="rounded-full border border-amber/40 bg-amber/10 px-2 py-0.5 font-mono text-[10px] text-amber">
                        private
                      </span>
                    )}
                    {r.pages_enabled && (
                      <span className="rounded-full border border-emerald/40 bg-emerald/10 px-2 py-0.5 font-mono text-[10px] text-emerald">
                        pages
                      </span>
                    )}
                    <a href={r.html_url} target="_blank" className="rounded-md p-1.5 text-faint transition-colors hover:text-cyan">
                      <ExternalLink size={14} />
                    </a>
                    <button
                      onClick={() => {
                        setOwner(r.full_name.split("/")[0]);
                        setRepo(r.name);
                        setTab("deploy");
                      }}
                      className="rounded-md border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan transition-colors hover:bg-cyan/10"
                    >
                      deploy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 font-mono text-xs text-faint">
              {token.trim() ? "Connect first, then Refresh." : "No repositories loaded."}
            </p>
          )}

          <div className="mt-6 border-t border-line pt-5">
            <h3 className="heading flex items-center gap-2 text-sm">
              <Plus size={14} className="text-cyan" /> Create repository
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <Field label="Name (required)" value={newRepoName} onChange={setNewRepoName} placeholder="my-site" />
              <div className="sm:col-span-2">
                <Field label="Description" value={newRepoDesc} onChange={setNewRepoDesc} />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newRepoPrivate}
                  onChange={(e) => setNewRepoPrivate(e.target.checked)}
                  className="accent-cyan"
                />
                <span className="font-mono text-[11px] text-dim">private</span>
              </label>
              <button onClick={makeRepo} disabled={busy || !token.trim() || !newRepoName.trim()} className="btn btn-ghost py-2 text-xs disabled:opacity-50">
                {busy ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                Create & deploy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- deploy ---------- */}
      {tab === "deploy" && (
        <div className="card p-6">
          <h2 className="heading flex items-center gap-2 text-lg">
            <Rocket size={16} className="text-emerald" /> Publish to GitHub Pages
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Owner" value={owner} onChange={setOwner} list="gh-owners" placeholder="YousofLHC" />
            <Field label="Repository" value={repo} onChange={setRepo} list="gh-repos" placeholder="my-site" />
            <datalist id="gh-owners">
              {user && <option value={user.login} />}
            </datalist>
            <datalist id="gh-repos">
              {repos.map((r) => (
                <option key={r.name} value={r.name} />
              ))}
            </datalist>
            <Field label="Branch" value={branch} onChange={setBranch} placeholder="gh-pages" />
            <Field label="Custom domain (optional CNAME)" value={cname} onChange={setCname} placeholder="yourdomain.com" />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-5">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={prune} onChange={(e) => setPrune(e.target.checked)} className="accent-cyan" />
              <span className="flex items-center gap-1 font-mono text-[11px] text-dim">
                <Trash2 size={11} /> prune removed files
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={rebuild} onChange={(e) => setRebuild(e.target.checked)} className="accent-cyan" />
              <span className="flex items-center gap-1 font-mono text-[11px] text-dim">
                <FileCode2 size={11} /> rebuild static export first
              </span>
            </label>
          </div>
          <button
            onClick={deploy}
            disabled={busy || !token.trim() || !owner.trim() || !repo.trim()}
            className="btn btn-primary mt-5 w-full disabled:opacity-50"
          >
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />}
            {busy ? "Deploying…" : "Build & deploy"}
          </button>

          {busy && prog && (
            <div className="mt-4 rounded-xl border border-line bg-panel/50 p-4">
              <div className="flex items-center justify-between font-mono text-[11px] text-dim">
                <span className="uppercase tracking-wider text-cyan">
                  {prog.stage === "branch" && "preparing branch"}
                  {prog.stage === "tree" && "diffing remote tree"}
                  {prog.stage === "upload" && `uploading files (${prog.current}/${prog.total})`}
                  {prog.stage === "prune" && "pruning removed files"}
                  {prog.stage === "pages" && "enabling GitHub Pages"}
                  {prog.stage === "done" && "done"}
                </span>
                {prog.stage === "upload" && (
                  <span>{Math.round((prog.current / Math.max(1, prog.total)) * 100)}%</span>
                )}
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-panel-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan to-violet transition-all duration-300"
                  style={{
                    width:
                      prog.stage === "upload"
                        ? `${(prog.current / Math.max(1, prog.total)) * 100}%`
                        : prog.stage === "prune" || prog.stage === "tree"
                          ? "45%"
                          : prog.stage === "pages"
                            ? "90%"
                            : "100%",
                  }}
                />
              </div>
              {prog.detail && <p className="mt-2 truncate font-mono text-[10px] text-faint">{prog.detail}</p>}
            </div>
          )}

          {log.length > 0 && (
            <pre className="mt-4 max-h-64 overflow-auto rounded-xl border border-line bg-void/60 p-4 font-mono text-[11px] leading-5 text-dim">
              {log.join("\n")}
            </pre>
          )}

          {lastDeploy && (
            <div className="mt-4 grid gap-2 rounded-xl border border-emerald/40 bg-emerald/5 p-4 sm:grid-cols-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-faint">uploaded</p>
                <p className="font-mono text-lg text-emerald">{lastDeploy.uploaded}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-faint">updated</p>
                <p className="font-mono text-lg text-cyan">{lastDeploy.updated}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-faint">deleted</p>
                <p className="font-mono text-lg text-magenta">{lastDeploy.deleted}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-faint">unchanged</p>
                <p className="font-mono text-lg text-faint">{lastDeploy.unchanged}</p>
              </div>
              {lastDeploy.pagesUrl && (
                <a href={lastDeploy.pagesUrl} target="_blank" className="btn btn-ghost sm:col-span-4 py-2 text-xs">
                  <ExternalLink size={13} className="text-cyan" /> {lastDeploy.pagesUrl}
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* ---------- live ---------- */}
      {tab === "live" && (
        <div className="card p-6">
          <h2 className="heading flex items-center gap-2 text-lg">
            <Activity size={16} className="text-amber" /> Live status
          </h2>
          <p className="mt-1 text-xs text-dim">Auto-refreshes every 8 seconds while this tab is open.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Owner" value={liveOwner} onChange={setLiveOwner} placeholder="YousofLHC" />
            <Field label="Repository" value={liveRepo} onChange={setLiveRepo} placeholder="my-site" />
          </div>
          <div className="mt-4 flex gap-2.5">
            <button onClick={() => { setLiveLoaded(false); refreshLive(); }} disabled={!token.trim() || !liveOwner.trim() || !liveRepo.trim() || busy} className="btn btn-ghost py-2 text-xs disabled:opacity-50">
              <RefreshCw size={13} className={busy ? "animate-spin" : ""} /> Refresh now
            </button>
          </div>

          {/* site reachability — real HTTP check */}
          <div className="mt-6 rounded-xl border border-line bg-panel/50 p-4">
            <h3 className="heading flex items-center gap-2 text-sm">
              <Globe size={14} className="text-emerald" /> Site reachability
            </h3>
            <div className="mt-3 flex items-end gap-2">
              <div className="flex-1">
                <Field label="Published URL" value={siteUrl} onChange={setSiteUrl} placeholder="https://user.github.io/repo/" />
              </div>
              <button onClick={refreshSite} disabled={!siteUrl.trim() || siteBusy} className="btn btn-ghost py-2 text-xs disabled:opacity-50">
                <RefreshCw size={13} className={siteBusy ? "animate-spin" : ""} /> Check now
              </button>
            </div>
            {siteChecked && site && (
              <div
                className={`mt-3 flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 ${
                  site.status >= 200 && site.status < 400
                    ? "border-emerald/40 bg-emerald/10"
                    : "border-magenta/40 bg-magenta/10"
                }`}
              >
                <span className="flex items-center gap-2 font-mono text-xs">
                  {site.status >= 200 && site.status < 400 ? (
                    <CheckCircle2 size={14} className="text-emerald" />
                  ) : (
                    <XCircle size={14} className="text-magenta" />
                  )}
                  <span className={site.status >= 200 && site.status < 400 ? "text-emerald" : "text-magenta"}>
                    HTTP {site.status}
                  </span>
                  <span className="text-dim">
                    {site.ms}ms · {(site.size / 1024).toFixed(1)} KB
                  </span>
                </span>
                <span className="font-mono text-[11px] text-faint">
                  {site.status >= 200 && site.status < 400 ? "live & serving" : "unreachable"}
                </span>
              </div>
            )}
            {!siteChecked && (
              <p className="mt-3 font-mono text-[11px] text-faint">
                Auto-checks this URL every 15 s — real HTTP request from the server.
              </p>
            )}
          </div>

          {liveLoaded && live ? (
            <div className="mt-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-panel/50 p-4">
                <div className="flex items-center gap-3">
                  <span className={`rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider ${STATUS_COLOR[live.status ?? "none"] ?? STATUS_COLOR.none}`}>
                    {live.status ?? "not enabled"}
                  </span>
                  {live.lastBuild?.status && (
                    <span className={`rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider ${STATUS_COLOR[live.lastBuild.status] ?? STATUS_COLOR.none}`}>
                      build: {live.lastBuild.status}
                    </span>
                  )}
                  {live.customDomain && (
                    <span className="flex items-center gap-1 font-mono text-[11px] text-cyan">
                      <Globe size={12} /> {live.customDomain}
                    </span>
                  )}
                  {live.httpsEnforced === true && (
                    <span className="flex items-center gap-1 font-mono text-[11px] text-emerald">
                      <ShieldCheck size={12} /> https
                    </span>
                  )}
                </div>
                {live.htmlUrl && (
                  <a href={live.htmlUrl} target="_blank" className="flex items-center gap-1.5 font-mono text-xs text-cyan underline decoration-cyan/40 underline-offset-4">
                    <ExternalLink size={12} /> {live.htmlUrl}
                  </a>
                )}
              </div>
              {live.lastBuild && (
                <div className="grid gap-3 rounded-xl border border-line bg-panel/50 p-4 sm:grid-cols-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-faint">last build</p>
                    <p className="mt-1 font-mono text-xs text-ink">{live.lastBuild.status ?? "—"}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-faint">duration</p>
                    <p className="mt-1 flex items-center gap-1 font-mono text-xs text-ink">
                      <Clock3 size={11} className="text-faint" /> {live.lastBuild.duration != null ? `${Math.round(live.lastBuild.duration / 1000)}s` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-faint">updated</p>
                    <p className="mt-1 font-mono text-xs text-ink">{live.lastBuild.updatedAt ? new Date(live.lastBuild.updatedAt).toLocaleString() : "—"}</p>
                  </div>
                  {live.lastBuild.error && (
                    <p className="rounded-lg border border-magenta/40 bg-magenta/5 p-3 font-mono text-[11px] text-magenta sm:col-span-3">
                      build error: {live.lastBuild.error}
                    </p>
                  )}
                </div>
              )}

              {live.builds.length > 1 && (
                <div className="rounded-xl border border-line bg-panel/50 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-faint">recent builds</p>
                  <div className="mt-2 divide-y divide-line">
                    {live.builds.map((b, i) => (
                      <div key={i} className="flex items-center justify-between gap-3 py-2">
                        <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${STATUS_COLOR[b.status ?? "none"] ?? STATUS_COLOR.none}`}>
                          {b.status ?? "—"}
                        </span>
                        <span className="font-mono text-[10px] text-faint">
                          {b.updatedAt ? new Date(b.updatedAt).toLocaleString() : "—"}
                          {b.duration != null ? ` · ${Math.round(b.duration / 1000)}s` : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                  {live.builds.some((b) => b.error) && (
                    <p className="mt-2 rounded-lg border border-magenta/40 bg-magenta/5 p-2.5 font-mono text-[11px] text-magenta">
                      {live.builds.find((b) => b.error)?.error}
                    </p>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 rounded-xl border border-line bg-panel/50 p-4">
                <GitBranch size={13} className="text-faint" />
                <span className="font-mono text-[11px] text-dim">
                  Deploy branch: <span className="text-ink">{branch}</span> — tip: after deploying, wait ~1 minute for the first build, then refresh here.
                </span>
              </div>
            </div>
          ) : (
            <p className="mt-5 font-mono text-xs text-faint">Enter owner/repo and hit Refresh to see build status.</p>
          )}
        </div>
      )}
    </div>
  );
}