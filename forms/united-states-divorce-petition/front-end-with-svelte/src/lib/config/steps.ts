import type { StepConfig, DivorcePetition } from '#lib/engine/types.js';

export const TOTAL_STEPS = 6;

export const steps: StepConfig[] = [
  { number: 1, title: 'Filing and grounds', shortTitle: 'Filing', section: 'filing' },
  { number: 2, title: 'Spouses and residency', shortTitle: 'Spouses', section: 'spouses' },
  { number: 3, title: 'Children and support', shortTitle: 'Children', section: 'children' },
  { number: 4, title: 'Property and settlement', shortTitle: 'Property', section: 'property' },
  { number: 5, title: 'Service of process', shortTitle: 'Service', section: 'service' },
  { number: 6, title: 'Decree and divorce certificate', shortTitle: 'Decree', section: 'decree' }
];

export function getVisibleSteps(_data: DivorcePetition): StepConfig[] {
  // All steps are always visible in the divorce-petition wizard.
  return steps;
}

export function getNextStep(current: number, data: DivorcePetition): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx === -1 || idx >= visible.length - 1) return null;
  return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: DivorcePetition): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx <= 0) return null;
  return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: DivorcePetition): boolean {
  return steps.some((s) => s.number === stepNumber);
}
