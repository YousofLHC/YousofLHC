import { ArticleManager } from "@/components/admin/article-manager";
import { listArticles } from "@/lib/mdx";

export default async function NotesManagerPage() {
  const notes = await listArticles("notes");
  return <ArticleManager kind="notes" items={notes} title="Study notes" />;
}