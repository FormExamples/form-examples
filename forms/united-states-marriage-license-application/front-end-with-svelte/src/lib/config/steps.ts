import type { StepConfig, MarriageApplication } from '#lib/engine/types.js';

export const TOTAL_STEPS = 6;

export const steps: StepConfig[] = [
  { number: 1, title: 'Issuing jurisdiction', shortTitle: 'Jurisdiction', section: 'jurisdiction' },
  { number: 2, title: 'First applicant', shortTitle: 'First applicant', section: 'applicantOne' },
  { number: 3, title: 'Second applicant', shortTitle: 'Second applicant', section: 'applicantTwo' },
  { number: 4, title: 'Eligibility', shortTitle: 'Eligibility', section: 'eligibility' },
  { number: 5, title: 'License issuance and fee', shortTitle: 'License', section: 'issuance' },
  {
    number: 6,
    title: 'Ceremony and marriage certificate',
    shortTitle: 'Ceremony',
    section: 'ceremony'
  }
];

export function getVisibleSteps(_data: MarriageApplication): StepConfig[] {
  // All steps are always visible in the marriage-license wizard.
  return steps;
}

export function getNextStep(current: number, data: MarriageApplication): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx === -1 || idx >= visible.length - 1) return null;
  return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: MarriageApplication): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx <= 0) return null;
  return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: MarriageApplication): boolean {
  return steps.some((s) => s.number === stepNumber);
}
