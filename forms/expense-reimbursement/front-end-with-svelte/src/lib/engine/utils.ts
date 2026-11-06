import { EXPENSE_CATEGORIES } from './defaults.js';

/** Title-case a kebab-case value for display. */
function titleCase(value: string): string {
  return String(value || '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const COMPLIANCE_LABELS: Record<string, string> = {
  compliant: 'Compliant',
  'needs-review': 'Needs review',
  'likely-ineligible': 'Likely ineligible'
};

const APPROVAL_LABELS: Record<string, string> = {
  'line-manager': 'Line manager',
  'budget-holder': 'Budget holder',
  'finance-review': 'Finance review'
};

const RECOMMENDATION_LABELS: Record<string, string> = {
  approve: 'Approve',
  escalate: 'Escalate',
  'request-more-information': 'Request more information',
  reject: 'Reject'
};

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  'under-review': 'Under review',
  approved: 'Approved',
  'partially-approved': 'Partially approved',
  rejected: 'Rejected',
  paid: 'Paid',
  withdrawn: 'Withdrawn'
};

export function complianceLabel(value: string): string {
  return COMPLIANCE_LABELS[value] ?? titleCase(value);
}

export function approvalTierLabel(value: string): string {
  return APPROVAL_LABELS[value] ?? titleCase(value);
}

export function recommendationLabel(value: string): string {
  return RECOMMENDATION_LABELS[value] ?? titleCase(value);
}

export function statusLabel(value: string): string {
  return STATUS_LABELS[value] ?? titleCase(value);
}

export function categoryLabel(value: string): string {
  return EXPENSE_CATEGORIES.find(([v]) => v === value)?.[1] ?? titleCase(value);
}

/** Format an amount in a currency, e.g. `GBP 12.50`. */
export function formatMoney(amount: number, currency = 'GBP'): string {
  return `${currency} ${Number(amount).toFixed(2)}`;
}

export function complianceColor(value: string): string {
  switch (value) {
    case 'compliant':
      return 'bg-success text-success-content border-success';
    case 'needs-review':
      return 'bg-warning text-warning-content border-warning';
    case 'likely-ineligible':
      return 'bg-error text-error-content border-error';
    default:
      return 'bg-base-300 text-base-content border-base-300';
  }
}

export function approvalTierColor(value: string): string {
  switch (value) {
    case 'finance-review':
      return 'bg-error text-error-content border-error';
    case 'budget-holder':
      return 'bg-warning text-warning-content border-warning';
    default:
      return 'bg-base-300 text-base-content border-base-300';
  }
}

export function recommendationColor(value: string): string {
  switch (value) {
    case 'approve':
      return 'bg-success text-success-content border-success';
    case 'escalate':
      return 'bg-info text-info-content border-info';
    case 'request-more-information':
      return 'bg-warning text-warning-content border-warning';
    case 'reject':
      return 'bg-error text-error-content border-error';
    default:
      return 'bg-base-300 text-base-content border-base-300';
  }
}

export function priorityColor(value: string): string {
  switch (value) {
    case 'high':
      return 'bg-error text-error-content border-error';
    case 'medium':
      return 'bg-warning text-warning-content border-warning';
    default:
      return 'bg-base-300 text-base-content border-base-300';
  }
}
