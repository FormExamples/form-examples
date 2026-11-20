import type { StepConfig, DivorceApplication } from '#lib/engine/types.js';

export const TOTAL_STEPS = 7;

export const steps: StepConfig[] = [
  {
    number: 1,
    title: 'Application type and stage',
    shortTitle: 'Application',
    section: 'application'
  },
  { number: 2, title: 'Marriage and certificate', shortTitle: 'Marriage', section: 'marriage' },
  { number: 3, title: 'Jurisdiction', shortTitle: 'Jurisdiction', section: 'jurisdiction' },
  {
    number: 4,
    title: 'The parties and service address',
    shortTitle: 'Parties',
    section: 'parties'
  },
  { number: 5, title: 'Children', shortTitle: 'Children', section: 'children' },
  {
    number: 6,
    title: 'Money, property and the fee',
    shortTitle: 'Money and fee',
    section: 'finances'
  },
  { number: 7, title: 'Progress and dates', shortTitle: 'Dates', section: 'progress' }
];

export function getVisibleSteps(_data: DivorceApplication): StepConfig[] {
  // All steps are always visible in the divorce-application wizard.
  return steps;
}

export function getNextStep(current: number, data: DivorceApplication): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx === -1 || idx >= visible.length - 1) return null;
  return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: DivorceApplication): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx <= 0) return null;
  return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: DivorceApplication): boolean {
  return steps.some((s) => s.number === stepNumber);
}
