export interface StepDef {
  number: number;
  slug: string;
  title: string;
  short: string;
}

export const STEPS: StepDef[] = [
  { number: 1, slug: 'respondent', title: 'Respondent identification', short: 'You' },
  { number: 2, slug: 'customer-satisfaction', title: 'Principle 1 — Customer satisfaction', short: 'P1 Customer' },
  { number: 3, slug: 'welcome-change', title: 'Principle 2 — Welcome change', short: 'P2 Change' },
  { number: 4, slug: 'deliver-frequently', title: 'Principle 3 — Deliver frequently', short: 'P3 Deliver' },
  { number: 5, slug: 'collaboration', title: 'Principle 4 — Daily collaboration', short: 'P4 Collab' },
  { number: 6, slug: 'motivated-individuals', title: 'Principle 5 — Motivated individuals', short: 'P5 People' },
  { number: 7, slug: 'face-to-face', title: 'Principle 6 — Face-to-face conversation', short: 'P6 Conv' },
  { number: 8, slug: 'working-software', title: 'Principle 7 — Working software', short: 'P7 Software' },
  { number: 9, slug: 'sustainable-development', title: 'Principle 8 — Sustainable development', short: 'P8 Pace' },
  { number: 10, slug: 'technical-excellence', title: 'Principle 9 — Technical excellence', short: 'P9 Quality' },
  { number: 11, slug: 'simplicity', title: 'Principle 10 — Simplicity', short: 'P10 Simple' },
  { number: 12, slug: 'self-organising-teams', title: 'Principle 11 — Self-organising teams', short: 'P11 Self-org' },
  { number: 13, slug: 'regular-reflection', title: 'Principle 12 — Regular reflection', short: 'P12 Reflect' },
  { number: 14, slug: 'summary', title: 'Summary, maturity & action plan', short: 'Summary' },
];

export const TOTAL_STEPS = STEPS.length;
