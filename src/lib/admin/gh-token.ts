/**
 * Secure GitHub token storage for the admin dashboard.
 *
 * Threat model addressed:
 *  - token NEVER reaches the browser: stored in an httpOnly, SameSite=Strict,
 *    Secure cookie encrypted with AES-256-GCM
 *  - encryption key derives from ADMIN_SECRET (or ADMIN_PASSWORD) — never
 *    shipped to the client
 *  - optional GITHUB_TOKEN env var acts as a server-side default so the
 *    dashboard works without pasting a token every session
 *  - explicit disconnect wipes the cookie; nothing persists client-side
 */
import { cookies } from "next/headers";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const COOKIE = "yg_gh";
const TTL_S = 12 * 60 * 60; // 12 h

function key(): Buffer {
  const secret =
    process.env.ADMIN_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "";
  return createHash("sha256").update(`yg-gh:${secret}`).digest();
}

export interface GhCookiePayload {
  token: string;
  login?: string;
  exp: number;
}

function encrypt(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64url")}.${tag.toString("base64url")}.${enc.toString("base64url")}`;
}

function decrypt(blob: string): GhCookiePayload | null {
  try {
    const [ivB, tagB, dataB] = blob.split(".");
    const decipher = createDecipheriv(
      "aes-256-gcm",
      key(),
      Buffer.from(ivB, "base64url")
    );
    decipher.setAuthTag(Buffer.from(tagB, "base64url"));
    const plain = Buffer.concat([
      decipher.update(Buffer.from(dataB, "base64url")),
      decipher.final(),
    ]).toString("utf8");
    const parsed = JSON.parse(plain) as GhCookiePayload;
    if (!parsed.token || parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Resolve the working token: encrypted cookie first, then env default. */
export async function getGhToken(): Promise<string | null> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (raw) {
    const payload = decrypt(raw);
    if (payload?.token) return payload.token;
  }
  const env = process.env.GITHUB_TOKEN?.trim();
  return env ? env : null;
}

export async function hasGhToken(): Promise<boolean> {
  const store = await cookies();
  if (store.get(COOKIE)?.value) {
    const raw = store.get(COOKIE)!.value;
    if (decrypt(raw)?.token) return true;
  }
  return Boolean(process.env.GITHUB_TOKEN?.trim());
}

/** Persist an encrypted, httpOnly session cookie with the token. */
export async function setGhToken(token: string, login?: string): Promise<void> {
  const store = await cookies();
  const payload: GhCookiePayload = {
    token,
    login,
    exp: Date.now() + TTL_S * 1000,
  };
  store.set(COOKIE, encrypt(JSON.stringify(payload)), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL_S,
  });
}

export async function clearGhToken(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getGhLogin(): Promise<string | null> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!raw) return null;
  return decrypt(raw)?.login ?? null;
}
