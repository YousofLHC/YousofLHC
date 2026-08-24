import { ArticleManager } from "@/components/admin/article-manager";
import { listArticles } from "@/lib/mdx";

export default async function ProjectsManagerPage() {
  const projectsMdx = await listArticles("projects", { includeDrafts: true });
  return <ArticleManager kind="projects" items={projectsMdx} title="Project deep-dives" />;
}