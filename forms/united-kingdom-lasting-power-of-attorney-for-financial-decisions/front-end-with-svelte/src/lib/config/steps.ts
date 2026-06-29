// Configuration of the 15-step LP1F wizard.
export interface StepDef {
  number: number;
  slug: string;
  title: string;
  short: string;
  lp1fSection: number;
  guideRef: string;
}

export const STEPS: StepDef[] = [
  { number: 1, slug: 'donor', title: 'Donor', short: 'Donor', lp1fSection: 1, guideRef: 'A1' },
  { number: 2, slug: 'attorneys', title: 'Attorneys', short: 'Attorneys', lp1fSection: 2, guideRef: 'A2' },
  { number: 3, slug: 'decision-mode', title: 'How attorneys make decisions', short: 'Decisions', lp1fSection: 3, guideRef: 'A3' },
  { number: 4, slug: 'replacement-attorneys', title: 'Replacement attorneys', short: 'Replacements', lp1fSection: 4, guideRef: 'A4' },
  { number: 5, slug: 'when-attorneys-can-act', title: 'When attorneys can act', short: 'When', lp1fSection: 5, guideRef: 'A5' },
  { number: 6, slug: 'people-to-notify', title: 'People to notify', short: 'Notify', lp1fSection: 6, guideRef: 'A8' },
  { number: 7, slug: 'preferences-and-instructions', title: 'Preferences and instructions', short: 'Preferences', lp1fSection: 7, guideRef: 'A9' },
  { number: 8, slug: 'legal-rights', title: 'Legal rights', short: 'Legal', lp1fSection: 8, guideRef: 'A10' },
  { number: 9, slug: 'donor-signature', title: 'Donor signature', short: 'Donor sig', lp1fSection: 9, guideRef: 'B1' },
  { number: 10, slug: 'certificate-provider', title: 'Certificate-provider signature', short: 'Certificate', lp1fSection: 10, guideRef: 'B2' },
  { number: 11, slug: 'attorney-signatures', title: 'Attorney signatures', short: 'Attorney sigs', lp1fSection: 11, guideRef: 'B3' },
  { number: 12, slug: 'applicant', title: 'Applicant', short: 'Applicant', lp1fSection: 12, guideRef: 'B4' },
  { number: 13, slug: 'recipient', title: 'Who receives the LPA', short: 'Recipient', lp1fSection: 13, guideRef: 'B4' },
  { number: 14, slug: 'fee', title: 'Application fee', short: 'Fee', lp1fSection: 14, guideRef: 'B5' },
  { number: 15, slug: 'registration-signature', title: 'Registration signature', short: 'Register', lp1fSection: 15, guideRef: 'B5' },
];

export const TOTAL_STEPS = STEPS.length;
