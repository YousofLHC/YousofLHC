"use client";

import { useRef, useState, type KeyboardEvent, type ClipboardEvent } from "react";
import { X } from "lucide-react";

/**
 * Chip-style tag editor.
 *  - Enter / Tab commits the typed tag
 *  - commas may be typed freely INSIDE a tag (they are literal characters)
 *  - pasting multi-token text splits on , ; or newlines for bulk insert
 *  - Backspace on an empty input removes the last chip
 */
export function TagInput({
  value,
  onChange,
  placeholder = "type and press Enter",
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const add = (raw: string) => {
    const t = raw.trim();
    if (!t || value.includes(t)) {
      setText("");
      return;
    }
    onChange([...value, t]);
    setText("");
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Tab") {
      if (text.trim()) {
        e.preventDefault();
        add(text);
      }
    } else if (e.key === "Backspace" && !text && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text");
    if (/[,;\n]/.test(pasted)) {
      e.preventDefault();
      const parts = pasted
        .split(/[,;\n]+/)
        .map((t) => t.trim())
        .filter(Boolean);
      const merged = [...value];
      for (const p of parts) if (!merged.includes(p)) merged.push(p);
      onChange(merged);
      setText("");
    }
  };

  const remove = (i: number) => onChange(value.filter((_, j) => j !== i));

  return (
    <div
      className="flex min-h-10 w-full cursor-text flex-wrap items-center gap-1.5 rounded-lg border border-line bg-void/60 px-2.5 py-1.5 text-sm transition-colors focus-within:border-cyan/60"
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className="inline-flex items-center gap-1 rounded-full border border-cyan/30 bg-cyan/10 px-2 py-0.5 font-mono text-[11.5px] text-cyan"
        >
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={(e) => {
              e.stopPropagation();
              remove(i);
            }}
            className="text-cyan/70 transition-colors hover:text-magenta"
          >
            <X size={11} />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={text}
        placeholder={value.length ? "" : placeholder}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKey}
        onPaste={onPaste}
        className="min-w-[8rem] flex-1 bg-transparent py-0.5 text-sm text-ink outline-none placeholder:text-faint"
      />
    </div>
  );
}
