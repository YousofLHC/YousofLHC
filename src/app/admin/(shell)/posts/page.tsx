import { ArticleManager } from "@/components/admin/article-manager";
import { listArticles } from "@/lib/mdx";

export default async function PostsManagerPage() {
  const posts = await listArticles("posts", { includeDrafts: true });
  return <ArticleManager kind="posts" items={posts} title="Blog posts" />;
}