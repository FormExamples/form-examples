import type { PropertyTaxApplication, StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 8;

export const steps: StepConfig[] = [
  { number: 1, title: 'Applicant', shortTitle: 'Applicant', section: 'applicant' },
  { number: 2, title: 'Property and occupancy', shortTitle: 'Property', section: 'property' },
  { number: 3, title: 'Exemptions claimed', shortTitle: 'Exemptions', section: 'exemptions' },
  { number: 4, title: 'Household income', shortTitle: 'Income', section: 'income' },
  { number: 5, title: 'Proof documents', shortTitle: 'Documents', section: 'documents' },
  { number: 6, title: 'Filing and deadline', shortTitle: 'Filing', section: 'filing' },
  { number: 7, title: 'Assessment appeal basics', shortTitle: 'Appeal', section: 'appeal' },
  { number: 8, title: 'Declaration', shortTitle: 'Declaration', section: 'declaration' }
];

export function getVisibleSteps(_data: PropertyTaxApplication): StepConfig[] {
  // All steps are always visible in the application wizard.
  return steps;
}

export function getNextStep(current: number, data: PropertyTaxApplication): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx === -1 || idx >= visible.length - 1) return null;
  return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: PropertyTaxApplication): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx <= 0) return null;
  return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: PropertyTaxApplication): boolean {
  return steps.some((s) => s.number === stepNumber);
}
