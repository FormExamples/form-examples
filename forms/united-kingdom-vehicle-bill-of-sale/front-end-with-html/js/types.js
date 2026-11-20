// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the United Kingdom Vehicle Bill of
// Sale form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_united_kingdom_vehicle_bill_of_sale.sql` (and the
// `seller` / `buyer` tables). This file builds and exports the canonical empty
// BillOfSale shape used by the wizard, so newly-added fields default correctly
// when older saved state is rehydrated from localStorage. It also exports
// display helpers (enum labels and classification / CSS-class hints).
//
// This is a COMPLETENESS and VALIDITY instrument, not a numeric score. It is
// documentation support, not legal advice: it classifies a private vehicle
// bill of sale as complete / incomplete / risk-flagged and raises flags.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'private' | 'trader' | ''} SellerCapacity
 * @typedef {'petrol' | 'diesel' | 'hybrid' | 'electric' | 'other' | ''} FuelType
 * @typedef {'recorded' | 'not-known' | ''} MileageAccuracy
 * @typedef {'valid' | 'expired' | 'exempt' | 'none' | ''} MotStatus
 * @typedef {'none' | 'outstanding' | 'unchecked' | ''} FinanceStatus
 * @typedef {'bank-transfer' | 'cash' | 'cheque' | 'card' | 'other' | ''} PaymentMethod
 * @typedef {'sold-as-seen' | 'warranty-given' | ''} SaleTerms
 * @typedef {'online' | 'post' | 'not-yet' | ''} DvlaNotification
 * @typedef {'complete' | 'incomplete' | 'risk-flagged'} Classification
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * @typedef {Object} Sale
 * @property {string | null} saleDate
 * @property {string} salePlace
 * @property {SellerCapacity} sellerCapacity
 */

/**
 * @typedef {Object} Seller
 * @property {string} name
 * @property {string} address
 * @property {string} postcode
 * @property {string} phone
 * @property {string} email
 * @property {YesNo} isRegisteredKeeper
 */

/**
 * @typedef {Object} Buyer
 * @property {string} name
 * @property {string} address
 * @property {string} postcode
 * @property {string} phone
 * @property {string} email
 */

/**
 * @typedef {Object} Vehicle
 * @property {string} registration
 * @property {string} make
 * @property {string} model
 * @property {string} colour
 * @property {string} vin
 * @property {number | null} firstRegisteredYear
 * @property {FuelType} fuelType
 * @property {number | null} mileage
 * @property {MileageAccuracy} mileageAccuracy
 */

/**
 * @typedef {Object} Checks
 * @property {YesNo} v5cPresent
 * @property {YesNo} v5cDetailsMatch
 * @property {MotStatus} motStatus
 * @property {string | null} motExpiryDate
 * @property {FinanceStatus} financeStatus
 * @property {string | null} financeCheckDate
 */

/**
 * @typedef {Object} Payment
 * @property {number | null} priceAsGbp
 * @property {number | null} depositAsGbp
 * @property {PaymentMethod} paymentMethod
 * @property {YesNo} paymentReceived
 */

/**
 * @typedef {Object} Condition
 * @property {SaleTerms} saleTerms
 * @property {string} knownFaults
 * @property {YesNo} descriptionMatchesAdvert
 */

/**
 * @typedef {Object} Dvla
 * @property {YesNo} newKeeperSlipGiven
 * @property {DvlaNotification} dvlaNotification
 */

/**
 * @typedef {Object} Signatures
 * @property {YesNo} sellerSigned
 * @property {YesNo} buyerSigned
 * @property {string | null} signatureDate
 * @property {string} note
 */

/**
 * @typedef {Object} BillOfSale
 * @property {Sale} sale
 * @property {Seller} seller
 * @property {Buyer} buyer
 * @property {Vehicle} vehicle
 * @property {Checks} checks
 * @property {Payment} payment
 * @property {Condition} condition
 * @property {Dvla} dvla
 * @property {Signatures} signatures
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
 * Build a fresh, fully-blank bill of sale.
 * Text / enum fields default to `''`; numeric and date fields to `null`.
 * @returns {BillOfSale}
 */
function emptyBillOfSale() {
  return {
    sale: { saleDate: null, salePlace: '', sellerCapacity: '' },
    seller: { name: '', address: '', postcode: '', phone: '', email: '', isRegisteredKeeper: '' },
    buyer: { name: '', address: '', postcode: '', phone: '', email: '' },
    vehicle: {
      registration: '', make: '', model: '', colour: '', vin: '',
      firstRegisteredYear: null, fuelType: '', mileage: null, mileageAccuracy: ''
    },
    checks: {
      v5cPresent: '', v5cDetailsMatch: '', motStatus: '', motExpiryDate: null,
      financeStatus: '', financeCheckDate: null
    },
    payment: { priceAsGbp: null, depositAsGbp: null, paymentMethod: '', paymentReceived: '' },
    condition: { saleTerms: '', knownFaults: '', descriptionMatchesAdvert: '' },
    dvla: { newKeeperSlipGiven: '', dvlaNotification: '' },
    signatures: { sellerSigned: '', buyerSigned: '', signatureDate: null, note: '' }
  };
}

/** Classification label for display. */
function classificationLabel(cls) {
  switch (cls) {
    case 'complete': return 'Complete';
    case 'incomplete': return 'Incomplete';
    case 'risk-flagged': return 'Risk flagged';
    default: return '';
  }
}

/** CSS class hint for the classification badge (reuses the risk palette). */
function classificationClass(cls) {
  switch (cls) {
    case 'complete': return 'risk-low';
    case 'incomplete': return 'risk-moderate';
    case 'risk-flagged': return 'risk-high';
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

/** Seller-capacity label. */
function sellerCapacityLabel(value) {
  switch (value) {
    case 'private': return 'Private individual';
    case 'trader': return 'Trader (selling in the course of a business)';
    default: return '';
  }
}

/** Fuel-type label. */
function fuelTypeLabel(value) {
  switch (value) {
    case 'petrol': return 'Petrol';
    case 'diesel': return 'Diesel';
    case 'hybrid': return 'Hybrid';
    case 'electric': return 'Electric';
    case 'other': return 'Other';
    default: return '';
  }
}

/** MOT-status label. */
function motStatusLabel(value) {
  switch (value) {
    case 'valid': return 'Valid MOT';
    case 'expired': return 'MOT expired';
    case 'exempt': return 'Exempt from MOT';
    case 'none': return 'No MOT';
    default: return '';
  }
}

/** Finance-status label. */
function financeStatusLabel(value) {
  switch (value) {
    case 'none': return 'No outstanding finance (checked)';
    case 'outstanding': return 'Finance outstanding';
    case 'unchecked': return 'Not checked';
    default: return '';
  }
}

/** Payment-method label. */
function paymentMethodLabel(value) {
  switch (value) {
    case 'bank-transfer': return 'Bank transfer';
    case 'cash': return 'Cash';
    case 'cheque': return 'Cheque';
    case 'card': return 'Card';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Sale-terms label. */
function saleTermsLabel(value) {
  switch (value) {
    case 'sold-as-seen': return 'Sold as seen';
    case 'warranty-given': return 'Warranty given';
    default: return '';
  }
}

/** DVLA-notification label. */
function dvlaNotificationLabel(value) {
  switch (value) {
    case 'online': return 'Told DVLA online';
    case 'post': return 'Told DVLA by post (V5C)';
    case 'not-yet': return 'Not yet told';
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

export { emptyBillOfSale, classificationLabel, classificationClass, yesNoLabel, sellerCapacityLabel, fuelTypeLabel, motStatusLabel, financeStatusLabel, paymentMethodLabel, saleTermsLabel, dvlaNotificationLabel, priorityLabel };
