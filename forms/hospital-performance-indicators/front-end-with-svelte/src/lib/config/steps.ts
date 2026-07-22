export interface StepDef {
  number: number;
  slug: string;
  title: string;
  short: string;
}

// 6 steps: reporting period (1), one per Balanced Scorecard perspective
// (2-5, 4 perspectives), summary & sign-off (6). Perspective numbers in the
// title refer to the spec/index.md catalogue numbering (1-4).
export const STEPS: StepDef[] = [
  { number: 1, slug: 'reporting-period', title: 'Reporting period', short: 'Period' },
  { number: 2, slug: 'finance', title: 'Perspective 1 — Finance Indicators (9 indicators)', short: 'Finance' },
  { number: 3, slug: 'process', title: 'Perspective 2 — Process Indicators (28 indicators)', short: 'Process' },
  { number: 4, slug: 'learning-and-growth', title: 'Perspective 3 — Learning and Growth Indicators (8 indicators)', short: 'Learning & Growth' },
  { number: 5, slug: 'customer', title: 'Perspective 4 — Customer Indicators (5 indicators)', short: 'Customer' },
  { number: 6, slug: 'summary', title: 'Summary & sign-off', short: 'Summary' },
];

export const TOTAL_STEPS = STEPS.length; // 6
