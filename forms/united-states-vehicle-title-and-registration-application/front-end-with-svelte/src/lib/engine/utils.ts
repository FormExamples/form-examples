import type { ApplicationClass, Priority, VinStatus } from './types';

/** Application-class label for display. */
export function applicationClassLabel(cls: ApplicationClass | ''): string {
  switch (cls) {
    case 'ready-to-submit':
      return 'Ready to submit';
    case 'incomplete':
      return 'Incomplete';
    case 'title-brand-or-lien-issue':
      return 'Title brand or lien issue';
    default:
      return '';
  }
}

/** Short application-class label for the dashboard. */
export function applicationClassShort(cls: ApplicationClass | ''): string {
  switch (cls) {
    case 'ready-to-submit':
      return 'Ready';
    case 'incomplete':
      return 'Incomplete';
    case 'title-brand-or-lien-issue':
      return 'Brand or lien';
    default:
      return 'N/A';
  }
}

/** Lily-token colour utility classes for the class badge / banner. */
export function applicationClassColor(cls: ApplicationClass | ''): string {
  switch (cls) {
    case 'ready-to-submit':
      return 'bg-success text-success-content border-success';
    case 'incomplete':
      return 'bg-warning text-warning-content border-warning';
    case 'title-brand-or-lien-issue':
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

/** VIN-status label. */
export function vinStatusLabel(value: VinStatus): string {
  switch (value) {
    case 'valid':
      return 'Valid (check digit passes)';
    case 'not-standardized':
      return 'Pre-1981 (no standard format)';
    case 'invalid-length':
      return 'Not 17 characters';
    case 'invalid-characters':
      return 'Contains I, O, Q or a symbol';
    case 'check-digit-mismatch':
      return 'Check digit fails';
    default:
      return 'Not entered';
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

/** Title-brand label. */
export function titleBrandLabel(value: string): string {
  switch (value) {
    case 'none':
      return 'No brand';
    case 'salvage':
      return 'Salvage';
    case 'junk':
      return 'Junk';
    case 'rebuilt':
      return 'Rebuilt or reconstructed';
    case 'flood':
      return 'Flood';
    case 'odometer-not-actual':
      return 'Odometer not actual mileage';
    case 'lemon-law-buyback':
      return 'Lemon-law buyback';
    case 'hail':
      return 'Hail damage';
    case 'other':
      return 'Other brand';
    default:
      return '';
  }
}

/** Lien-status label. */
export function lienStatusLabel(value: string): string {
  switch (value) {
    case 'none':
      return 'No lien';
    case 'new-lien':
      return 'New lien on this purchase';
    case 'existing-lien-released':
      return 'Existing lien, released';
    case 'existing-lien-unreleased':
      return 'Existing lien, not released';
    default:
      return '';
  }
}

/** Odometer-status label. */
export function odometerStatusLabel(value: string): string {
  switch (value) {
    case 'actual':
      return 'Actual mileage';
    case 'exceeds-mechanical-limits':
      return 'Exceeds mechanical limits';
    case 'not-actual':
      return 'Not the actual mileage';
    default:
      return '';
  }
}
