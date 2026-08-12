"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, FolderGit2, GitBranch } from "lucide-react";
import type { Project } from "@/lib/data";
import { domainColors } from "@/lib/data";

const statusDot = {
  active: "bg-emerald shadow-[0_0_8px_#34d399]",
  complete: "bg-cyan/70",
  archived: "bg-faint",
} as const;

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const domains = useMemo(
    () => Array.from(new Set(projects.map((p) => p.domain))),
    [projects]
  );
  const [filter, setFilter] = useState<string>("All");

  const filtered =
    filter === "All" ? projects : projects.filter((p) => p.domain === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {["All", ...domains].map((d) => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            className={`chip !px-3.5 !py-1.5 ${filter === d ? "chip-active" : ""}`}
          >
            {d}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              <Link
                href={`/projects/${p.slug}`}
                className="card group flex h-full flex-col overflow-hidden"
              >
                <div className="relative h-44 overflow-hidden bg-gradient-to-br from-panel-2 via-panel to-abyss">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.cover}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    className="absolute left-3 top-3 rounded-md px-2 py-1 font-mono text-[10px]"
                    style={{
                      color: domainColors[p.domainColor],
                      backgroundColor: `${domainColors[p.domainColor]}1f`,
                      border: `1px solid ${domainColors[p.domainColor]}40`,
                    }}
                  >
                    {p.domain}
                  </span>
                  <span
                    className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-md glass px-2 py-1 font-mono text-[10px] text-dim`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${statusDot[p.status]}`} />
                    {p.status}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-ink transition-colors group-hover:text-cyan">
                      {p.title}
                    </h3>
                    <ArrowUpRight
                      size={15}
                      className="shrink-0 text-faint opacity-0 transition-all group-hover:opacity-100 group-hover:text-cyan"
                    />
                  </div>
                  <p className="mt-1 text-sm text-dim">{p.subtitle}</p>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-dim/80">
                    {p.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tech.map((t) => (
                      <span key={t} className="chip !py-0.5 text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                    <span className="font-mono text-[11px] text-faint">{p.year}</span>
                    <div className="flex gap-3">
                      {p.github && (
                        <span className="flex items-center gap-1 font-mono text-[11px] text-dim transition-colors group-hover:text-cyan">
                          <GitBranch size={12} /> github
                        </span>
                      )}
                      {p.demo && (
                        <span className="flex items-center gap-1 font-mono text-[11px] text-dim transition-colors group-hover:text-cyan">
                          <FolderGit2 size={12} /> demo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="mt-16 text-center text-dim">No projects in this domain yet.</div>
      )}
    </div>
  );
}

