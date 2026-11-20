import type { Priority, ValidityClass } from './types';

/** Lily-token colour utility classes for the validity-class badge / banner. */
export function validityClassColor(cls: ValidityClass): string {
  switch (cls) {
    case 'ready-to-submit':
      return 'bg-success text-success-content border-success';
    case 'needs-supporting-documents':
      return 'bg-warning text-warning-content border-warning';
    case 'incomplete':
      return 'bg-error text-error-content border-error';
    default:
      return 'bg-base-300 text-base-content border-base-300';
  }
}

/** Short validity-class label for the dashboard. */
export function validityClassShort(cls: ValidityClass): string {
  switch (cls) {
    case 'ready-to-submit':
      return 'Ready';
    case 'needs-supporting-documents':
      return 'Needs documents';
    case 'incomplete':
      return 'Incomplete';
    default:
      return 'N/A';
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
      return 'bg-info text-info-content border-info';
    default:
      return 'bg-base-300 text-base-content border-base-300';
  }
}

/** Format pence as a pound amount, or an em dash when unknown. */
export function poundsLabel(pence: number | null | undefined): string {
  if (pence === null || pence === undefined) return '—';
  return '£' + (pence / 100).toFixed(2);
}

/** validityClassLabel. */
export function validityClassLabel(cls: string): string {
  switch (cls) {
    case 'ready-to-submit':
      return 'Ready to submit';
    case 'incomplete':
      return 'Incomplete';
    case 'needs-supporting-documents':
      return 'Needs supporting documents';
    default:
      return '';
  }
}

/** applicationTypeLabel. */
export function applicationTypeLabel(value: string): string {
  switch (value) {
    case 'v62-replacement-v5c':
      return 'V62: replacement V5C (lost, stolen, destroyed, damaged, or not received)';
    case 'v62-acquired-without-v5c':
      return 'V62: vehicle acquired without a V5C';
    case 'v55-4-new-vehicle':
      return 'V55/4: first registration of a new vehicle';
    case 'v55-5-used-vehicle':
      return 'V55/5: first registration of a used vehicle';
    case 'imported-vehicle':
      return 'Imported vehicle (V55/4 new or V55/5 used)';
    case 'v627-1-rebuilt-or-kit':
      return 'V627/1: rebuilt or kit vehicle';
    default:
      return '';
  }
}

/** v5cStatusLabel. */
export function v5cStatusLabel(value: string): string {
  switch (value) {
    case 'lost':
      return 'Lost';
    case 'stolen':
      return 'Stolen';
    case 'destroyed':
      return 'Destroyed';
    case 'not-received':
      return 'Not received after a change';
    case 'damaged':
      return 'Damaged';
    case 'never-had':
      return 'Vehicle acquired without a V5C';
    case 'has-v5c':
      return 'A V5C is held (first registration)';
    default:
      return '';
  }
}

/** keeperTypeLabel. */
export function keeperTypeLabel(value: string): string {
  switch (value) {
    case 'individual':
      return 'Individual';
    case 'company':
      return 'Company';
    case 'organization':
      return 'Organization';
    case 'trade':
      return 'Motor trade';
    case 'other':
      return 'Other';
    default:
      return '';
  }
}

/** identityDocumentTypeLabel. */
export function identityDocumentTypeLabel(value: string): string {
  switch (value) {
    case 'photocard-driving-licence':
      return 'Photocard driving licence (photocopy)';
    case 'passport':
      return 'Passport';
    case 'other-name-document':
      return 'Other document proving name';
    case 'none':
      return 'None supplied';
    default:
      return '';
  }
}

/** addressDocumentTypeLabel. */
export function addressDocumentTypeLabel(value: string): string {
  switch (value) {
    case 'photocard-driving-licence':
      return 'Photocard driving licence (photocopy)';
    case 'utility-bill':
      return 'Recent utility bill';
    case 'bank-statement':
      return 'Bank or building society statement';
    case 'council-tax-bill':
      return 'Council tax bill';
    case 'none':
      return 'None supplied';
    default:
      return '';
  }
}

/** vehicleCategoryLabel. */
export function vehicleCategoryLabel(value: string): string {
  switch (value) {
    case 'car':
      return 'Car';
    case 'motorcycle':
      return 'Motorcycle';
    case 'light-goods':
      return 'Light goods vehicle';
    case 'heavy-goods':
      return 'Heavy goods vehicle';
    case 'bus':
      return 'Bus or coach';
    case 'other':
      return 'Other';
    default:
      return '';
  }
}

/** fuelTypeLabel. */
export function fuelTypeLabel(value: string): string {
  switch (value) {
    case 'petrol':
      return 'Petrol';
    case 'diesel':
      return 'Diesel';
    case 'electric':
      return 'Electric';
    case 'hybrid':
      return 'Hybrid';
    case 'lpg':
      return 'LPG';
    case 'other':
      return 'Other';
    default:
      return '';
  }
}

/** typeApprovalLabel. */
export function typeApprovalLabel(value: string): string {
  switch (value) {
    case 'ecwvta':
      return 'European Community Whole Vehicle Type Approval (certificate of conformity)';
    case 'gb-type-approval':
      return 'Great Britain type approval certificate';
    case 'ni-type-approval':
      return 'Northern Ireland type approval certificate';
    case 'iva':
      return 'Individual Vehicle Approval (IVA) certificate';
    case 'msva':
      return 'Motorcycle Single Vehicle Approval (MSVA) certificate';
    case 'exempt-over-10-years':
      return 'Exempt: vehicle is 10 years old or more';
    case 'none':
      return 'No type-approval evidence';
    default:
      return '';
  }
}

/** motStatusLabel. */
export function motStatusLabel(value: string): string {
  switch (value) {
    case 'valid':
      return 'Valid MOT certificate enclosed';
    case 'not-required':
      return 'Not required';
    case 'missing':
      return 'No MOT certificate';
    default:
      return '';
  }
}

/** insuranceStatusLabel. */
export function insuranceStatusLabel(value: string): string {
  switch (value) {
    case 'in-force':
      return 'Insurance in force (certificate or cover note)';
    case 'none':
      return 'No insurance';
    default:
      return '';
  }
}

/** novaStatusLabel. */
export function novaStatusLabel(value: string): string {
  switch (value) {
    case 'notified':
      return 'HMRC notified through NOVA';
    case 'not-notified':
      return 'HMRC not yet notified';
    case 'not-applicable':
      return 'Not applicable';
    default:
      return '';
  }
}

/** feePaymentMethodLabel. */
export function feePaymentMethodLabel(value: string): string {
  switch (value) {
    case 'cheque':
      return 'Cheque payable to DVLA, Swansea';
    case 'postal-order':
      return 'Postal order payable to DVLA, Swansea';
    case 'post-office-card':
      return 'Card payment at a Post Office branch';
    case 'online-card':
      return 'Card payment online';
    case 'none':
      return 'No payment enclosed';
    default:
      return '';
  }
}

/** yesNoLabel. */
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

/** priorityLabel. */
export function priorityLabel(priority: string): string {
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
