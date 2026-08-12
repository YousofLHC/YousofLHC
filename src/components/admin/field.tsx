import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export const inputCls =
  "w-full rounded-lg border border-line bg-void/60 px-3.5 py-2.5 text-sm text-ink placeholder:text-faint transition-colors focus:border-cyan/60 focus:outline-none focus:ring-1 focus:ring-cyan/40";

export function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-dim">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-faint">{hint}</span>}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea {...props} className={`${inputCls} resize-y ${props.className ?? ""}`} />
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors ${
        checked ? "border-cyan/60 bg-cyan/20" : "border-line bg-panel"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
          checked ? "translate-x-6 bg-cyan" : "translate-x-1 bg-faint"
        }`}
      />
      {label && <span className="ml-3 font-mono text-xs text-dim">{label}</span>}
    </button>
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 font-mono text-xs text-dim">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-cyan"
      />
      {label}
    </label>
  );
}