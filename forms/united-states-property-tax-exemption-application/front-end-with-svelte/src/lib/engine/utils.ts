import type { EligibilityClass, ExemptionId, Priority } from './types.js';

// Display helpers for the eligibility class, the priority and the exemptions.

const CLASS_LABELS: Record<EligibilityClass, string> = {
  'likely-eligible': 'Likely eligible',
  incomplete: 'Incomplete',
  'likely-ineligible': 'Likely ineligible'
};

export function eligibilityClassLabel(c: EligibilityClass): string {
  return CLASS_LABELS[c] ?? c;
}

/** Lily risk-badge class for an eligibility class. */
export function eligibilityClassColor(c: EligibilityClass): string {
  if (c === 'likely-eligible') return 'risk-low';
  if (c === 'incomplete') return 'risk-moderate';
  return 'risk-high';
}

const PRIORITY_LABELS: Record<Priority, string> = { high: 'High', medium: 'Medium', low: 'Low' };

export function priorityLabel(p: Priority): string {
  return PRIORITY_LABELS[p] ?? p;
}

export function priorityColor(p: Priority): string {
  if (p === 'high') return 'text-error';
  if (p === 'medium') return 'text-warning';
  return 'text-base-content/70';
}

const EXEMPTION_LABELS: Record<ExemptionId, string> = {
  homestead: 'Homestead',
  senior: 'Senior',
  disability: 'Disability',
  veteran: 'Disabled veteran',
  'circuit-breaker': 'Circuit-breaker'
};

export function exemptionLabel(e: ExemptionId): string {
  return EXEMPTION_LABELS[e] ?? e;
}

export function yesNoLabel(v: string): string {
  if (v === 'yes') return 'Yes';
  if (v === 'no') return 'No';
  return '';
}
