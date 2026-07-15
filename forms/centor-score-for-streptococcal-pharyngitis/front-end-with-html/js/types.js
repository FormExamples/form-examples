// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Centor Score for Streptococcal
// Pharyngitis form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_centor_score_for_streptococcal_pharyngitis.sql`. This
// file builds and exports the canonical empty AssessmentData shape used by the
// wizard, so that newly-added fields automatically default correctly when
// older saved state is rehydrated from localStorage. It also exports display
// helpers (riskBandLabel, riskBandClass, ageModifierLabel, clinicianRoleLabel,
// careSettingLabel, sexLabel, priorityLabel).

/**
 * @typedef {'gp' | 'nurse-practitioner' | 'pharmacist' | 'other' | ''} ClinicianRole
 * @typedef {'general-practice' | 'urgent-care' | 'pharmacy' | 'emergency-department' | 'other' | ''} CareSetting
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'low' | 'moderate' | 'high'} RiskBand
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} assessedAt        - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {number | null} ageYears   - whole years; drives the McIsaac modifier
 * @property {Sex} sex
 */

/**
 * Step 3 — Centor criterion 1: tonsillar exudate or swelling.
 * @typedef {Object} Exudate
 * @property {YesNo} tonsillarExudate
 */

/**
 * Step 4 — Centor criterion 2: tender anterior cervical lymphadenopathy.
 * @typedef {Object} Nodes
 * @property {YesNo} tenderAnteriorCervicalNodes
 */

/**
 * Step 5 — Centor criterion 3: fever (> 38 °C or history of fever).
 * @typedef {Object} Fever
 * @property {YesNo} feverOver38                        - history of fever / > 38 °C
 * @property {number | null} measuredTemperatureCelsius - optional; > 38.0 sets fever
 */

/**
 * Step 6 — Centor criterion 4: absence of cough (scores when cough is absent).
 * @typedef {Object} Cough
 * @property {YesNo} absenceOfCough
 */

/**
 * Step 7 — airway / peritonsillar (quinsy) red-flag inputs.
 * @typedef {Object} RedFlags
 * @property {YesNo} stridorOrBreathingDifficulty
 * @property {YesNo} droolingOrCannotSwallow
 * @property {YesNo} trismus
 * @property {YesNo} muffledVoice
 * @property {YesNo} unilateralNeckSwelling
 */

/**
 * Step 8 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Exudate} exudate
 * @property {Nodes} nodes
 * @property {Fever} fever
 * @property {Cough} cough
 * @property {RedFlags} redFlags
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredCriterion
 * @property {string} id           - stable rule id, e.g. R-TONSILLAR-EXUDATE-01
 * @property {string} criterion    - tonsillar-exudate | tender-nodes | fever | cough-absent | age-modifier | band
 * @property {number} points       - point contributed
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
 * @property {0 | 1} tonsillarExudatePoint
 * @property {0 | 1} tenderNodesPoint
 * @property {0 | 1} feverPoint
 * @property {0 | 1} coughAbsentPoint
 * @property {0 | 1 | 2 | 3 | 4} centorScore
 * @property {-1 | 0 | 1} ageModifier
 * @property {number} mcIsaacScore   - -1..5
 * @property {RiskBand} riskBand
 * @property {FiredCriterion[]} firedCriteria
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.CentorScoreForStreptococcalPharyngitis`.

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    context: {
      clinicianName: '',
      clinicianRole: '',
      assessedAt: '',
      careSetting: ''
    },
    identification: {
      patientIdentifier: '',
      ageYears: null,
      sex: ''
    },
    exudate: {
      tonsillarExudate: ''
    },
    nodes: {
      tenderAnteriorCervicalNodes: ''
    },
    fever: {
      feverOver38: '',
      measuredTemperatureCelsius: null
    },
    cough: {
      absenceOfCough: ''
    },
    redFlags: {
      stridorOrBreathingDifficulty: '',
      droolingOrCannotSwallow: '',
      trismus: '',
      muffledVoice: '',
      unilateralNeckSwelling: ''
    },
    note: {
      clinicalNote: ''
    }
  };
}

/** Risk-band label for display (banding uses the modified McIsaac score). */
function riskBandLabel(band) {
  switch (band) {
    case 'low': return 'Low risk (McIsaac ≤ 1)';
    case 'moderate': return 'Moderate risk (McIsaac 2–3)';
    case 'high': return 'High risk (McIsaac 4–5)';
    default: return '';
  }
}

/** CSS class hint for the risk-band badge (reuses the shared risk palette). */
function riskBandClass(band) {
  switch (band) {
    case 'low': return 'risk-low';
    case 'moderate': return 'risk-moderate';
    case 'high': return 'risk-high';
    default: return '';
  }
}

/** Human-readable label for the McIsaac age modifier. */
function ageModifierLabel(modifier) {
  if (modifier > 0) return `+${modifier} (age 3–14)`;
  if (modifier < 0) return `${modifier} (age ≥ 45)`;
  return '0 (age 15–44)';
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'gp': return 'General practitioner';
    case 'nurse-practitioner': return 'Nurse practitioner';
    case 'pharmacist': return 'Pharmacist';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'general-practice': return 'General practice';
    case 'urgent-care': return 'Urgent / out-of-hours care';
    case 'pharmacy': return 'Community pharmacy';
    case 'emergency-department': return 'Emergency department';
    case 'other': return 'Other';
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

export { emptyAssessment, riskBandLabel, riskBandClass, ageModifierLabel, clinicianRoleLabel, careSettingLabel, sexLabel, priorityLabel };
