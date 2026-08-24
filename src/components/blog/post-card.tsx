import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import type { ArticleMeta } from "@/lib/mdx";
import { CoverMedia } from "@/components/site/cover-media";

export function PostCard({
  post,
  href,
  kind = "post",
}: {
  post: ArticleMeta;
  href?: string;
  kind?: "post" | "note";
}) {
  const link = href ?? `/${kind === "note" ? "notes" : "blog"}/${post.slug}`;
  return (
    <Link href={link} className="card group flex flex-col overflow-hidden">
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-panel-2 via-panel to-abyss">
        {post.cover ? (
          <CoverMedia
            src={post.cover}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid-overlay h-full w-full opacity-70" />
        )}
        <span className="absolute left-3 top-3 rounded-md glass px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan">
          {kind}
        </span>
        <ArrowUpRight
          size={18}
          className="absolute right-3 top-3 text-cyan opacity-0 transition-opacity group-hover:opacity-100"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-faint">
          <span>{post.date}</span>
          {post.subject && <span>· {post.subject}</span>}
          <span className="ml-auto flex items-center gap-1">
            <Clock size={11} /> {post.readTime} min
          </span>
        </div>
        <h3 className="mt-2 line-clamp-2 font-semibold leading-snug text-ink transition-colors group-hover:text-cyan">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-dim">
          {post.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 4).map((t) => (
            <span key={t} className="chip !py-0.5 text-[10px]">
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
