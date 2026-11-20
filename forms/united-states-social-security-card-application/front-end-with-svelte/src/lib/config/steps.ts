import type { StepConfig, SocialSecurityApplication } from '#lib/engine/types.js';

export const TOTAL_STEPS = 6;

export const steps: StepConfig[] = [
  { number: 1, title: 'What you are requesting', shortTitle: 'Request', section: 'request' },
  { number: 2, title: 'The applicant', shortTitle: 'Applicant', section: 'applicant' },
  { number: 3, title: 'Evidence documents', shortTitle: 'Evidence', section: 'evidence' },
  { number: 4, title: 'Who is signing', shortTitle: 'Signer', section: 'filer' },
  { number: 5, title: 'Tell SSA: death-related items', shortTitle: 'Tell SSA', section: 'tellSsa' },
  { number: 6, title: 'Summary and class', shortTitle: 'Summary', section: 'summary' }
];

export function getVisibleSteps(_data: SocialSecurityApplication): StepConfig[] {
  // All steps are always visible in the Social Security card application wizard.
  return steps;
}

export function getNextStep(current: number, data: SocialSecurityApplication): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx === -1 || idx >= visible.length - 1) return null;
  return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: SocialSecurityApplication): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx <= 0) return null;
  return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: SocialSecurityApplication): boolean {
  return steps.some((s) => s.number === stepNumber);
}
