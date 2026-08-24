import {
  GitBranch, Briefcase, AtSign, GraduationCap, ScanLine, Send,
  Play, Camera, Globe, Mail, Layers, BookOpen,
  type LucideIcon,
} from "lucide-react";

export interface SocialPresetMeta {
  label: string;
  icon: LucideIcon;
}

/** Curated presets + fallback for arbitrary custom links.
 *  Brand glyphs are unavailable in this lucide build — neutral marks used. */
export const SOCIAL_PRESETS: Record<string, SocialPresetMeta> = {
  github: { label: "GitHub", icon: GitBranch },
  linkedin: { label: "LinkedIn", icon: Briefcase },
  x: { label: "X / Twitter", icon: AtSign },
  scholar: { label: "Google Scholar", icon: GraduationCap },
  orcid: { label: "ORCID", icon: ScanLine },
  telegram: { label: "Telegram", icon: Send },
  youtube: { label: "YouTube", icon: Play },
  instagram: { label: "Instagram", icon: Camera },
  researchgate: { label: "ResearchGate", icon: BookOpen },
  stackoverflow: { label: "Stack Overflow", icon: Layers },
  email: { label: "Email", icon: Mail },
  website: { label: "Website (custom)", icon: Globe },
};

export const SOCIAL_ID_OPTIONS = Object.keys(SOCIAL_PRESETS);

export function socialMeta(id: string): SocialPresetMeta {
  return (
    SOCIAL_PRESETS[id] ?? {
      label: id || "Link",
      icon: Globe,
    }
  );
}

/** Resolve an entry's href; Email preset falls back to the site email. */
export function socialHref(
  link: { id: string; url?: string },
  siteEmail?: string
): string {
  if (link.url) return link.url;
  if (link.id === "email" && siteEmail) return `mailto:${siteEmail}`;
  return "";
}
