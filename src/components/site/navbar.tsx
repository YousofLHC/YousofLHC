"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { navLinks, site } from "@/lib/site";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`no-print fixed inset-x-0 top-0 z-[100] transition-all duration-300 ${
        scrolled ? "glass py-3 shadow-[0_10px_40px_-16px_rgba(0,0,0,0.4)]" : "bg-transparent py-5"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-accent to-accent-2 font-display text-sm font-bold text-void animate-logo-pulse transition-transform duration-300 group-hover:rotate-6">
            {site.shortName.slice(0, 2)}
          </span>
          <span className="hidden font-mono text-sm tracking-tight text-ink sm:block">
            {site.name}
            <span className="ml-1 text-accent">_</span>
          </span>
        </Link>

        <ul className="no-scrollbar flex min-w-0 items-center gap-0.5 overflow-x-auto rounded-full border border-line bg-panel/50 p-1 sm:gap-1">
          {navLinks.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <li key={l.href} className="shrink-0">
                <Link
                  href={l.href}
                  className={`group relative whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11.5px] font-medium transition-all duration-200 sm:px-4 sm:text-[13px] ${
                    active
                      ? "bg-gradient-to-b from-cyan to-violet text-void shadow-[0_2px_12px_rgba(79,200,232,0.35)]"
                      : "text-dim hover:bg-panel-2 hover:text-ink"
                  }`}
                >
                  {l.label}
                  {!active && (
                    <span className="absolute inset-x-4 -bottom-px h-px w-0 bg-gradient-to-r from-cyan to-violet transition-all duration-300 group-hover:w-[calc(100%-2rem)]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-2.5">
          <ThemeToggle />
          <Link href="/connect" className="btn btn-primary hidden !px-4 !py-2 sm:inline-flex">
            Let&apos;s talk
            <ArrowUpRight />
          </Link>
        </div>
      </nav>
    </header>
  );
}