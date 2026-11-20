import type { StepConfig, BirthRegistration } from '#lib/engine/types.js';

export const TOTAL_STEPS = 5;

export const steps: StepConfig[] = [
  { number: 1, title: 'The child', shortTitle: 'Child', section: 'child' },
  { number: 2, title: 'The mother', shortTitle: 'Mother', section: 'mother' },
  {
    number: 3,
    title: 'Parentage and the second parent',
    shortTitle: 'Parentage',
    section: 'parentage'
  },
  {
    number: 4,
    title: 'Informant, registration and identity',
    shortTitle: 'Informant',
    section: 'informant'
  },
  { number: 5, title: 'Birth certificate order', shortTitle: 'Certificate', section: 'certificate' }
];

export function getVisibleSteps(_data: BirthRegistration): StepConfig[] {
  // All steps are always visible in the birth-registration wizard.
  return steps;
}

export function getNextStep(current: number, data: BirthRegistration): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx === -1 || idx >= visible.length - 1) return null;
  return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: BirthRegistration): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx <= 0) return null;
  return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: BirthRegistration): boolean {
  return steps.some((s) => s.number === stepNumber);
}
