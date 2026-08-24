import { requireAdmin } from "@/lib/admin/store";
import { GithubStudio } from "@/components/admin/github-studio";

export const dynamic = "force-dynamic";

export default async function GitHubPage() {
  await requireAdmin();
  return <GithubStudio />;
}