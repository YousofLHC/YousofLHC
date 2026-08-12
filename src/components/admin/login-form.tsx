"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Lock, Loader2, ShieldCheck } from "lucide-react";
import { login, type LoginState } from "@/app/admin/(auth)/login/actions";

const initialState: LoginState = {};

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const [state, formAction, pending] = useActionState(login, initialState);

  const input =
    "w-full rounded-lg border border-line bg-void/60 px-3.5 py-2.5 text-sm text-ink placeholder:text-faint transition-colors focus:border-cyan/60 focus:outline-none focus:ring-1 focus:ring-cyan/40";

  return (
    <form action={formAction} className="w-full space-y-5">
      <input type="hidden" name="next" value={next} />

      <div>
        <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-dim">
          Admin password
        </label>
        <div className="relative">
          <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
          <input
            type="password"
            name="password"
            required
            autoFocus
            autoComplete="current-password"
            className={`${input} pl-10`}
            placeholder="••••••••••"
          />
        </div>
      </div>

      {state.error && (
        <p className="rounded-lg border border-magenta/30 bg-magenta/10 px-3.5 py-2.5 text-sm text-magenta">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary w-full disabled:opacity-60"
      >
        {pending ? <Loader2 size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
