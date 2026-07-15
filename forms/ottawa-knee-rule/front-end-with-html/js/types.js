// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Ottawa Knee Rule form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_ottawa_knee_rule.sql`. This file builds and exports the
// canonical empty AssessmentData shape used by the wizard, so that newly-added
// fields automatically default correctly when older saved state is rehydrated
// from localStorage. It also exports display helpers (decisionLabel,
// decisionClass, criterionLabel, clinicianRoleLabel, careSettingLabel,
// injuryMechanismLabel, sexLabel, injuredSideLabel, yesNoLabel, priorityLabel).
//
// The Ottawa Knee Rule is a DECISION RULE, not a score: a knee radiograph is
// indicated when ANY one of the five criteria is present. There is no total.

/**
 * @typedef {'doctor' | 'nurse-practitioner' | 'physiotherapist' | 'paramedic' | 'other' | ''} ClinicianRole
 * @typedef {'emergency-department' | 'minor-injuries-unit' | 'urgent-care' | 'other' | ''} CareSetting
 * @typedef {'blunt-trauma' | 'twisting' | 'fall' | 'other' | ''} InjuryMechanism
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'left' | 'right' | ''} InjuredSide
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'xray-indicated' | 'xray-not-indicated'} Decision
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} assessedAt          - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {InjuryMechanism} injuryMechanism
 * @property {number | null} hoursSinceInjury
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {Sex} sex
 * @property {InjuredSide} injuredSide
 */

/**
 * Step 3 — age (criterion 1).
 * @typedef {Object} Age
 * @property {number | null} ageYears      - criterion 1 fires when >= 55
 */

/**
 * Step 4 — bony tenderness (criteria 2 and 3).
 * @typedef {Object} Tenderness
 * @property {YesNo} patellarTenderness    - tenderness at the patella
 * @property {YesNo} otherBonyTenderness   - other bony tenderness (tests isolation)
 * @property {YesNo} fibularHeadTenderness - criterion 3
 */

/**
 * Step 5 — knee flexion (criterion 4).
 * @typedef {Object} Flexion
 * @property {YesNo} unableToFlex90        - criterion 4
 */

/**
 * Step 6 — weight-bearing (criterion 5).
 * @typedef {Object} WeightBearing
 * @property {YesNo} unableToBearWeight    - criterion 5
 */

/**
 * Step 7 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Age} age
 * @property {Tenderness} tenderness
 * @property {Flexion} flexion
 * @property {WeightBearing} weightBearing
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredCriterion
 * @property {string} id           - stable rule id, e.g. R-AGE-01
 * @property {string} criterion    - criterion slug, or 'decision'
 * @property {boolean} fired
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
 * @property {boolean} ageCriterion
 * @property {boolean} isolatedPatellarCriterion
 * @property {boolean} fibularHeadCriterion
 * @property {boolean} flexionCriterion
 * @property {boolean} weightBearingCriterion
 * @property {boolean} xrayIndicated
 * @property {Decision} decision
 * @property {FiredCriterion[]} firedCriteria
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.OttawaKneeRule`.

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
      careSetting: '',
      injuryMechanism: '',
      hoursSinceInjury: null
    },
    identification: {
      patientIdentifier: '',
      sex: '',
      injuredSide: ''
    },
    age: {
      ageYears: null
    },
    tenderness: {
      patellarTenderness: '',
      otherBonyTenderness: '',
      fibularHeadTenderness: ''
    },
    flexion: {
      unableToFlex90: ''
    },
    weightBearing: {
      unableToBearWeight: ''
    },
    note: {
      clinicalNotes: ''
    }
  };
}

/** Imaging-decision label for display. */
function decisionLabel(decision) {
  switch (decision) {
    case 'xray-indicated': return 'X-ray indicated';
    case 'xray-not-indicated': return 'X-ray not indicated';
    default: return '';
  }
}

/** CSS class hint for the decision badge (reuses the shared risk palette). */
function decisionClass(decision) {
  switch (decision) {
    case 'xray-indicated': return 'risk-high';
    case 'xray-not-indicated': return 'risk-low';
    default: return '';
  }
}

/** Human label for each criterion slug. */
function criterionLabel(criterion) {
  switch (criterion) {
    case 'age': return 'Age >= 55 years';
    case 'isolated-patellar-tenderness': return 'Isolated patellar tenderness';
    case 'fibular-head-tenderness': return 'Fibular head tenderness';
    case 'flexion': return 'Unable to flex the knee to 90 degrees';
    case 'weight-bearing': return 'Unable to bear weight (four steps)';
    default: return '';
  }
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'doctor': return 'Doctor';
    case 'nurse-practitioner': return 'Emergency nurse practitioner';
    case 'physiotherapist': return 'Physiotherapy practitioner';
    case 'paramedic': return 'Paramedic';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'emergency-department': return 'Emergency department';
    case 'minor-injuries-unit': return 'Minor-injuries unit';
    case 'urgent-care': return 'Urgent-care / walk-in centre';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Injury-mechanism label. */
function injuryMechanismLabel(mechanism) {
  switch (mechanism) {
    case 'blunt-trauma': return 'Blunt trauma';
    case 'twisting': return 'Twisting';
    case 'fall': return 'Fall';
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

/** Injured-side label. */
function injuredSideLabel(side) {
  switch (side) {
    case 'left': return 'Left';
    case 'right': return 'Right';
    default: return '';
  }
}

/** Yes/No label. */
function yesNoLabel(v) {
  switch (v) {
    case 'yes': return 'Yes';
    case 'no': return 'No';
    default: return 'Not recorded';
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

export { emptyAssessment, decisionLabel, decisionClass, criterionLabel, clinicianRoleLabel, careSettingLabel, injuryMechanismLabel, sexLabel, injuredSideLabel, yesNoLabel, priorityLabel };
