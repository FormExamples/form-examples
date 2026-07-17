export interface StepConfig {
  number: number;
  slug: string;
  title: string;
  shortTitle: string;
}

export const STEPS: StepConfig[] = [
  { number: 1, slug: 'practitioner', title: 'Practitioner identification', shortTitle: 'Practitioner' },
  { number: 2, slug: 'patient', title: 'Patient identification', shortTitle: 'Patient' },
  { number: 3, slug: 'referral', title: 'Referral details', shortTitle: 'Referral' },
  { number: 4, slug: 'waiting-list', title: 'Waiting list entry', shortTitle: 'Waiting list' },
  { number: 5, slug: 'appointment', title: 'Upcoming appointment', shortTitle: 'Appointment' },
  { number: 6, slug: 'communication', title: 'Patient communication', shortTitle: 'Communication' },
  { number: 7, slug: 'signoff', title: 'Sign-off', shortTitle: 'Sign-off' }
];

export const TOTAL_STEPS = STEPS.length;
