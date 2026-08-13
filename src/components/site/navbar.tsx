"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { navLinks, site } from "@/lib/site";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`no-print fixed inset-x-0 top-0 z-[100] transition-all duration-300 ${
        scrolled ? "glass py-3 shadow-[0_10px_40px_-16px_rgba(0,0,0,0.4)]" : "bg-transparent py-5"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-accent to-accent-2 font-display text-sm font-bold text-void animate-logo-pulse transition-transform duration-300 group-hover:rotate-6">
            {site.shortName.slice(0, 2)}
          </span>
          <span className="hidden font-mono text-sm tracking-tight text-ink sm:block">
            {site.name}
            <span className="ml-1 text-accent">_</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 rounded-full border border-line bg-panel/50 p-1 lg:flex">
          {navLinks.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-b from-cyan to-violet text-void shadow-[0_2px_12px_rgba(79,200,232,0.35)]"
                      : "text-dim hover:bg-panel-2 hover:text-ink"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link href="/connect" className="btn btn-primary hidden !px-4 !py-2 sm:inline-flex">
            Let&apos;s talk
            <ArrowUpRight />
          </Link>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-panel/60 text-ink transition-colors hover:border-cyan/50 lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <div className={`mobile-nav no-print lg:hidden ${open ? "open" : ""}`}>
        <div className="flex items-center justify-between">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-2 font-display text-sm font-bold text-void animate-logo-pulse">
            {site.shortName.slice(0, 2)}
          </span>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-line text-ink"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-12 flex flex-1 flex-col justify-center">
          {navLinks.map((l, i) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${i * 45}ms` : "0ms" }}
                className={`mnav-link flex items-center justify-between transition-opacity duration-300 ${
                  open ? "opacity-100" : "opacity-0"
                } ${active ? "!text-accent" : ""}`}
              >
                {l.label}
                <span className="font-mono text-xs text-faint">0{i + 1}</span>
              </Link>
            );
          })}
        </div>
        <div className="flex items-center justify-between border-t border-line pt-5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-faint">theme</span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}