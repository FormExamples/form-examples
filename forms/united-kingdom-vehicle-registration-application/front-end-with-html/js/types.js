// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the United Kingdom Vehicle
// Registration Application (DVLA V62 and first-registration variants).
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_united_kingdom_vehicle_registration_application.sql`.
// This file builds and exports the canonical empty application shape used by
// the wizard, so newly-added fields default correctly when older saved state is
// rehydrated from localStorage. It also exports display helpers (enum labels
// and validity-class / CSS-class hints).
//
// This is a COMPLETENESS AND VALIDITY instrument, not a clinical score and NOT
// a decision on the application. The engine checks that the application is
// complete, internally consistent, and accompanied by the documents and fee the
// DVLA asks for, classifies it as `ready-to-submit` / `incomplete` /
// `needs-supporting-documents`, and raises flags. Only the DVLA decides whether
// a vehicle is registered.

/**
 * @typedef {'v62-replacement-v5c' | 'v62-acquired-without-v5c' | 'v55-4-new-vehicle' | 'v55-5-used-vehicle' | 'imported-vehicle' | 'v627-1-rebuilt-or-kit' | ''} ApplicationType
 * @typedef {'lost' | 'stolen' | 'destroyed' | 'not-received' | 'damaged' | 'never-had' | 'has-v5c' | ''} V5cStatus
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'individual' | 'company' | 'organization' | 'trade' | 'other' | ''} KeeperType
 * @typedef {'photocard-driving-licence' | 'passport' | 'other-name-document' | 'none' | ''} IdentityDocumentType
 * @typedef {'photocard-driving-licence' | 'utility-bill' | 'bank-statement' | 'council-tax-bill' | 'none' | ''} AddressDocumentType
 * @typedef {'car' | 'motorcycle' | 'light-goods' | 'heavy-goods' | 'bus' | 'other' | ''} VehicleCategory
 * @typedef {'petrol' | 'diesel' | 'electric' | 'hybrid' | 'lpg' | 'other' | ''} FuelType
 * @typedef {'ecwvta' | 'gb-type-approval' | 'ni-type-approval' | 'iva' | 'msva' | 'exempt-over-10-years' | 'none' | ''} TypeApproval
 * @typedef {'valid' | 'not-required' | 'missing' | ''} MotStatus
 * @typedef {'in-force' | 'none' | ''} InsuranceStatus
 * @typedef {'notified' | 'not-notified' | 'not-applicable' | ''} NovaStatus
 * @typedef {'cheque' | 'postal-order' | 'post-office-card' | 'online-card' | 'none' | ''} FeePaymentMethod
 * @typedef {'ready-to-submit' | 'incomplete' | 'needs-supporting-documents'} ValidityClass
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1: which application, and why a V5C is needed.
 * @typedef {Object} Application
 * @property {ApplicationType} applicationType
 * @property {string | null} applicationDate         - ISO date; null when unset
 * @property {V5cStatus} v5cStatus
 * @property {number | null} weeksSinceChangeOfKeeper
 * @property {YesNo} newKeeperSlipProvided
 */

/**
 * Step 2: the applicant and their identity documents.
 * @typedef {Object} Applicant
 * @property {string} name
 * @property {string | null} birthDate               - ISO date; null when unset
 * @property {string} email
 * @property {string} phone
 * @property {string} postalAddressAsFullText
 * @property {string} postcode
 * @property {string} drivingLicenceNumber
 * @property {IdentityDocumentType} identityDocumentType
 * @property {AddressDocumentType} addressDocumentType
 */

/**
 * Step 3: registered keeper and owner.
 * @typedef {Object} Keeper
 * @property {string} keeperName
 * @property {KeeperType} keeperType
 * @property {string} companyRegistrationNumber
 * @property {YesNo} ownerDiffersFromKeeper
 * @property {string} ownerName
 * @property {YesNo} keeperAddressInNorthernIreland
 */

/**
 * Step 4: the vehicle.
 * @typedef {Object} Vehicle
 * @property {string} registrationNumber
 * @property {string} vehicleIdentificationNumber
 * @property {string} engineNumber
 * @property {string} make
 * @property {string} model
 * @property {string} colour
 * @property {VehicleCategory} vehicleCategory
 * @property {FuelType} fuelType
 * @property {number | null} engineCapacityAsCc
 * @property {string | null} dateOfManufacture       - ISO date; null when unset
 * @property {string | null} dateFirstUsed           - ISO date; null when unset
 * @property {YesNo} seriouslyDamaged
 */

/**
 * Step 5: supporting evidence.
 * @typedef {Object} Evidence
 * @property {YesNo} certificateOfNewnessProvided
 * @property {TypeApproval} typeApproval
 * @property {MotStatus} motStatus
 * @property {InsuranceStatus} insuranceStatus
 * @property {YesNo} buildEvidenceProvided
 * @property {number | null} donorVehicleCount
 */

/**
 * Step 6: imported vehicles.
 * @typedef {Object} ImportDetails
 * @property {string} countryOfExport
 * @property {string | null} importDate              - ISO date; null when unset
 * @property {NovaStatus} novaStatus
 * @property {string} novaReference
 */

/**
 * Step 7: fee and declaration.
 * @typedef {Object} FeeAndDeclaration
 * @property {FeePaymentMethod} feePaymentMethod
 * @property {number | null} feePaidAsPence
 * @property {YesNo} declarationSigned
 * @property {string | null} declarationDate         - ISO date; null when unset
 * @property {string} applicantNote
 */

/**
 * @typedef {Object} VehicleApplication
 * @property {Application} application
 * @property {Applicant} applicant
 * @property {Keeper} keeper
 * @property {Vehicle} vehicle
 * @property {Evidence} evidence
 * @property {ImportDetails} importDetails
 * @property {FeeAndDeclaration} feeAndDeclaration
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
 * @typedef {Object} RuleFinding
 * @property {string} ruleId
 * @property {string} dimension
 * @property {string} category
 * @property {string} description
 */

/**
 * @typedef {Object} ValidationResult
 * @property {ValidityClass} validityClass
 * @property {number | null} feeDueAsPence
 * @property {number} missingItemCount
 * @property {RuleFinding[]} rules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank application.
 * Text / enum fields default to `''`; numeric, date, and time fields to `null`.
 * @returns {VehicleApplication}
 */
function emptyApplication() {
  return {
    application: {
      applicationType: '',
      applicationDate: null,
      v5cStatus: '',
      weeksSinceChangeOfKeeper: null,
      newKeeperSlipProvided: ''
    },
    applicant: {
      name: '',
      birthDate: null,
      email: '',
      phone: '',
      postalAddressAsFullText: '',
      postcode: '',
      drivingLicenceNumber: '',
      identityDocumentType: '',
      addressDocumentType: ''
    },
    keeper: {
      keeperName: '',
      keeperType: '',
      companyRegistrationNumber: '',
      ownerDiffersFromKeeper: '',
      ownerName: '',
      keeperAddressInNorthernIreland: ''
    },
    vehicle: {
      registrationNumber: '',
      vehicleIdentificationNumber: '',
      engineNumber: '',
      make: '',
      model: '',
      colour: '',
      vehicleCategory: '',
      fuelType: '',
      engineCapacityAsCc: null,
      dateOfManufacture: null,
      dateFirstUsed: null,
      seriouslyDamaged: ''
    },
    evidence: {
      certificateOfNewnessProvided: '',
      typeApproval: '',
      motStatus: '',
      insuranceStatus: '',
      buildEvidenceProvided: '',
      donorVehicleCount: null
    },
    importDetails: {
      countryOfExport: '',
      importDate: null,
      novaStatus: '',
      novaReference: ''
    },
    feeAndDeclaration: {
      feePaymentMethod: '',
      feePaidAsPence: null,
      declarationSigned: '',
      declarationDate: null,
      applicantNote: ''
    }
  };
}

/** Validity-class label for display. */
function validityClassLabel(cls) {
  switch (cls) {
    case 'ready-to-submit': return 'Ready to submit';
    case 'incomplete': return 'Incomplete';
    case 'needs-supporting-documents': return 'Needs supporting documents';
    default: return '';
  }
}

/** CSS class hint for the validity-class badge (reuses the risk palette). */
function validityClassClass(cls) {
  switch (cls) {
    case 'ready-to-submit': return 'risk-low';
    case 'needs-supporting-documents': return 'risk-moderate';
    case 'incomplete': return 'risk-high';
    default: return '';
  }
}

/** Application-type label. */
function applicationTypeLabel(value) {
  switch (value) {
    case 'v62-replacement-v5c': return 'V62: replacement V5C (lost, stolen, destroyed, damaged, or not received)';
    case 'v62-acquired-without-v5c': return 'V62: vehicle acquired without a V5C';
    case 'v55-4-new-vehicle': return 'V55/4: first registration of a new vehicle';
    case 'v55-5-used-vehicle': return 'V55/5: first registration of a used vehicle';
    case 'imported-vehicle': return 'Imported vehicle (V55/4 new or V55/5 used)';
    case 'v627-1-rebuilt-or-kit': return 'V627/1: rebuilt or kit vehicle';
    default: return '';
  }
}

/** V5C-status label. */
function v5cStatusLabel(value) {
  switch (value) {
    case 'lost': return 'Lost';
    case 'stolen': return 'Stolen';
    case 'destroyed': return 'Destroyed';
    case 'not-received': return 'Not received after a change';
    case 'damaged': return 'Damaged';
    case 'never-had': return 'Vehicle acquired without a V5C';
    case 'has-v5c': return 'A V5C is held (first registration)';
    default: return '';
  }
}

/** Keeper-type label. */
function keeperTypeLabel(value) {
  switch (value) {
    case 'individual': return 'Individual';
    case 'company': return 'Company';
    case 'organization': return 'Organization';
    case 'trade': return 'Motor trade';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Identity-document label. */
function identityDocumentTypeLabel(value) {
  switch (value) {
    case 'photocard-driving-licence': return 'Photocard driving licence (photocopy)';
    case 'passport': return 'Passport';
    case 'other-name-document': return 'Other document proving name';
    case 'none': return 'None supplied';
    default: return '';
  }
}

/** Proof-of-address-document label. */
function addressDocumentTypeLabel(value) {
  switch (value) {
    case 'photocard-driving-licence': return 'Photocard driving licence (photocopy)';
    case 'utility-bill': return 'Recent utility bill';
    case 'bank-statement': return 'Bank or building society statement';
    case 'council-tax-bill': return 'Council tax bill';
    case 'none': return 'None supplied';
    default: return '';
  }
}

/** Vehicle-category label. */
function vehicleCategoryLabel(value) {
  switch (value) {
    case 'car': return 'Car';
    case 'motorcycle': return 'Motorcycle';
    case 'light-goods': return 'Light goods vehicle';
    case 'heavy-goods': return 'Heavy goods vehicle';
    case 'bus': return 'Bus or coach';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Fuel-type label. */
function fuelTypeLabel(value) {
  switch (value) {
    case 'petrol': return 'Petrol';
    case 'diesel': return 'Diesel';
    case 'electric': return 'Electric';
    case 'hybrid': return 'Hybrid';
    case 'lpg': return 'LPG';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Type-approval label. */
function typeApprovalLabel(value) {
  switch (value) {
    case 'ecwvta': return 'European Community Whole Vehicle Type Approval (certificate of conformity)';
    case 'gb-type-approval': return 'Great Britain type approval certificate';
    case 'ni-type-approval': return 'Northern Ireland type approval certificate';
    case 'iva': return 'Individual Vehicle Approval (IVA) certificate';
    case 'msva': return 'Motorcycle Single Vehicle Approval (MSVA) certificate';
    case 'exempt-over-10-years': return 'Exempt: vehicle is 10 years old or more';
    case 'none': return 'No type-approval evidence';
    default: return '';
  }
}

/** MOT label. */
function motStatusLabel(value) {
  switch (value) {
    case 'valid': return 'Valid MOT certificate enclosed';
    case 'not-required': return 'Not required';
    case 'missing': return 'No MOT certificate';
    default: return '';
  }
}

/** Insurance label. */
function insuranceStatusLabel(value) {
  switch (value) {
    case 'in-force': return 'Insurance in force (certificate or cover note)';
    case 'none': return 'No insurance';
    default: return '';
  }
}

/** NOVA label. */
function novaStatusLabel(value) {
  switch (value) {
    case 'notified': return 'HMRC notified through NOVA';
    case 'not-notified': return 'HMRC not yet notified';
    case 'not-applicable': return 'Not applicable';
    default: return '';
  }
}

/** Fee-payment label. */
function feePaymentMethodLabel(value) {
  switch (value) {
    case 'cheque': return 'Cheque payable to DVLA, Swansea';
    case 'postal-order': return 'Postal order payable to DVLA, Swansea';
    case 'post-office-card': return 'Card payment at a Post Office branch';
    case 'online-card': return 'Card payment online';
    case 'none': return 'No payment enclosed';
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

/** Format pence as a pound amount, or an em dash when unknown. */
function poundsLabel(pence) {
  if (pence === null || pence === undefined) return '—';
  return '£' + (pence / 100).toFixed(2);
}

export { emptyApplication, validityClassLabel, validityClassClass, applicationTypeLabel, v5cStatusLabel, keeperTypeLabel, identityDocumentTypeLabel, addressDocumentTypeLabel, vehicleCategoryLabel, fuelTypeLabel, typeApprovalLabel, motStatusLabel, insuranceStatusLabel, novaStatusLabel, feePaymentMethodLabel, yesNoLabel, priorityLabel, poundsLabel };
