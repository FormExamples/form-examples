import type { Priority, ReadinessClass } from './types';

/** Readiness-class label for display. */
export function readinessClassLabel(cls: ReadinessClass): string {
  switch (cls) {
    case 'ready-to-submit':
      return 'Ready to submit';
    case 'incomplete':
      return 'Incomplete';
    case 'needs-additional-evidence':
      return 'Needs additional evidence';
    case 'out-of-scope':
      return 'Out of scope';
    default:
      return '';
  }
}

/** Lily-token colour utility classes for the readiness badge / banner. */
export function readinessClassColor(cls: ReadinessClass): string {
  switch (cls) {
    case 'ready-to-submit':
      return 'bg-success text-success-content border-success';
    case 'incomplete':
      return 'bg-warning text-warning-content border-warning';
    case 'needs-additional-evidence':
    case 'out-of-scope':
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

/** Sex label. */
export function sexLabel(value: string): string {
  switch (value) {
    case 'female':
      return 'Female';
    case 'male':
      return 'Male';
    case 'indeterminate':
      return 'Indeterminate';
    default:
      return '';
  }
}

/** Birth-country label. */
export function birthCountryLabel(value: string): string {
  switch (value) {
    case 'england':
      return 'England';
    case 'wales':
      return 'Wales';
    case 'scotland':
      return 'Scotland';
    case 'northern-ireland':
      return 'Northern Ireland';
    case 'abroad':
      return 'Outside the United Kingdom';
    default:
      return '';
  }
}

/** Parents-relationship label. */
export function parentsRelationshipLabel(value: string): string {
  switch (value) {
    case 'married-or-civil-partners':
      return 'Married or civil partners (at the birth or conception)';
    case 'unmarried':
      return 'Not married or civil partners (mother and father)';
    case 'female-couple-married':
      return 'Female couple, married or civil partners';
    case 'female-couple-unmarried':
      return 'Female couple, not married or civil partners';
    case 'male-couple':
      return 'Male couple';
    case 'mother-only':
      return 'Mother only (no second parent)';
    default:
      return '';
  }
}

/** Paternity-basis label. */
export function paternityBasisLabel(value: string): string {
  switch (value) {
    case 'married-or-civil-partners':
      return 'Parents married or civil partners';
    case 'joint-registration':
      return 'Both parents register together';
    case 'statutory-declaration':
      return 'Signed statutory declaration of parentage';
    case 'court-order-parental-responsibility':
      return 'Court document giving parental responsibility';
    case 'parental-order':
      return 'Parental order from the court';
    case 'none':
      return 'None';
    default:
      return '';
  }
}

/** Informant-relationship label. */
export function informantRelationshipLabel(value: string): string {
  switch (value) {
    case 'mother':
      return 'Mother';
    case 'father':
      return 'Father';
    case 'second-parent':
      return 'Second parent (female parent)';
    case 'both-parents':
      return 'Both parents together';
    case 'person-present-at-birth':
      return 'Someone present at the birth';
    case 'person-responsible-for-child':
      return 'Someone responsible for the child';
    case 'hospital-administrator':
      return 'Hospital administrative staff';
    case 'other':
      return 'Other (for example a relative who was not present)';
    default:
      return '';
  }
}

/** Registration-route label. */
export function registrationRouteLabel(value: string): string {
  switch (value) {
    case 'local-register-office':
      return 'Local register office for the birth area';
    case 'hospital':
      return 'At the hospital before the mother leaves';
    case 'other-register-office':
      return 'Any other register office (details passed on)';
    default:
      return '';
  }
}

/** Identity-document label. */
export function identityDocumentLabel(value: string): string {
  switch (value) {
    case 'passport':
      return 'Passport (valid or expired)';
    case 'uk-photocard-driving-licence':
      return 'UK photocard driving licence';
    case 'eu-photocard-driving-licence':
      return 'EU photocard driving licence (full)';
    case 'uk-birth-or-adoption-certificate':
      return 'UK birth or adoption certificate';
    case 'biometric-immigration-document':
      return 'UK biometric immigration document';
    case 'uk-travel-document':
      return 'UK travel document (leave to enter or remain)';
    case 'refugee-or-stateless-travel-document':
      return 'Refugee or stateless person travel document';
    case 'eu-identity-card':
      return 'EU Member State identity card';
    case 'proof-of-age-card':
      return 'National Proof of Age Standards Scheme card';
    case 'none':
      return 'None of these';
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
