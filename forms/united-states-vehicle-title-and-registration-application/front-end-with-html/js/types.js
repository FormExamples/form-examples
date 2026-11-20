// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the United States vehicle title and
// registration application.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_vehicle_title_application.sql`. This file builds and
// exports the canonical empty TitleApplication shape used by the wizard, so
// newly-added fields default correctly when older saved state is rehydrated
// from localStorage. It also exports display helpers (enum labels and
// class / CSS-class hints).
//
// This is a COMPLETENESS / VALIDITY / ELIGIBILITY instrument, not a legal
// determination. The engine checks that the application is complete and
// consistent with federal rules (VIN, odometer, NMVTIS) and the encoded state
// rules, classifies it as `ready-to-submit` / `incomplete` /
// `title-brand-or-lien-issue`, and raises flags. The issuing state agency
// decides whether to issue a title. Documentation support, not legal advice.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'title-and-registration' | 'title-only' | 'registration-only' | ''} TransactionType
 * @typedef {'new' | 'used' | ''} VehicleCondition
 * @typedef {'dealer-purchase' | 'private-purchase' | 'gift' | 'inheritance' | 'other' | ''} AcquisitionMethod
 * @typedef {'individual' | 'business' | ''} OwnerType
 * @typedef {'and' | 'or' | ''} Conjunction
 * @typedef {'drivers-license' | 'state-id' | 'passport' | 'fein' | 'other' | ''} IdentificationType
 * @typedef {'passenger' | 'light-truck' | 'heavy-truck' | 'motorcycle' | 'trailer' | 'motorhome' | ''} VehicleClass
 * @typedef {'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'other' | ''} FuelType
 * @typedef {'actual' | 'exceeds-mechanical-limits' | 'not-actual' | ''} OdometerStatus
 * @typedef {'state-title' | 'manufacturer-statement-of-origin' | 'out-of-state-title' | 'none' | ''} TitleDocument
 * @typedef {'none' | 'salvage' | 'junk' | 'rebuilt' | 'flood' | 'odometer-not-actual' | 'lemon-law-buyback' | 'hail' | 'other' | ''} TitleBrand
 * @typedef {'clear' | 'brand-or-theft-found' | 'not-checked' | ''} NmvtisCheck
 * @typedef {'passed' | 'not-done' | 'not-applicable' | ''} BrandInspection
 * @typedef {'none' | 'new-lien' | 'existing-lien-released' | 'existing-lien-unreleased' | ''} LienStatus
 * @typedef {'provided' | 'not-provided' | ''} InsuranceProof
 * @typedef {'passed' | 'not-done' | 'exempt' | 'not-required' | ''} InspectionStatus
 * @typedef {'done' | 'not-done' | 'not-required' | ''} VinVerification
 * @typedef {'paid-to-dealer' | 'due-at-title' | 'exempt' | 'not-calculated' | ''} SalesTaxStatus
 * @typedef {'ready-to-submit' | 'incomplete' | 'title-brand-or-lien-issue'} ApplicationClass
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * @typedef {Object} StateRule
 * @property {string} name
 * @property {string} agency
 * @property {number | null} titleDeadlineDays
 * @property {number | null} salesTaxBasePercent
 * @property {string} inspection
 * @property {boolean} insuranceAtRegistration
 * @property {boolean} outOfStateVinVerification
 */

/**
 * Step 1 — the application.
 * @typedef {Object} ApplicationDetails
 * @property {string} state                       - two-letter state code
 * @property {TransactionType} transactionType
 * @property {VehicleCondition} vehicleCondition
 * @property {AcquisitionMethod} acquisitionMethod
 * @property {YesNo} outOfStateTransfer
 * @property {string} previousState               - two-letter code of the state that last titled it
 * @property {string | null} acquisitionDate      - ISO date; null when unset
 * @property {string | null} applicationDate      - ISO date; null when unset
 */

/**
 * Step 2 — owner identification.
 * @typedef {Object} OwnerDetails
 * @property {OwnerType} ownerType
 * @property {string} ownerName
 * @property {string} coOwnerName
 * @property {Conjunction} coOwnerConjunction
 * @property {IdentificationType} identificationType
 * @property {string} identificationNumber
 * @property {string} mailingAddress
 * @property {YesNo} ownerSigned
 * @property {YesNo} coOwnerSigned
 */

/**
 * Step 3 — the vehicle.
 * @typedef {Object} VehicleDetails
 * @property {string} vin
 * @property {number | null} modelYear
 * @property {string} make
 * @property {string} model
 * @property {string} bodyType
 * @property {VehicleClass} vehicleClass
 * @property {FuelType} fuelType
 * @property {number | null} gvwrLbs
 * @property {string} color
 */

/**
 * Step 4 — odometer disclosure (49 CFR Part 580).
 * @typedef {Object} OdometerDetails
 * @property {number | null} odometerReading      - whole miles
 * @property {OdometerStatus} odometerStatus
 * @property {YesNo} sellerOdometerStatement
 * @property {YesNo} buyerOdometerAcknowledged
 */

/**
 * Step 5 — title history and brands.
 * @typedef {Object} TitleHistory
 * @property {TitleDocument} titleDocument
 * @property {YesNo} priorTitleSurrendered
 * @property {TitleBrand} titleBrand
 * @property {YesNo} brandDisclosed
 * @property {NmvtisCheck} nmvtisCheck
 * @property {BrandInspection} brandInspection
 */

/**
 * Step 6 — lien.
 * @typedef {Object} LienDetails
 * @property {LienStatus} lienStatus
 * @property {string} lienholderName
 * @property {YesNo} lienElectronic
 */

/**
 * Step 7 — insurance and inspections.
 * @typedef {Object} ComplianceDetails
 * @property {InsuranceProof} insuranceProof
 * @property {string | null} insuranceExpiryDate  - ISO date; null when unset
 * @property {InspectionStatus} emissionsInspection
 * @property {InspectionStatus} safetyInspection
 * @property {VinVerification} vinVerification
 */

/**
 * Step 8 — fees and tax.
 * @typedef {Object} FeesTaxDetails
 * @property {number | null} purchasePriceUsd
 * @property {SalesTaxStatus} salesTaxStatus
 * @property {number | null} salesTaxRatePercent
 * @property {number | null} salesTaxAmountUsd
 * @property {string} taxExemptionReason
 * @property {number | null} titleFeeUsd
 * @property {number | null} registrationFeeUsd
 * @property {YesNo} feesTendered
 * @property {string} applicantNote
 */

/**
 * @typedef {Object} TitleApplication
 * @property {ApplicationDetails} application
 * @property {OwnerDetails} owner
 * @property {VehicleDetails} vehicle
 * @property {OdometerDetails} odometer
 * @property {TitleHistory} titleHistory
 * @property {LienDetails} lien
 * @property {ComplianceDetails} compliance
 * @property {FeesTaxDetails} feesTax
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
 * @property {ApplicationClass} applicationClass
 * @property {string} vinStatus
 * @property {boolean} odometerDisclosureRequired
 * @property {boolean} brandOrLienIssue
 * @property {number} outstandingItemCount
 * @property {boolean} stateRuleKnown
 * @property {number | null} estimatedStateTaxUsd
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank application.
 * Text / enum fields default to `''`; numeric, date, and time fields to `null`.
 * @returns {TitleApplication}
 */
function emptyApplication() {
  return {
    application: {
      state: '',
      transactionType: '',
      vehicleCondition: '',
      acquisitionMethod: '',
      outOfStateTransfer: '',
      previousState: '',
      acquisitionDate: null,
      applicationDate: null
    },
    owner: {
      ownerType: '',
      ownerName: '',
      coOwnerName: '',
      coOwnerConjunction: '',
      identificationType: '',
      identificationNumber: '',
      mailingAddress: '',
      ownerSigned: '',
      coOwnerSigned: ''
    },
    vehicle: {
      vin: '',
      modelYear: null,
      make: '',
      model: '',
      bodyType: '',
      vehicleClass: '',
      fuelType: '',
      gvwrLbs: null,
      color: ''
    },
    odometer: {
      odometerReading: null,
      odometerStatus: '',
      sellerOdometerStatement: '',
      buyerOdometerAcknowledged: ''
    },
    titleHistory: {
      titleDocument: '',
      priorTitleSurrendered: '',
      titleBrand: '',
      brandDisclosed: '',
      nmvtisCheck: '',
      brandInspection: ''
    },
    lien: {
      lienStatus: '',
      lienholderName: '',
      lienElectronic: ''
    },
    compliance: {
      insuranceProof: '',
      insuranceExpiryDate: null,
      emissionsInspection: '',
      safetyInspection: '',
      vinVerification: ''
    },
    feesTax: {
      purchasePriceUsd: null,
      salesTaxStatus: '',
      salesTaxRatePercent: null,
      salesTaxAmountUsd: null,
      taxExemptionReason: '',
      titleFeeUsd: null,
      registrationFeeUsd: null,
      feesTendered: '',
      applicantNote: ''
    }
  };
}

/** Application-class label for display. */
function applicationClassLabel(cls) {
  switch (cls) {
    case 'ready-to-submit': return 'Ready to submit';
    case 'incomplete': return 'Incomplete';
    case 'title-brand-or-lien-issue': return 'Title brand or lien issue';
    default: return '';
  }
}

/** CSS class hint for the class badge (reuses the risk palette). */
function applicationClassClass(cls) {
  switch (cls) {
    case 'ready-to-submit': return 'risk-low';
    case 'incomplete': return 'risk-moderate';
    case 'title-brand-or-lien-issue': return 'risk-high';
    default: return '';
  }
}

/** VIN-status label. */
function vinStatusLabel(value) {
  switch (value) {
    case 'valid': return 'Valid (check digit passes)';
    case 'not-standardized': return 'Pre-1981 (no standard format)';
    case 'invalid-length': return 'Not 17 characters';
    case 'invalid-characters': return 'Contains I, O, Q or a symbol';
    case 'check-digit-mismatch': return 'Check digit fails';
    default: return 'Not entered';
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

/** Yes / No label. */
function yesNoLabel(value) {
  switch (value) {
    case 'yes': return 'Yes';
    case 'no': return 'No';
    default: return '';
  }
}

/** Title-brand label. */
function titleBrandLabel(value) {
  switch (value) {
    case 'none': return 'No brand';
    case 'salvage': return 'Salvage';
    case 'junk': return 'Junk';
    case 'rebuilt': return 'Rebuilt or reconstructed';
    case 'flood': return 'Flood';
    case 'odometer-not-actual': return 'Odometer not actual mileage';
    case 'lemon-law-buyback': return 'Lemon-law buyback';
    case 'hail': return 'Hail damage';
    case 'other': return 'Other brand';
    default: return '';
  }
}

/** Lien-status label. */
function lienStatusLabel(value) {
  switch (value) {
    case 'none': return 'No lien';
    case 'new-lien': return 'New lien on this purchase';
    case 'existing-lien-released': return 'Existing lien, released';
    case 'existing-lien-unreleased': return 'Existing lien, not released';
    default: return '';
  }
}

/** Odometer-status label. */
function odometerStatusLabel(value) {
  switch (value) {
    case 'actual': return 'Actual mileage';
    case 'exceeds-mechanical-limits': return 'Exceeds mechanical limits';
    case 'not-actual': return 'Not the actual mileage';
    default: return '';
  }
}

export { emptyApplication, applicationClassLabel, applicationClassClass, vinStatusLabel, priorityLabel, yesNoLabel, titleBrandLabel, lienStatusLabel, odometerStatusLabel };
