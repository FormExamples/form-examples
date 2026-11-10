import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 6;

/** The six claim wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
  { number: 1, title: 'Worker', shortTitle: 'Worker' },
  { number: 2, title: 'Approver', shortTitle: 'Approver' },
  { number: 3, title: 'Claim', shortTitle: 'Claim' },
  { number: 4, title: 'Expenses', shortTitle: 'Expenses' },
  { number: 5, title: 'Repayment', shortTitle: 'Repayment' },
  { number: 6, title: 'Declaration and Submit', shortTitle: 'Declaration' }
];
