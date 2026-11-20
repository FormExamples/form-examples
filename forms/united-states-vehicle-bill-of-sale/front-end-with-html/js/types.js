// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the United States vehicle bill of
// sale form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_united_states_vehicle_bill_of_sale.sql` (a section's
// field `seller.name` is the column `seller_name`). This file builds and exports
// the canonical empty BillOfSale shape used by the wizard, so newly-added fields
// default correctly when older saved state is rehydrated from localStorage. It
// also exports display helpers (enum labels and class / CSS-class hints).
//
// This is a DOCUMENTATION-SUPPORT instrument, not legal advice. The engine
// checks that a private-party vehicle bill of sale is internally complete and
// consistent against federal law (49 CFR Part 580 odometer disclosure) and a
// small table of state rules, classifies it as `complete` / `incomplete` /
// `risk-flagged`, and raises flags. The state motor vehicle agency decides.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'individual' | 'business' | ''} PartyType
 * @typedef {'cash' | 'check' | 'wire' | 'financing' | 'trade' | 'gift' | ''} PaymentMethod
 * @typedef {'purchase-price' | 'standard-presumptive-value' | 'fair-market-value' | 'exempt-gift' | 'exempt-family' | ''} TaxBasis
 * @typedef {'clean' | 'salvage' | 'rebuilt' | 'flood' | 'lemon' | 'junk' | 'unknown' | ''} TitleBrand
 * @typedef {'actual' | 'exceeds-mechanical-limits' | 'not-actual' | ''} OdometerStatus
 * @typedef {'none' | 'released' | 'outstanding' | ''} LienStatus
 * @typedef {'as-is' | 'warranty' | ''} AsIsClause
 * @typedef {'yes' | 'no' | 'not-required' | ''} Notarized
 * @typedef {'complete' | 'incomplete' | 'risk-flagged'} CompletenessClass
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1: sale transaction.
 * @typedef {Object} Transaction
 * @property {string} state                    - two-letter USPS code; '' when unset
 * @property {string | null} saleDate          - ISO date; null when unset
 * @property {number | null} salePriceAsUsd    - dollars; 0 for a gift; null when unset
 * @property {PaymentMethod} paymentMethod
 * @property {TaxBasis} taxBasis
 */

/**
 * Steps 2 and 3: a party (seller or buyer).
 * @typedef {Object} Party
 * @property {string} name
 * @property {PartyType} type
 * @property {string} streetAddress
 * @property {string} city
 * @property {string} state
 * @property {string} postalCode
 * @property {string} phone
 * @property {YesNo} signed
 */

/**
 * Step 4: vehicle.
 * @typedef {Object} Vehicle
 * @property {number | null} year
 * @property {string} make
 * @property {string} model
 * @property {string} bodyType
 * @property {string} vin
 * @property {string} color
 * @property {string} titleNumber
 * @property {TitleBrand} titleBrand
 * @property {YesNo} gvwrOver16000
 * @property {YesNo} selfPropelled
 */

/**
 * Step 5: federal odometer disclosure (49 CFR 580.5).
 * @typedef {Object} Odometer
 * @property {number | null} readingMiles
 * @property {OdometerStatus} status
 * @property {YesNo} sellerCertified
 * @property {YesNo} buyerAcknowledged
 */

/**
 * Step 6: terms, title, lien, and notarization.
 * @typedef {Object} Terms
 * @property {YesNo} sellerHoldsTitle
 * @property {YesNo} titleSigned
 * @property {LienStatus} lienStatus
 * @property {string} lienholderName
 * @property {string | null} lienReleaseDate
 * @property {AsIsClause} asIsClause
 * @property {string} warrantyNote
 * @property {Notarized} notarized
 */

/**
 * Step 7: after the sale.
 * @typedef {Object} AfterSale
 * @property {YesNo} releaseOfLiabilityFiled
 * @property {string | null} releaseFiledDate
 * @property {YesNo} platesRemoved
 * @property {string | null} buyerTitleApplicationDate
 */

/**
 * @typedef {Object} BillOfSale
 * @property {Transaction} transaction
 * @property {Party} seller
 * @property {Party} buyer
 * @property {Vehicle} vehicle
 * @property {Odometer} odometer
 * @property {Terms} terms
 * @property {AfterSale} afterSale
 */

/**
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category
 * @property {Priority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

/**
 * @typedef {Object} ValidationResult
 * @property {CompletenessClass} completenessClass
 * @property {boolean} odometerExempt
 * @property {boolean} stateRuleKnown
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/** @returns {Party} */
function emptyParty() {
  return {
    name: '',
    type: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    signed: ''
  };
}

/**
 * Build a fresh, fully-blank bill of sale.
 * Text / enum fields default to `''`; numeric, date, and time fields to `null`.
 * @returns {BillOfSale}
 */
function emptyBillOfSale() {
  return {
    transaction: {
      state: '',
      saleDate: null,
      salePriceAsUsd: null,
      paymentMethod: '',
      taxBasis: ''
    },
    seller: emptyParty(),
    buyer: emptyParty(),
    vehicle: {
      year: null,
      make: '',
      model: '',
      bodyType: '',
      vin: '',
      color: '',
      titleNumber: '',
      titleBrand: '',
      gvwrOver16000: '',
      selfPropelled: ''
    },
    odometer: {
      readingMiles: null,
      status: '',
      sellerCertified: '',
      buyerAcknowledged: ''
    },
    terms: {
      sellerHoldsTitle: '',
      titleSigned: '',
      lienStatus: '',
      lienholderName: '',
      lienReleaseDate: null,
      asIsClause: '',
      warrantyNote: '',
      notarized: ''
    },
    afterSale: {
      releaseOfLiabilityFiled: '',
      releaseFiledDate: null,
      platesRemoved: '',
      buyerTitleApplicationDate: null
    }
  };
}

/** Completeness-class label for display. */
function completenessClassLabel(cls) {
  switch (cls) {
    case 'complete': return 'Complete';
    case 'incomplete': return 'Incomplete';
    case 'risk-flagged': return 'Risk flagged';
    default: return '';
  }
}

/** CSS class hint for the class badge (reuses the risk palette). */
function completenessClassClass(cls) {
  switch (cls) {
    case 'complete': return 'risk-low';
    case 'incomplete': return 'risk-moderate';
    case 'risk-flagged': return 'risk-high';
    default: return '';
  }
}

/** Party-type label. */
function partyTypeLabel(value) {
  switch (value) {
    case 'individual': return 'Individual';
    case 'business': return 'Business';
    default: return '';
  }
}

/** Payment-method label. */
function paymentMethodLabel(value) {
  switch (value) {
    case 'cash': return 'Cash';
    case 'check': return 'Check';
    case 'wire': return 'Wire or electronic transfer';
    case 'financing': return 'Financing or loan';
    case 'trade': return 'Trade';
    case 'gift': return 'Gift (no payment)';
    default: return '';
  }
}

/** Sales-tax-basis label. */
function taxBasisLabel(value) {
  switch (value) {
    case 'purchase-price': return 'Purchase price';
    case 'standard-presumptive-value': return 'State standard presumptive value';
    case 'fair-market-value': return 'Fair market value';
    case 'exempt-gift': return 'Exempt: gift';
    case 'exempt-family': return 'Exempt: family transfer';
    default: return '';
  }
}

/** Title-brand label. */
function titleBrandLabel(value) {
  switch (value) {
    case 'clean': return 'Clean (no brand)';
    case 'salvage': return 'Salvage';
    case 'rebuilt': return 'Rebuilt or reconstructed';
    case 'flood': return 'Flood damage';
    case 'lemon': return 'Lemon-law buyback';
    case 'junk': return 'Junk or non-repairable';
    case 'unknown': return 'Unknown';
    default: return '';
  }
}

/** Odometer-status label. */
function odometerStatusLabel(value) {
  switch (value) {
    case 'actual': return 'Reflects the actual mileage';
    case 'exceeds-mechanical-limits': return 'Exceeds the odometer mechanical limits';
    case 'not-actual': return 'NOT the actual mileage (warning: odometer discrepancy)';
    default: return '';
  }
}

/** Lien-status label. */
function lienStatusLabel(value) {
  switch (value) {
    case 'none': return 'No lien';
    case 'released': return 'Lien released (release in hand)';
    case 'outstanding': return 'Lien outstanding';
    default: return '';
  }
}

/** As-is-clause label. */
function asIsClauseLabel(value) {
  switch (value) {
    case 'as-is': return 'Sold as is, with no warranty';
    case 'warranty': return 'Sold with a written warranty';
    default: return '';
  }
}

/** Notarized label. */
function notarizedLabel(value) {
  switch (value) {
    case 'yes': return 'Yes, notarized';
    case 'no': return 'No, not notarized';
    case 'not-required': return 'Not required';
    default: return '';
  }
}

/** Yes / No label. */
function yesNoLabel(value) {
  switch (value) {
    case 'yes': return 'Yes';
    case 'no': return 'No';
    default: return '';
  }
}

/** Flag-priority label. */
function priorityLabel(priority) {
  switch (priority) {
    case 'high': return 'HIGH';
    case 'medium': return 'MEDIUM';
    case 'low': return 'LOW';
    default: return '';
  }
}

export { emptyBillOfSale, completenessClassLabel, completenessClassClass, partyTypeLabel, paymentMethodLabel, taxBasisLabel, titleBrandLabel, odometerStatusLabel, lienStatusLabel, asIsClauseLabel, notarizedLabel, yesNoLabel, priorityLabel };
