import type { StepConfig, Application } from '#lib/engine/types.js';

export const TOTAL_STEPS = 5;

export const steps: StepConfig[] = [
  { number: 1, title: 'Claim', shortTitle: 'Claim', section: 'claim' },
  {
    number: 2,
    title: 'Applicant and property',
    shortTitle: 'Applicant',
    section: 'applicant'
  },
  { number: 3, title: 'Household', shortTitle: 'Household', section: 'household' },
  { number: 4, title: 'Evidence', shortTitle: 'Evidence', section: 'evidence' },
  { number: 5, title: 'Declaration', shortTitle: 'Declaration', section: 'declaration' }
];

export function getVisibleSteps(_data: Application): StepConfig[] {
  // All steps are always visible in the Council Tax application wizard.
  return steps;
}

export function getNextStep(current: number, data: Application): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx === -1 || idx >= visible.length - 1) return null;
  return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: Application): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx <= 0) return null;
  return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: Application): boolean {
  return steps.some((s) => s.number === stepNumber);
}
