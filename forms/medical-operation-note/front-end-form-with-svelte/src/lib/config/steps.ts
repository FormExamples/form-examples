export interface StepDef {
  number: number;
  slug: string;
  title: string;
  short: string;
}

export const STEPS: StepDef[] = [
  { number: 1, slug: 'identification', title: 'Operation identification', short: 'Operation' },
  { number: 2, slug: 'patient', title: 'Patient identification', short: 'Patient' },
  { number: 3, slug: 'team', title: 'Surgical team', short: 'Team' },
  { number: 4, slug: 'diagnoses', title: 'Diagnoses and procedures', short: 'Procedures' },
  { number: 5, slug: 'anaesthesia', title: 'Anaesthesia', short: 'Anaesthesia' },
  { number: 6, slug: 'approach', title: 'Position, prep and approach', short: 'Approach' },
  { number: 7, slug: 'findings', title: 'Operative findings and technique', short: 'Findings' },
  { number: 8, slug: 'materials', title: 'Materials, implants and prostheses', short: 'Implants' },
  { number: 9, slug: 'specimens', title: 'Drains, packs and specimens', short: 'Specimens' },
  { number: 10, slug: 'safety', title: 'Safety, counts, EBL and complications', short: 'Safety' },
  { number: 11, slug: 'plan', title: 'Post-operative plan', short: 'Post-op' },
  { number: 12, slug: 'signoff', title: 'Summary, grade and sign-off', short: 'Sign-off' },
];

export const TOTAL_STEPS = STEPS.length;
