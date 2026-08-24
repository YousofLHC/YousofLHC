#!/usr/bin/env node
/**
 * Admin smoke test — proves the panel's server side really works.
 *
 *   Part 1  Store-level CRUD through the EXACT module the UI calls
 *           (article create / read / update / delete + JSON roundtrip).
 *   Part 2  HTTP probes against a real production server:
 *           - login page renders (200)
 *           - unauthenticated GET to an admin route redirects, NOT 404
 *           - unauthenticated POST is never a bare 404
 *
 * Usage:
 *   npm run build            (production bundle for part 2)
 *   node --experimental-strip-types --import ./scripts/ts-register.mjs \
 *        scripts/admin-smoke.mjs
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { existsSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
let pass = 0;
let fail = 0;

function check(name, cond, extra = "") {
  if (cond) {
    pass++;
    console.log(`PASS  ${name}`);
  } else {
    fail++;
    console.log(`FAIL  ${name}${extra ? ` — ${extra}` : ""}`);
  }
}

/* ==================== Part 1 · store CRUD ==================== */

console.log("\n── Part 1 · store-level CRUD ──");
try {
  const store = await import("../src/lib/admin/store.ts");

  const kind = "posts";
  const slug = `__smoke_${Date.now()}`;
  const fm = { title: "Smoke test", draft: true };
  const body1 = "# smoke v1\n\nTemporary article created by admin-smoke.";
  const body2 = body1.replace("v1", "v2");

  try {
    await store.saveArticle(kind, slug, fm, body1);
    let read = await store.readArticleSource(kind, slug);
    const ok1 =
      Boolean(read) &&
      read.body.trim() === body1 &&
      read.frontmatter.title === "Smoke test";
    check("create + read article", ok1);
    if (!ok1) {
      console.log(
        "      debug got:",
        JSON.stringify(read)?.slice(0, 400)
      );
    }

    await store.saveArticle(kind, slug, fm, body2);
    read = await store.readArticleSource(kind, slug);
    check("update article", read?.body.trim() === body2);

    // comma-containing tag survives a save/read roundtrip
    const commaTags = ["machine learning, deep", "R"];
    await store.saveArticle(kind, slug, { ...fm, tags: commaTags }, body2);
    read = await store.readArticleSource(kind, slug);
    check(
      "tag with comma preserved",
      JSON.stringify(read?.frontmatter.tags) === JSON.stringify(commaTags)
    );

    // drafts: hidden by default, visible with includeDrafts
    const mdx = await import("../src/lib/mdx.ts");
    const publicList = await mdx.listArticles(kind);
    const adminList = await mdx.listArticles(kind, { includeDrafts: true });
    check("draft hidden from public list", !publicList.some((a) => a.slug === read.slug));
    check("draft visible with includeDrafts", adminList.some((a) => a.slug === read.slug));

    // cover generation for an arbitrary new slug
    const covSlug = `smoke-cover-${Date.now()}`;
    const cov = await store.ensureCover(covSlug, "Smoke Cover Title");
    let coverOk = Boolean(cov) && (await import("node:fs")).existsSync(`public/covers/${covSlug}.svg`);
    check("ensureCover writes svg", coverOk);
    if (coverOk) rmSync(path.join(root, "public", "covers", `${covSlug}.svg`));

    // rich motifs — dna scene must contain helix backbones + base-pair rungs
    await store.ensureCover("motif-dna", "DNA", "dna", 0);
    const dnaSvg = (await import("node:fs")).readFileSync(
      path.join(root, "public", "covers", "motif-dna.svg"), "utf8"
    );
    const circles = (dnaSvg.match(/<circle/g) ?? []).length;
    check("dna motif rich (rungs+backbones)", /<polyline/.test(dnaSvg) && circles >= 20);
    rmSync(path.join(root, "public", "covers", "motif-dna.svg"));

    // agent scene must contain hub + tool nodes
    await store.ensureCover("motif-agent", "Agentic AI", "agent", 0);
    const agentSvg = (await import("node:fs")).readFileSync(
      path.join(root, "public", "covers", "motif-agent.svg"), "utf8"
    );
    check("agent motif rich (hub + tools)", /AGENT/.test(agentSvg) && (agentSvg.match(/<text/g) ?? []).length >= 4);
    rmSync(path.join(root, "public", "covers", "motif-agent.svg"));

    // explicit style + variant produce distinct output
    const a1 = path.join(root, "public", "covers", "smoke-style-a.svg");
    const a2 = path.join(root, "public", "covers", "smoke-style-b.svg");
    await store.ensureCover("smoke-style-a", "T", "waves", 0);
    await store.ensureCover("smoke-style-b", "T", "starfield", 2);
    const fsp = await import("node:fs/promises");
    const bufA = await fsp.readFile(a1);
    const bufB = await fsp.readFile(a2);
    check("style param respected (distinct svg)", existsSync(a1) && existsSync(a2) && !bufA.equals(bufB));
    rmSync(a1);
    rmSync(a2);

    // upload any-format cover (fake webp bytes)
    const up = await store.saveCoverUpload(
      "upload-slug",
      "photo.webp",
      Buffer.from([0x52, 0x49, 0x46, 0x46, 0x00, 0x01])
    );
    check(
      "upload webp stored",
      Boolean(up?.path.includes("/covers/uploads/")) &&
        existsSync(path.join(root, "public", up.path))
    );

    // ---- CRUD: delete ----
    if (up) {
      const gone = await store.deleteCover(up.path);
      check("delete uploaded cover", gone && !existsSync(path.join(root, "public", up.path)));
    }

    const delSlug = `smoke-del-${Date.now()}`;
    await store.ensureCover(delSlug, "Delete me");
    const delPath = `/covers/${delSlug}.svg`;
    check("generated cover exists before delete", existsSync(path.join(root, `public${delPath.replace(/\//g, "\\")}`)) || existsSync(path.join(root, "public", delPath)));
    const goneGen = await store.deleteCover(delPath);
    check("delete generated svg", goneGen && !existsSync(path.join(root, "public", delPath)));

    // path traversal must be rejected
    const evil = await store.deleteCover("/covers/uploads/../../data/site.json");
    check("traversal rejected", evil === false && existsSync(path.join(root, "content", "data", "site.json")));

    // reject unsupported extension
    const bad = await store.saveCoverUpload("upload-slug", "clip.avi", Buffer.from([0]));
    check("unsupported ext rejected", bad === null);

    // section preview parity: markdown + katex render
    // (uses lib/mdx mdxOptions — the SAME config renderSectionPreview uses)
    const mdxLib = await import("../src/lib/mdx.ts");
    const { evaluate } = await import("next-mdx-remote-client/rsc");
    const out = await evaluate({
      source: "Greek *is* $\\alpha$ and bold **works**.",
      components: {},
      options: { mdxOptions: mdxLib.mdxOptions },
    });
    const { renderToStaticMarkup } = await import("react-dom/server");
    const htmlOut = renderToStaticMarkup(out.content);
    check(
      "pipeline parity (em + katex)",
      /<em>is<\/em>/.test(htmlOut) && /katex/.test(htmlOut)
    );

    await store.deleteArticle(kind, slug);
    read = await store.readArticleSource(kind, slug);
    check("delete article → null", read === null);
  } finally {
    // belt & braces: never leave smoke artifacts behind
    await store.deleteArticle(kind, slug).catch(() => {});
  }

  // JSON roundtrip on a throwaway file (real content files untouched)
  const tmpName = "_smoke.json";
  await store.writeJsonFile(tmpName, { ok: true, n: 42 });
  const j = await store.readJsonFile(tmpName);
  check("json write/read roundtrip", j.ok === true && j.n === 42);
  rmSync(path.join(root, "content", "data", tmpName));
} catch (err) {
  fail++;
  console.log("FAIL  store import/execution —", err instanceof Error ? err.message : err);
}
console.log(`--- store: ${pass} passed, ${fail} failed ---`);

/* ==================== Part 2 · HTTP probes ==================== */

if (fail > 0 || process.env.SMOKE_SKIP_HTTP === "1") {
  console.log("\n(skipping HTTP probes)");
} else {
  console.log("\n── Part 2 · HTTP probes (production server :3179) ──");
  const port = 3179;
  const base = `http://127.0.0.1:${port}`;
  const server = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start", "-p", String(port)],
    { cwd: root, stdio: "ignore" }
  );

  try {
    let up = false;
    for (let i = 0; i < 60; i++) {
      try {
        const r = await fetch(`${base}/admin/login`);
        if (r.status === 200) { up = true; break; }
      } catch { /* not ready yet */ }
      await sleep(500);
    }
    check("server boots — GET /admin/login = 200", up);
    if (!up) throw new Error("server did not start");

    const nav = await fetch(`${base}/admin/posts`, { redirect: "manual" });
    check(
      "GET /admin/posts w/o session → redirect (not 404)",
      [302, 303, 307, 308].includes(nav.status),
      `got ${nav.status}`
    );

    const post = await fetch(`${base}/admin/posts/__smoke`, {
      method: "POST",
      redirect: "manual",
    });
    check("POST /admin/posts/x w/o session → not 404", post.status !== 404, `got ${post.status}`);

    const home = await fetch(base);
    check("GET homepage = 200", home.status === 200);
  } catch (err) {
    fail++;
    console.log("FAIL  http probes —", err instanceof Error ? err.message : err);
  } finally {
    server.kill("SIGTERM");
    await sleep(300);
  }
}

console.log(`\nSMOKE RESULT: ${pass} passed / ${fail} failed`);
process.exit(fail ? 1 : 0);
