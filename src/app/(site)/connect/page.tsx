import type { Metadata } from "next";
import { CalendarClock, Clock, Mail, MapPin, Shield } from "lucide-react";
import { ContactForm } from "@/components/connect/contact-form";
import { InterestHeatmap } from "@/components/ui/heatmap";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Connect",
  description:
    "Collaborate, consult, or start a research conversation. Book a 1:1 call or send a message.",
};

export default function ConnectPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-28">
      <Reveal>
        <p className="section-kicker">networking / connect</p>
        <h1 className="heading mt-3 max-w-3xl text-4xl sm:text-5xl">
          Let&apos;s build the <span className="text-grad-cyan">next signal</span> together
        </h1>
        <p className="mt-4 max-w-2xl text-dim">
          Whether you&apos;re exploring a research collaboration, scoping a data or
          optimization project, or looking for mathematics tutoring — I read every
          message and reply within a few days.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <Reveal delay={0.08}>
          <ContactForm />
        </Reveal>

        <div className="space-y-5">
          {site.calendly && (
            <Reveal delay={0.14}>
              <div className="card p-6">
                <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyan">
                  <CalendarClock size={14} /> Book a 1:1 call
                </h3>
                <p className="mt-3 text-sm leading-6 text-dim">
                  Free 30-minute intro calls for collaborations and project scoping. Pick a
                  slot that works for you.
                </p>
                <a
                  href={site.calendly}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary mt-4 w-full"
                >
                  Open scheduling calendar
                </a>
              </div>
            </Reveal>
          )}

          <Reveal delay={0.2}>
            <div className="card p-6">
              <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyan">
                <Mail size={14} /> Direct lines
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a href={`mailto:${site.email}`} className="text-ink hover:text-cyan">
                    {site.email}
                  </a>
                </li>
                <li className="flex items-center gap-2 text-dim">
                  <MapPin size={13} className="text-faint" /> {site.location}
                </li>
                <li className="flex items-center gap-2 text-dim">
                  <Clock size={13} className="text-faint" /> {site.availability}
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.26}>
            <div className="card p-6">
              <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyan">
                <Shield size={14} /> How I collaborate
              </h3>
              <ul className="mt-3 space-y-2.5 text-sm leading-6 text-dim">
                <li className="flex gap-2">
                  <span className="text-cyan">▹</span> Clear scoping docs, milestones, and
                  open-source-first deliverables.
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan">▹</span> Reproducible notebooks, pinned
                  environments, and honest uncertainty.
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan">▹</span> NDA-friendly and IP-conscious for
                  industry engagements.
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.1}>
        <div className="mt-16">
          <InterestHeatmap />
        </div>
      </Reveal>

      {site.calendly && (
        <Reveal delay={0.15}>
          <div className="mt-12 overflow-hidden rounded-2xl border border-line bg-panel/40">
            <iframe
              title="Calendly scheduling"
              src={site.calendly}
              className="h-[560px] w-full"
              loading="lazy"
            />
          </div>
        </Reveal>
      )}
    </div>
  );
}
