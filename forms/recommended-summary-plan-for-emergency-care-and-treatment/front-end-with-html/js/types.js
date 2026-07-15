// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Recommended Summary Plan for
// Emergency Care and Treatment (ReSPECT) form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_respect.sql` (the short base name `respect` is used for
// the SQL table because the full slug would exceed PostgreSQL's 63-byte
// identifier limit). This file builds and exports the canonical empty
// RespectPlan shape used by the wizard, so newly-added fields default correctly
// when older saved state is rehydrated from localStorage. It also exports
// display helpers (statusLabel, statusClass, priorityLabel, and per-enum
// label helpers).
//
// Unlike a scored assessment, ReSPECT is a documentation / completeness
// instrument: the engine grades a plan as `complete` or `incomplete`, reports a
// completeness percentage, records which mandatory rules fired, and raises
// safety / governance flags. There is no numeric clinical score.

/**
 * @typedef {'sustain-life' | 'balanced' | 'comfort' | ''} PriorityBalance
 * @typedef {'attempt' | 'do-not-attempt' | ''} CprRecommendation
 * @typedef {'appropriate' | 'not-appropriate' | ''} Ceiling
 * @typedef {'person' | 'legal-proxy' | 'consultees' | ''} Involvement
 * @typedef {'doctor' | 'nurse' | 'paramedic' | 'other' | ''} ClinicianRole
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'complete' | 'incomplete'} Status
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — personal details.
 * @typedef {Object} Personal
 * @property {string} personName
 * @property {string | null} dateOfBirth   - ISO date string; null when unset
 * @property {string} identifier           - NHS / CHI number or local identifier
 * @property {string} address
 * @property {string} keyContact
 */

/**
 * Step 2 — summary of relevant health.
 * @typedef {Object} Health
 * @property {string} healthSummary
 * @property {string} diagnoses
 * @property {string} existingDocuments    - ADRT / LPA / organ-donation wishes
 */

/**
 * Step 3 — preferences and what matters.
 * @typedef {Object} Preferences
 * @property {string} whatMatters
 * @property {string} carePreferences
 */

/**
 * Step 4 — clinical recommendations.
 * @typedef {Object} Recommendations
 * @property {PriorityBalance} priorityBalance
 * @property {string} recommendedInterventions
 * @property {string} notRecommendedInterventions
 */

/**
 * Step 5 — CPR recommendation.
 * @typedef {Object} Cpr
 * @property {CprRecommendation} cprRecommendation
 * @property {string} cprRationale
 * @property {YesNo} cprDiscussed
 */

/**
 * Step 6 — ceilings of treatment.
 * @typedef {Object} Ceilings
 * @property {Ceiling} hospitalTransfer
 * @property {Ceiling} criticalCareAdmission
 * @property {string} treatmentCeilings
 */

/**
 * Step 7 — capacity and involvement.
 * @typedef {Object} Capacity
 * @property {YesNo} hasCapacity
 * @property {string} capacityAssessment
 * @property {Involvement} involvement
 * @property {string} proxyDetails
 */

/**
 * Step 8 — clinician sign-off.
 * @typedef {Object} SignOff
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} clinicianRegistration
 * @property {string} signature
 * @property {string | null} signedAt      - ISO datetime string; null when unsigned
 * @property {string} seniorEndorsement
 * @property {string} emergencyContacts
 * @property {string | null} reviewDate     - ISO date string; null when unset
 */

/**
 * @typedef {Object} RespectPlan
 * @property {Personal} personal
 * @property {Health} health
 * @property {Preferences} preferences
 * @property {Recommendations} recommendations
 * @property {Cpr} cpr
 * @property {Ceilings} ceilings
 * @property {Capacity} capacity
 * @property {SignOff} signOff
 * @property {string} note                  - free-text clinician note (step 9)
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-IDENTITY-01
 * @property {string} rule         - short rule key
 * @property {boolean} satisfied
 * @property {string} category
 * @property {string} description
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
 * @typedef {Object} GradingResult
 * @property {Status} status
 * @property {number} completenessPercent   - 0..100
 * @property {number} satisfiedCount        - mandatory rules satisfied (0..8)
 * @property {number} mandatoryCount        - total mandatory rules (8)
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank plan.
 * Text / enum fields default to `''`; date / time fields default to `null`.
 * @returns {RespectPlan}
 */
function emptyPlan() {
  return {
    personal: {
      personName: '',
      dateOfBirth: null,
      identifier: '',
      address: '',
      keyContact: ''
    },
    health: {
      healthSummary: '',
      diagnoses: '',
      existingDocuments: ''
    },
    preferences: {
      whatMatters: '',
      carePreferences: ''
    },
    recommendations: {
      priorityBalance: '',
      recommendedInterventions: '',
      notRecommendedInterventions: ''
    },
    cpr: {
      cprRecommendation: '',
      cprRationale: '',
      cprDiscussed: ''
    },
    ceilings: {
      hospitalTransfer: '',
      criticalCareAdmission: '',
      treatmentCeilings: ''
    },
    capacity: {
      hasCapacity: '',
      capacityAssessment: '',
      involvement: '',
      proxyDetails: ''
    },
    signOff: {
      clinicianName: '',
      clinicianRole: '',
      clinicianRegistration: '',
      signature: '',
      signedAt: null,
      seniorEndorsement: '',
      emergencyContacts: '',
      reviewDate: null
    },
    note: ''
  };
}

/** Completeness-status label for display. */
function statusLabel(status) {
  switch (status) {
    case 'complete': return 'Complete';
    case 'incomplete': return 'Incomplete';
    default: return '';
  }
}

/** CSS class hint for the status badge (reuses the shared risk palette). */
function statusClass(status) {
  switch (status) {
    case 'complete': return 'risk-low';
    case 'incomplete': return 'risk-high';
    default: return '';
  }
}

/** Priority-balance label. */
function priorityBalanceLabel(value) {
  switch (value) {
    case 'sustain-life': return 'Prioritise sustaining life';
    case 'balanced': return 'Balanced';
    case 'comfort': return 'Prioritise comfort';
    default: return '';
  }
}

/** CPR-recommendation label. */
function cprRecommendationLabel(value) {
  switch (value) {
    case 'attempt': return 'CPR should be attempted';
    case 'do-not-attempt': return 'CPR should NOT be attempted (DNACPR)';
    default: return 'Not documented';
  }
}

/** Ceiling-of-treatment label. */
function ceilingLabel(value) {
  switch (value) {
    case 'appropriate': return 'Appropriate';
    case 'not-appropriate': return 'Not appropriate';
    default: return 'Not recorded';
  }
}

/** Capacity / involvement label. */
function involvementLabel(value) {
  switch (value) {
    case 'person': return 'The person';
    case 'legal-proxy': return 'Legal proxy (welfare attorney / deputy)';
    case 'consultees': return 'Consultees / those close to the person';
    default: return '';
  }
}

/** Clinician-role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'doctor': return 'Doctor';
    case 'nurse': return 'Nurse';
    case 'paramedic': return 'Paramedic';
    case 'other': return 'Other';
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

export { emptyPlan, statusLabel, statusClass, priorityBalanceLabel, cprRecommendationLabel, ceilingLabel, involvementLabel, clinicianRoleLabel, yesNoLabel, priorityLabel };
