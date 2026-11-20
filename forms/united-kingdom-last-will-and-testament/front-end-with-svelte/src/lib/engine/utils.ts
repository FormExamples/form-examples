import type {
  Domicile,
  MaritalStatus,
  PreviousWill,
  EstateValueBand,
  BeneficiaryRelationship,
  FuneralWishes,
  ExecutionStatus,
  Priority,
  ValidityClass
} from './types';

/** Validity-class label for display. */
export function validityClassLabel(cls: ValidityClass): string {
  switch (cls) {
    case 'valid':
      return 'Valid — ready to execute';
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
    case 'valid':
      return 'Valid';
    case 'incomplete':
      return 'Incomplete';
    case 'formality-risk':
      return 'Risk';
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

/** domicileLabel for display. */
export function domicileLabel(value: Domicile): string {
  switch (value) {
    case 'england-wales':
      return 'England and Wales';
    case 'scotland':
      return 'Scotland';
    case 'northern-ireland':
      return 'Northern Ireland';
    case 'other':
      return 'Another country';
    default:
      return '';
  }
}

/** maritalStatusLabel for display. */
export function maritalStatusLabel(value: MaritalStatus): string {
  switch (value) {
    case 'single':
      return 'Single';
    case 'married':
      return 'Married';
    case 'civil-partnership':
      return 'In a civil partnership';
    case 'cohabiting':
      return 'Living with an unmarried partner';
    case 'divorced-or-dissolved':
      return 'Divorced or civil partnership dissolved';
    case 'widowed':
      return 'Widowed';
    default:
      return '';
  }
}

/** previousWillLabel for display. */
export function previousWillLabel(value: PreviousWill): string {
  switch (value) {
    case 'none':
      return 'No earlier will';
    case 'exists':
      return 'An earlier will exists';
    case 'unsure':
      return 'Not sure';
    default:
      return '';
  }
}

/** estateValueBandLabel for display. */
export function estateValueBandLabel(value: EstateValueBand): string {
  switch (value) {
    case 'under-325k':
      return 'Under £325,000';
    case '325k-500k':
      return '£325,000 to £500,000';
    case '500k-2m':
      return '£500,000 to £2 million';
    case 'over-2m':
      return 'Over £2 million';
    default:
      return '';
  }
}

/** relationshipLabel for display. */
export function relationshipLabel(value: BeneficiaryRelationship): string {
  switch (value) {
    case 'spouse-or-civil-partner':
      return 'Spouse or civil partner';
    case 'unmarried-partner':
      return 'Unmarried partner';
    case 'child':
      return 'Child';
    case 'grandchild':
      return 'Grandchild';
    case 'other-relative':
      return 'Other relative';
    case 'friend':
      return 'Friend';
    case 'charity':
      return 'Charity';
    case 'other':
      return 'Other';
    default:
      return '';
  }
}

/** funeralWishesLabel for display. */
export function funeralWishesLabel(value: FuneralWishes): string {
  switch (value) {
    case 'burial':
      return 'Burial';
    case 'cremation':
      return 'Cremation';
    case 'no-preference':
      return 'No preference';
    case 'other':
      return 'Other';
    default:
      return '';
  }
}

/** executionStatusLabel for display. */
export function executionStatusLabel(value: ExecutionStatus): string {
  switch (value) {
    case 'draft':
      return 'Draft — not yet signed';
    case 'signed':
      return 'Signed and witnessed';
    default:
      return '';
  }
}
