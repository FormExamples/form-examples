import type {
  ApplicationClass,
  CertificateType,
  DeliveryMethod,
  IdType,
  Priority,
  Purpose,
  Relationship,
  Sex
} from './types';

/** Application-class label for display. */
export function applicationClassLabel(cls: ApplicationClass): string {
  switch (cls) {
    case 'ready-to-submit':
      return 'Ready to submit';
    case 'incomplete':
      return 'Incomplete';
    case 'ineligible-requester':
      return 'Ineligible requester';
    default:
      return '';
  }
}

/** Short application-class label for the dashboard. */
export function applicationClassShort(cls: ApplicationClass): string {
  switch (cls) {
    case 'ready-to-submit':
      return 'Ready';
    case 'incomplete':
      return 'Incomplete';
    case 'ineligible-requester':
      return 'Ineligible';
    default:
      return '';
  }
}

/** Tailwind colour classes for the application-class badge. */
export function applicationClassColor(cls: ApplicationClass): string {
  switch (cls) {
    case 'ready-to-submit':
      return 'text-success border-success bg-success/10';
    case 'incomplete':
      return 'text-warning border-warning bg-warning/10';
    case 'ineligible-requester':
      return 'text-error border-error bg-error/10';
    default:
      return '';
  }
}

/** Tailwind colour classes for a flag-priority badge. */
export function priorityColor(priority: Priority): string {
  switch (priority) {
    case 'high':
      return 'text-error border-error bg-error/10';
    case 'medium':
      return 'text-warning border-warning bg-warning/10';
    case 'low':
      return 'text-info border-info bg-info/10';
    default:
      return '';
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

/** Sex label. */
export function sexLabel(value: Sex): string {
  switch (value) {
    case 'female':
      return 'Female';
    case 'male':
      return 'Male';
    case 'other':
      return 'Other';
    case 'unknown':
      return 'Unknown';
    default:
      return '';
  }
}

const RELATIONSHIP_LABELS: Record<string, string> = {
  self: 'Myself (the person named)',
  parent: 'Parent named on the certificate',
  'legal-guardian': 'Legal guardian',
  'legal-representative': 'Legal representative (attorney)',
  spouse: 'Spouse',
  child: 'Adult child',
  sibling: 'Sibling',
  grandparent: 'Grandparent',
  grandchild: 'Grandchild',
  'government-agency': 'Government agency',
  other: 'Other (no direct relationship)'
};

const PURPOSE_LABELS: Record<string, string> = {
  passport: 'US passport',
  'real-id': 'REAL ID driver license',
  school: 'School enrollment',
  employment: 'Employment',
  benefits: 'Benefits or Social Security',
  genealogy: 'Genealogy or family history',
  'foreign-use': 'Use in another country',
  other: 'Other'
};

const CERTIFICATE_TYPE_LABELS: Record<string, string> = {
  'certified-long-form': 'Certified long form (full image of the record)',
  'certified-short-form': 'Certified short form (abstract)',
  informational: 'Informational copy (not valid for identity)'
};

const DELIVERY_LABELS: Record<string, string> = {
  online: 'Online',
  mail: 'By mail',
  'in-person': 'In person'
};

const ID_TYPE_LABELS: Record<string, string> = {
  'state-driver-license': 'State driver license',
  'state-id-card': 'State identification card',
  'us-passport': 'US passport',
  'military-id': 'Military ID',
  'other-photo-id': 'Other government photo ID',
  none: 'No photo ID'
};

/** Relationship label. */
export function relationshipLabel(value: Relationship): string {
  return RELATIONSHIP_LABELS[value] ?? '';
}

/** Purpose label. */
export function purposeLabel(value: Purpose): string {
  return PURPOSE_LABELS[value] ?? '';
}

/** Copy-type label. */
export function certificateTypeLabel(value: CertificateType): string {
  return CERTIFICATE_TYPE_LABELS[value] ?? '';
}

/** Delivery-method label. */
export function deliveryMethodLabel(value: DeliveryMethod): string {
  return DELIVERY_LABELS[value] ?? '';
}

/** Photo-ID type label. */
export function idTypeLabel(value: IdType): string {
  return ID_TYPE_LABELS[value] ?? '';
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
