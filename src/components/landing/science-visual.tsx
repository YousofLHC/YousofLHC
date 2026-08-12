export function ScienceVisual() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,rgba(59,225,255,0.12),transparent_65%)] blur-2xl" />

      <div className="glass relative overflow-hidden rounded-2xl border border-line p-5">
        <div className="pointer-events-none absolute inset-0 grid-overlay opacity-20" />

        {/* header row */}
        <div className="relative flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
          <span className="flex items-center gap-1.5 text-cyan">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_8px_var(--color-cyan)]" />
            molecular graph
          </span>
          <span className="text-faint">GPU Â· PyTorch</span>
        </div>

        {/* molecule + equations */}
        <svg viewBox="0 0 400 260" className="relative mt-2 w-full">
          {/* faint lattice behind (material science) */}
          <g stroke="currentColor" strokeOpacity="0.06" strokeWidth="1">
            {[0, 34, 68].map((x) => (
              <line key={`v${x}`} x1={x} y1={-20} x2={x} y2={280} />
            ))}
            {[20, 60, 100, 140, 180, 220, 260].map((y) => (
              <line key={`h${y}`} x1={-20} y1={y} x2={420} y2={y} />
            ))}
          </g>

          {/* message-passing pulse on center -> top edge */}
          <circle cx={110} cy={93} r={7} fill="var(--color-cyan)" opacity="0.45" className="animate-pulse-soft" />

          {/* bonds */}
          <g stroke="var(--color-cyan)" strokeOpacity="0.55" strokeWidth="1.5">
            <path d="M110 66 L63.2 93 M63.2 147 L110 174 M110 174 L156.8 147 M156.8 93 L110 66 Z" fill="none" />
            <line x1={110} y1={120} x2={110} y2={66} />
            <line x1={110} y1={120} x2={63.2} y2={93} />
            <line x1={110} y1={120} x2={63.2} y2={147} />
            <line x1={110} y1={120} x2={110} y2={174} />
            <line x1={110} y1={120} x2={156.8} y2={147} />
            <line x1={110} y1={120} x2={156.8} y2={93} />
            {/* side groups */}
            <line x1={156.8} y1={93} x2={206} y2={76} strokeOpacity="0.4" />
            <line x1={63.2} y1={147} x2={34} y2={182} strokeOpacity="0.4" />
            <line x1={63.2} y1={93} x2={34} y2={64} strokeOpacity="0.4" />
          </g>

          {/* hollow ring (bond-order hint) */}
          <circle cx={110} cy={120} r={26} fill="none" stroke="var(--color-violet)" strokeOpacity="0.5" strokeWidth="1.25" />
          <circle cx={110} cy={120} r={26} fill="none" stroke="var(--color-violet)" strokeOpacity="0.5" strokeWidth="1.25" strokeDasharray="6 10" className="animate-spin-slow" style={{ transformOrigin: "110px 120px" }} />

          {/* atoms */}
          <g fill="none" strokeWidth="2">
            <circle cx={110} cy={66} r={9} fill="var(--color-panel)" stroke="var(--color-cyan)" />
            <circle cx={63.2} cy={93} r={9} fill="var(--color-panel)" stroke="var(--color-cyan)" />
            <circle cx={63.2} cy={147} r={9} fill="var(--color-panel)" stroke="var(--color-cyan)" />
            <circle cx={110} cy={174} r={9} fill="var(--color-panel)" stroke="var(--color-cyan)" />
            <circle cx={156.8} cy={147} r={9} fill="var(--color-panel)" stroke="var(--color-cyan)" />
            <circle cx={156.8} cy={93} r={9} fill="var(--color-panel)" stroke="var(--color-cyan)" />
            <circle cx={110} cy={120} r={11} fill="var(--color-panel-2)" stroke="var(--color-magenta)" />
          </g>
          <g fill="var(--color-faint)" fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle">
            <text x={110} y={69} fill="var(--color-cyan)">C</text>
            <text x={110} y={177} fill="var(--color-violet)">C</text>
            <text x={110} y={123} fill="var(--color-magenta)">Fe</text>
            <text x={206} y={79} fill="var(--color-emerald)">O</text>
            <text x={34} y={185} fill="var(--color-violet)">N</text>
            <text x={34} y={67} fill="var(--color-emerald)">C</text>
          </g>

          {/* float equation chip */}
          <g>
            <rect x={196} y={150} width={168} height={40} rx={10} fill="var(--color-abyss)" stroke="var(--color-cyan)" strokeOpacity="0.35" />
            <text x={280} y={167} textAnchor="middle" fill="var(--color-cyan)" fontSize="13" fontFamily="JetBrains Mono, monospace">
              Î¼<text fontSize="9" dy="-4">vâ†’u</text><text dy="4">^</text><text fontSize="9" dy="-4">t+1</text>
            </text>
            <text x={280} y={182} textAnchor="middle" fill="var(--color-dim)" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
              = MLP( A<text fontSize="7" dy="-3">âŠ™</text> H<text fontSize="7" dy="-3">t</text> )
            </text>
          </g>

          {/* SMILES chip */}
          <g>
            <rect x={34} y={216} width={138} height={26} rx={8} fill="var(--color-abyss)" stroke="var(--color-violet)" strokeOpacity="0.35" />
            <text x={103} y={233} textAnchor="middle" fill="var(--color-violet)" fontSize="10.5" fontFamily="JetBrains Mono, monospace">
              C1=CC=CC=C1
            </text>
          </g>

          {/* GNN pipeline row */}
          <g fontFamily="JetBrains Mono, monospace" fontSize="9" fill="var(--color-faint)">
            <text x={238} y={110} textAnchor="middle">input</text>
            <text x={280} y={92} textAnchor="middle" fill="var(--color-dim)">conv</text>
            <text x={322} y={92} textAnchor="middle" fill="var(--color-dim)">conv</text>
            <text x={364} y={92} textAnchor="middle" fill="var(--color-cyan)">read</text>
            <g stroke="var(--color-line-strong)" strokeWidth="4" strokeLinecap="round">
              <line x1={246} y1={102} x2={272} y2={94} />
              <line x1={288} y1={94} x2={314} y2={94} />
              <line x1={330} y1={94} x2={356} y2={94} />
            </g>
          </g>
        </svg>

        {/* readout: property prediction bars */}
        <div className="relative mt-1 space-y-2.5">
          {[
            { label: "LogP", width: "82%", color: "var(--color-cyan)" },
            { label: "Solubility", width: "64%", color: "var(--color-violet)" },
            { label: "IC50 (nM)", width: "46%", color: "var(--color-emerald)" },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <span className="w-20 shrink-0 font-mono text-[9px] uppercase tracking-wider text-faint">
                {row.label}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-panel-2">
                <div
                  className="h-full rounded-full"
                  style={{ width: row.width, backgroundColor: row.color, boxShadow: `0 0 8px ${row.color}` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
