import type { StepConfig, BirthCertificateApplication } from '#lib/engine/types.js';

export const TOTAL_STEPS = 6;

export const steps: StepConfig[] = [
  { number: 1, title: 'Applicant', shortTitle: 'Applicant', section: 'applicant' },
  {
    number: 2,
    title: 'Person named on the certificate',
    shortTitle: 'Person named',
    section: 'registrant'
  },
  {
    number: 3,
    title: 'Relationship and purpose',
    shortTitle: 'Purpose',
    section: 'purpose'
  },
  { number: 4, title: 'Certificate order', shortTitle: 'Order', section: 'order' },
  {
    number: 5,
    title: 'Identity and supporting documents',
    shortTitle: 'ID and documents',
    section: 'evidence'
  },
  { number: 6, title: 'Declaration', shortTitle: 'Declaration', section: 'declaration' }
];

export function getVisibleSteps(_data: BirthCertificateApplication): StepConfig[] {
  return steps;
}

export function getNextStep(current: number, data: BirthCertificateApplication): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx === -1 || idx >= visible.length - 1) return null;
  return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: BirthCertificateApplication): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx <= 0) return null;
  return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: BirthCertificateApplication): boolean {
  return steps.some((s) => s.number === stepNumber);
}
