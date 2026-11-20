import type { StepConfig, BillOfSale } from '#lib/engine/types.js';

export const TOTAL_STEPS = 7;

export const steps: StepConfig[] = [
  { number: 1, title: 'Sale transaction', shortTitle: 'Sale', section: 'transaction' },
  { number: 2, title: 'Seller (transferor)', shortTitle: 'Seller', section: 'seller' },
  { number: 3, title: 'Buyer (transferee)', shortTitle: 'Buyer', section: 'buyer' },
  { number: 4, title: 'Vehicle', shortTitle: 'Vehicle', section: 'vehicle' },
  {
    number: 5,
    title: 'Odometer disclosure (49 CFR 580)',
    shortTitle: 'Odometer',
    section: 'odometer'
  },
  { number: 6, title: 'Terms, title, and lien', shortTitle: 'Terms and title', section: 'terms' },
  { number: 7, title: 'After the sale', shortTitle: 'After the sale', section: 'afterSale' }
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
