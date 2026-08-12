import type { Metadata } from "next";
import { Reveal } from "@/components/ui/reveal";
import { ProjectGrid } from "@/components/projects/project-grid";
import { projects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Research and engineering projects across message passing, graph neural networks, drug design, metabolic engineering, material informatics and agentic AI.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-28">
      <Reveal>
        <p className="section-kicker">portfolio / projects</p>
        <h1 className="heading mt-3 max-w-3xl text-4xl sm:text-5xl">
          Things I&apos;ve <span className="text-grad-cyan">built</span>, unfolded, and
          published
        </h1>
        <p className="mt-4 max-w-2xl text-dim">
          A living index of research prototypes and engineering systems. Filter by
          sub-domain — each project has a deep-dive page with architecture diagrams,
          math, and (where it makes sense) an interactive notebook.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <ProjectGrid projects={projects} />
      </Reveal>
    </div>
  );
}
