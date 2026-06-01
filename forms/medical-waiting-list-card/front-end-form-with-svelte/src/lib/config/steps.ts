export interface StepConfig {
  number: number;
  slug: string;
  title: string;
}

export const STEPS: StepConfig[] = [
  { number: 1, slug: 'practitioner', title: 'Practitioner identification' },
  { number: 2, slug: 'patient', title: 'Patient identification' },
  { number: 3, slug: 'referral', title: 'Referral details' },
  { number: 4, slug: 'waiting-list', title: 'Waiting list entry' },
  { number: 5, slug: 'appointment', title: 'Upcoming appointment' },
  { number: 6, slug: 'communication', title: 'Patient communication' },
  { number: 7, slug: 'signoff', title: 'Sign-off' }
];

export const TOTAL_STEPS = STEPS.length;
