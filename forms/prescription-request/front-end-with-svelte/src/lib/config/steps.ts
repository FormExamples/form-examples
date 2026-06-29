import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 5;

export const steps: StepConfig[] = [
  { number: 1, title: 'Patient Information', shortTitle: 'Patient', section: 'patientInformation' },
  { number: 2, title: 'Clinician Information', shortTitle: 'Clinician', section: 'clinicianInformation' },
  { number: 3, title: 'Prescription Details', shortTitle: 'Prescription', section: 'prescriptionDetails' },
  { number: 4, title: 'Substitution Options', shortTitle: 'Substitution', section: 'substitutionOptions' },
  { number: 5, title: 'Request Type', shortTitle: 'Request', section: 'requestType' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
  // All steps are always visible in the prescription request.
  return steps;
}

export function getNextStep(current: number, data: AssessmentData): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx === -1 || idx >= visible.length - 1) return null;
  return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: AssessmentData): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx <= 0) return null;
  return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: AssessmentData): boolean {
  return steps.some((s) => s.number === stepNumber);
}
