"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Zap } from "lucide-react";
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

  return (
    <header
      className={`no-print fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong py-2.5 shadow-[0_8px_40px_-12px_rgba(59,225,255,0.18)]" : "bg-transparent py-4"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-cyan to-violet font-mono text-sm font-bold text-void shadow-[0_0_18px_rgba(59,225,255,0.4)] transition-transform group-hover:rotate-6">
            {site.shortName.slice(0, 2)}
          </span>
          <span className="font-mono text-sm tracking-tight text-ink">
            {site.name}
            <span className="ml-1 text-faint">_</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`relative rounded-md px-3 py-2 font-mono text-[13px] transition-colors ${
                    active ? "text-cyan" : "text-dim hover:text-ink"
                  }`}
                >
                  {active && (
                    <span className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan to-transparent" />
                  )}
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/connect" className="btn btn-primary hidden !px-4 !py-2 sm:inline-flex">
            <Zap size={14} />
            Let&apos;s talk
          </Link>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink transition-colors hover:border-cyan/50 lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass-strong mx-4 mt-3 rounded-xl p-3 lg:hidden">
          <ul className="flex flex-col">
{navLinks.map((l) => {
                  const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
                  return (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className={`block rounded-lg px-3 py-2.5 font-mono text-sm ${
                          active ? "bg-cyan/10 text-cyan" : "text-dim"
                        }`}
                      >
                        {l.label}
                      </Link>
                    </li>
                  );
                })}
          </ul>
          <div className="mt-2 flex items-center justify-between border-t border-line px-2 pt-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-faint">theme</span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
