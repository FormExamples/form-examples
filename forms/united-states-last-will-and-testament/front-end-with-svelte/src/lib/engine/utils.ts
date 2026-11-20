import type { ExecutionForm, MaritalStatus, Priority, SoundMind, ValidityClass } from './types';

/** Validity-class label for display. */
export function validityClassLabel(cls: ValidityClass): string {
  switch (cls) {
    case 'valid-ready-to-execute':
      return 'Valid, ready to execute';
    case 'incomplete':
      return 'Incomplete';
    case 'formality-risk':
      return 'Formality risk';
    default:
      return '';
  }
}

/** Short validity-class label for the dashboard. */
export function validityClassShort(cls: ValidityClass): string {
  switch (cls) {
    case 'valid-ready-to-execute':
      return 'Ready';
    case 'incomplete':
      return 'Incomplete';
    case 'formality-risk':
      return 'Risk';
    default:
      return '';
  }
}

/** Lily-token colour utility classes for the validity-class badge / banner. */
export function validityClassColor(cls: ValidityClass): string {
  switch (cls) {
    case 'valid-ready-to-execute':
      return 'bg-success text-success-content border-success';
    case 'incomplete':
      return 'bg-warning text-warning-content border-warning';
    case 'formality-risk':
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
  switch (priority) {
    case 'high':
      return 'HIGH';
    case 'medium':
      return 'MEDIUM';
    case 'low':
      return 'LOW';
    default:
      return '';
  }
}

/** Marital-status label. */
export function maritalStatusLabel(value: MaritalStatus): string {
  switch (value) {
    case 'single':
      return 'Single';
    case 'married':
      return 'Married';
    case 'divorced':
      return 'Divorced';
    case 'widowed':
      return 'Widowed';
    default:
      return '';
  }
}

/** Execution-form label. */
export function executionFormLabel(value: ExecutionForm): string {
  switch (value) {
    case 'witnessed':
      return 'Witnessed will (two witnesses)';
    case 'holographic':
      return 'Holographic (handwritten, unwitnessed) will';
    case 'electronic':
      return 'Electronic will';
    default:
      return '';
  }
}

/** Sound-mind label. */
export function soundMindLabel(value: SoundMind): string {
  switch (value) {
    case 'yes':
      return 'Yes, of sound mind';
    case 'no':
      return 'No';
    case 'uncertain':
      return 'Uncertain';
    default:
      return '';
  }
}

/** Yes / No label. */
export function yesNoLabel(value: string): string {
  switch (value) {
    case 'yes':
      return 'Yes';
    case 'no':
      return 'No';
    default:
      return '';
  }
}

/** US dollars for display; '' when null. */
export function dollars(n: number | null): string {
  return typeof n === 'number' && Number.isFinite(n)
    ? '$' + Math.round(n).toLocaleString('en-US')
    : '';
}
