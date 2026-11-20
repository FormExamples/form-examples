import type { StepConfig, VehicleApplication } from '#lib/engine/types.js';

export const TOTAL_STEPS = 7;

export const steps: StepConfig[] = [
  { number: 1, title: 'Which application', shortTitle: 'Application', section: 'application' },
  { number: 2, title: 'Applicant', shortTitle: 'Applicant', section: 'applicant' },
  { number: 3, title: 'Registered keeper and owner', shortTitle: 'Keeper', section: 'keeper' },
  { number: 4, title: 'Vehicle', shortTitle: 'Vehicle', section: 'vehicle' },
  { number: 5, title: 'Supporting evidence', shortTitle: 'Evidence', section: 'evidence' },
  { number: 6, title: 'Imported vehicle', shortTitle: 'Import', section: 'importDetails' },
  { number: 7, title: 'Fee and declaration', shortTitle: 'Fee', section: 'feeAndDeclaration' }
];

export function getVisibleSteps(_data: VehicleApplication): StepConfig[] {
  // All steps are always visible in the vehicle-registration wizard.
  return steps;
}

export function getNextStep(current: number, data: VehicleApplication): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx === -1 || idx >= visible.length - 1) return null;
  return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: VehicleApplication): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx <= 0) return null;
  return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: VehicleApplication): boolean {
  return steps.some((s) => s.number === stepNumber);
}
