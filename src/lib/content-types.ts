import type { LucideIcon } from "lucide-react";
import {
  Brain,
  Cpu,
  FlaskConical,
  Hexagon,
  Magnet,
  Network,
  ScanLine,
  Sigma,
  Sparkles,
  Workflow,
} from "lucide-react";

export type DomainColor = "cyan" | "violet" | "magenta" | "emerald" | "amber";

export const domainColors: Record<DomainColor, string> = {
  cyan: "#3be1ff",
  violet: "#a78bfa",
  magenta: "#f472b6",
  emerald: "#34d399",
  amber: "#fbbf24",
};

/** name -> Lucide icon, used by the content generator to resolve string icon names */
export const lucideIconRegistry: Record<string, LucideIcon> = {
  Brain,
  Cpu,
  FlaskConical,
  Hexagon,
  Magnet,
  Network,
  ScanLine,
  Sigma,
  Sparkles,
  Workflow,
};

export interface ResearchDomain {
  id: string;
  label: string;
  short: string;
  blurb: string;
  level: number;
  heat: number;
  color: DomainColor;
  icon: LucideIcon;
  keywords: string[];
}

export interface TimelineItem {
  period: string;
  title: string;
  org: string;
  detail: string;
  tags: string[];
  highlight?: boolean;
}

export interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: string;
  status: "published" | "in-press" | "preprint" | "under-review";
  tags: string[];
  cite?: string;
}

export interface SkillGroup {
  name: string;
  skills: { name: string; level: number }[];
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  year: string;
  status: "active" | "complete" | "archived";
  domain: string;
  domainColor: DomainColor;
  tags: string[];
  tech: string[];
  cover: string;
  github?: string;
  demo?: string;
  featured?: boolean;
}