import type { Priority, ValidityClass } from './types';

const VALIDITY_LABEL: Record<string, string> = {
  'ready-to-execute': 'Ready to execute',
  incomplete: 'Incomplete',
  'execution-risk': 'Execution risk'
};
const VALIDITY_SHORT: Record<string, string> = {
  'ready-to-execute': 'Ready',
  incomplete: 'Incomplete',
  'execution-risk': 'Risk'
};

/** Validity-class label for display. */
export function validityClassLabel(cls: ValidityClass): string {
  return VALIDITY_LABEL[cls] ?? '';
}

/** Short validity-class label for the dashboard. */
export function validityClassShort(cls: ValidityClass): string {
  return VALIDITY_SHORT[cls] ?? 'N/A';
}

/** Lily-token colour utility classes for the validity-class badge / banner. */
export function validityClassColor(cls: ValidityClass): string {
  switch (cls) {
    case 'ready-to-execute':
      return 'bg-success text-success-content border-success';
    case 'incomplete':
      return 'bg-warning text-warning-content border-warning';
    case 'execution-risk':
      return 'bg-error text-error-content border-error';
    default:
      return 'bg-base-300 text-base-content border-base-300';
  }
}

/** Lily-token colour utility classes for a flag priority. */
export function priorityColor(priority: Priority): string {
  switch (priority) {
    case 'high':
      return 'bg-error text-error-content border-error';
    case 'medium':
      return 'bg-warning text-warning-content border-warning';
    default:
      return 'bg-base-300 text-base-content border-base-300';
  }
}

/** Flag-priority label. */
export function priorityLabel(priority: Priority): string {
  return { high: 'HIGH', medium: 'MEDIUM', low: 'LOW' }[priority] ?? '';
}

const pick =
  (table: Record<string, string>) =>
  (value: string): string =>
    table[value] ?? '';

export const relationshipLabel = pick({
  spouse: 'Spouse',
  child: 'Child',
  'other-family': 'Other family member',
  friend: 'Friend',
  professional: 'Professional fiduciary',
  'financial-institution': 'Financial institution with trust powers'
});
export const effectivenessLabel = pick({
  immediate: 'Immediately on signing',
  springing: 'Springing, on a later event'
});
export const springingTriggerLabel = pick({
  'physician-certification': 'Physician certification of incapacity',
  'named-person-declaration': 'Declaration by a named person',
  'court-determination': 'Court determination'
});
export const compensationLabel = pick({
  none: 'No compensation',
  reasonable: 'Reasonable compensation',
  fixed: 'Fixed compensation'
});
export const giftLimitLabel = pick({
  'annual-exclusion': 'Federal annual exclusion per recipient',
  'fixed-amount': 'Fixed amount per year',
  unlimited: 'Unlimited',
  none: 'No limit stated'
});
export const bankFormLabel = pick({
  yes: 'Completed',
  no: 'Not completed',
  'not-needed': 'Not needed'
});
export const form2848Label = pick({
  filed: 'Filed or attached',
  'not-filed': 'Not filed',
  'not-needed': 'Not needed'
});
export const yesNoLabel = pick({ yes: 'Yes', no: 'No' });

export const GRANT_LABELS: Record<string, string> = {
  grantBanking: 'Banking and financial institutions',
  grantRealEstate: 'Real estate',
  grantInvestments: 'Stocks, bonds, and investments',
  grantBusiness: 'Business operations',
  grantInsurance: 'Insurance and annuities',
  grantTaxMatters: 'Tax matters',
  grantBenefits: 'Government and public benefits',
  grantRetirement: 'Retirement plans',
  grantClaims: 'Claims and litigation',
  grantPersonalProperty: 'Personal property'
};
export const HOT_LABELS: Record<string, string> = {
  hotCreateTrust: 'Create, amend, revoke, or terminate a trust',
  hotGift: 'Make gifts',
  hotSurvivorship: 'Create or change rights of survivorship',
  hotBeneficiary: 'Create or change a beneficiary designation',
  hotDelegate: "Delegate the agent's authority",
  hotAnnuityWaiver: "Waive the principal's joint and survivor annuity right",
  hotDisclaim: 'Disclaim property'
};
