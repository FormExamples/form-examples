import { SECTIONS } from "#lib/engine/criteria.js";

export interface StepDef {
  number: number;
  slug: string;
  title: string;
  short: string;
  /** DTAC section id for criterion steps (a-g). */
  section?: string;
}

const head: StepDef[] = [
  { number: 1, slug: "supplier", title: "Supplier", short: "Supplier" },
  { number: 2, slug: "product", title: "Product", short: "Product" },
  { number: 3, slug: "assessor", title: "Assessor and assessment", short: "Assessor" },
];

const sections: StepDef[] = SECTIONS.map((s, i) => ({
  number: 4 + i,
  slug: `section-${s.id}`,
  title: `Section ${s.id.toUpperCase()} — ${s.title}`,
  short: `${s.id.toUpperCase()} ${s.title.split(" ")[0]}`,
  section: s.id,
}));

export const STEPS: StepDef[] = [
  ...head,
  ...sections,
  { number: 4 + SECTIONS.length, slug: "review", title: "Review and outcome", short: "Review" },
];

export const TOTAL_STEPS = STEPS.length;
