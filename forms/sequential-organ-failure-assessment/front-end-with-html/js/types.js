// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Sequential Organ Failure
// Assessment (SOFA) form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_sequential_organ_failure_assessment.sql`. This file
// builds and exports the canonical empty AssessmentData shape used by the
// wizard, so that newly-added fields automatically default correctly when
// older saved state is rehydrated from localStorage. It also exports display
// helpers (mortalityBandLabel, mortalityBandClass, systemLabel, roleLabel,
// careLocationLabel, sexLabel, suspectedInfectionLabel, respiratorySupportLabel,
// vasopressorLabel, priorityLabel).

/**
 * @typedef {'intensivist' | 'critical-care-physician' | 'acute-physician' | 'resident' | 'nurse' | 'outreach-practitioner' | 'other' | ''} AssessorRole
 * @typedef {'icu' | 'hdu' | 'critical-care-outreach' | 'acute-medical-unit' | 'emergency-department' | 'other' | ''} CareLocation
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'yes' | 'no' | 'unknown' | ''} SuspectedInfection
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'ventilated' | 'cpap' | 'none' | ''} RespiratorySupport
 * @typedef {'none' | 'dopamine' | 'dobutamine' | 'adrenaline' | 'noradrenaline' | 'other' | ''} Vasopressor
 * @typedef {'low' | 'moderate' | 'high' | 'veryHigh' | 'extreme'} MortalityBand
 * @typedef {'high' | 'medium' | 'low'} Priority
 * @typedef {0 | 1 | 2 | 3 | 4 | null} SubScore
 */

/**
 * Step 1 — clinician and context.
 * @typedef {Object} Context
 * @property {string} assessorName
 * @property {AssessorRole} assessorRole
 * @property {string} assessorRegistrationNumber
 * @property {string} assessedAt          - ISO-ish datetime-local string; '' when unset
 * @property {CareLocation} careLocation
 * @property {number | null} hoursSinceAdmission
 */

/**
 * Step 2 — patient identification and baseline.
 * @typedef {Object} Baseline
 * @property {string} patientIdentifier
 * @property {number | null} ageYears
 * @property {Sex} sex
 * @property {string} admissionDiagnosis
 * @property {SuspectedInfection} suspectedInfection
 * @property {number | null} baselineSofaTotal
 */

/**
 * Step 3 — respiration (PaO2/FiO2 ratio, respiratory support).
 * @typedef {Object} Respiration
 * @property {number | null} pao2            - arterial PaO2 (mmHg for the P/F ratio)
 * @property {number | null} fio2            - fraction of inspired oxygen, decimal 0.21-1.0
 * @property {number | null} pao2Fio2Ratio   - directly-entered PaO2/FiO2 ratio (mmHg)
 * @property {RespiratorySupport} respiratorySupport
 */

/**
 * Step 4 — coagulation (platelet count, x10^9/L).
 * @typedef {Object} Coagulation
 * @property {number | null} platelets
 */

/**
 * Step 5 — liver (bilirubin, umol/L).
 * @typedef {Object} Liver
 * @property {number | null} bilirubin
 */

/**
 * Step 6 — cardiovascular (MAP, vasopressor agent and dose).
 * @typedef {Object} Cardiovascular
 * @property {number | null} map             - mean arterial pressure, mmHg
 * @property {Vasopressor} vasopressor
 * @property {number | null} vasopressorDose - ug/kg/min
 */

/**
 * Step 7 — central nervous system (Glasgow Coma Scale, sedation).
 * @typedef {Object} Cns
 * @property {number | null} glasgowComaScale - GCS total 3-15
 * @property {YesNo} sedated                  - use pre-sedation GCS or best estimate when sedated
 */

/**
 * Step 8 — renal (creatinine umol/L, 24-hour urine output mL/day).
 * @typedef {Object} Renal
 * @property {number | null} creatinine
 * @property {number | null} urineOutput
 */

/**
 * Step 9 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Baseline} baseline
 * @property {Respiration} respiration
 * @property {Coagulation} coagulation
 * @property {Liver} liver
 * @property {Cardiovascular} cardiovascular
 * @property {Cns} cns
 * @property {Renal} renal
 * @property {Note} note
 */

/**
 * @typedef {Object} SubScores
 * @property {SubScore} respiration
 * @property {SubScore} coagulation
 * @property {SubScore} liver
 * @property {SubScore} cardiovascular
 * @property {SubScore} cns
 * @property {SubScore} renal
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-RESPIRATION-01
 * @property {string} parameter    - respiration | coagulation | liver | cardiovascular | cns | renal | total | delta | band | sepsis
 * @property {number | null} points - the 0-4 sub-score this rule contributed (null for derivations)
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
 * @property {SubScores} subScores
 * @property {number} totalSofa       - sum of the non-null sub-scores, 0..24
 * @property {boolean} complete       - true when all six sub-scores are non-null
 * @property {number | null} deltaSofa - totalSofa - baselineSofaTotal, or null
 * @property {MortalityBand} mortalityBand
 * @property {boolean} sepsis3
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.SequentialOrganFailureAssessment`.
(function () {
'use strict';
window.SequentialOrganFailureAssessment =
  window.SequentialOrganFailureAssessment || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    context: {
      assessorName: '',
      assessorRole: '',
      assessorRegistrationNumber: '',
      assessedAt: '',
      careLocation: '',
      hoursSinceAdmission: null
    },
    baseline: {
      patientIdentifier: '',
      ageYears: null,
      sex: '',
      admissionDiagnosis: '',
      suspectedInfection: '',
      baselineSofaTotal: null
    },
    respiration: {
      pao2: null,
      fio2: null,
      pao2Fio2Ratio: null,
      respiratorySupport: ''
    },
    coagulation: {
      platelets: null
    },
    liver: {
      bilirubin: null
    },
    cardiovascular: {
      map: null,
      vasopressor: '',
      vasopressorDose: null
    },
    cns: {
      glasgowComaScale: null,
      sedated: ''
    },
    renal: {
      creatinine: null,
      urineOutput: null
    },
    note: {
      clinicalNote: ''
    }
  };
}

/** Mortality-band label for display. */
function mortalityBandLabel(band) {
  switch (band) {
    case 'low': return 'Low (< 10%)';
    case 'moderate': return 'Moderate (~15-20%)';
    case 'high': return 'High (~40-50%)';
    case 'veryHigh': return 'Very high (~50-60%)';
    case 'extreme': return 'Extreme (> 80%)';
    default: return '';
  }
}

/** CSS class hint for the mortality-band badge (reuses the shared risk palette). */
function mortalityBandClass(band) {
  switch (band) {
    case 'low': return 'risk-low';
    case 'moderate': return 'risk-moderate';
    case 'high': return 'risk-high';
    case 'veryHigh': return 'risk-high';
    case 'extreme': return 'risk-critical';
    default: return '';
  }
}

/** Organ-system label for display. */
function systemLabel(system) {
  switch (system) {
    case 'respiration': return 'Respiration';
    case 'coagulation': return 'Coagulation';
    case 'liver': return 'Liver';
    case 'cardiovascular': return 'Cardiovascular';
    case 'cns': return 'Central nervous system';
    case 'renal': return 'Renal';
    default: return system;
  }
}

/** Assessing-clinician role label. */
function roleLabel(role) {
  switch (role) {
    case 'intensivist': return 'Intensivist';
    case 'critical-care-physician': return 'Critical-care physician';
    case 'acute-physician': return 'Acute-medicine physician';
    case 'resident': return 'Resident';
    case 'nurse': return 'Critical-care nurse';
    case 'outreach-practitioner': return 'Outreach practitioner';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-location label. */
function careLocationLabel(location) {
  switch (location) {
    case 'icu': return 'Intensive care unit';
    case 'hdu': return 'High-dependency unit';
    case 'critical-care-outreach': return 'Critical-care outreach';
    case 'acute-medical-unit': return 'Acute medical unit';
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

/** Suspected-infection label. */
function suspectedInfectionLabel(v) {
  switch (v) {
    case 'yes': return 'Yes';
    case 'no': return 'No';
    case 'unknown': return 'Unknown';
    default: return '';
  }
}

/** Respiratory-support label. */
function respiratorySupportLabel(v) {
  switch (v) {
    case 'ventilated': return 'Mechanical ventilation';
    case 'cpap': return 'CPAP';
    case 'none': return 'None';
    default: return '';
  }
}

/** Vasopressor / inotrope agent label. */
function vasopressorLabel(v) {
  switch (v) {
    case 'none': return 'None';
    case 'dopamine': return 'Dopamine';
    case 'dobutamine': return 'Dobutamine';
    case 'adrenaline': return 'Adrenaline (epinephrine)';
    case 'noradrenaline': return 'Noradrenaline (norepinephrine)';
    case 'other': return 'Other';
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

Object.assign(window.SequentialOrganFailureAssessment, {
  emptyAssessment,
  mortalityBandLabel,
  mortalityBandClass,
  systemLabel,
  roleLabel,
  careLocationLabel,
  sexLabel,
  suspectedInfectionLabel,
  respiratorySupportLabel,
  vasopressorLabel,
  priorityLabel
});
})();
