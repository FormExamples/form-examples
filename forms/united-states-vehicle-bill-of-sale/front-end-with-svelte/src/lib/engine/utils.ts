import type {
  AsIsClause,
  CompletenessClass,
  LienStatus,
  Notarized,
  OdometerStatus,
  PartyType,
  PaymentMethod,
  Priority,
  TaxBasis,
  TitleBrand,
  YesNo
} from './types';

/** Completeness-class label for display. */
export function completenessClassLabel(cls: CompletenessClass): string {
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

/** Short completeness-class label for the dashboard. */
export function completenessClassShort(cls: CompletenessClass): string {
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

/** Lily-token colour utility classes for the class badge / banner. */
export function completenessClassColor(cls: CompletenessClass): string {
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

/** Party-type label. */
export function partyTypeLabel(value: PartyType): string {
  switch (value) {
    case 'individual':
      return 'Individual';
    case 'business':
      return 'Business';
    default:
      return '';
  }
}

/** Payment-method label. */
export function paymentMethodLabel(value: PaymentMethod): string {
  switch (value) {
    case 'cash':
      return 'Cash';
    case 'check':
      return 'Check';
    case 'wire':
      return 'Wire or electronic transfer';
    case 'financing':
      return 'Financing or loan';
    case 'trade':
      return 'Trade';
    case 'gift':
      return 'Gift (no payment)';
    default:
      return '';
  }
}

/** Sales-tax-basis label. */
export function taxBasisLabel(value: TaxBasis): string {
  switch (value) {
    case 'purchase-price':
      return 'Purchase price';
    case 'standard-presumptive-value':
      return 'State standard presumptive value';
    case 'fair-market-value':
      return 'Fair market value';
    case 'exempt-gift':
      return 'Exempt: gift';
    case 'exempt-family':
      return 'Exempt: family transfer';
    default:
      return '';
  }
}

/** Title-brand label. */
export function titleBrandLabel(value: TitleBrand): string {
  switch (value) {
    case 'clean':
      return 'Clean (no brand)';
    case 'salvage':
      return 'Salvage';
    case 'rebuilt':
      return 'Rebuilt or reconstructed';
    case 'flood':
      return 'Flood damage';
    case 'lemon':
      return 'Lemon-law buyback';
    case 'junk':
      return 'Junk or non-repairable';
    case 'unknown':
      return 'Unknown';
    default:
      return '';
  }
}

/** Odometer-status label. */
export function odometerStatusLabel(value: OdometerStatus): string {
  switch (value) {
    case 'actual':
      return 'Reflects the actual mileage';
    case 'exceeds-mechanical-limits':
      return 'Exceeds the odometer mechanical limits';
    case 'not-actual':
      return 'NOT the actual mileage (warning: odometer discrepancy)';
    default:
      return '';
  }
}

/** Lien-status label. */
export function lienStatusLabel(value: LienStatus): string {
  switch (value) {
    case 'none':
      return 'No lien';
    case 'released':
      return 'Lien released (release in hand)';
    case 'outstanding':
      return 'Lien outstanding';
    default:
      return '';
  }
}

/** As-is-clause label. */
export function asIsClauseLabel(value: AsIsClause): string {
  switch (value) {
    case 'as-is':
      return 'Sold as is, with no warranty';
    case 'warranty':
      return 'Sold with a written warranty';
    default:
      return '';
  }
}

/** Notarized label. */
export function notarizedLabel(value: Notarized): string {
  switch (value) {
    case 'yes':
      return 'Yes, notarized';
    case 'no':
      return 'No, not notarized';
    case 'not-required':
      return 'Not required';
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
