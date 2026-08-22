"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2, CalendarClock } from "lucide-react";
import { site } from "@/lib/site";

const purposes = [
  "Research collaboration",
  "Consulting / project",
  "Data science & ML work",
  "Mathematics tutoring",
  "Just saying hi",
];

const initialState = { name: "", email: "", org: "", subject: "", purpose: purposes[0], message: "" };

export function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const set = (k: keyof typeof initialState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    if (site.formspree) {
      try {
        await fetch(site.formspree, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(form),
        });
        setStatus("sent");
        setForm(initialState);
        return;
      } catch {
        /* fall through to mailto */
      }
    }

    const subject = encodeURIComponent(
      `[${form.purpose}] ${form.subject || "Message from website"} — ${form.name}`
    );
    const body = encodeURIComponent(
      `${form.message}\n\n—\n${form.name}${form.org ? ` · ${form.org}` : ""}\n${form.email}`
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setStatus("sent");
  }

  const input =
    "w-full rounded-lg border border-line bg-panel/70 px-3.5 py-2.5 text-sm text-ink placeholder:text-faint transition-colors focus:border-cyan/60 focus:outline-none focus:ring-1 focus:ring-cyan/40";

  if (status === "sent") {
    return (
      <div className="card flex flex-col items-center gap-3 p-10 text-center">
        <CheckCircle2 size={40} className="text-emerald" />
        <h3 className="text-lg font-semibold text-ink">Message sent</h3>
        <p className="max-w-sm text-sm leading-6 text-dim">
          Thanks for reaching out{form.name ? `, ${form.name.split(" ")[0]}` : ""}. I usually
          reply within 24–48 hours.
        </p>
        <button className="btn btn-ghost mt-2" onClick={() => setStatus("idle")}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-6 sm:p-8">
      <div className="flex items-center gap-2 text-sm text-dim">
        <CalendarClock size={15} className="text-cyan" />
        Expect a reply within 24–48h.
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-faint">
            Your name *
          </label>
          <input className={input} required value={form.name} onChange={set("name")} placeholder="Ada Lovelace" />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-faint">
            Email *
          </label>
          <input className={input} required type="email" value={form.email} onChange={set("email")} placeholder="ada@university.edu" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-faint">
            Affiliation / company
          </label>
          <input className={input} value={form.org} onChange={set("org")} placeholder="Lab, institute, or startup" />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-faint">
            Subject *
          </label>
          <input className={input} required value={form.subject} onChange={set("subject")} placeholder="e.g. PhD position inquiry" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-faint">
          Message *
        </label>
        <textarea
          className={`${input} min-h-36 resize-y`}
          required
          value={form.message}
          onChange={set("message")}
          placeholder="Tell me about the position, collaboration, or project…"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn btn-primary w-full disabled:opacity-60"
      >
        {status === "sending" ? (
          <>
            <Loader2 size={15} className="animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send size={15} /> Send message
          </>
        )}
      </button>
      <p className="text-center font-mono text-[10px] text-faint">
        PGP-encrypted replies available on request.
      </p>
    </form>
  );
}
