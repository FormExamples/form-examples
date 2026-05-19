export interface StepDef {
  number: number;
  slug: string;
  title: string;
  short: string;
}

/**
 * The WHO Surgical Safety Checklist wizard is 1-indexed by file name
 * (Step0CaseDetails, Step1SignIn, ...) but 0-indexed by URL step number
 * to match the `/checklist/[step=step]/` route matcher allowing 0–4.
 */
export const STEPS: StepDef[] = [
  { number: 0, slug: 'case-details', title: 'Case details', short: 'Case' },
  { number: 1, slug: 'sign-in', title: 'Sign In (before induction)', short: 'Sign In' },
  { number: 2, slug: 'time-out', title: 'Time Out (before incision)', short: 'Time Out' },
  { number: 3, slug: 'sign-out', title: 'Sign Out (before leaving OR)', short: 'Sign Out' },
  { number: 4, slug: 'summary', title: 'Summary and export', short: 'Summary' },
];

export const TOTAL_STEPS = STEPS.length;
export const MIN_STEP = 0;
export const MAX_STEP = 4;
