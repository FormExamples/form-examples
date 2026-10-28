import type { ApprovalStatus, FitNoteFlag } from './types.js';

/** A `{ value, label }` option for a select. */
export interface Option {
  value: string;
  label: string;
}

export const METHOD_OPTIONS: Option[] = [
  { value: 'face-to-face', label: 'Face to face' },
  { value: 'video', label: 'Video' },
  { value: 'telephone', label: 'Telephone' },
  { value: 'records-review', label: 'Records review' }
];

export const ADVICE_OPTIONS: Option[] = [
  { value: 'not-fit-for-work', label: 'Not fit for work' },
  { value: 'may-be-fit-for-work', label: 'May be fit for work' }
];

export const YES_NO_OPTIONS: Option[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

export const ROLE_OPTIONS: Option[] = [
  { value: 'gp', label: 'GP' },
  { value: 'hospital-doctor', label: 'Hospital doctor' },
  { value: 'nurse', label: 'Nurse' },
  { value: 'occupational-therapist', label: 'Occupational therapist' },
  { value: 'pharmacist', label: 'Pharmacist' },
  { value: 'physiotherapist', label: 'Physiotherapist' },
  { value: 'other', label: 'Other' }
];

export const REGISTRATION_BODY_OPTIONS: Option[] = [
  { value: 'GMC', label: 'GMC' },
  { value: 'NMC', label: 'NMC' },
  { value: 'HCPC', label: 'HCPC' },
  { value: 'GPhC', label: 'GPhC' },
  { value: 'other', label: 'Other' }
];

export const APPROVAL_LABELS: Record<ApprovalStatus, string> = {
  approved: 'Approved',
  'needs-completion': 'Needs completion',
  blocked: 'Blocked'
};

/** Human label for an approval status. */
export function approvalLabel(status: string): string {
  return APPROVAL_LABELS[status as ApprovalStatus] || status || '';
}

/** Human label for the fitness advice value ('' when none). */
export function adviceLabel(value: string): string {
  return ADVICE_OPTIONS.find((o) => o.value === value)?.label ?? '';
}

/** Lily alert/badge token for an approval status (success / warning / error). */
export function approvalToken(status: string): 'success' | 'warning' | 'error' {
  return status === 'approved' ? 'success' : status === 'blocked' ? 'error' : 'warning';
}

/** Token utility classes for an approval badge (Lily token triples, no palette colours). */
export function approvalBadgeClass(status: string): string {
  if (status === 'approved') return 'bg-success text-success-content border-success';
  if (status === 'blocked') return 'bg-error text-error-content border-error';
  return 'bg-warning text-warning-content border-warning';
}

/** Flag categories joined for display. */
export function flagCategories(flags: FitNoteFlag[]): string[] {
  return flags.map((f) => f.category);
}
