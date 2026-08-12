"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { ArticleMeta } from "@/lib/mdx";
import { PostCard } from "@/components/blog/post-card";

export function BlogGrid({ posts }: { posts: ArticleMeta[] }) {
  const tags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [posts]);

  const [active, setActive] = useState<string>("All");
  const filtered = active === "All" ? posts : posts.filter((p) => p.tags.includes(active));

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {["All", ...tags].map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`chip !px-3.5 !py-1.5 ${active === t ? "chip-active" : ""}`}
          >
            {t}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <motion.div
              layout
              key={p.slug}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
            >
              <PostCard post={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="mt-16 text-center text-dim">
          No articles tagged “{active}” yet — check back soon.
        </div>
      )}
    </div>
  );
}
