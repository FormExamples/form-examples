// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Wells Score for Deep Vein
// Thrombosis (DVT) form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_wells_score_for_deep_vein_thrombosis.sql`. This file
// builds and exports the canonical empty AssessmentData shape used by the
// wizard, so that newly-added fields automatically default correctly when older
// saved state is rehydrated from localStorage. It also exports display helpers
// (twoLevelBandLabel, threeLevelBandLabel, bandClass, recommendedInvestigationLabel,
// clinicianRoleLabel, careSettingLabel, sexLabel, ageBandLabel, symptomaticLegLabel,
// yesNoLabel, priorityLabel).

/**
 * @typedef {'doctor' | 'nurse-practitioner' | 'physician-associate' | 'other' | ''} ClinicianRole
 * @typedef {'emergency-department' | 'ambulatory' | 'acute-medical-unit' | 'dvt-clinic' | 'other' | ''} CareSetting
 * @typedef {'18-39' | '40-64' | '65-74' | '75-84' | '85-plus' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'left' | 'right' | ''} SymptomaticLeg
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'likely' | 'unlikely'} TwoLevelBand
 * @typedef {'low' | 'moderate' | 'high'} ThreeLevelBand
 * @typedef {'proximal-leg-vein-ultrasound' | 'd-dimer'} RecommendedInvestigation
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
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 * @property {SymptomaticLeg} symptomaticLeg
 */

/**
 * Step 3 — predisposing factors (criteria 1, 2, 3, 9).
 * @typedef {Object} Predisposing
 * @property {YesNo} activeCancer                    - criterion 1 (+1)
 * @property {YesNo} paralysisOrImmobilisation       - criterion 2 (+1)
 * @property {YesNo} recentlyBedriddenOrSurgery      - criterion 3 (+1)
 * @property {YesNo} previouslyDocumentedDvt         - criterion 9 (+1)
 */

/**
 * Step 4 — leg examination (criteria 4–8).
 * @typedef {Object} Examination
 * @property {YesNo} localisedTenderness             - criterion 4 (+1)
 * @property {YesNo} entireLegSwollen                - criterion 5 (+1)
 * @property {YesNo} calfSwellingOver3cm             - criterion 6 (+1)
 * @property {YesNo} pittingOedema                   - criterion 7 (+1)
 * @property {YesNo} collateralSuperficialVeins      - criterion 8 (+1)
 */

/**
 * Step 5 — alternative diagnosis (−2 adjustment).
 * @typedef {Object} Alternative
 * @property {YesNo} alternativeDiagnosisAsLikely    - alternative at least as likely (−2)
 */

/**
 * Step 6 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Predisposing} predisposing
 * @property {Examination} examination
 * @property {Alternative} alternative
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredCriterion
 * @property {string} id           - stable rule id, e.g. R-ACTIVE-CANCER-01
 * @property {string} criterion    - criterion slug, or 'band'
 * @property {number} points       - point contributed (+1 or -2, 0 for audit rows)
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
 * @property {Record<string, number>} criterionPoints
 * @property {number} wellsScore                       - -2..9
 * @property {TwoLevelBand} twoLevelBand
 * @property {ThreeLevelBand} threeLevelBand
 * @property {RecommendedInvestigation} recommendedInvestigation
 * @property {FiredCriterion[]} firedCriteria
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.WellsScoreForDeepVeinThrombosis`.
(function () {
'use strict';
window.WellsScoreForDeepVeinThrombosis =
  window.WellsScoreForDeepVeinThrombosis || {};

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
      ageBand: '',
      sex: '',
      symptomaticLeg: ''
    },
    predisposing: {
      activeCancer: '',
      paralysisOrImmobilisation: '',
      recentlyBedriddenOrSurgery: '',
      previouslyDocumentedDvt: ''
    },
    examination: {
      localisedTenderness: '',
      entireLegSwollen: '',
      calfSwellingOver3cm: '',
      pittingOedema: '',
      collateralSuperficialVeins: ''
    },
    alternative: {
      alternativeDiagnosisAsLikely: ''
    },
    note: {
      clinicalNotes: ''
    }
  };
}

/** Two-level (NICE NG158) band label for display. */
function twoLevelBandLabel(band) {
  switch (band) {
    case 'likely': return 'DVT likely (Wells >= 2)';
    case 'unlikely': return 'DVT unlikely (Wells <= 1)';
    default: return '';
  }
}

/** Three-level (original Wells) band label for display. */
function threeLevelBandLabel(band) {
  switch (band) {
    case 'low': return 'Low probability';
    case 'moderate': return 'Moderate probability';
    case 'high': return 'High probability';
    default: return '';
  }
}

/** CSS class hint for the two-level band badge (reuses the shared risk palette). */
function bandClass(band) {
  switch (band) {
    case 'likely':
    case 'high':
      return 'risk-high';
    case 'moderate':
      return 'risk-moderate';
    case 'unlikely':
    case 'low':
      return 'risk-low';
    default:
      return '';
  }
}

/** Recommended-investigation label. */
function recommendedInvestigationLabel(inv) {
  switch (inv) {
    case 'proximal-leg-vein-ultrasound': return 'Proximal leg vein ultrasound';
    case 'd-dimer': return 'D-dimer';
    default: return '';
  }
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'doctor': return 'Doctor';
    case 'nurse-practitioner': return 'Nurse practitioner';
    case 'physician-associate': return 'Physician associate';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'emergency-department': return 'Emergency department';
    case 'ambulatory': return 'Ambulatory / same-day emergency care';
    case 'acute-medical-unit': return 'Acute medical unit';
    case 'dvt-clinic': return 'DVT / anticoagulation clinic';
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

/** Adult age-band label. */
function ageBandLabel(band) {
  switch (band) {
    case '18-39': return '18-39';
    case '40-64': return '40-64';
    case '65-74': return '65-74';
    case '75-84': return '75-84';
    case '85-plus': return '85 and over';
    default: return '';
  }
}

/** Symptomatic-leg label. */
function symptomaticLegLabel(leg) {
  switch (leg) {
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

Object.assign(window.WellsScoreForDeepVeinThrombosis, {
  emptyAssessment,
  twoLevelBandLabel,
  threeLevelBandLabel,
  bandClass,
  recommendedInvestigationLabel,
  clinicianRoleLabel,
  careSettingLabel,
  sexLabel,
  ageBandLabel,
  symptomaticLegLabel,
  yesNoLabel,
  priorityLabel
});
})();
