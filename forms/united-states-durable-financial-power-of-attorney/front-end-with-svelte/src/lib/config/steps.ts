import type { StepConfig, PowerOfAttorney } from '#lib/engine/types.js';

export const TOTAL_STEPS = 6;

export const steps: StepConfig[] = [
  {
    number: 1,
    title: 'Principal and governing state',
    shortTitle: 'Principal',
    section: 'principal'
  },
  {
    number: 2,
    title: 'Durability and effectiveness',
    shortTitle: 'Durability',
    section: 'instrument'
  },
  { number: 3, title: 'Agent and successors', shortTitle: 'Agents', section: 'agents' },
  { number: 4, title: 'Authority granted', shortTitle: 'Authority', section: 'authority' },
  {
    number: 5,
    title: 'Signing: notary and witnesses',
    shortTitle: 'Signing',
    section: 'execution'
  },
  { number: 6, title: 'Acceptance and use', shortTitle: 'Acceptance', section: 'acceptance' }
];

export function getVisibleSteps(_data: PowerOfAttorney): StepConfig[] {
  // All steps are always visible in the wizard.
  return steps;
}

export function getNextStep(current: number, data: PowerOfAttorney): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx === -1 || idx >= visible.length - 1) return null;
  return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: PowerOfAttorney): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx <= 0) return null;
  return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: PowerOfAttorney): boolean {
  return steps.some((s) => s.number === stepNumber);
}
