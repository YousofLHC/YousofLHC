import { ArticleEditor } from "@/components/admin/article-editor";
import { notFound } from "next/navigation";
import type { ArticleKind } from "@/lib/admin/store";

export default async function NewArticlePage({
  params,
}: {
  params: Promise<{ kind: ArticleKind }>;
}) {
  const { kind } = await params;
  if (!["posts", "notes", "projects"].includes(kind)) notFound();
  return <ArticleEditor kind={kind} initial={null} />;
}