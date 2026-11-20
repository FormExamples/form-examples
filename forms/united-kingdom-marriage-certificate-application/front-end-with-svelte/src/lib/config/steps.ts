import type { StepConfig, Application } from '#lib/engine/types.js';

export const TOTAL_STEPS = 6;

export const steps: StepConfig[] = [
  { number: 1, title: 'The notice', shortTitle: 'Notice', section: 'notice' },
  { number: 2, title: 'The ceremony', shortTitle: 'Ceremony', section: 'ceremony' },
  { number: 3, title: 'First party', shortTitle: 'First party', section: 'partyOne' },
  { number: 4, title: 'Second party', shortTitle: 'Second party', section: 'partyTwo' },
  { number: 5, title: 'Relationship', shortTitle: 'Relationship', section: 'relationship' },
  {
    number: 6,
    title: 'Marriage certificate order',
    shortTitle: 'Certificate',
    section: 'certificate'
  }
];

export function getVisibleSteps(_data: Application): StepConfig[] {
  // All steps are always visible in the application wizard.
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
