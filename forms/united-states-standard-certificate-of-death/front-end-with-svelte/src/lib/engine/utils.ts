import type { Priority, ValidityClass } from './types.js';

/** Validity-class label for display. */
export function validityClassLabel(cls: ValidityClass): string {
  switch (cls) {
    case 'valid':
      return 'Valid';
    case 'incomplete':
      return 'Incomplete';
    case 'refer-to-medical-examiner-or-coroner':
      return 'Refer to medical examiner or coroner';
    default:
      return '';
  }
}

/** Short validity-class label for the dashboard. */
export function validityClassShort(cls: ValidityClass): string {
  switch (cls) {
    case 'valid':
      return 'Valid';
    case 'incomplete':
      return 'Incomplete';
    case 'refer-to-medical-examiner-or-coroner':
      return 'Refer';
    default:
      return 'N/A';
  }
}

/** Lily-token colour utility classes for the validity-class badge / banner. */
export function validityClassColor(cls: ValidityClass): string {
  switch (cls) {
    case 'valid':
      return 'bg-success text-success-content border-success';
    case 'incomplete':
      return 'bg-warning text-warning-content border-warning';
    case 'refer-to-medical-examiner-or-coroner':
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
