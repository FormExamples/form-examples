// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Wells Score for Pulmonary
// Embolism (PE) form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_wells_score_for_pulmonary_embolism.sql` and the spec
// §3 data model. Criterion 3 (heart rate > 100) is captured as a measured
// numeric heart rate (beats/min); the other six criteria are yes/no enums.
// This file builds and exports the canonical empty AssessmentData shape used by
// the wizard, so newly-added fields default correctly when older saved state is
// rehydrated from localStorage. It also exports display helpers
// (twoLevelBandLabel, threeLevelBandLabel, bandClass, recommendedPathwayLabel,
// clinicianRoleLabel, careSettingLabel, sexLabel, ageBandLabel,
// haemodynamicStatusLabel, yesNoLabel, priorityLabel).

/**
 * @typedef {'doctor' | 'nurse-practitioner' | 'physician-associate' | 'other' | ''} ClinicianRole
 * @typedef {'emergency-department' | 'acute-medical-unit' | 'ambulatory' | 'other' | ''} CareSetting
 * @typedef {'18-39' | '40-64' | '65-74' | '75-84' | '85-plus' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'stable' | 'unstable' | ''} HaemodynamicStatus
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'unlikely' | 'likely'} TwoLevelBand
 * @typedef {'low' | 'moderate' | 'high'} ThreeLevelBand
 * @typedef {'d-dimer' | 'ctpa'} RecommendedPathway
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
 */

/**
 * Step 3 — haemodynamic status.
 * @typedef {Object} Haemodynamic
 * @property {HaemodynamicStatus} haemodynamicStatus
 */

/**
 * Step 4 — clinical criteria (criteria 1, 2, 4, 5, 6, 7).
 * @typedef {Object} Criteria
 * @property {YesNo} dvtSigns                 - criterion 1 (+3)
 * @property {YesNo} peMostLikely             - criterion 2 (+3)
 * @property {YesNo} immobilisationSurgery    - criterion 4 (+1.5)
 * @property {YesNo} previousDvtPe            - criterion 5 (+1.5)
 * @property {YesNo} haemoptysis              - criterion 6 (+1)
 * @property {YesNo} malignancy               - criterion 7 (+1)
 */

/**
 * Step 5 — observations. Criterion 3 (+1.5) fires when heartRate > 100.
 * @typedef {Object} Observations
 * @property {number | null} heartRate        - measured heart rate (beats/min); null when unmeasured
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
 * @property {Haemodynamic} haemodynamic
 * @property {Criteria} criteria
 * @property {Observations} observations
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredCriterion
 * @property {string} id           - stable rule id, e.g. R-DVT-SIGNS-01
 * @property {string} criterion    - criterion slug, or a band slug
 * @property {number} points       - points contributed (+3, +1.5, +1; 0 for audit rows)
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
 * @property {number} dvtSignsPoints
 * @property {number} peMostLikelyPoints
 * @property {number} heartRatePoints
 * @property {number} immobilisationSurgeryPoints
 * @property {number} previousDvtPePoints
 * @property {number} haemoptysisPoints
 * @property {number} malignancyPoints
 * @property {number} wellsScore                       - 0..12.5
 * @property {TwoLevelBand} twoLevelBand
 * @property {ThreeLevelBand} threeLevelBand
 * @property {RecommendedPathway} recommendedPathway
 * @property {FiredCriterion[]} firedCriteria
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

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
      sex: ''
    },
    haemodynamic: {
      haemodynamicStatus: ''
    },
    criteria: {
      dvtSigns: '',
      peMostLikely: '',
      immobilisationSurgery: '',
      previousDvtPe: '',
      haemoptysis: '',
      malignancy: ''
    },
    observations: {
      heartRate: null
    },
    note: {
      clinicalNotes: ''
    }
  };
}

/** Two-level (NICE NG158) band label for display. */
function twoLevelBandLabel(band) {
  switch (band) {
    case 'likely': return 'PE likely (Wells > 4)';
    case 'unlikely': return 'PE unlikely (Wells <= 4)';
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

/** CSS class hint for the band badge (reuses the shared risk palette). */
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

/** Recommended-pathway label. */
function recommendedPathwayLabel(pathway) {
  switch (pathway) {
    case 'ctpa': return 'CT pulmonary angiogram (CTPA)';
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
    case 'acute-medical-unit': return 'Acute medical unit';
    case 'ambulatory': return 'Ambulatory / same-day emergency care';
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

/** Haemodynamic-status label. */
function haemodynamicStatusLabel(status) {
  switch (status) {
    case 'stable': return 'Stable';
    case 'unstable': return 'Unstable';
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

export { emptyAssessment, twoLevelBandLabel, threeLevelBandLabel, bandClass, recommendedPathwayLabel, clinicianRoleLabel, careSettingLabel, sexLabel, ageBandLabel, haemodynamicStatusLabel, yesNoLabel, priorityLabel };
