/**
 * One-shot / on-demand image optimizer.
 *
 * Converts source photos to WebP beside the original, then removes the
 * original so only optimized files ship to production. Re-run any time you
 * drop new raw photos into the watched folders — existing outputs are skipped
 * (idempotent), so it is safe to run repeatedly.
 *
 * Usage:  node scripts/optimize-images.mjs
 *
 * Rules (edit TARGETS below):
 *   - hero slides  → width 1600, quality 72
 *   - card images  → width 1200, quality 72
 */
import { readdirSync, existsSync, unlinkSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.dirname(import.meta.dirname);
const publicDir = path.join(root, "public", "assets");

const TARGETS = [
  { dir: path.join(publicDir, "scenes", "UseThisHeros"), width: 1600, quality: 72 },
  {
    dir: publicDir,
    file: "scenes/pexels-googledeepmind-17483874.jpg",
    width: 1200,
    quality: 72,
  },
];

async function convert(src, width, quality) {
  const out = src.replace(/\.(jpe?g|png)$/i, ".webp");
  if (existsSync(out)) {
    console.log(`skip (exists): ${path.relative(root, out)}`);
    return false;
  }
  const info = await sharp(src)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 4 })
    .toFile(out);
  console.log(
    `ok: ${path.relative(root, src)} → ${path.relative(root, out)}  ${(info.size / 1024).toFixed(0)} KB`
  );
  return true;
}

let count = 0;
for (const t of TARGETS) {
  const files = t.file
    ? [t.file]
    : readdirSync(t.dir).filter((f) => /\.(jpe?g|png)$/i.test(f));
  for (const f of files) {
    const src = path.join(t.dir, f);
    const ok = await convert(src, t.width, t.quality);
    if (ok) {
      unlinkSync(src); // ship optimized only
      count++;
    }
  }
}
console.log(`done — ${count} converted`);
