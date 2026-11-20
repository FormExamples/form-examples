import type {
  Adaptation,
  ClaimType,
  EligibilityClass,
  IndicativeOutcome,
  LiableRole,
  OccupantStatus,
  Priority
} from './types';

/** Eligibility-class label for display. */
export function eligibilityClassLabel(cls: EligibilityClass): string {
  switch (cls) {
    case 'likely-eligible':
      return 'Likely eligible';
    case 'incomplete':
      return 'Incomplete';
    case 'likely-ineligible':
      return 'Likely ineligible';
    default:
      return '';
  }
}

/** Short eligibility-class label for the dashboard. */
export function eligibilityClassShort(cls: EligibilityClass): string {
  switch (cls) {
    case 'likely-eligible':
      return 'Eligible';
    case 'incomplete':
      return 'Incomplete';
    case 'likely-ineligible':
      return 'Ineligible';
    default:
      return 'N/A';
  }
}

/** Lily-token colour utility classes for the eligibility-class badge / banner. */
export function eligibilityClassColor(cls: EligibilityClass): string {
  switch (cls) {
    case 'likely-eligible':
      return 'bg-success text-success-content border-success';
    case 'incomplete':
      return 'bg-warning text-warning-content border-warning';
    case 'likely-ineligible':
      return 'bg-error text-error-content border-error';
    default:
      return 'bg-base-200 text-base-content border-base-300';
  }
}

/** Lily-token colour utility classes for a flag-priority badge. */
export function priorityColor(priority: Priority): string {
  switch (priority) {
    case 'high':
      return 'bg-error text-error-content border-error';
    case 'medium':
      return 'bg-warning text-warning-content border-warning';
    case 'low':
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

/** Claim-type label. */
export function claimTypeLabel(value: ClaimType): string {
  switch (value) {
    case 'single-person-discount':
      return 'Single person discount (25%)';
    case 'all-disregarded-discount':
      return 'Everyone disregarded (50% discount)';
    case 'student-exemption':
      return 'Full-time student exemption';
    case 'severe-mental-impairment':
      return 'Severe mental impairment disregard';
    case 'disabled-band-reduction':
      return 'Disabled band reduction';
    case 'care-leaver-relief':
      return 'Care leaver relief';
    case 'council-tax-reduction':
      return 'Council Tax Reduction (means-tested)';
    default:
      return '';
  }
}

/** Occupant-status label. */
export function occupantStatusLabel(value: OccupantStatus): string {
  switch (value) {
    case 'counted-adult':
      return 'Adult (counts)';
    case 'full-time-student':
      return 'Full-time student';
    case 'severely-mentally-impaired':
      return 'Severely mentally impaired';
    case 'under-18':
      return 'Under 18';
    case 'apprentice':
      return 'Apprentice';
    case 'education-18-19':
      return 'Aged 18 or 19 in full-time education';
    case 'live-in-carer':
      return 'Live-in carer';
    case 'care-leaver':
      return 'Care leaver';
    case 'other-disregarded':
      return 'Other disregarded person';
    default:
      return '';
  }
}

/** Indicative-outcome label. */
export function indicativeOutcomeLabel(value: IndicativeOutcome): string {
  switch (value) {
    case '25-percent-discount':
      return '25% discount';
    case '50-percent-discount':
      return '50% discount';
    case 'full-exemption':
      return 'Full exemption (no bill)';
    case 'smi-disregard':
      return 'Severe mental impairment disregard';
    case 'band-reduction':
      return 'Reduction to the next lower band';
    case 'care-leaver-relief':
      return 'Care leaver relief';
    case 'means-tested-reduction':
      return 'Means-tested reduction (decided by the authority)';
    case 'none':
      return 'No discount indicated';
    default:
      return '';
  }
}

/** Adaptation label. */
export function adaptationLabel(value: Adaptation): string {
  switch (value) {
    case 'extra-bathroom':
      return 'Extra bathroom';
    case 'extra-kitchen':
      return 'Extra kitchen';
    case 'extra-room':
      return 'Extra room needed by the disabled person';
    case 'wheelchair-space':
      return 'Extra indoor space for a wheelchair';
    case 'none':
      return 'No qualifying adaptation';
    default:
      return '';
  }
}

/** Liable-role label. */
export function liableRoleLabel(value: LiableRole): string {
  switch (value) {
    case 'owner-occupier':
      return 'Owner-occupier';
    case 'tenant':
      return 'Tenant';
    case 'landlord':
      return 'Landlord';
    case 'other':
      return 'Other';
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
