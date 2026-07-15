// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the MELD (Model for End-Stage Liver
// Disease) Score calculator.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_model_for_end_stage_liver_disease_score.sql`
// (`bilirubin_unit` -> `bilirubinUnit`, `dialysis_sessions_past_week` ->
// `dialysisSessionsPastWeek`, `cvvhd_24h` -> `cvvhd24h`, `meld_variant` ->
// `meldVariant`). This file builds and exports the canonical empty
// AssessmentData shape used by the wizard, so that newly-added fields
// automatically default correctly when older saved state is rehydrated from
// localStorage. It also exports display helpers (meldVariantLabel,
// mortalityBandLabel, mortalityBandClass, clinicianRoleLabel, careSettingLabel,
// sexLabel, ageBandLabel, priorityLabel).

/**
 * @typedef {'hepatologist' | 'gastroenterologist' | 'transplant-coordinator' | 'intensivist' | 'other' | ''} ClinicianRole
 * @typedef {'hepatology-clinic' | 'transplant-unit' | 'intensive-care' | 'ward' | 'other' | ''} CareSetting
 * @typedef {'meld' | 'meld-na' | 'meld-3' | ''} MeldVariant
 * @typedef {'16-39' | '40-59' | '60-74' | '75-plus' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'mg/dL' | 'umol/L' | ''} LabUnit
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'low' | 'moderate' | 'high' | 'very-high' | 'extreme' | ''} MortalityBand
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} assessedAt        - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {MeldVariant} meldVariant  - chosen instrument (drives required inputs)
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex                  - female indicator used by MELD 3.0
 */

/**
 * Step 3 — total bilirubin (calculation input 1).
 * @typedef {Object} Bilirubin
 * @property {number | null} bilirubin
 * @property {LabUnit} bilirubinUnit
 */

/**
 * Step 4 — INR (calculation input 2).
 * @typedef {Object} Inr
 * @property {number | null} inr
 */

/**
 * Step 5 — serum creatinine and dialysis (calculation input 3 + dialysis rule).
 * @typedef {Object} Renal
 * @property {number | null} creatinine
 * @property {LabUnit} creatinineUnit
 * @property {number | null} dialysisSessionsPastWeek
 * @property {YesNo} cvvhd24h
 */

/**
 * Step 6 — serum sodium (MELD-Na and MELD 3.0).
 * @typedef {Object} Sodium
 * @property {number | null} sodium
 */

/**
 * Step 7 — serum albumin (MELD 3.0).
 * @typedef {Object} Albumin
 * @property {number | null} albumin
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
 * @property {Bilirubin} bilirubin
 * @property {Inr} inr
 * @property {Renal} renal
 * @property {Sodium} sodium
 * @property {Albumin} albumin
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-BAND-HIGH-01
 * @property {string} instrument   - conversion | dialysis | formula | band
 * @property {string} band         - low | moderate | high | very-high | extreme | ''
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
 * @property {number | null} bilirubinMgDl
 * @property {number | null} creatinineMgDl
 * @property {number | null} creatinineAdjusted
 * @property {boolean} dialysisRuleApplied
 * @property {number | null} meldScore              - 6..40 when computable
 * @property {MortalityBand} mortalityBand
 * @property {number | null} estimatedMortalityPercent
 * @property {FiredRule[]} firedRules
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
      careSetting: '',
      meldVariant: ''
    },
    identification: {
      patientIdentifier: '',
      ageBand: '',
      sex: ''
    },
    bilirubin: {
      bilirubin: null,
      bilirubinUnit: ''
    },
    inr: {
      inr: null
    },
    renal: {
      creatinine: null,
      creatinineUnit: '',
      dialysisSessionsPastWeek: null,
      cvvhd24h: ''
    },
    sodium: {
      sodium: null
    },
    albumin: {
      albumin: null
    },
    note: {
      clinicalNote: ''
    }
  };
}

/** MELD variant label for display. */
function meldVariantLabel(variant) {
  switch (variant) {
    case 'meld': return 'MELD (original)';
    case 'meld-na': return 'MELD-Na (sodium-corrected)';
    case 'meld-3': return 'MELD 3.0';
    default: return '';
  }
}

/** Mortality-band label for display. */
function mortalityBandLabel(band) {
  switch (band) {
    case 'low': return 'Low (~2% 3-month mortality)';
    case 'moderate': return 'Moderate (~6% 3-month mortality)';
    case 'high': return 'High (~20% 3-month mortality)';
    case 'very-high': return 'Very high (~53% 3-month mortality)';
    case 'extreme': return 'Extreme (~71% 3-month mortality)';
    default: return 'Awaiting required inputs';
  }
}

/** CSS class hint for the mortality-band badge (reuses the shared risk palette). */
function mortalityBandClass(band) {
  switch (band) {
    case 'low': return 'risk-low';
    case 'moderate': return 'risk-moderate';
    case 'high': return 'risk-high';
    case 'very-high': return 'risk-high';
    case 'extreme': return 'risk-critical';
    default: return '';
  }
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'hepatologist': return 'Hepatologist';
    case 'gastroenterologist': return 'Gastroenterologist';
    case 'transplant-coordinator': return 'Transplant coordinator';
    case 'intensivist': return 'Intensivist';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'hepatology-clinic': return 'Hepatology clinic';
    case 'transplant-unit': return 'Transplant unit';
    case 'intensive-care': return 'Intensive care';
    case 'ward': return 'Ward';
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
    case '16-39': return '16-39';
    case '40-59': return '40-59';
    case '60-74': return '60-74';
    case '75-plus': return '75 and over';
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

export { emptyAssessment, meldVariantLabel, mortalityBandLabel, mortalityBandClass, clinicianRoleLabel, careSettingLabel, sexLabel, ageBandLabel, priorityLabel };
