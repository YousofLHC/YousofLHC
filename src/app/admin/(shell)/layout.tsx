import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default async function AdminShellLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const store = await cookies();
  if (!verifySessionToken(store.get(ADMIN_COOKIE)?.value)) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-abyss text-ink">
      <AdminNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line bg-void/40 px-6 py-4 md:hidden">
          <Link href="/admin" className="font-mono text-sm text-ink">
            Admin studio
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/" className="font-mono text-xs text-dim hover:text-cyan">
              site ↗
            </Link>
            <Link href="/admin/logout" className="font-mono text-xs text-magenta">
              logout
            </Link>
          </div>
        </header>
        <main className="min-w-0 flex-1 px-6 py-8 md:px-10">{children}</main>
      </div>
    </div>
  );
}
