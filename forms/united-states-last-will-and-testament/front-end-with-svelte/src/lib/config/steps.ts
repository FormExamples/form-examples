import type { StepConfig, Will } from '#lib/engine/types.js';

export const TOTAL_STEPS = 6;

export const steps: StepConfig[] = [
  { number: 1, title: 'Testator and state', shortTitle: 'Testator', section: 'testator' },
  { number: 2, title: 'Family and spouse', shortTitle: 'Family', section: 'family' },
  { number: 3, title: 'Estate and bequests', shortTitle: 'Estate', section: 'estate' },
  {
    number: 4,
    title: 'Representative and clauses',
    shortTitle: 'Clauses',
    section: 'provisions'
  },
  { number: 5, title: 'Execution and witnesses', shortTitle: 'Execution', section: 'execution' },
  {
    number: 6,
    title: 'Self-proving affidavit',
    shortTitle: 'Self-proving',
    section: 'selfProving'
  }
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
