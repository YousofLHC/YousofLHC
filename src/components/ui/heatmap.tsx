"use client";

import { useState } from "react";
import { domains, domainColors } from "@/lib/data";

const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

function cellAlpha(seed: number, i: number, base: number): number {
  const noise = (Math.sin(seed * 31.7 + i * 7.3) * 0.5 + 0.5) * 0.45;
  return Math.min(0.95, noise + (base / 5) * 0.55);
}

export function InterestHeatmap() {
  const [hover, setHover] = useState<{ row: number; col: number } | null>(null);
  const active =
    hover !== null
      ? { domain: domains[hover.row], col: hover.col }
      : null;

  return (
    <div className="glass rounded-2xl p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="heading text-lg">Research Interests Heatmap</h3>
          <p className="mt-1 text-sm text-dim">
            Where my attention currently radiates. Hover a cell.
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-faint">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-cyan/20" /> low
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-cyan/60" /> mid
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-cyan" /> high
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[560px]">
          <div className="flex">
            <div className="w-44 shrink-0" />
            {months.map((m, i) => (
              <div
                key={`${m}-${i}`}
                className="flex-1 text-center font-mono text-[10px] uppercase text-faint"
              >
                {m}
              </div>
            ))}
          </div>

          {domains.map((d, row) => {
            const color = domainColors[d.color];
            return (
              <div key={d.id} className="mt-1.5 flex items-center">
                <div className="flex w-44 shrink-0 items-center gap-2 pr-3">
                  <d.icon size={14} style={{ color }} />
                  <span
                    className={`truncate font-mono text-[11px] ${
                      hover?.row === row ? "text-ink" : "text-dim"
                    }`}
                  >
                    {d.short}
                  </span>
                </div>
                {months.map((_, col) => {
                  const a = cellAlpha(row * 3 + 1, col, d.heat);
                  return (
                    <button
                      key={col}
                      onMouseEnter={() => setHover({ row, col })}
                      onMouseLeave={() => setHover(null)}
                      onFocus={() => setHover({ row, col })}
                      onBlur={() => setHover(null)}
                      aria-label={`${d.label}, month ${col + 1}`}
                      className={`h-6 flex-1 rounded-[4px] transition-all duration-150 ${
                        hover?.row === row ? "scale-[1.06]" : ""
                      }`}
                      style={{
                        backgroundColor: color,
                        opacity: a,
                        boxShadow: hover?.row === row && hover?.col === col
                          ? `0 0 12px ${color}`
                          : "none",
                      }}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={`mt-5 rounded-xl border border-line bg-panel/50 px-4 py-3 transition-opacity ${
          active ? "opacity-100" : "opacity-60"
        }`}
      >
        {active ? (
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 font-mono text-sm text-ink">
                <active.domain.icon size={15} style={{ color: domainColors[active.domain.color] }} />
                {active.domain.label}
                <span className="text-faint">· month {active.col + 1}</span>
              </p>
              <p className="mt-1 text-sm leading-6 text-dim">{active.domain.blurb}</p>
            </div>
            <span
              className="shrink-0 rounded-full px-2.5 py-1 font-mono text-[11px]"
              style={{
                color: domainColors[active.domain.color],
                backgroundColor: `${domainColors[active.domain.color]}1f`,
              }}
            >
              heat {active.domain.heat}/5 · depth {active.domain.level}/5
            </span>
          </div>
        ) : (
          <p className="font-mono text-xs text-faint">
            Hover over the grid to inspect each active research direction.
          </p>
        )}
      </div>
    </div>
  );
}
