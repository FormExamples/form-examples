import type { StepConfig, Registration } from '#lib/engine/types.js';

export const TOTAL_STEPS = 6;

export const steps: StepConfig[] = [
  { number: 1, title: 'The deceased and the death', shortTitle: 'Deceased', section: 'deceased' },
  {
    number: 2,
    title: 'Medical certificate and medical examiner',
    shortTitle: 'Medical examiner',
    section: 'medical'
  },
  { number: 3, title: 'Coroner', shortTitle: 'Coroner', section: 'coroner' },
  { number: 4, title: 'The informant', shortTitle: 'Informant', section: 'informant' },
  {
    number: 5,
    title: 'Registration appointment',
    shortTitle: 'Appointment',
    section: 'registration'
  },
  { number: 6, title: 'After registration', shortTitle: 'After registration', section: 'aftercare' }
];

export function getVisibleSteps(_data: Registration): StepConfig[] {
  // All steps are always visible in the death-registration wizard.
  return steps;
}

export function getNextStep(current: number, data: Registration): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx === -1 || idx >= visible.length - 1) return null;
  return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: Registration): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx <= 0) return null;
  return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: Registration): boolean {
  return steps.some((s) => s.number === stepNumber);
}
