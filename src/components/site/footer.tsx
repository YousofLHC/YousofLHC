import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";
import { socialHref, socialMeta } from "@/lib/social-presets";
import { marqueeDomains } from "@/lib/data";

const footerCols = [
  {
    title: "Explore",
    links: [
      { href: "/resume", label: "Resume & CV" },
      { href: "/projects", label: "Projects" },
      { href: "/blog", label: "Blog" },
      { href: "/notes", label: "Notes & Notebooks" },
      { href: "/connect", label: "Connect" },
    ],
  },
  {
    title: "Research",
    links: [
      { href: "/blog", label: "Message Passing" },
      { href: "/blog", label: "Machine Learning" },
      { href: "/blog", label: "Optimization" },
      { href: "/blog", label: "Anomaly Detection" },
      { href: "/blog", label: "Mathematics & Statistics" },
    ],
  },
];

type SocialLinkRow = { id: string; label: string; url: string };

const socialIcons = (site.socialLinks as readonly SocialLinkRow[])
  .map((l) => ({
    href: socialHref(l, site.email),
    label: l.label || socialMeta(l.id).label,
    icon: socialMeta(l.id).icon,
  }))
  .filter((s) => Boolean(s.href));

export function Footer() {
  return (
    <footer className="no-print relative border-t border-line bg-abyss/60">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-cyan to-violet font-mono text-sm font-bold text-void">
                {site.shortName.slice(0, 2)}
              </span>
              <span className="font-mono text-sm text-ink">{site.name}</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-dim">
              {site.tagline}. Bridging machine learning, optimization, and mathematics.
            </p>
            <div className="mt-5 flex gap-2">
              {socialIcons.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-line text-dim transition-all hover:border-cyan/50 hover:text-cyan hover:shadow-[0_0_14px_rgba(59,225,255,0.3)]"
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {footerCols.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="group inline-flex items-center gap-1 text-sm text-dim transition-colors hover:text-ink"
                    >
                      {l.label}
                      <ArrowUpRight
                        size={12}
                        className="text-faint opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 text-xs text-faint md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name} · All rights reserved.
          </p>
          <p className="flex items-center gap-2 font-mono">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber" />
            Building intelligence for a better future.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
            Domains
          </span>
          {marqueeDomains.map((d) => (
            <span key={d} className="font-mono text-[11px] text-dim/70">
              {d}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
