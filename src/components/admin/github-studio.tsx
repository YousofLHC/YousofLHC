"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2, ExternalLink, Eye, EyeOff, Globe, KeyRound,
  Loader2, Rocket, RefreshCw, ShieldCheck, XCircle,
} from "lucide-react";
import type { ActionResult } from "@/app/admin/github/actions";
import {
  buildStaticExport, createRepo, deployProgress, deployToPages,
  ghConnect, ghDisconnect, ghStatus, listRepos, checkSite,
  pagesStatus, type DeployProgress, type GhRepo, type PagesStatus,
} from "@/app/admin/github/actions";
import { Field, TextInput } from "@/components/admin/field";

/* ------------------------------------------------------------------ */
/* tiny primitives                                                     */
/* ------------------------------------------------------------------ */

type Tab = "connect" | "deploy" | "live" | "guide";

const tabBtn = (on: boolean) =>
  `rounded-lg px-4 py-2 font-mono text-[12px] transition-colors ${
    on ? "bg-cyan/10 text-cyan shadow-[inset_0_0_0_1px_rgba(59,225,255,.25)]"
       : "text-dim hover:bg-panel hover:text-ink"
  }`;

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-line bg-panel p-6 ${className}`}>{children}</div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children?: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-cyan/50 font-mono text-[11px] text-cyan">
        {n}
      </span>
      <div className="min-w-0 text-[13.5px] leading-6 text-dim">
        <b className="text-ink">{title}</b>
        {children ? <div className="mt-1">{children}</div> : null}
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* main                                                                */
/* ------------------------------------------------------------------ */

export function GithubStudio() {
  const [tab, setTab] = useState<Tab>("connect");

  /* connection */
  const [connected, setConnected] = useState<boolean | null>(null);
  const [viaEnv, setViaEnv] = useState(false);
  const [login, setLogin] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [showTok, setShowTok] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  /* repos */
  const [repos, setRepos] = useState<GhRepo[]>([]);
  const [repoLoaded, setRepoLoaded] = useState(false);
  const [newRepoName, setNewRepoName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  /* deploy */
  const [owner, setOwner] = useState("YousofLHC");
  const [repo, setRepo] = useState("YousofLHC");
  const [branch, setBranch] = useState("gh-pages");
  const [cname, setCname] = useState("");
  const [prune, setPrune] = useState(true);
  const [rebuild, setRebuild] = useState(false);
  const [prog, setProg] = useState<DeployProgress | null>(null);
  const [deployMsg, setDeployMsg] = useState<string | null>(null);

  /* live */
  const [liveStatus, setLiveStatus] = useState<PagesStatus | null>(null);
  const [checkRes, setCheckRes] = useState<string | null>(null);

  /* ---------- boot: connection status ---------- */
  useEffect(() => {
    void refreshStatus();
  }, []);

  const refreshStatus = useCallback(async () => {
    const res = await ghStatus();
    setConnected(res.connected);
    setViaEnv(res.viaEnv);
    setLogin(res.login);
  }, []);

  /* ---------- connect / disconnect ---------- */
  const connect = async () => {
    setBusy(true); setErr(null);
    try {
      const res = await ghConnect({ token: tokenInput });
      if (!res.ok) throw new Error(res.error ?? "Connection failed");
      if (!res.data?.login) throw new Error(res.error ?? "Token rejected by GitHub");
      setTokenInput("");
      await refreshStatus();
      setTab("deploy");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Connection failed");
    } finally {
      setBusy(false);
    }
  };

  const disconnect = async () => {
    await ghDisconnect();
    setTokenInput(""); setLogin(null); setConnected(false); setViaEnv(false);
    setRepos([]); setRepoLoaded(false);
  };

  /* ---------- repos ---------- */
  const loadRepos = async () => {
    setBusy(true); setErr(null);
    try {
      const res = await listRepos();
      if (!res.ok) throw new Error(res.error);
      setRepos(res.data!); setRepoLoaded(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load repos");
    } finally { setBusy(false); }
  };

  const makeRepo = async () => {
    setBusy(true); setErr(null);
    try {
      const res = await createRepo({ name: newRepoName, isPrivate });
      if (!res.ok) throw new Error(res.error);
      setNewRepoName("");
      await loadRepos(); setRepoLoaded(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Create failed");
    } finally { setBusy(false); }
  };

  /* ---------- deploy pipeline ---------- */
  const runDeploy = async () => {
    setBusy(true); setErr(null); setDeployMsg(null);
    try {
      if (rebuild) {
        const b = await buildStaticExport({ basePath: "/YousofLHC" });
        if (!b.ok) throw new Error(b.error);
      }
      const res = await deployToPages({ owner, repo, branch, cname: cname || undefined, prune });
      if (!res.ok) throw new Error(res.error);
      const s = res.data!;
      setDeployMsg(
        `Deployed ✓ — ${s.uploaded} added · ${s.updated} updated · ${s.deleted} removed` +
        (s.pagesUrl ? ` → ${s.pagesUrl}` : "")
      );
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Deploy failed");
    } finally { setBusy(false); }
  };

  /* progress polling while deploying */
  useEffect(() => {
    if (!busy) return;
    const iv = setInterval(async () => {
      const r = await deployProgress();
      if (r.ok && r.data !== undefined && r.data !== null) setProg(r.data);
    }, 800);
    return () => clearInterval(iv);
  }, [busy]);

  /* live status */
  const refreshLive = async () => {
    setBusy(true);
    try {
      const res = await pagesStatus(owner, repo);
      if (res.ok && res.data) setLiveStatus(res.data);
    } finally { setBusy(false); }
  };
  useEffect(() => {
    if (tab === "live" && connected) void refreshLive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const doSiteCheck = async () => {
    const url = `https://${owner}.github.io/${repo}/`;
    setCheckRes("checking…");
    const res = await checkSite(url);
    if (res.ok)
      setCheckRes(`${res.data!.status} in ${res.data!.ms} ms · ${(res.data!.size / 1024).toFixed(0)} KB`);
    else setCheckRes(res.error ?? "failed");
  };

  /* ================================================================== */

  return (
    <div className="space-y-6">
      {/* tabs */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setTab("connect")} className={tabBtn(tab === "connect")}>
          <KeyRound size={13} className="mr-1.5 inline" /> Connect
        </button>
        <button onClick={() => setTab("deploy")} className={tabBtn(tab === "deploy")}>
          <Rocket size={13} className="mr-1.5 inline" /> Deploy
        </button>
        <button onClick={() => setTab("live")} className={tabBtn(tab === "live")}>
          <Globe size={13} className="mr-1.5 inline" /> Live status
        </button>
        <button onClick={() => setTab("guide")} className={tabBtn(tab === "guide")}>
          How to deploy
        </button>
      </div>

      {err && (
        <p className="flex items-center gap-2 rounded-lg border border-magenta/40 bg-magenta/10 px-4 py-2.5 text-sm text-magenta">
          <XCircle size={15} /> {err}
        </p>
      )}

      {/* ---------------- CONNECT ---------------- */}
      {tab === "connect" && (
        <Card>
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-lg text-ink">
              <KeyRound size={16} className="text-cyan" /> Personal Access Token
            </h2>
            {connected !== null && connected && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald/40 bg-emerald/10 px-3 py-1 font-mono text-xs text-emerald">
                <ShieldCheck size={12} /> {viaEnv ? "env GITHUB_TOKEN" : login ? `@${login}` : "connected"}
              </span>
            )}
          </div>

          <p className="mb-3 max-w-2xl text-sm leading-6 text-dim">
            Create a token at{" "}
            <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noreferrer" className="text-cyan underline decoration-cyan/40 underline-offset-2">
              github.com/settings/tokens
            </a>{" "}
            — a <b className="text-ink">fine-grained token</b> limited to this repo with{" "}
            <b className="text-ink">Contents: Read &amp; write</b> and{" "}
            <b className="text-ink">Pages: Read &amp; write</b> permissions.
            The token is validated once, then stored <b className="text-ink">only server-side</b> in an
            encrypted httpOnly cookie for 12&nbsp;h — it never touches the browser storage or any page HTML.
            {viaEnv && (
              <span className="mt-2 block text-[12px] text-emerald">
                ● Currently using the GITHUB_TOKEN default from .env.local
              </span>
            )}
          </p>

          <div className="max-w-xl space-y-3">
            <Field label="GitHub token">
              <div className="relative">
                <TextInput
                  type={showTok ? "text" : "password"}
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="github_pat_… or ghp_…"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowTok((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-faint hover:text-cyan"
                >
                  {showTok ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </Field>

            <div className="flex flex-wrap gap-2">
              <button onClick={() => void connect()} disabled={busy || !tokenInput.trim()} className="btn btn-primary disabled:opacity-50">
                {busy ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />} Connect
              </button>
              {connected && (
                <button onClick={() => void disconnect()} disabled={busy} className="btn btn-ghost !text-magenta">
                  <XCircle size={14} /> Disconnect
                </button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* ---------------- DEPLOY ---------------- */}
      {tab === "deploy" && (
        <div className="space-y-6">
          {!connected && (
            <p className="rounded-lg border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-dim">
              ⚠ Connect a token first (Connect tab).
            </p>
          )}

          <Card>
            <h2 className="mb-4 font-display text-lg text-ink">Repository</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Owner"><TextInput value={owner} onChange={(e) => setOwner(e.target.value)} /></Field>
              <Field label="Repo"><TextInput value={repo} onChange={(e) => setRepo(e.target.value)} /></Field>
              <Field label="Branch"><TextInput value={branch} onChange={(e) => setBranch(e.target.value)} /></Field>
            </div>

            <details className="mt-4 rounded-lg border border-line px-4 py-2.5" open={repoLoaded}>
              <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-wider text-faint">
                repositories ({repos.length})
              </summary>
              <div className="mt-2 flex gap-2">
                <button onClick={() => void loadRepos()} disabled={busy || !connected} className="chip !py-1 !text-[10px]">
                  <RefreshCw size={11} className="mr-1 inline" /> Refresh list
                </button>
              </div>
              <ul className="mt-2 max-h-44 space-y-1 overflow-y-auto">
                {repos.map((r) => (
                  <li key={r.full_name}>
                    <button
                      onClick={() => { const [o, rn] = r.full_name.split("/"); setOwner(o); setRepo(rn); }}
                      className={`w-full truncate rounded-md px-2 py-1 text-left font-mono text-[12px] ${
                        repo === r.name ? "bg-cyan/10 text-cyan" : "text-dim hover:bg-panel hover:text-ink"
                      }`}
                    >
                      {r.full_name}{r.private ? " 🔒" : ""}
                    </button>
                  </li>
                ))}
              </ul>
            </details>

            <details className="mt-3 rounded-lg border border-line px-4 py-2.5">
              <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-wider text-faint">create a new repository</summary>
              <div className="mt-2 flex flex-wrap items-end gap-2">
                <div className="min-w-48 flex-1"><Field label="Repo name"><TextInput value={newRepoName} onChange={(e) => setNewRepoName(e.target.value)} placeholder="my-site-repo" /></Field></div>
                <label className="flex cursor-pointer items-center gap-2 pb-2 font-mono text-xs text-dim">
                  <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} className="accent-cyan" /> private
                </label>
                <button onClick={() => void makeRepo()} disabled={busy || !newRepoName.trim() || !connected} className="btn btn-ghost !py-2 !text-[12px]">Create</button>
              </div>
            </details>
          </Card>

          <Card>
            <h2 className="mb-4 font-display text-lg text-ink">Deploy pipeline</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center gap-2 font-mono text-xs text-dim">
                <input type="checkbox" checked={rebuild} onChange={(e) => setRebuild(e.target.checked)} className="accent-cyan" />
                rebuild static export before push (out/)
              </label>
              <label className="flex cursor-pointer items-center gap-2 font-mono text-xs text-dim">
                <input type="checkbox" checked={prune} onChange={(e) => setPrune(e.target.checked)} className="accent-cyan" />
                prune files deleted locally
              </label>
              <Field label="Custom domain (optional)"><TextInput value={cname} onChange={(e) => setCname(e.target.value)} placeholder="mysite.com" /></Field>
            </div>

            {prog && busy && (
              <div className="mt-5 rounded-lg border border-line bg-void/60 p-4 font-mono text-xs">
                <p className="text-cyan">stage: {prog.stage} — {prog.detail}</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
                  <div className="h-full bg-cyan transition-all" style={{ width: `${Math.round((prog.current / Math.max(prog.total, 1)) * 100)}%` }} />
                </div>
              </div>
            )}

            {deployMsg && (
              <p className="mt-4 flex items-start gap-2 rounded-lg border border-emerald/40 bg-emerald/10 px-4 py-2.5 text-sm text-emerald">
                <CheckCircle2 size={15} className="shrink-0" /> {deployMsg}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={() => void runDeploy()} disabled={busy || !connected}
                className="btn btn-primary disabled:opacity-50">
                {busy ? <Loader2 size={15} className="animate-spin" /> : <Rocket size={15} />}
                Build &amp; Deploy to Pages
              </button>
              <a href={`https://${owner}.github.io/${repo}/`} target="_blank" rel="noreferrer" className="btn btn-ghost">
                <ExternalLink size={14} /> open live site
              </a>
            </div>
          </Card>
        </div>
      )}

      {/* ---------------- LIVE STATUS ---------------- */}
      {tab === "live" && (
        <div className="space-y-6">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-lg text-ink">GitHub Pages status</h2>
              <button onClick={() => void refreshLive()} disabled={busy} className="chip !py-1.5 !text-[11px]">
                <RefreshCw size={12} className="mr-1 inline" /> refresh
              </button>
            </div>
            {liveStatus ? (
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <Row k="URL" v={liveStatus.htmlUrl} link />
                <Row k="status" v={liveStatus.status} />
                <Row k="custom domain" v={liveStatus.customDomain} />
                <Row k="https enforced" v={String(liveStatus.httpsEnforced ?? "—")} />
              </dl>
            ) : (
              <p className="mt-4 text-sm text-faint">Press refresh…</p>
            )}
            {liveStatus?.lastBuild && (
              <p className="mt-4 font-mono text-xs text-dim">
                last build: {liveStatus.lastBuild.status} · {liveStatus.lastBuild.duration}s
                {liveStatus.lastBuild.error ? ` · ${liveStatus.lastBuild.error}` : ""}
              </p>
            )}
          </Card>

          <Card>
            <h2 className="mb-3 font-display text-lg text-ink">Site health check</h2>
            <button onClick={() => void doSiteCheck()} className="btn btn-primary !py-2 !text-[13px]">
              <Globe size={14} /> Check https://{owner}.github.io/{repo}/
            </button>
            {checkRes && <p className="mt-3 font-mono text-xs text-dim">{checkRes}</p>}
          </Card>
        </div>
      )}

      {/* ---------------- GUIDE ---------------- */}
      {tab === "guide" && (
        <Card>
          <h2 className="mb-5 font-display text-xl text-ink">Deploy from the dashboard — step by step</h2>
          <ol className="space-y-5">
            <Step n={1} title="Create the Personal Access Token">
              Open <code>github.com/settings/personal-access-tokens/new</code> → generate a
              <b> fine-grained token</b> scoped to <code>YousofLHC/YousofLHC</code> with
              <b> Contents: Read &amp; Write</b> and <b>Pages: Read &amp; Write</b>.
              Copy it (you see it only once).
            </Step>
            <Step n={2} title="Connect">
              Paste it in the <b>Connect</b> tab and press Connect. It is stored
              server-side in an encrypted httpOnly cookie for 12 h — nothing is kept in the browser.
              Alternatively put <code>GITHUB_TOKEN=ghp_…</code> into your local{" "}
              <code>.env.local</code> so the dashboard picks it up automatically.
            </Step>
            <Step n={3} title="Deploy">
              In the <b>Deploy</b> tab confirm owner/repo (<code>YousofLHC/YousofLHC</code>) and branch
              (<code>gh-pages</code>). Tick <i>rebuild static export</i> whenever content changed,
              then press <b>Build &amp; Deploy to Pages</b> and watch the progress bar.
            </Step>
            <Step n={4} title="Verify">
              The <b>Live status</b> tab shows Pages build state; use <i>Site health check</i> for an
              HTTP probe of the published URL.
            </Step>
            <Step n={5} title="Security notes">
              The token never enters browser storage or page HTML. Disconnect wipes it instantly.
              Admin routes are excluded from the service worker cache. Login rate-limited.
            </Step>
          </ol>
        </Card>
      )}
    </div>
  );

  function Row({ k, v, link }: { k: string; v?: string | null; link?: boolean }) {
    if (!v) return null;
    return (
      <div className="text-[13px]">
        <dt className="font-mono text-[10.5px] uppercase tracking-wider text-faint">{k}</dt>
        <dd className="mt-0.5 break-all text-dim">
          {link ? <a href={v} target="_blank" rel="noreferrer" className="text-cyan hover:underline">{v}</a> : v}
        </dd>
      </div>
    );
  }
}

