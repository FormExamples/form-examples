// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the US Standard Certificate of Death
// (U.S. Department of Health and Human Services, CDC/NCHS, 2003 revision).
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_united_states_standard_certificate_of_death.sql`. This
// file builds and exports the canonical empty DeathCertificate shape used by the
// wizard, so newly-added fields default correctly when older saved state is
// rehydrated from localStorage. It also exports display helpers (enum labels).
//
// This is a DOCUMENTATION-SUPPORT and VALIDITY-CLASSIFICATION instrument, not a
// numeric score and NOT legal advice. It checks that the certificate is
// internally complete and consistent against the NCHS Physicians' Handbook on
// Medical Certification of Death, classifies it as `valid` / `incomplete` /
// `refer-to-medical-examiner-or-coroner`, derives the underlying cause, and
// raises flags. The registering state agency decides.

/**
 * @typedef {'female' | 'male' | 'unknown' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'natural' | 'accident' | 'suicide' | 'homicide' | 'pending-investigation' | 'could-not-be-determined' | ''} MannerOfDeath
 * @typedef {'valid' | 'incomplete' | 'refer-to-medical-examiner-or-coroner'} ValidityClass
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * @typedef {Object} DeathCertificate
 * @property {{ state: string }} jurisdiction
 * @property {{ decedentName: string, sex: Sex, dateOfBirth: string | null, ageYears: number | null, maritalStatus: string, veteranStatus: YesNo, stateOfResidence: string }} decedent
 * @property {{ placeOfDeathType: string, placeOfDeathFacility: string, dateOfDeath: string | null, timeOfDeath: string | null }} death
 * @property {{ certifierName: string, certifierType: string, certifierLicenseNumber: string, certificationDate: string | null, attendedDeceased: YesNo, lastSeenAliveDate: string | null }} certifier
 * @property {{ causeIaCondition: string, causeIaInterval: string, causeIbCondition: string, causeIbInterval: string, causeIcCondition: string, causeIcInterval: string, causeIdCondition: string, causeIdInterval: string }} partI
 * @property {{ partIiConditions: string, autopsyPerformed: YesNo, autopsyFindingsAvailable: YesNo }} partII
 * @property {{ mannerOfDeath: MannerOfDeath, tobaccoUseContributed: string, pregnancyStatus: string }} manner
 * @property {{ injuryDate: string | null, injuryTime: string | null, injuryPlace: string, injuryAtWork: YesNo, injuryLocation: string, injuryDescription: string, transportationInjuryRole: string }} injury
 * @property {{ referredToMedicalExaminer: YesNo, referralReason: string, certifierNote: string }} referral
 * @property {{ funeralDirectorName: string, funeralDirectorLicenseNumber: string, dispositionMethod: string, dispositionDate: string | null, dispositionPlace: string, filedDate: string | null }} funeral
 * @property {{ certifiedCopiesRequested: number | null, requesterRelationship: string, requesterIdentityVerified: YesNo, feePaidInUsd: number | null }} copies
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
 * @property {ValidityClass} validityClass
 * @property {string} underlyingCause            - '' when Part I empty
 * @property {boolean} referralIndicated
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank certificate.
 * Text / enum fields default to `''`; numeric, date, and time fields to `null`.
 * @returns {DeathCertificate}
 */
function emptyCertificate() {
  return {
    jurisdiction: { state: '' },
    decedent: {
      decedentName: '',
      sex: '',
      dateOfBirth: null,
      ageYears: null,
      maritalStatus: '',
      veteranStatus: '',
      stateOfResidence: ''
    },
    death: {
      placeOfDeathType: '',
      placeOfDeathFacility: '',
      dateOfDeath: null,
      timeOfDeath: null
    },
    certifier: {
      certifierName: '',
      certifierType: '',
      certifierLicenseNumber: '',
      certificationDate: null,
      attendedDeceased: '',
      lastSeenAliveDate: null
    },
    partI: {
      causeIaCondition: '',
      causeIaInterval: '',
      causeIbCondition: '',
      causeIbInterval: '',
      causeIcCondition: '',
      causeIcInterval: '',
      causeIdCondition: '',
      causeIdInterval: ''
    },
    partII: {
      partIiConditions: '',
      autopsyPerformed: '',
      autopsyFindingsAvailable: ''
    },
    manner: {
      mannerOfDeath: '',
      tobaccoUseContributed: '',
      pregnancyStatus: ''
    },
    injury: {
      injuryDate: null,
      injuryTime: null,
      injuryPlace: '',
      injuryAtWork: '',
      injuryLocation: '',
      injuryDescription: '',
      transportationInjuryRole: ''
    },
    referral: {
      referredToMedicalExaminer: '',
      referralReason: '',
      certifierNote: ''
    },
    funeral: {
      funeralDirectorName: '',
      funeralDirectorLicenseNumber: '',
      dispositionMethod: '',
      dispositionDate: null,
      dispositionPlace: '',
      filedDate: null
    },
    copies: {
      certifiedCopiesRequested: null,
      requesterRelationship: '',
      requesterIdentityVerified: '',
      feePaidInUsd: null
    }
  };
}

/** Option lists, shared by the wizard and the labels below. */
const OPTIONS = {
  yesNo: [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' }
  ],
  sex: [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'unknown', label: 'Unknown' }
  ],
  maritalStatus: [
    { value: 'married', label: 'Married' },
    { value: 'married-separated', label: 'Married but separated' },
    { value: 'widowed', label: 'Widowed' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'never-married', label: 'Never married' },
    { value: 'unknown', label: 'Unknown' }
  ],
  placeOfDeathType: [
    { value: 'hospital-inpatient', label: 'Hospital: inpatient' },
    { value: 'hospital-emergency-outpatient', label: 'Hospital: emergency room or outpatient' },
    { value: 'hospital-dead-on-arrival', label: 'Hospital: dead on arrival' },
    { value: 'decedent-home', label: 'Decedent’s home' },
    { value: 'hospice', label: 'Hospice facility' },
    { value: 'nursing-home', label: 'Nursing home or long-term care facility' },
    { value: 'other', label: 'Other' }
  ],
  certifierType: [
    { value: 'certifying-physician', label: 'Certifying physician' },
    { value: 'pronouncing-and-certifying-physician', label: 'Pronouncing and certifying physician' },
    { value: 'medical-examiner', label: 'Medical examiner' },
    { value: 'coroner', label: 'Coroner' },
    { value: 'other', label: 'Other' }
  ],
  manner: [
    { value: 'natural', label: 'Natural' },
    { value: 'accident', label: 'Accident' },
    { value: 'suicide', label: 'Suicide' },
    { value: 'homicide', label: 'Homicide' },
    { value: 'pending-investigation', label: 'Pending investigation' },
    { value: 'could-not-be-determined', label: 'Could not be determined' }
  ],
  tobacco: [
    { value: 'yes', label: 'Yes' },
    { value: 'probably', label: 'Probably' },
    { value: 'no', label: 'No' },
    { value: 'unknown', label: 'Unknown' }
  ],
  pregnancy: [
    { value: 'not-applicable', label: 'Not applicable (male, or female outside the age band)' },
    { value: 'not-pregnant-within-past-year', label: 'Not pregnant within the past year' },
    { value: 'pregnant-at-time-of-death', label: 'Pregnant at time of death' },
    { value: 'not-pregnant-but-pregnant-within-42-days', label: 'Not pregnant, but pregnant within 42 days of death' },
    { value: 'not-pregnant-but-pregnant-43-days-to-1-year', label: 'Not pregnant, but pregnant 43 days to 1 year before death' },
    { value: 'unknown', label: 'Unknown if pregnant within the past year' }
  ],
  transportationRole: [
    { value: 'driver-operator', label: 'Driver or operator' },
    { value: 'passenger', label: 'Passenger' },
    { value: 'pedestrian', label: 'Pedestrian' },
    { value: 'other', label: 'Other' }
  ],
  referralReason: [
    { value: 'none', label: 'None: no referral criterion met' },
    { value: 'violent-or-unnatural', label: 'Violent or unnatural death' },
    { value: 'accident', label: 'Accident or injury' },
    { value: 'suicide', label: 'Suicide' },
    { value: 'homicide', label: 'Homicide' },
    { value: 'suspicious', label: 'Suspicious circumstances' },
    { value: 'poisoning-or-overdose', label: 'Poisoning or drug overdose' },
    { value: 'unattended-by-physician', label: 'Unattended by a physician' },
    { value: 'sudden-unexpected-infant-death', label: 'Sudden unexpected infant death' },
    { value: 'work-related', label: 'Work-related death' },
    { value: 'medical-procedure-related', label: 'Related to a medical or surgical procedure' },
    { value: 'in-custody', label: 'Death in custody or police action' },
    { value: 'public-health-hazard', label: 'Public-health hazard' },
    { value: 'unidentified', label: 'Unidentified body' },
    { value: 'other', label: 'Other reportable circumstance' }
  ],
  dispositionMethod: [
    { value: 'burial', label: 'Burial' },
    { value: 'cremation', label: 'Cremation' },
    { value: 'entombment', label: 'Entombment' },
    { value: 'donation', label: 'Donation' },
    { value: 'removal-from-state', label: 'Removal from state' },
    { value: 'other', label: 'Other' }
  ],
  requesterRelationship: [
    { value: 'spouse', label: 'Spouse' },
    { value: 'child', label: 'Child' },
    { value: 'parent', label: 'Parent' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'legal-representative', label: 'Legal representative or executor' },
    { value: 'funeral-director', label: 'Funeral director' },
    { value: 'other', label: 'Other' }
  ]
};

/** Label for an option value within a named group; '' when unset or unknown. */
function optionLabel(group, value) {
  const found = (OPTIONS[group] || []).find((o) => o.value === value);
  return found ? found.label : '';
}

/** Validity-class label for display. */
function validityClassLabel(cls) {
  switch (cls) {
    case 'valid': return 'Valid';
    case 'incomplete': return 'Incomplete';
    case 'refer-to-medical-examiner-or-coroner': return 'Refer to medical examiner or coroner';
    default: return '';
  }
}

/** CSS class hint for the validity-class badge (reuses the risk palette). */
function validityClassClass(cls) {
  switch (cls) {
    case 'valid': return 'risk-low';
    case 'incomplete': return 'risk-moderate';
    case 'refer-to-medical-examiner-or-coroner': return 'risk-high';
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

export { emptyCertificate, OPTIONS, optionLabel, validityClassLabel, validityClassClass, priorityLabel };
