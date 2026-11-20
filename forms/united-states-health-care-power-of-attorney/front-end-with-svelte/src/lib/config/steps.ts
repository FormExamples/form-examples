import type { StepConfig, Directive } from '#lib/engine/types.js';

export const TOTAL_STEPS = 6;

export const steps: StepConfig[] = [
  { number: 1, title: 'Principal', shortTitle: 'Principal', section: 'principal' },
  { number: 2, title: 'Agent and successors', shortTitle: 'Agent', section: 'agent' },
  { number: 3, title: 'Authority', shortTitle: 'Authority', section: 'authority' },
  { number: 4, title: 'Treatment wishes', shortTitle: 'Wishes', section: 'wishes' },
  { number: 5, title: 'Signing and witnesses', shortTitle: 'Signing', section: 'execution' },
  { number: 6, title: 'Summary and readiness', shortTitle: 'Summary', section: 'distribution' }
];

export function getVisibleSteps(_data: Directive): StepConfig[] {
  // All steps are always visible in the health care power of attorney wizard.
  return steps;
}

export function getNextStep(current: number, data: Directive): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx === -1 || idx >= visible.length - 1) return null;
  return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: Directive): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx <= 0) return null;
  return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: Directive): boolean {
  return steps.some((s) => s.number === stepNumber);
}
