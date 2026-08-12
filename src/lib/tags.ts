import { domains } from "./data";

export interface Taggable {
  slug: string;
  title: string;
  description?: string;
  tags: string[];
  kind: "post" | "notebook" | "project" | "note";
}

/**
 * Auto-tagging: scan free text and map occurrences of known keyword patterns
 * to canonical domain tags from lib/data.ts. Always merges with explicit tags.
 */
export function autoTag(
  text: string,
  explicit: string[] = [],
  includeDomains = true
): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>(explicit.map((t) => t.toLowerCase()));

  if (includeDomains) {
    for (const d of domains) {
      const hit = d.keywords.some((k) => lower.includes(k.toLowerCase()));
      if (hit) found.add(d.label);
    }
  }

  return Array.from(found);
}

/** score how related two items are, based on tag overlap */
export function similarity(a: Taggable, b: Taggable): number {
  const aSet = new Set(a.tags.map((t) => t.toLowerCase()));
  const bSet = new Set(b.tags.map((t) => t.toLowerCase()));
  let hits = 0;
  for (const t of aSet) if (bSet.has(t)) hits++;
  return hits;
}

/**
 * Given a collection and the current item, return top-N related items
 * (excluding self) ranked by tag overlap, ties broken by title similarity.
 */
export function relatedItems<T extends Taggable>(
  all: T[],
  current: Taggable,
  limit = 3
): T[] {
  return all
    .filter((it) => it.slug !== current.slug)
    .map((it) => ({ it, score: similarity(current, it) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.it.title.localeCompare(b.it.title))
    .slice(0, limit)
    .map((r) => r.it);
}
