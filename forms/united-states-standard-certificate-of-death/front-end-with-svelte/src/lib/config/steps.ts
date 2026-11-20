import type { StepConfig, DeathCertificate } from '#lib/engine/types.js';

export const TOTAL_STEPS = 11;

export const steps: StepConfig[] = [
  { number: 1, title: 'State and decedent', shortTitle: 'Decedent', section: 'decedent' },
  { number: 2, title: 'Death details', shortTitle: 'Death', section: 'death' },
  { number: 3, title: 'Certifier', shortTitle: 'Certifier', section: 'certifier' },
  { number: 4, title: 'Part I: cause of death chain', shortTitle: 'Part I', section: 'partI' },
  { number: 5, title: 'Part II and autopsy', shortTitle: 'Part II', section: 'partII' },
  {
    number: 6,
    title: 'Manner of death, tobacco and pregnancy',
    shortTitle: 'Manner',
    section: 'manner'
  },
  { number: 7, title: 'Injury items', shortTitle: 'Injury', section: 'injury' },
  {
    number: 8,
    title: 'Medical examiner or coroner referral',
    shortTitle: 'Referral',
    section: 'referral'
  },
  {
    number: 9,
    title: 'Funeral director and disposition',
    shortTitle: 'Disposition',
    section: 'funeral'
  },
  { number: 10, title: 'Certified copies', shortTitle: 'Copies', section: 'copies' },
  { number: 11, title: 'Summary and validity', shortTitle: 'Summary', section: 'summary' }
];

export function getVisibleSteps(_data: DeathCertificate): StepConfig[] {
  // All steps are always visible in the death-certificate wizard.
  return steps;
}

export function getNextStep(current: number, data: DeathCertificate): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx === -1 || idx >= visible.length - 1) return null;
  return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: DeathCertificate): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx <= 0) return null;
  return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: DeathCertificate): boolean {
  return steps.some((s) => s.number === stepNumber);
}
