// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Child-Pugh Score
// (Child-Turcotte-Pugh) form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_child_pugh_score.sql`. This file builds and exports the
// canonical empty AssessmentData shape used by the wizard, so that newly-added
// fields automatically default correctly when older saved state is rehydrated
// from localStorage. It also exports display helpers (childPughClassLabel,
// childPughClassCss, surgicalRiskLabel, clinicianRoleLabel, careSettingLabel,
// aetiologyLabel, sexLabel, ageBandLabel, ascitesLabel, encephalopathyLabel,
// priorityLabel).

/**
 * @typedef {'hepatologist' | 'surgeon' | 'anaesthetist' | 'physician' | 'nurse' | 'other' | ''} ClinicianRole
 * @typedef {'hepatology-clinic' | 'ward' | 'pre-operative' | 'intensive-care' | 'other' | ''} CareSetting
 * @typedef {'alcohol' | 'viral-hepatitis' | 'nafld' | 'autoimmune' | 'cholestatic' | 'other' | ''} Aetiology
 * @typedef {'16-39' | '40-59' | '60-74' | '75-plus' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'none' | 'mild' | 'moderate-severe' | ''} Ascites
 * @typedef {'none' | 'grade-1-2' | 'grade-3-4' | ''} Encephalopathy
 * @typedef {'A' | 'B' | 'C'} ChildPughClass
 * @typedef {'low' | 'moderate' | 'high'} SurgicalRisk
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} assessedAt        - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {Aetiology} aetiology
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 */

/**
 * Step 3 — total bilirubin (parameter 1).
 * @typedef {Object} Bilirubin
 * @property {number | null} totalBilirubin  - µmol/L; 1 pt < 34, 2 pt 34-50, 3 pt > 50
 */

/**
 * Step 4 — serum albumin (parameter 2).
 * @typedef {Object} Albumin
 * @property {number | null} serumAlbumin    - g/L; 1 pt > 35, 2 pt 28-35, 3 pt < 28
 */

/**
 * Step 5 — coagulation (parameter 3). INR is preferred; prothrombin-time
 * prolongation (seconds) is the fallback used when no INR is recorded.
 * @typedef {Object} Coagulation
 * @property {number | null} inr                          - ratio; 1 pt < 1.7, 2 pt 1.7-2.3, 3 pt > 2.3
 * @property {number | null} prothrombinTimeProlongation  - seconds; 1 pt < 4, 2 pt 4-6, 3 pt > 6
 */

/**
 * Step 6 — ascites (parameter 4).
 * @typedef {Object} AscitesStep
 * @property {Ascites} ascites
 */

/**
 * Step 7 — hepatic encephalopathy (parameter 5).
 * @typedef {Object} EncephalopathyStep
 * @property {Encephalopathy} encephalopathy
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
 * @property {Albumin} albumin
 * @property {Coagulation} coagulation
 * @property {AscitesStep} ascitesStep
 * @property {EncephalopathyStep} encephalopathyStep
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-BILIRUBIN-3POINT-01
 * @property {string} parameter    - bilirubin | albumin | coagulation | ascites | encephalopathy | class
 * @property {number | null} points - points contributed for the parameter (1-3), or null
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
 * @property {1 | 2 | 3 | null} bilirubinPoint
 * @property {1 | 2 | 3 | null} albuminPoint
 * @property {1 | 2 | 3 | null} coagulationPoint
 * @property {1 | 2 | 3 | null} ascitesPoint
 * @property {1 | 2 | 3 | null} encephalopathyPoint
 * @property {number} childPughScore          - 5..15 when complete; partial otherwise
 * @property {ChildPughClass} childPughClass
 * @property {string} oneYearSurvival
 * @property {string} twoYearSurvival
 * @property {SurgicalRisk} surgicalRisk
 * @property {boolean} complete               - true when all five parameters answered
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
      aetiology: ''
    },
    identification: {
      patientIdentifier: '',
      ageBand: '',
      sex: ''
    },
    bilirubin: {
      totalBilirubin: null
    },
    albumin: {
      serumAlbumin: null
    },
    coagulation: {
      inr: null,
      prothrombinTimeProlongation: null
    },
    ascitesStep: {
      ascites: ''
    },
    encephalopathyStep: {
      encephalopathy: ''
    },
    note: {
      clinicalNote: ''
    }
  };
}

/** Child-Pugh class label for display. */
function childPughClassLabel(cls) {
  switch (cls) {
    case 'A': return 'Class A (well-compensated)';
    case 'B': return 'Class B (significant compromise)';
    case 'C': return 'Class C (decompensated)';
    default: return '';
  }
}

/** CSS class hint for the class badge (reuses the shared risk palette). */
function childPughClassCss(cls) {
  switch (cls) {
    case 'A': return 'risk-low';
    case 'B': return 'risk-moderate';
    case 'C': return 'risk-high';
    default: return '';
  }
}

/** Peri-operative surgical-risk label. */
function surgicalRiskLabel(risk) {
  switch (risk) {
    case 'low': return 'Low (~10%)';
    case 'moderate': return 'Moderate (~30%)';
    case 'high': return 'High (~80%)';
    default: return '';
  }
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'hepatologist': return 'Hepatologist';
    case 'surgeon': return 'Surgeon';
    case 'anaesthetist': return 'Anaesthetist';
    case 'physician': return 'Physician';
    case 'nurse': return 'Specialist nurse';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'hepatology-clinic': return 'Hepatology / gastroenterology clinic';
    case 'ward': return 'General / acute ward';
    case 'pre-operative': return 'Pre-operative assessment';
    case 'intensive-care': return 'Intensive care';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Aetiology-of-liver-disease label. */
function aetiologyLabel(aetiology) {
  switch (aetiology) {
    case 'alcohol': return 'Alcohol-related';
    case 'viral-hepatitis': return 'Viral hepatitis';
    case 'nafld': return 'NAFLD / MASLD';
    case 'autoimmune': return 'Autoimmune';
    case 'cholestatic': return 'Cholestatic';
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

/** Ascites-grade label. */
function ascitesLabel(grade) {
  switch (grade) {
    case 'none': return 'None';
    case 'mild': return 'Mild (diuretic-responsive)';
    case 'moderate-severe': return 'Moderate-to-severe (refractory)';
    default: return '';
  }
}

/** Hepatic-encephalopathy-grade label. */
function encephalopathyLabel(grade) {
  switch (grade) {
    case 'none': return 'None';
    case 'grade-1-2': return 'Grade 1-2 (or medically controlled)';
    case 'grade-3-4': return 'Grade 3-4 (or refractory)';
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

export { emptyAssessment, childPughClassLabel, childPughClassCss, surgicalRiskLabel, clinicianRoleLabel, careSettingLabel, aetiologyLabel, sexLabel, ageBandLabel, ascitesLabel, encephalopathyLabel, priorityLabel };
