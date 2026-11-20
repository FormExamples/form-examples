import type { StepConfig, Will } from '#lib/engine/types.js';

export const TOTAL_STEPS = 6;

export const steps: StepConfig[] = [
  { number: 1, title: 'The testator', shortTitle: 'Testator', section: 'testator' },
  { number: 2, title: 'The estate', shortTitle: 'Estate', section: 'estate' },
  { number: 3, title: 'Executors', shortTitle: 'Executors', section: 'executors' },
  {
    number: 4,
    title: 'Beneficiaries and residuary estate',
    shortTitle: 'Beneficiaries',
    section: 'beneficiaries'
  },
  { number: 5, title: 'Guardians and funeral wishes', shortTitle: 'Family', section: 'family' },
  { number: 6, title: 'Signing and witnessing', shortTitle: 'Signing', section: 'execution' }
];

export function getVisibleSteps(_data: Will): StepConfig[] {
  // All steps are always visible in the will wizard.
  return steps;
}

export function getNextStep(current: number, data: Will): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx === -1 || idx >= visible.length - 1) return null;
  return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: Will): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx <= 0) return null;
  return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: Will): boolean {
  return steps.some((s) => s.number === stepNumber);
}
