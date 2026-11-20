import type {
  CeremonyType,
  CertificateService,
  MaritalStatus,
  NationalityStatus,
  NoticeType,
  Priority,
  ValidityClass
} from './types';

/** Validity-class label for display. */
export function validityClassLabel(cls: ValidityClass): string {
  switch (cls) {
    case 'ready-to-submit':
      return 'Ready to submit';
    case 'incomplete':
      return 'Incomplete';
    case 'needs-evidence':
      return 'Needs evidence or correction';
    case 'ineligible':
      return 'Ineligible';
    default:
      return '';
  }
}

/** Short validity-class label for the dashboard. */
export function validityClassShort(cls: ValidityClass): string {
  switch (cls) {
    case 'ready-to-submit':
      return 'Ready';
    case 'incomplete':
      return 'Incomplete';
    case 'needs-evidence':
      return 'Evidence';
    case 'ineligible':
      return 'Ineligible';
    default:
      return 'N/A';
  }
}

/** Lily-token colour utility classes for the validity-class badge / banner. */
export function validityClassColor(cls: ValidityClass): string {
  switch (cls) {
    case 'ready-to-submit':
      return 'bg-success text-success-content border-success';
    case 'incomplete':
    case 'needs-evidence':
      return 'bg-warning text-warning-content border-warning';
    case 'ineligible':
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

/** Notice-type label. */
export function noticeTypeLabel(value: NoticeType): string {
  switch (value) {
    case 'marriage':
      return 'Marriage';
    case 'civil-partnership':
      return 'Civil partnership';
    default:
      return '';
  }
}

/** Ceremony-type label. */
export function ceremonyTypeLabel(value: CeremonyType): string {
  switch (value) {
    case 'civil-register-office':
      return 'Civil ceremony at a register office';
    case 'civil-approved-premises':
      return 'Civil ceremony at approved premises';
    case 'religious-registered-building':
      return 'Religious ceremony in a registered building';
    case 'anglican':
      return 'Church of England or Church in Wales ceremony';
    default:
      return '';
  }
}

/** Nationality-status label. */
export function nationalityStatusLabel(value: NationalityStatus): string {
  switch (value) {
    case 'british-or-irish':
      return 'British or Irish citizen';
    case 'eu-settlement-scheme':
      return 'EU Settlement Scheme (settled or pre-settled)';
    case 'other':
      return 'Other (outside the UK and Ireland)';
    default:
      return '';
  }
}

/** Marital-status label. */
export function maritalStatusLabel(value: MaritalStatus): string {
  switch (value) {
    case 'never-married':
      return 'Never married or in a civil partnership';
    case 'divorced':
      return 'Divorced';
    case 'widowed':
      return 'Widowed';
    case 'dissolved-civil-partnership':
      return 'Civil partnership dissolved';
    case 'annulled':
      return 'Marriage or civil partnership annulled';
    case 'currently-married-or-civil-partnered':
      return 'Currently married or in a civil partnership';
    default:
      return '';
  }
}

/** Certificate-service label. */
export function certificateServiceLabel(value: CertificateService): string {
  switch (value) {
    case 'standard':
      return 'Standard';
    case 'priority':
      return 'Priority (next working day)';
    default:
      return '';
  }
}

/** Yes / No / Not applicable label. */
export function yesNoLabel(value: string): string {
  switch (value) {
    case 'yes':
      return 'Yes';
    case 'no':
      return 'No';
    case 'not-applicable':
      return 'Not applicable';
    default:
      return '';
  }
}
