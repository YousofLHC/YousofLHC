import { MediaManager } from "@/components/admin/media-manager";
import { listMedia } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const files = await listMedia();
  return <MediaManager initial={files} />;
}