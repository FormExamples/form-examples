import type {
  Classification,
  DvlaNotification,
  FinanceStatus,
  FuelType,
  MotStatus,
  PaymentMethod,
  Priority,
  SaleTerms,
  SellerCapacity
} from './types';

/** Classification label for display. */
export function classificationLabel(cls: Classification): string {
  switch (cls) {
    case 'complete':
      return 'Complete';
    case 'incomplete':
      return 'Incomplete';
    case 'risk-flagged':
      return 'Risk flagged';
    default:
      return '';
  }
}

/** Short classification label for the dashboard. */
export function classificationShort(cls: Classification): string {
  switch (cls) {
    case 'complete':
      return 'Complete';
    case 'incomplete':
      return 'Incomplete';
    case 'risk-flagged':
      return 'Risk';
    default:
      return 'N/A';
  }
}

/** Lily-token colour utility classes for the classification badge / banner. */
export function classificationColor(cls: Classification): string {
  switch (cls) {
    case 'complete':
      return 'bg-success text-success-content border-success';
    case 'incomplete':
      return 'bg-warning text-warning-content border-warning';
    case 'risk-flagged':
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
      return 'bg-info text-info-content border-info';
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

/** Seller-capacity label. */
export function sellerCapacityLabel(value: SellerCapacity): string {
  switch (value) {
    case 'private':
      return 'Private individual';
    case 'trader':
      return 'Trader (selling in the course of a business)';
    default:
      return '';
  }
}

/** Fuel-type label. */
export function fuelTypeLabel(value: FuelType): string {
  switch (value) {
    case 'petrol':
      return 'Petrol';
    case 'diesel':
      return 'Diesel';
    case 'hybrid':
      return 'Hybrid';
    case 'electric':
      return 'Electric';
    case 'other':
      return 'Other';
    default:
      return '';
  }
}

/** MOT-status label. */
export function motStatusLabel(value: MotStatus): string {
  switch (value) {
    case 'valid':
      return 'Valid MOT';
    case 'expired':
      return 'MOT expired';
    case 'exempt':
      return 'Exempt from MOT';
    case 'none':
      return 'No MOT';
    default:
      return '';
  }
}

/** Finance-status label. */
export function financeStatusLabel(value: FinanceStatus): string {
  switch (value) {
    case 'none':
      return 'No outstanding finance (checked)';
    case 'outstanding':
      return 'Finance outstanding';
    case 'unchecked':
      return 'Not checked';
    default:
      return '';
  }
}

/** Payment-method label. */
export function paymentMethodLabel(value: PaymentMethod): string {
  switch (value) {
    case 'bank-transfer':
      return 'Bank transfer';
    case 'cash':
      return 'Cash';
    case 'cheque':
      return 'Cheque';
    case 'card':
      return 'Card';
    case 'other':
      return 'Other';
    default:
      return '';
  }
}

/** Sale-terms label. */
export function saleTermsLabel(value: SaleTerms): string {
  switch (value) {
    case 'sold-as-seen':
      return 'Sold as seen';
    case 'warranty-given':
      return 'Warranty given';
    default:
      return '';
  }
}

/** DVLA-notification label. */
export function dvlaNotificationLabel(value: DvlaNotification): string {
  switch (value) {
    case 'online':
      return 'Told DVLA online';
    case 'post':
      return 'Told DVLA by post (V5C)';
    case 'not-yet':
      return 'Not yet told';
    default:
      return '';
  }
}
