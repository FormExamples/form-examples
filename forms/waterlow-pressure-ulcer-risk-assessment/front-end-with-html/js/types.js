// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Waterlow Pressure Ulcer Risk
// Assessment form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_waterlow_pressure_ulcer_risk_assessment.sql`. This file
// builds and exports the canonical empty AssessmentData shape used by the
// wizard, so that newly-added fields automatically default correctly when older
// saved state is rehydrated from localStorage. It also exports the display
// option lists and label helpers (riskBandLabel, riskBandClass,
// preventionActionLabel, priorityLabel, optionLabel, and the per-field option
// arrays).

/**
 * @typedef {'registered-nurse' | 'healthcare-assistant' | 'tissue-viability' | 'other' | ''} NurseRole
 * @typedef {'acute-ward' | 'community' | 'care-home' | 'hospice' | 'other' | ''} CareSetting
 * @typedef {'admission' | 'routine' | 'change-in-condition' | ''} AssessmentReason
 * @typedef {'14-49' | '50-64' | '65-74' | '75-80' | '81-plus' | ''} AgeBand
 * @typedef {'female' | 'male' | ''} Sex
 * @typedef {'average' | 'above-average' | 'obese' | 'below-average' | ''} BuildWeightForHeight
 * @typedef {'healthy' | 'tissue-paper' | 'dry' | 'oedematous' | 'clammy-pyrexial' | 'discoloured' | 'broken' | ''} SkinType
 * @typedef {'complete-catheterised' | 'incontinent-urine' | 'incontinent-faeces' | 'doubly-incontinent' | ''} Continence
 * @typedef {'fully-mobile' | 'restless' | 'apathetic' | 'restricted' | 'bedbound' | 'chairbound' | ''} Mobility
 * @typedef {'none' | 'smoking' | 'anaemia' | 'peripheral-vascular-disease' | 'single-organ-failure' | 'multiple-organ-failure' | 'terminal-cachexia' | ''} TissueMalnutrition
 * @typedef {'none' | 'mild' | 'moderate' | 'severe' | ''} NeurologicalDeficit
 * @typedef {'none' | 'orthopaedic-spinal' | 'on-table-over-2h' | 'on-table-over-6h' | ''} MajorSurgeryTrauma
 * @typedef {'none' | 'high-dose-steroids-cytotoxics-anti-inflammatory' | ''} Medication
 * @typedef {'no' | 'yes' | ''} ExistingPressureDamage
 * @typedef {'low' | 'at-risk' | 'high' | 'very-high'} RiskBand
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} nurseName
 * @property {NurseRole} nurseRole
 * @property {string} assessedAt          - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {AssessmentReason} assessmentReason
 */

/**
 * Step 2 — patient identification (age band and sex are scored categories).
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 */

/**
 * Steps 3-6 — weighted core category inputs.
 * @typedef {Object} Core
 * @property {BuildWeightForHeight} buildWeightForHeight
 * @property {SkinType} skinType
 * @property {Continence} continence
 * @property {Mobility} mobility
 */

/**
 * Steps 7-10 — special-risk group inputs plus the existing-damage flag.
 * @typedef {Object} Special
 * @property {TissueMalnutrition} tissueMalnutrition
 * @property {NeurologicalDeficit} neurologicalDeficit
 * @property {MajorSurgeryTrauma} majorSurgeryTrauma
 * @property {Medication} medication
 * @property {ExistingPressureDamage} existingPressureDamage
 */

/**
 * Step 11 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Core} core
 * @property {Special} special
 * @property {Note} note
 */

/**
 * @typedef {Object} ContributingCategory
 * @property {string} key         - camelCase category key
 * @property {string} label       - human-readable category label
 * @property {string} optionLabel - the selected option's label
 * @property {number} points      - points contributed (> 0)
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
 * @property {number} buildPoints
 * @property {number} skinPoints
 * @property {number} sexPoints
 * @property {number} agePoints
 * @property {number} continencePoints
 * @property {number} mobilityPoints
 * @property {number} tissueMalnutritionPoints
 * @property {number} neurologicalDeficitPoints
 * @property {number} majorSurgeryTraumaPoints
 * @property {number} medicationPoints
 * @property {number} waterlowScore
 * @property {RiskBand} riskBand
 * @property {string} preventionAction
 * @property {ContributingCategory[]} contributingCategories
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank assessment.
 * Strings/enums default to `''`; there are no numeric inputs to null.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    context: {
      nurseName: '',
      nurseRole: '',
      assessedAt: '',
      careSetting: '',
      assessmentReason: ''
    },
    identification: {
      patientIdentifier: '',
      ageBand: '',
      sex: ''
    },
    core: {
      buildWeightForHeight: '',
      skinType: '',
      continence: '',
      mobility: ''
    },
    special: {
      tissueMalnutrition: '',
      neurologicalDeficit: '',
      majorSurgeryTrauma: '',
      medication: '',
      existingPressureDamage: ''
    },
    note: {
      clinicalNote: ''
    }
  };
}

// Per-field option lists (value + display label). Scored options carry their
// point weight in the label so the weighting is visible in the wizard. Shared
// by the wizard selects/radios and by `optionLabel()` for report rendering.
const options = {
  nurseRole: [
    { value: 'registered-nurse', label: 'Registered nurse' },
    { value: 'healthcare-assistant', label: 'Healthcare assistant' },
    { value: 'tissue-viability', label: 'Tissue-viability specialist' },
    { value: 'other', label: 'Other' }
  ],
  careSetting: [
    { value: 'acute-ward', label: 'Acute ward' },
    { value: 'community', label: 'Community' },
    { value: 'care-home', label: 'Care home' },
    { value: 'hospice', label: 'Hospice' },
    { value: 'other', label: 'Other' }
  ],
  assessmentReason: [
    { value: 'admission', label: 'Admission' },
    { value: 'routine', label: 'Routine reassessment' },
    { value: 'change-in-condition', label: 'Change in condition' }
  ],
  ageBand: [
    { value: '14-49', label: '14-49 (1 point)' },
    { value: '50-64', label: '50-64 (2 points)' },
    { value: '65-74', label: '65-74 (3 points)' },
    { value: '75-80', label: '75-80 (4 points)' },
    { value: '81-plus', label: '81 and over (5 points)' }
  ],
  sex: [
    { value: 'male', label: 'Male (1 point)' },
    { value: 'female', label: 'Female (2 points)' }
  ],
  buildWeightForHeight: [
    { value: 'average', label: 'Average — BMI 20-24.9 (0 points)' },
    { value: 'above-average', label: 'Above average — BMI 25-29.9 (1 point)' },
    { value: 'obese', label: 'Obese — BMI 30 or over (2 points)' },
    { value: 'below-average', label: 'Below average — BMI under 20 (3 points)' }
  ],
  skinType: [
    { value: 'healthy', label: 'Healthy (0 points)' },
    { value: 'tissue-paper', label: 'Tissue paper — thin / fragile (1 point)' },
    { value: 'dry', label: 'Dry (1 point)' },
    { value: 'oedematous', label: 'Oedematous (1 point)' },
    { value: 'clammy-pyrexial', label: 'Clammy / pyrexial (1 point)' },
    { value: 'discoloured', label: 'Discoloured — category 1 (2 points)' },
    { value: 'broken', label: 'Broken / spot — category 2-4 (3 points)' }
  ],
  continence: [
    { value: 'complete-catheterised', label: 'Complete / catheterised (0 points)' },
    { value: 'incontinent-urine', label: 'Incontinent of urine (1 point)' },
    { value: 'incontinent-faeces', label: 'Incontinent of faeces (2 points)' },
    { value: 'doubly-incontinent', label: 'Doubly incontinent (3 points)' }
  ],
  mobility: [
    { value: 'fully-mobile', label: 'Fully mobile (0 points)' },
    { value: 'restless', label: 'Restless / fidgety (1 point)' },
    { value: 'apathetic', label: 'Apathetic (2 points)' },
    { value: 'restricted', label: 'Restricted (3 points)' },
    { value: 'bedbound', label: 'Bedbound — e.g. traction (4 points)' },
    { value: 'chairbound', label: 'Chairbound — e.g. wheelchair (5 points)' }
  ],
  tissueMalnutrition: [
    { value: 'none', label: 'None (0 points)' },
    { value: 'smoking', label: 'Smoking (1 point)' },
    { value: 'anaemia', label: 'Anaemia — Hb under 8 g/dL (2 points)' },
    { value: 'peripheral-vascular-disease', label: 'Peripheral vascular disease (5 points)' },
    { value: 'single-organ-failure', label: 'Single organ failure — cardiac, renal, respiratory (5 points)' },
    { value: 'multiple-organ-failure', label: 'Multiple organ failure (8 points)' },
    { value: 'terminal-cachexia', label: 'Terminal cachexia (8 points)' }
  ],
  neurologicalDeficit: [
    { value: 'none', label: 'None (0 points)' },
    { value: 'mild', label: 'Mild deficit (4 points)' },
    { value: 'moderate', label: 'Moderate deficit (5 points)' },
    { value: 'severe', label: 'Severe deficit (6 points)' }
  ],
  majorSurgeryTrauma: [
    { value: 'none', label: 'None (0 points)' },
    { value: 'orthopaedic-spinal', label: 'Orthopaedic / spinal, below waist (5 points)' },
    { value: 'on-table-over-2h', label: 'On table over 2 hours (5 points)' },
    { value: 'on-table-over-6h', label: 'On table over 6 hours (8 points)' }
  ],
  medication: [
    { value: 'none', label: 'None (0 points)' },
    { value: 'high-dose-steroids-cytotoxics-anti-inflammatory', label: 'High-dose steroids / cytotoxics / anti-inflammatory (4 points)' }
  ],
  existingPressureDamage: [
    { value: 'no', label: 'No' },
    { value: 'yes', label: 'Yes' }
  ]
};

/**
 * Look up an option's display label for a field/value pair. Falls back to the
 * raw value when no option matches (e.g. a legacy stored value).
 * @param {string} field
 * @param {string} value
 * @returns {string}
 */
function optionLabel(field, value) {
  const list = options[field];
  if (!list || value === '' || value == null) return '';
  const found = list.find((o) => o.value === value);
  return found ? found.label : String(value);
}

/** Risk-band label for display. */
function riskBandLabel(band) {
  switch (band) {
    case 'low': return 'Low risk (Waterlow under 10)';
    case 'at-risk': return 'At risk (Waterlow 10-14)';
    case 'high': return 'High risk (Waterlow 15-19)';
    case 'very-high': return 'Very high risk (Waterlow 20 or more)';
    default: return '';
  }
}

/** CSS class hint for the risk-band badge (reuses the shared risk palette). */
function riskBandClass(band) {
  switch (band) {
    case 'low': return 'risk-low';
    case 'at-risk': return 'risk-moderate';
    case 'high': return 'risk-high';
    case 'very-high': return 'risk-critical';
    default: return '';
  }
}

/** Recommended prevention action for a risk band (spec §4). */
function preventionActionLabel(band) {
  switch (band) {
    case 'low':
      return 'Routine skin inspection; reassess if the patient’s condition changes.';
    case 'at-risk':
      return 'Introduce a pressure-redistributing foam mattress and cushion; document a repositioning schedule; review nutrition and continence.';
    case 'high':
      return 'Escalate to an alternating-pressure / dynamic support surface; increase repositioning frequency; refer to tissue viability; formal skin-care plan.';
    case 'very-high':
      return 'High-specification dynamic mattress; frequent repositioning; urgent tissue-viability review; treat reversible factors (nutrition, moisture, perfusion).';
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

export { emptyAssessment, options, optionLabel, riskBandLabel, riskBandClass, preventionActionLabel, priorityLabel };
