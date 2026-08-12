import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { readJsonFile } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const config = await readJsonFile("site.json");
  return <SiteSettingsForm config={config as Record<string, unknown>} />;
}