"use client";

import { useState } from "react";
import {
  ChevronDown, Copy, Plus, Trash2, ArrowUp, ArrowDown,
  Superscript, FlaskConical,
} from "lucide-react";
import {
  ICON_OPTIONS, COLOR_OPTIONS,
  type FieldDef, type SectionDef,
} from "@/lib/admin/content-schema";
import { TagInput } from "@/components/admin/tag-input";

type Json = Record<string, unknown>;

/* ------------------------------ primitives ------------------------------ */

const inputCls =
  "w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-cyan/60";

function Label({ f, children }: { f: FieldDef; children?: React.ReactNode }) {
  return (
    <label className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-faint">
      {children ?? f.label}
      {f.required && <span className="text-accent"> *</span>}
    </label>
  );
}

function MarkdownBar({ onInsert }: { onInsert: (snippet: string) => void }) {
  const btn =
    "rounded border border-line px-1.5 py-0.5 text-[10px] font-mono text-dim hover:border-cyan/60 hover:text-cyan";
  return (
    <div className="mt-1 flex flex-wrap gap-1">
      <button type="button" className={btn} onClick={() => onInsert("\\( \\)}")}>{"\\( \\)"}</button>
      <button type="button" className={btn} onClick={() => onInsert("$$\n\n$$")}>{"$$ block $$"}</button>
      <button type="button" className={btn} onClick={() => onInsert("\\ce{H2O}")}>
        <FlaskConical size={10} className="mr-0.5 inline" /> ce{}
      </button>
      <button type="button" className={btn} onClick={() => onInsert("**bold**")}>b</button>
      <button type="button" className={btn} onClick={() => onInsert("*italic*")}>i</button>
      <button type="button" className={btn} onClick={() => onInsert("`code`")}>
        <Superscript size={10} className="inline" />
      </button>
      <button type="button" className={btn} onClick={() => onInsert("- item")}>list</button>
    </div>
  );
}

function FieldInput({
  f, value, onChange,
}: {
  f: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  switch (f.type) {
    case "boolean":
      return (
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={`flex h-6 w-11 items-center rounded-full border transition-colors ${
            value ? "border-emerald/60 bg-emerald/20" : "border-line bg-panel-2"
          }`}
          aria-pressed={Boolean(value)}
        >
          <span
            className={`mx-0.5 h-4 w-4 rounded-full bg-dim transition-transform ${
              value ? "translate-x-5 bg-emerald" : ""
            }`}
          />
        </button>
      );
    case "number": {
      const num = typeof value === "number" ? value : Number(value) || 0;
      return (
        <input
          type="number"
          min={f.min}
          max={f.max}
          value={num}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`${inputCls} font-mono`}
        />
      );
    }
    case "select":
      return (
        <select
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        >
          {(f.options ?? []).map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      );
    case "icon":
      return (
        <select
          value={String(value ?? ICON_OPTIONS[0])}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} font-mono`}
        >
          {ICON_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      );
    case "color":
      return (
        <div className="flex gap-2">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              title={c}
              onClick={() => onChange(c)}
              className={`h-7 w-7 rounded-lg border-2 transition-transform ${
                value === c ? "scale-110 border-ink" : "border-transparent"
              }`}
              style={{ background: `var(--t-${c})` }}
            />
          ))}
        </div>
      );
    case "tags":
    case "sublist": {
      const arr = Array.isArray(value) ? value : [];
      if (f.type === "tags") {
        return (
          <TagInput
            value={(arr as string[]).filter((t) => typeof t === "string")}
            onChange={(v) => onChange(v)}
          />
        );
      }
      /* sublist editor */
      const subs = f.subfields ?? [];

      /* --- RAW scalar array (e.g. profile.bio: string[]) ---
         Items are edited in place as primitives; object-shaped legacy items
         are coerced on read and written back as scalars. Never re-shaped. */
      if (f.type === "sublist" && f.scalarArray && subs.length === 1) {
        const sf = subs[0];
        const rows: Array<string | number> = arr.map((it) => {
          if (it !== null && typeof it === "object") {
            const o = it as Record<string, unknown>;
            if (sf.name in o) return (o[sf.name] as string | number) ?? "";
            const idxKeys = Object.keys(o)
              .filter((k) => /^\d+$/.test(k))
              .sort((a, b) => Number(a) - Number(b));
            if (idxKeys.length) return idxKeys.map((k) => String(o[k])).join("");
            return "";
          }
          return typeof it === "number" ? it : String(it ?? "");
        });
        const setRow = (i: number, v: string | number) => {
          const copy = [...rows];
          copy[i] = v;
          onChange(copy);
        };
        return (
          <div className="space-y-2">
            {rows.map((val, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="flex-1">
                  {sf.type === "markdown" ? (
                    <>
                      <textarea
                        rows={3}
                        className={`${inputCls} resize-y leading-6`}
                        value={String(val)}
                        onChange={(e) => setRow(i, e.target.value)}
                      />
                      <MarkdownBar
                        onInsert={(snip) =>
                          setRow(i, `${String(val)}${String(val) ? "\n" : ""}${snip}`)
                        }
                      />
                    </>
                  ) : sf.type === "number" ? (
                    <input
                      type="number"
                      min={sf.min}
                      max={sf.max}
                      className={`${inputCls} font-mono`}
                      value={Number(val)}
                      onChange={(e) => setRow(i, Number(e.target.value))}
                    />
                  ) : (
                    <input
                      className={inputCls}
                      value={String(val)}
                      onChange={(e) => setRow(i, e.target.value)}
                    />
                  )}
                  {f.help && <p className="mt-1 text-[10.5px] text-faint">{f.help}</p>}
                </div>
                <button
                  type="button"
                  aria-label="Remove paragraph"
                  onClick={() => onChange(rows.filter((_, j) => j !== i))}
                  className="mt-6 rounded-lg border border-line p-2 text-faint hover:border-magenta/60 hover:text-magenta"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => onChange([...rows, sf.type === "number" ? 0 : ""])}
              className="chip !py-1 !text-[11px]"
            >
              <Plus size={12} className="mr-1 inline" /> Add paragraph
            </button>
          </div>
        );
      }

      return (
        <div className="space-y-2">
          {arr.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="grid flex-1 gap-2 sm:grid-cols-[1fr_auto]">
                {subs.map((sf) => (
                  <div key={sf.name} className={sf.type === "markdown" ? "sm:col-span-2" : ""}>
                    <Label f={sf} />
                    {sf.type === "markdown" ? (
                      <textarea
                        rows={2}
                        className={`${inputCls} resize-y`}
                        value={String((item as Json)?.[sf.name] ?? "")}
                        onChange={(e) => {
                          const copy = [...(arr as Json[])];
                          copy[i] = { ...(item as Json), [sf.name]: e.target.value };
                          onChange(copy);
                        }}
                      />
                    ) : sf.type === "number" ? (
                      <input
                        type="number" min={sf.min} max={sf.max}
                        className={`${inputCls} font-mono`}
                        value={Number((item as Json)?.[sf.name] ?? 0)}
                        onChange={(e) => {
                          const copy = [...(arr as Json[])];
                          copy[i] = { ...(item as Json), [sf.name]: Number(e.target.value) };
                          onChange(copy);
                        }}
                      />
                    ) : (
                      <input
                        className={inputCls}
                        value={String((item as Json)?.[sf.name] ?? "")}
                        onChange={(e) => {
                          const copy = [...(arr as Json[])];
                          copy[i] = { ...(item as Json), [sf.name]: e.target.value };
                          onChange(copy);
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                aria-label="Remove row"
                onClick={() => onChange((arr as unknown[]).filter((_, j) => j !== i))}
                className="mt-6 rounded-lg border border-line p-2 text-faint hover:border-magenta/60 hover:text-magenta"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange([...(arr as unknown[]), Object.fromEntries(subs.map(sf => [sf.name, sf.type === "number" ? 50 : ""]))])}
            className="chip !py-1 !text-[11px]"
          >
            <Plus size={12} className="mr-1 inline" /> Add
          </button>
        </div>
      );
    }
    case "textarea":
    case "markdown":
      return (
        <div>
          <textarea
            rows={f.type === "markdown" ? 4 : 3}
            className={`${inputCls} resize-y leading-6`}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
          />
          {f.type === "markdown" && (
            <MarkdownBar
              onInsert={(snip) => {
                /* naive append; good enough for hints */
                onChange(`${String(value ?? "")}${value ? "\n" : ""}${snip}`);
              }}
            />
          )}
        </div>
      );
    default:
      return (
        <input
          className={inputCls}
          value={String(value ?? "")}
          placeholder={f.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}

/* ------------------------------ item card ------------------------------ */

function ItemCard({
  index, total, item, def, onChange, onMove, onDelete, onDuplicate,
}: {
  index: number;
  total: number;
  item: Json;
  def: SectionDef;
  onChange: (next: Json) => void;
  onMove: (dir: -1 | 1) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const itemDef = def.item!;
  const title = String(item?.[itemDef.titleField] || `Item ${index + 1}`);
  const subtitle = itemDef.subtitleField ? String(item?.[itemDef.subtitleField] ?? "") : "";

  const iconBtn = "rounded-lg border border-line p-1.5 text-faint transition-colors hover:border-cyan/60 hover:text-cyan disabled:opacity-30";

  return (
    <div className="rounded-xl border border-line bg-panel/60">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <button type="button" onClick={() => setOpen(v => !v)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
          <ChevronDown size={14} className={`shrink-0 text-faint transition-transform ${open ? "" : "-rotate-90"}`} />
          <span className="truncate text-sm font-medium text-ink">{title}</span>
          {subtitle && <span className="truncate text-xs text-faint">· {subtitle}</span>}
        </button>
        <button type="button" className={iconBtn} disabled={index === 0} onClick={() => onMove(-1)} aria-label="Move up"><ArrowUp size={13} /></button>
        <button type="button" className={iconBtn} disabled={index === total - 1} onClick={() => onMove(1)} aria-label="Move down"><ArrowDown size={13} /></button>
        <button type="button" className={iconBtn} onClick={onDuplicate} aria-label="Duplicate"><Copy size={13} /></button>
        <button type="button" className={`${iconBtn} hover:!border-magenta/60 hover:!text-magenta`} onClick={onDelete} aria-label="Delete"><Trash2 size={13} /></button>
      </div>

      {open && (
        <div className="grid gap-3 border-t border-line p-4 sm:grid-cols-2">
          {itemDef.fields.map((f) => {
            const wide = f.type === "markdown" || f.type === "textarea" || f.type === "sublist";
            return (
              <div key={f.name} className={wide ? "sm:col-span-2" : ""}>
                <Label f={f} />
                <FieldInput
                  f={f}
                  value={item?.[f.name]}
                  onChange={(v) => onChange({ ...item, [f.name]: v })}
                />
                {f.help && <p className="mt-1 text-[10.5px] text-faint">{f.help}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------ section editor ------------------------------ */

export function SectionEditor({
  def, value, onChange,
}: {
  def: SectionDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (def.kind === "object") {
    const obj = (value ?? {}) as Json;
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {(def.fields ?? []).map((f) => {
          const wide = f.type === "textarea" || f.type === "markdown" || f.type === "sublist";
          return (
            <div key={f.name} className={wide ? "sm:col-span-2" : ""}>
              <Label f={f} />
              <FieldInput f={f} value={obj[f.name]} onChange={(v) => onChange({ ...obj, [f.name]: v })} />
              {f.help && <p className="mt-1 text-[10.5px] text-faint">{f.help}</p>}
            </div>
          );
        })}
      </div>
    );
  }

  const arr = Array.isArray(value) ? (value as Json[]) : [];
  const setArr = (next: Json[]) => onChange(next);

  return (
    <div className="space-y-2">
      {arr.map((item, i) => (
        <ItemCard
          key={i}
          index={i}
          total={arr.length}
          item={item}
          def={def}
          onChange={(next) => { const c = [...arr]; c[i] = next; setArr(c); }}
          onMove={(dir) => { const c = [...arr]; const j = i + dir; [c[i], c[j]] = [c[j], c[i]]; setArr(c); }}
          onDelete={() => setArr(arr.filter((_, j) => j !== i))}
          onDuplicate={() => { const c = [...arr]; c.splice(i + 1, 0, structuredClone(item)); setArr(c); }}
        />
      ))}
      <button
        type="button"
        onClick={() => setArr([...arr, structuredClone(def.addDefault ?? {})])}
        className="chip mt-1"
      >
        <Plus size={13} className="mr-1 inline" /> Add {def.item?.titleField ? "entry" : "item"}
      </button>
    </div>
  );
}
