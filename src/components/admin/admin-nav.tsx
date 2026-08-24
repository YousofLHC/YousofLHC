"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  BookOpen,
  FolderKanban,
  FlaskConical,
  Settings,
  UserRound,
  Images,
  LayoutDashboard,
  Globe,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/resume", label: "Résumé studio", icon: UserRound },
  { href: "/admin/data", label: "Data studio", icon: Settings, exact: true },
  { href: "/admin/posts", label: "Blog posts", icon: FileText },
  { href: "/admin/notes", label: "Study notes", icon: BookOpen },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/notebooks", label: "Notebooks", icon: FlaskConical },
  { href: "/admin/media", label: "Media", icon: Images },
  { href: "/admin/settings", label: "Site settings", icon: Settings },
  { href: "/admin/github", label: "GitHub Pages", icon: Globe },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-void/60 p-4 md:flex">
      <Link href="/admin" className="flex items-center gap-2.5 px-2 py-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-cyan to-violet font-mono text-sm font-bold text-void">
          YG
        </span>
        <div>
          <p className="font-mono text-sm text-ink">Admin</p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-faint">studio</p>
        </div>
      </Link>

      <nav className="mt-4 flex flex-1 flex-col gap-1">
        {links.map((l) => {
          const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 font-mono text-[13px] transition-colors ${
                active
                  ? "bg-cyan/10 text-cyan shadow-[inset_0_0_0_1px_rgba(59,225,255,0.25)]"
                  : "text-dim hover:bg-panel hover:text-ink"
              }`}
            >
              <l.icon size={15} />
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-line pt-3">
        <div className="flex items-center justify-between rounded-lg px-3 py-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-faint">theme</span>
          <ThemeToggle />
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 font-mono text-[13px] text-dim transition-colors hover:bg-panel hover:text-ink"
        >
          <ExternalLink size={15} />
          View site
        </Link>
        <Link
          href="/admin/logout"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 font-mono text-[13px] text-magenta transition-colors hover:bg-magenta/10"
        >
          <LogOut size={15} />
          Log out
        </Link>
      </div>
    </aside>
  );
}
