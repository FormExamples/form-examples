import type { StepConfig, BillOfSale } from '#lib/engine/types.js';

export const TOTAL_STEPS = 9;

export const steps: StepConfig[] = [
  { number: 1, title: 'The sale', shortTitle: 'Sale', section: 'sale' },
  { number: 2, title: 'Seller', shortTitle: 'Seller', section: 'seller' },
  { number: 3, title: 'Buyer', shortTitle: 'Buyer', section: 'buyer' },
  { number: 4, title: 'The vehicle', shortTitle: 'Vehicle', section: 'vehicle' },
  { number: 5, title: 'Checks: V5C, MOT, and finance', shortTitle: 'Checks', section: 'checks' },
  { number: 6, title: 'Price and payment', shortTitle: 'Payment', section: 'payment' },
  { number: 7, title: 'Condition and description', shortTitle: 'Condition', section: 'condition' },
  { number: 8, title: 'Telling DVLA', shortTitle: 'DVLA', section: 'dvla' },
  { number: 9, title: 'Signatures', shortTitle: 'Signatures', section: 'signatures' }
];

export function getVisibleSteps(_data: BillOfSale): StepConfig[] {
  // All steps are always visible in the bill-of-sale wizard.
  return steps;
}

export function getNextStep(current: number, data: BillOfSale): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx === -1 || idx >= visible.length - 1) return null;
  return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: BillOfSale): number | null {
  const visible = getVisibleSteps(data);
  const idx = visible.findIndex((s) => s.number === current);
  if (idx <= 0) return null;
  return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: BillOfSale): boolean {
  return steps.some((s) => s.number === stepNumber);
}
