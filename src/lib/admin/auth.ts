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

/* ---------- brute-force throttle (in-memory, per instance) ---------- */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILS = 5;
const attempts = new Map<string, { fails: number; firstAt: number }>();

function bucketId(ip: string): string {
  return ip || "unknown";
}

export function isLockedOut(ip: string): boolean {
  const b = attempts.get(bucketId(ip));
  if (!b) return false;
  if (Date.now() - b.firstAt > WINDOW_MS) {
    attempts.delete(bucketId(ip));
    return false;
  }
  return b.fails >= MAX_FAILS;
}

export function lockoutSeconds(ip: string): number {
  const b = attempts.get(bucketId(ip));
  if (!b) return 0;
  const remain = WINDOW_MS - (Date.now() - b.firstAt);
  return Math.max(0, Math.ceil(remain / 1000));
}

export function recordFailure(ip: string): void {
  const id = bucketId(ip);
  const b = attempts.get(id);
  if (!b || Date.now() - b.firstAt > WINDOW_MS) {
    attempts.set(id, { fails: 1, firstAt: Date.now() });
  } else {
    b.fails++;
  }
}

export function clearFailures(ip: string): void {
  attempts.delete(bucketId(ip));
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
