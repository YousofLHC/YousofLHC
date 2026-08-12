import { DataStudio } from "@/components/admin/data-studio";
import { readJsonFile } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function DataPage() {
  const config = await readJsonFile("content.json");
  return <DataStudio initial={config as never} />;
}