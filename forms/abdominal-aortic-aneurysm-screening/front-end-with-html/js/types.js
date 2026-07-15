// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Abdominal Aortic Aneurysm (AAA)
// Screening form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_abdominal_aortic_aneurysm_screening.sql`. This file
// builds and exports the canonical empty AssessmentData shape used by the
// wizard, so that newly-added fields automatically default correctly when older
// saved state is rehydrated from localStorage. It also exports display helpers
// (categoryLabel, categoryClass, surveillanceBandLabel, technicianRoleLabel,
// eligibilityRouteLabel, scanTypeLabel, sexLabel, priorityLabel).

/**
 * @typedef {'screening-technician' | 'clinical-skills-trainer' | 'other' | ''} TechnicianRole
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'routine-year-of-65' | 'self-referral-over-65' | 'other' | ''} EligibilityRoute
 * @typedef {'first-scan' | 'surveillance-rescan' | ''} ScanType
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'normal' | 'small' | 'medium' | 'large' | 'non-visualised'} Category
 * @typedef {'discharge' | 'annual' | 'three-monthly' | 'refer-vascular' | 'rescan'} SurveillanceBand
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — scan context.
 * @typedef {Object} Context
 * @property {string} technicianName
 * @property {TechnicianRole} technicianRole
 * @property {string} clinicSite
 * @property {string} scannedAt        - ISO-ish datetime-local string; '' when unset
 * @property {string} deviceIdentifier
 */

/**
 * Step 2 — patient identification and eligibility.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {number | null} age
 * @property {Sex} sex
 * @property {EligibilityRoute} eligibilityRoute
 * @property {ScanType} scanType
 */

/**
 * Step 3 — consent.
 * @typedef {Object} Consent
 * @property {YesNo} consentGiven
 * @property {YesNo} leafletProvided
 * @property {string} consentNote
 */

/**
 * Step 4 — ultrasound measurement.
 * @typedef {Object} Measurement
 * @property {YesNo} aortaVisualised
 * @property {number | null} maxAorticDiameterCm  - maximum antero-posterior diameter (cm); classified value
 * @property {number | null} priorMaxDiameterCm   - prior maximum diameter (cm); surveillance patients
 * @property {string} priorScanDate               - ISO date string; '' when unset
 */

/**
 * Step 5 — clinical observations.
 * @typedef {Object} Observations
 * @property {YesNo} symptomatic
 * @property {string} incidentalFindings
 */

/**
 * Step 6 — result note.
 * @typedef {Object} Result
 * @property {string} resultNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Consent} consent
 * @property {Measurement} measurement
 * @property {Observations} observations
 * @property {Result} result
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-CLASSIFY-SMALL-01
 * @property {string} instrument   - classification
 * @property {string} band         - normal | small | medium | large
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
 * @property {Category} category
 * @property {SurveillanceBand} surveillanceBand
 * @property {string} recommendedAction
 * @property {number | null} maxAorticDiameterCm
 * @property {number | null} growthCm
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric and date fields default to `null` / `''`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    context: {
      technicianName: '',
      technicianRole: '',
      clinicSite: '',
      scannedAt: '',
      deviceIdentifier: ''
    },
    identification: {
      patientIdentifier: '',
      age: null,
      sex: '',
      eligibilityRoute: '',
      scanType: ''
    },
    consent: {
      consentGiven: '',
      leafletProvided: '',
      consentNote: ''
    },
    measurement: {
      aortaVisualised: '',
      maxAorticDiameterCm: null,
      priorMaxDiameterCm: null,
      priorScanDate: ''
    },
    observations: {
      symptomatic: '',
      incidentalFindings: ''
    },
    result: {
      resultNote: ''
    }
  };
}

/** Aneurysm-category label for display. */
function categoryLabel(category) {
  switch (category) {
    case 'normal': return 'Normal (< 3.0 cm)';
    case 'small': return 'Small aneurysm (3.0–4.4 cm)';
    case 'medium': return 'Medium aneurysm (4.5–5.4 cm)';
    case 'large': return 'Large aneurysm (≥ 5.5 cm)';
    case 'non-visualised': return 'Non-visualised';
    default: return '';
  }
}

/** CSS class hint for the category badge (reuses the shared risk palette). */
function categoryClass(category) {
  switch (category) {
    case 'normal': return 'risk-low';
    case 'small': return 'risk-moderate';
    case 'medium': return 'risk-high';
    case 'large': return 'risk-critical';
    case 'non-visualised': return 'risk-medium';
    default: return '';
  }
}

/** Surveillance / referral band label. */
function surveillanceBandLabel(band) {
  switch (band) {
    case 'discharge': return 'Discharge — no further surveillance';
    case 'annual': return 'Annual (12-monthly) surveillance';
    case 'three-monthly': return 'Three-monthly surveillance';
    case 'refer-vascular': return 'Refer to vascular surgery';
    case 'rescan': return 'Arrange a re-scan';
    default: return '';
  }
}

/** Screening-technician role label. */
function technicianRoleLabel(role) {
  switch (role) {
    case 'screening-technician': return 'Screening technician';
    case 'clinical-skills-trainer': return 'Clinical skills trainer';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Eligibility-route label. */
function eligibilityRouteLabel(route) {
  switch (route) {
    case 'routine-year-of-65': return 'Routine — year of 65 invitation';
    case 'self-referral-over-65': return 'Self-referral — over 65';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Scan-type label. */
function scanTypeLabel(type) {
  switch (type) {
    case 'first-scan': return 'First scan';
    case 'surveillance-rescan': return 'Surveillance re-scan';
    default: return '';
  }
}

/** Patient-sex label. */
function sexLabel(sex) {
  switch (sex) {
    case 'female': return 'Female';
    case 'male': return 'Male';
    case 'intersex': return 'Intersex';
    case 'unknown': return 'Unknown';
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

export { emptyAssessment, categoryLabel, categoryClass, surveillanceBandLabel, technicianRoleLabel, eligibilityRouteLabel, scanTypeLabel, sexLabel, priorityLabel };
