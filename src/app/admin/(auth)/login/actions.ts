"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  createSessionToken,
  verifyPassword,
  isLockedOut,
  lockoutSeconds,
  recordFailure,
  clearFailures,
} from "@/lib/admin/auth";

export interface LoginState {
  error?: string;
}

async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "local"
  );
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const ip = await clientIp();
  if (isLockedOut(ip)) {
    return {
      error: `Too many attempts — locked for ${Math.ceil(lockoutSeconds(ip) / 60)} min.`,
    };
  }

  const password = String(formData.get("password") || "");
  if (!verifyPassword(password)) {
    recordFailure(ip);
    const left = Math.max(0, 5 - (isLockedOut(ip) ? 5 : 0));
    return {
      error: isLockedOut(ip)
        ? `Too many attempts — locked for ${Math.ceil(lockoutSeconds(ip) / 60)} min.`
        : `Wrong password — try again.${left > 0 ? ` (${left} attempts left)` : ""}`,
    };
  }
  clearFailures(ip);

  const store = await cookies();
  store.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  const next = String(formData.get("next") || "/admin");
  redirect(next.startsWith("/admin") ? next : "/admin");
}
