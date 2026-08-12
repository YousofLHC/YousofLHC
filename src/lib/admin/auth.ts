import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "yg_admin";
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

function key(): Buffer {
  const pwd = process.env.ADMIN_PASSWORD || "";
  const explicit = process.env.ADMIN_SECRET || "";
  const raw = explicit || createHmac("sha256", "phd-website-admin").update(pwd).digest("hex");
  return Buffer.from(raw);
}

function sign(payload: string): string {
  return `${payload}.${createHmac("sha256", key()).update(payload).digest("base64url")}`;
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected || !input) return false;
  return safeEqual(input, expected);
}

export function createSessionToken(): string {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + TTL_MS })).toString("base64url");
  return sign(payload);
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const i = token.lastIndexOf(".");
  if (i <= 0) return false;
  const payload = token.slice(0, i);
  const sig = token.slice(i + 1);
  const expected = createHmac("sha256", key()).update(payload).digest("base64url");
  if (!safeEqual(sig, expected)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { exp?: number };
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}
