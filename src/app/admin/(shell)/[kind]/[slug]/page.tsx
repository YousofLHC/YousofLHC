import { ArticleEditor } from "@/components/admin/article-editor";
import { readArticleSource } from "@/lib/admin/store";
import { notFound } from "next/navigation";
import type { ArticleKind } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ kind: ArticleKind; slug: string }>;
}) {
  const { kind, slug } = await params;
  if (!["posts", "notes", "projects"].includes(kind)) notFound();
  const source = await readArticleSource(kind, slug);
  if (!source) notFound();
  return <ArticleEditor kind={kind} slug={source.slug} initial={source} />;
}