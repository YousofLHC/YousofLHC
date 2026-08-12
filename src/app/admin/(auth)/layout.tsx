import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin/auth";

export default async function AdminAuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const store = await cookies();
  if (verifySessionToken(store.get(ADMIN_COOKIE)?.value)) redirect("/admin");
  return children;
}