import type {
  ApplicationClass,
  ApplicationMode,
  ApplicationType,
  CertificateType,
  ChildrenArrangements,
  FeeStatus,
  FinancialOrderIntent,
  Priority,
  ServiceMethod,
  Stage,
  YesNo
} from './types';

/** Application-class label for display. */
export function applicationClassLabel(cls: ApplicationClass): string {
  switch (cls) {
    case 'ready-to-apply':
      return 'Ready to apply';
    case 'incomplete':
      return 'Incomplete';
    case 'not-eligible-yet':
      return 'Not eligible yet';
    default:
      return '';
  }
}

/** Short application-class label for the dashboard. */
export function applicationClassShort(cls: ApplicationClass): string {
  switch (cls) {
    case 'ready-to-apply':
      return 'Ready';
    case 'incomplete':
      return 'Incomplete';
    case 'not-eligible-yet':
      return 'Not yet';
    default:
      return 'N/A';
  }
}

/** Lily-token colour utility classes for the application-class badge / banner. */
export function applicationClassColor(cls: ApplicationClass): string {
  switch (cls) {
    case 'ready-to-apply':
      return 'bg-success text-success-content border-success';
    case 'incomplete':
      return 'bg-warning text-warning-content border-warning';
    case 'not-eligible-yet':
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
    case 'low':
      return 'bg-base-300 text-base-content border-base-300';
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

/** Stage label. */
export function stageLabel(value: Stage): string {
  switch (value) {
    case 'application':
      return 'Application (form D8 or online)';
    case 'conditional-order':
      return 'Conditional order (form D84)';
    case 'final-order':
      return 'Final order (form D36)';
    default:
      return '';
  }
}

/** Short stage label for the dashboard. */
export function stageShort(value: Stage): string {
  switch (value) {
    case 'application':
      return 'Application';
    case 'conditional-order':
      return 'Conditional order';
    case 'final-order':
      return 'Final order';
    default:
      return '';
  }
}

/** Application-type label. */
export function applicationTypeLabel(value: ApplicationType): string {
  switch (value) {
    case 'divorce':
      return 'Divorce';
    case 'dissolution':
      return 'Dissolution of a civil partnership';
    default:
      return '';
  }
}

/** Application-mode label. */
export function applicationModeLabel(value: ApplicationMode): string {
  switch (value) {
    case 'sole':
      return 'Sole application';
    case 'joint':
      return 'Joint application';
    default:
      return '';
  }
}

/** Marriage-certificate label. */
export function certificateTypeLabel(value: CertificateType): string {
  switch (value) {
    case 'original':
      return 'Original certificate';
    case 'certified-copy':
      return 'Certified copy';
    case 'not-held':
      return 'Not held';
    default:
      return '';
  }
}

/** Service-method label. */
export function serviceMethodLabel(value: ServiceMethod): string {
  switch (value) {
    case 'email':
      return 'By email';
    case 'post':
      return 'By post';
    case 'alternative-service':
      return 'Alternative service (court order needed)';
    default:
      return '';
  }
}

/** Children-arrangements label. */
export function childrenArrangementsLabel(value: ChildrenArrangements): string {
  switch (value) {
    case 'agreed':
      return 'Agreed';
    case 'not-agreed':
      return 'Not agreed';
    case 'undecided':
      return 'Undecided';
    default:
      return '';
  }
}

/** Financial-order-intent label. */
export function financialOrderLabel(value: FinancialOrderIntent): string {
  switch (value) {
    case 'yes':
      return 'Yes, a financial order is intended';
    case 'no':
      return 'No financial order intended';
    case 'undecided':
      return 'Undecided';
    default:
      return '';
  }
}

/** Fee-status label. */
export function feeStatusLabel(value: FeeStatus): string {
  switch (value) {
    case 'paid':
      return 'Paid';
    case 'help-with-fees-approved':
      return 'Help with Fees approved';
    case 'help-with-fees-pending':
      return 'Help with Fees pending';
    case 'unpaid':
      return 'Not paid';
    default:
      return '';
  }
}

/** Yes / No label. */
export function yesNoLabel(value: YesNo): string {
  switch (value) {
    case 'yes':
      return 'Yes';
    case 'no':
      return 'No';
    default:
      return '';
  }
}
