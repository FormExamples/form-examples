export interface StepDef {
  number: number;
  slug: string;
  title: string;
  short: string;
}

export const STEPS: StepDef[] = [
  { number: 1, slug: 'location', title: 'Location', short: 'Location' },
  { number: 2, slug: 'checklist', title: 'Checklist', short: 'Checklist' },
  { number: 3, slug: 'inspector', title: 'Inspector & sign-off', short: 'Sign-off' },
];

export const TOTAL_STEPS = STEPS.length;
