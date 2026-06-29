export interface StepDef {
  number: number;
  slug: string;
  title: string;
  short: string;
}

export const STEPS: StepDef[] = [
  { number: 1, slug: 'respondent', title: 'Respondent identification', short: 'You' },
  { number: 2, slug: 'teams', title: 'Section 1 — Teams (25 items)', short: 'Teams' },
  { number: 3, slug: 'stakeholders', title: 'Section 2 — Stakeholders (14 items)', short: 'Stakeholders' },
  { number: 4, slug: 'practices', title: 'Section 3 — Practices (18 items)', short: 'Practices' },
  { number: 5, slug: 'summary', title: 'Summary, maturity & action plan', short: 'Summary' },
];

export const TOTAL_STEPS = STEPS.length;
