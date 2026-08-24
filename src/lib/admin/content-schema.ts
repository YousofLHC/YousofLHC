/**
 * Content schema registry — single source of truth for the admin UI.
 *
 * The generic SchemaForm renders typed editors from these descriptors, so a
 * field added here instantly appears in Data Studio / Résumé Studio and is
 * included in import/export + validation. Keep names in sync with the JSON
 * consumed by scripts/generate-content.mjs.
 */

import { SOCIAL_ID_OPTIONS } from "@/lib/social-presets";

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "number"
  | "boolean"
  | "select"
  | "tags"
  | "icon"
  | "color"
  | "sublist";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  options?: readonly string[];
  /** for sublist: the child item's fields */
  subfields?: readonly FieldDef[];
  /**
   * sublist variant whose items are RAW values (string/number) instead of
   * objects — e.g. profile.bio is string[]. Editing never re-shapes items.
   */
  scalarArray?: boolean;
  help?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  required?: boolean;
  /** hide inside item cards (still exported) */
  compactInCardHide?: boolean;
}

export interface ItemDef {
  titleField: string;
  subtitleField?: string;
  fields: readonly FieldDef[];
}

export interface SectionDef {
  key: string;
  label: string;
  description?: string;
  file: "content.json" | "site.json";
  kind: "object" | "objectArray";
  item?: ItemDef;
  fields?: readonly FieldDef[];
  addDefault?: Record<string, unknown>;
  /** group tag used by Résumé Studio */
  group?: "resume" | "general";
}

export const ICON_OPTIONS = [
  "Brain", "Cpu", "FlaskConical", "Hexagon", "Magnet", "Network",
  "ScanLine", "Sigma", "Sparkles", "Workflow",
] as const;

export const COLOR_OPTIONS = ["cyan", "violet", "magenta", "emerald", "amber"] as const;

export const PUB_STATUS = [
  "published", "in-press", "preprint", "under-review", "other",
] as const;

export const PROJECT_STATUS = ["complete", "active", "archived"] as const;

const tagsField: FieldDef = { name: "tags", label: "Tags", type: "tags" };

const periodTitleOrgDetail: readonly FieldDef[] = [
  { name: "period", label: "Period", type: "text", placeholder: "2022 — 2025", required: true },
  { name: "title", label: "Title / Degree", type: "text", required: true },
  { name: "org", label: "Organization", type: "text", required: true },
  { name: "detail", label: "Details", type: "markdown", help: "Markdown + inline \\(LaTeX\\) allowed" },
];

export const SECTIONS: SectionDef[] = [
  {
    key: "profile",
    label: "Profile",
    file: "content.json",
    kind: "object",
    group: "resume",
    fields: [
      { name: "name", label: "Full name", type: "text", required: true },
      { name: "firstName", label: "First name", type: "text" },
      { name: "role", label: "Role line", type: "text" },
      { name: "degree", label: "Degree", type: "text" },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "focus", label: "Current focus strip", type: "textarea" },
      { name: "bio", label: "Bio paragraphs", type: "sublist", scalarArray: true, compactInCardHide: true,
        subfields: [{ name: "p", label: "Paragraph", type: "markdown" }] },
    ],
  },
  {
    key: "stats",
    label: "Stats strip",
    file: "content.json",
    kind: "objectArray",
    item: { titleField: "label", fields: [
      { name: "value", label: "Value", type: "text", required: true },
      { name: "label", label: "Label", type: "text", required: true },
    ]},
    addDefault: { value: "0", label: "New stat" },
  },
  {
    key: "education",
    label: "Education",
    file: "content.json",
    kind: "objectArray",
    group: "resume",
    item: { titleField: "title", subtitleField: "org", fields: [...periodTitleOrgDetail,
      { name: "highlight", label: "Highlight", type: "boolean" }, tagsField ]},
    addDefault: { period: "", title: "New degree", org: "", detail: "", tags: [] },
  },
  {
    key: "experience",
    label: "Experience",
    file: "content.json",
    kind: "objectArray",
    group: "resume",
    item: { titleField: "title", subtitleField: "org", fields: [...periodTitleOrgDetail,
      { name: "highlight", label: "Highlight", type: "boolean" }, tagsField ]},
    addDefault: { period: "", title: "New role", org: "", detail: "", tags: [] },
  },
  {
    key: "publications",
    label: "Publications",
    file: "content.json",
    kind: "objectArray",
    group: "resume",
    item: { titleField: "title", subtitleField: "venue", fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "authors", label: "Authors", type: "text", required: true },
      { name: "venue", label: "Venue / Journal", type: "text" },
      { name: "year", label: "Year", type: "text" },
      { name: "status", label: "Status", type: "select", options: PUB_STATUS },
      tagsField,
      { name: "cite", label: "Citation (BibTeX optional)", type: "textarea", compactInCardHide: true },
    ]},
    addDefault: { title: "New publication", authors: "", venue: "", year: String(new Date().getFullYear()), status: "preprint", tags: [], cite: "" },
  },
  {
    key: "awards",
    label: "Awards",
    file: "content.json",
    kind: "objectArray",
    group: "resume",
    item: { titleField: "title", fields: [
      { name: "year", label: "Year", type: "text" },
      { name: "title", label: "Award", type: "text", required: true },
      { name: "org", label: "Issuer", type: "text" },
    ]},
    addDefault: { year: "", title: "New award", org: "" },
  },
  {
    key: "certifications",
    label: "Certifications",
    file: "content.json",
    kind: "objectArray",
    group: "resume",
    item: { titleField: "title", fields: [
      { name: "year", label: "Year", type: "text" },
      { name: "title", label: "Certification", type: "text", required: true },
      { name: "org", label: "Issuer", type: "text" },
    ]},
    addDefault: { year: "", title: "New certification", org: "" },
  },
  {
    key: "skills",
    label: "Skills groups",
    file: "content.json",
    kind: "objectArray",
    group: "resume",
    item: { titleField: "name", fields: [
      { name: "name", label: "Group name", type: "text", required: true },
      { name: "skills", label: "Skills (name + 0–100 level)", type: "sublist", compactInCardHide: true,
        subfields: [
          { name: "name", label: "Skill", type: "text", required: true },
          { name: "level", label: "Level %", type: "number", min: 0, max: 100 },
        ]},
    ]},
    addDefault: { name: "New group", skills: [] },
  },
  {
    key: "languages",
    label: "Spoken languages",
    file: "content.json",
    kind: "objectArray",
    group: "resume",
    item: { titleField: "name", fields: [
      { name: "name", label: "Language", type: "text", required: true },
      { name: "level", label: "Level text", type: "text" },
      { name: "percentage", label: "Percentage", type: "number", min: 0, max: 100 },
    ]},
    addDefault: { name: "New language", level: "", percentage: 50 },
  },
  {
    key: "projects",
    label: "Projects",
    file: "content.json",
    kind: "objectArray",
    item: { titleField: "title", subtitleField: "subtitle", fields: [
      { name: "slug", label: "Slug", type: "text", required: true, help: "URL id — also needs a matching MDX in content/projects/" },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "subtitle", label: "Subtitle", type: "text" },
      { name: "summary", label: "Summary", type: "textarea" },
      { name: "year", label: "Year", type: "text" },
      { name: "status", label: "Status", type: "select", options: PROJECT_STATUS },
      { name: "domain", label: "Domain label", type: "text" },
      { name: "domainColor", label: "Domain color", type: "color" },
      tagsField,
      { name: "tech", label: "Tech stack", type: "tags" },
      { name: "cover", label: "Cover path", type: "text", placeholder: "/covers/my-cover.svg" },
      { name: "featured", label: "Featured", type: "boolean" },
    ]},
    addDefault: { slug: "", title: "New project", subtitle: "", summary: "", year: "", status: "active", domain: "", domainColor: "cyan", tags: [], tech: [], cover: "", featured: false },
  },
  {
    key: "services",
    label: "Services",
    file: "content.json",
    kind: "objectArray",
    item: { titleField: "title", fields: [
      { name: "icon", label: "Icon", type: "icon" },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "blurb", label: "Blurb", type: "textarea" },
    ]},
    addDefault: { icon: "Sparkles", title: "New service", blurb: "" },
  },
  {
    key: "domains",
    label: "Research domains",
    file: "content.json",
    kind: "objectArray",
    item: { titleField: "label", fields: [
      { name: "id", label: "Id", type: "text", required: true },
      { name: "label", label: "Label", type: "text", required: true },
      { name: "short", label: "Short", type: "text" },
      { name: "blurb", label: "Blurb", type: "textarea" },
      { name: "level", label: "Level 1–5", type: "number", min: 1, max: 5 },
      { name: "heat", label: "Heat 1–5", type: "number", min: 1, max: 5 },
      { name: "color", label: "Color", type: "color" },
      { name: "icon", label: "Icon", type: "icon" },
      { name: "keywords", label: "Keywords", type: "tags" },
    ]},
    addDefault: { id: "", label: "New domain", short: "", blurb: "", level: 3, heat: 3, color: "cyan", icon: "Sparkles", keywords: [] },
  },
  /* ---------- site.json ---------- */
  {
    key: "site-meta",
    label: "Site identity",
    file: "site.json",
    kind: "object",
    fields: [
      { name: "name", label: "Site / person name", type: "text", required: true },
      { name: "shortName", label: "Short name", type: "text" },
      { name: "logo", label: "Logo path (optional)", type: "text",
        help: "e.g. /media/logo.png — upload via Media page. Leave empty to keep the YG monogram." },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "title", label: "<title> suffix", type: "text" },
      { name: "description", label: "Meta description", type: "textarea" },
      { name: "url", label: "Canonical URL", type: "text" },
      { name: "location", label: "Location", type: "text" },
      { name: "email", label: "Email", type: "text" },
      { name: "availability", label: "Availability badge", type: "text" },
      { name: "calendly", label: "Calendly URL", type: "text" },
      { name: "formspree", label: "Formspree endpoint", type: "text" },
    ],
  },
  {
    key: "socialLinks",
    label: "Social links",
    file: "site.json",
    kind: "objectArray",
    item: { titleField: "label", fields: [
      { name: "id", label: "Network preset", type: "select", options: SOCIAL_ID_OPTIONS, required: true },
      { name: "label", label: "Display label", type: "text", required: true },
      { name: "url", label: "URL", type: "text", help: "Email preset: leave empty to auto-use site email (mailto:)" },
    ]},
    addDefault: { id: "website", label: "New link", url: "" },
  },
  {
    key: "navLinks",
    label: "Navigation",
    file: "site.json",
    kind: "objectArray",
    item: { titleField: "label", fields: [
      { name: "href", label: "Href", type: "text", required: true },
      { name: "label", label: "Label", type: "text", required: true },
    ]},
    addDefault: { href: "/", label: "New link" },
  },
];

export function getSection(key: string): SectionDef | undefined {
  return SECTIONS.find((s) => s.key === key);
}

/* ------------------------------------------------------------------ */
/* Per-section help: what this controls + how to edit it well          */
/* ------------------------------------------------------------------ */

export interface SectionMeta {
  /** Shown live under the section title — where these edits appear. */
  liveImpact: string;
  /** Collapsible how-to bullets. */
  guide: string[];
}

export const SECTION_META: Record<string, SectionMeta> = {
  profile: {
    liveImpact: "Hero identity line, About strip, résumé header & cv.pdf name block.",
    guide: [
      "Bio paragraphs = one array item each; they stack vertically.",
      "Inline \\(LaTeX\\) renders anywhere text supports Markdown.",
      "“Current focus strip” appears as the highlighted → banner on the homepage.",
    ],
  },
  stats: {
    liveImpact: "The four-number ledger under the hero buttons.",
    guide: ["Keep values short (a number or compact figure); labels wrap to two lines max."],
  },
  education: {
    liveImpact: "About-me education cards, résumé timeline & cv.pdf Education.",
    guide: [
      "Period is free-form (“2022 — 2025”); it prints right-aligned.",
      "Highlight = accent border on the card + bold row in cv.pdf.",
      "Tags render as mono chips under each entry.",
    ],
  },
  experience: {
    liveImpact: "Résumé timeline entries & cv.pdf Experience.",
    guide: ["Order top→bottom = most recent first.", "Use Detail for impact bullets separated by “ · ”."],
  },
  publications: {
    liveImpact: "Publications page cards, résumé Publications & cv.pdf.",
    guide: [
      "Status drives the badge color (published / in-press / preprint / under-review / other).",
      "Authors format: “Y. Ghalenoei, H. Sadoghi Yazdi”. Cite field accepts raw BibTeX.",
    ],
  },
  awards: { liveImpact: "Résumé Awards column & cv.pdf.", guide: ["Year first; keep one award per entry."] },
  certifications: {
    liveImpact: "Résumé Certifications column & cv.pdf.",
    guide: ["Group related courses into one entry instead of many tiny rows."],
  },
  skills: {
    liveImpact: "Skill bars/cards across the site, résumé Skills & cv.pdf Technical Skills.",
    guide: ["Level is 0–100 and maps to bar width.", "Each group renders as its own titled cluster."],
  },
  languages: {
    liveImpact: "Résumé Languages column & cv.pdf.",
    guide: ["Percentage drives a small progress ring/bar; level text sits beside it."],
  },
  projects: {
    liveImpact: "Selected-work cards & individual project pages (slug route).",
    guide: [
      "Slug must match an MDX file in content/projects/<slug>.mdx.",
      "Cover path points into public/ (e.g. /covers/x.svg).",
      "Featured pins the project higher on the homepage grid.",
    ],
  },
  services: {
    liveImpact: "Services / “what I offer” grid.",
    guide: ["Icons come from the approved lucide whitelist only."],
  },
  domains: {
    liveImpact: "Research-focus grid, domain heat/level visuals & footer keyword marquee.",
    guide: [
      "Level 1–5 = depth · Heat 1–5 = current emphasis weight.",
      "Keywords power search/tag matching — lowercase, comma-separated.",
    ],
  },
  "site-meta": {
    liveImpact: "<title>, meta description, OG/Twitter cards, navbar brand, contact email & availability badge.",
    guide: [
      "Canonical URL should be the final production origin (no trailing slash).",
      "Description ideal length 140–165 characters.",
    ],
  },
  socialLinks: {
    liveImpact: "Footer social icons row, connect page links & GitHub card URL.",
    guide: [
      "Pick a Network preset, then set the URL. Empty URL rows are hidden on the site.",
      "Email preset needs no URL — it auto-links mailto:site-email.",
      "Custom link: choose Website (custom), set your own Display label.",
      "Drag order = display order.",
    ],
  },
  navLinks: {
    liveImpact: "Navbar pill order & mobile swipe list.",
    guide: ["Href must start with /. Reorder with the arrows; delete removes from navbar."],
  },
};
