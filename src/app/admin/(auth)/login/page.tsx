import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-abyss px-5 text-ink">
      <div className="absolute right-5 top-5">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-cyan to-violet font-mono text-lg font-bold text-void">
            YG
          </div>
          <h1 className="heading mt-5 text-2xl">Admin console</h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-dim">
            restricted access · content management
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-void/40 p-6 backdrop-blur">
          <LoginForm />
        </div>

        <p className="mt-6 text-center font-mono text-[10px] text-faint">
          Set <span className="text-dim">ADMIN_PASSWORD</span> in the environment. Back to{" "}
          <Link href="/" className="text-cyan hover:underline">
            the site
          </Link>
        </p>
      </div>
    </main>
  );
}