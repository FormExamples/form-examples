import type { StepConfig, TitleApplication } from '#lib/engine/types.js';

export const TOTAL_STEPS = 8;

export const steps: StepConfig[] = [
  { number: 1, title: 'The application', shortTitle: 'Application', section: 'application' },
  { number: 2, title: 'Owner identification', shortTitle: 'Owner', section: 'owner' },
  { number: 3, title: 'The vehicle', shortTitle: 'Vehicle', section: 'vehicle' },
  { number: 4, title: 'Odometer disclosure', shortTitle: 'Odometer', section: 'odometer' },
  {
    number: 5,
    title: 'Title history and brands',
    shortTitle: 'Title history',
    section: 'titleHistory'
  },
  { number: 6, title: 'Lienholder', shortTitle: 'Lien', section: 'lien' },
  { number: 7, title: 'Insurance and inspections', shortTitle: 'Insurance', section: 'compliance' },
  { number: 8, title: 'Fees and tax', shortTitle: 'Fees and tax', section: 'feesTax' }
];

export function getVisibleSteps(_data: TitleApplication): StepConfig[] {
  // All steps are always visible in the title application wizard.
  return steps;
}

export function getNextStep(current: number, data: TitleApplication): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx === -1 || idx >= visible.length - 1) return null;
  return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: TitleApplication): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx <= 0) return null;
  return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: TitleApplication): boolean {
  return steps.some((s) => s.number === stepNumber);
}
