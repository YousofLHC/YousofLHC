import type { Metadata } from "next";
import { BlogGrid } from "@/components/blog/blog-grid";
import { Reveal } from "@/components/ui/reveal";
import { listArticles } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Deep-dive technical articles with LaTeX math, chemical formulas, interactive diagrams and linked notebooks.",
};

export default async function BlogPage() {
  const posts = await listArticles("posts");
  const featured = posts[0];

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-28">
      <Reveal>
        <p className="section-kicker">knowledge hub / blog</p>
        <h1 className="heading mt-3 max-w-3xl text-4xl sm:text-5xl">
          Deep dives in <span className="text-grad-cyan">math, code & chemistry</span>
        </h1>
        <p className="mt-4 max-w-2xl text-dim">
          Full articles render LaTeX, chemical formulas, Mermaid diagrams, high-res
          figures with zoom, and embedded Jupyter notebooks. Every post is cross-linked to
          related notebooks, notes, and projects.
        </p>
      </Reveal>

      {featured && (
        <Reveal delay={0.08}>
          <a
            href={`/blog/${featured.slug}`}
            className="card group mt-10 block overflow-hidden md:grid md:grid-cols-2"
          >
            <div className="relative min-h-56 bg-gradient-to-br from-panel-2 via-panel to-abyss">
              {featured.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featured.cover}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="grid-overlay absolute inset-0 opacity-70" />
              )}
              <span className="absolute left-4 top-4 rounded-md glass px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan">
                featured
              </span>
            </div>
            <div className="flex flex-col justify-center p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
                {featured.date} · {featured.readTime} min read
              </p>
              <h2 className="mt-3 text-2xl font-semibold leading-snug text-ink transition-colors group-hover:text-cyan">
                {featured.title}
              </h2>
              <p className="mt-3 leading-7 text-dim">{featured.description}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {featured.tags.map((t) => (
                  <span key={t} className="chip !py-0.5 text-[10px]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </a>
        </Reveal>
      )}

      <Reveal delay={0.12}>
        <div className="mt-12">
          <BlogGrid posts={posts.slice(1)} />
        </div>
      </Reveal>
    </div>
  );
}
