// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Newborn and Infant Physical
// Examination (NIPE) form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_newborn_and_infant_physical_examination.sql`. This file
// builds and exports the canonical empty ExaminationData shape used by the
// wizard, so that newly-added fields automatically default correctly when older
// saved state is rehydrated from localStorage. It also exports display helpers
// (outcomeLabel, outcomeClass, componentResultLabel, componentResultClass,
// practitionerRoleLabel, careSettingLabel, examinationContextLabel, sexLabel,
// priorityLabel).

/**
 * @typedef {'midwife' | 'neonatal-nurse' | 'paediatrician' | 'gp' | 'nurse-practitioner' | 'other' | ''} PractitionerRole
 * @typedef {'newborn-72h' | 'infant-6-8-week' | ''} ExaminationContext
 * @typedef {'maternity-ward' | 'neonatal-unit' | 'community' | 'gp-surgery' | 'home' | 'other' | ''} CareSetting
 * @typedef {'male' | 'female' | 'indeterminate' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'normal' | 'abnormal' | 'not-examined' | ''} NormalAbnormal
 * @typedef {'satisfactory' | 'refer' | 'not-examined'} ComponentResult
 * @typedef {ComponentResult | 'not-applicable'} TestesResult
 * @typedef {'satisfactory' | 'refer' | 'incomplete'} OverallOutcome
 * @typedef {'complete' | 'incomplete'} Completeness
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — examination context.
 * @typedef {Object} Context
 * @property {string} practitionerName
 * @property {PractitionerRole} practitionerRole
 * @property {string} examinedAt          - ISO-ish datetime-local string; '' when unset
 * @property {ExaminationContext} examinationContext
 * @property {CareSetting} careSetting
 */

/**
 * Step 2 — baby identification.
 * @typedef {Object} Identification
 * @property {string} babyIdentifier
 * @property {string} babyName
 * @property {string} dateOfBirth         - ISO date string; '' when unset
 * @property {Sex} sex
 * @property {number | null} gestationalAgeWeeks
 * @property {number | null} birthWeightGrams
 */

/**
 * Step 3 — hip risk factors.
 * @typedef {Object} RiskFactors
 * @property {YesNo} breechPresentation
 * @property {YesNo} familyHistoryHipProblems
 * @property {string} antenatalConcerns
 */

/**
 * Step 4 — eyes key component.
 * @typedef {Object} Eyes
 * @property {'present' | 'absent' | 'not-examined' | ''} eyesRedReflexRight
 * @property {'present' | 'absent' | 'not-examined' | ''} eyesRedReflexLeft
 * @property {NormalAbnormal} eyesAppearance
 */

/**
 * Step 5 — heart key component.
 * @typedef {Object} Heart
 * @property {'none' | 'present' | 'not-examined' | ''} heartMurmur
 * @property {'present' | 'weak' | 'absent' | 'not-examined' | ''} femoralPulsesRight
 * @property {'present' | 'weak' | 'absent' | 'not-examined' | ''} femoralPulsesLeft
 * @property {'absent' | 'present' | 'not-examined' | ''} centralCyanosis
 * @property {number | null} oxygenSaturationPreductal
 * @property {number | null} oxygenSaturationPostductal
 */

/**
 * Step 6 — hips key component.
 * @typedef {Object} Hips
 * @property {'negative' | 'positive' | 'not-examined' | ''} barlowTest
 * @property {'negative' | 'positive' | 'not-examined' | ''} ortolaniTest
 * @property {'normal' | 'limited' | 'not-examined' | ''} hipAbduction
 */

/**
 * Step 7 — testes key component (boys).
 * @typedef {Object} Testes
 * @property {'descended' | 'undescended' | 'not-palpable' | 'not-examined' | ''} testisRight
 * @property {'descended' | 'undescended' | 'not-palpable' | 'not-examined' | ''} testisLeft
 */

/**
 * Step 8 — head-to-toe systematic examination and measurements.
 * @typedef {Object} Systematic
 * @property {NormalAbnormal} generalAppearance
 * @property {NormalAbnormal} skin
 * @property {NormalAbnormal} headAndFontanelles
 * @property {NormalAbnormal} faceAndPalate
 * @property {NormalAbnormal} neckAndClavicles
 * @property {NormalAbnormal} chestAndLungs
 * @property {NormalAbnormal} abdomen
 * @property {NormalAbnormal} genitalia
 * @property {NormalAbnormal} anusAndSpine
 * @property {NormalAbnormal} limbsAndDigits
 * @property {NormalAbnormal} feet
 * @property {NormalAbnormal} toneAndMovement
 * @property {number | null} weightGrams
 * @property {number | null} headCircumferenceCm
 * @property {number | null} lengthCm
 */

/**
 * Step 9 — summary: optional recorded results and free-text note.
 * @typedef {Object} Summary
 * @property {ComponentResult | ''} eyesResultRecorded
 * @property {ComponentResult | ''} heartResultRecorded
 * @property {ComponentResult | ''} hipsResultRecorded
 * @property {TestesResult | ''} testesResultRecorded
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} ExaminationData
 * @property {Context} context
 * @property {Identification} identification
 * @property {RiskFactors} riskFactors
 * @property {Eyes} eyes
 * @property {Heart} heart
 * @property {Hips} hips
 * @property {Testes} testes
 * @property {Systematic} systematic
 * @property {Summary} summary
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-HIPS-REFER-01
 * @property {string} component    - eyes | heart | hips | testes | overall
 * @property {string} category
 * @property {string} description
 */

/**
 * @typedef {Object} Referral
 * @property {string} component    - eyes | heart | hips | testes
 * @property {string} pathway
 * @property {'same-day' | 'within-2-weeks' | 'by-6-weeks' | 'review-6-8-weeks'} urgency
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
 * @property {ComponentResult} eyesResult
 * @property {ComponentResult} heartResult
 * @property {ComponentResult} hipsResult
 * @property {TestesResult} testesResult
 * @property {OverallOutcome} overallOutcome
 * @property {Completeness} completeness
 * @property {number} completenessPercent
 * @property {Referral[]} referrals
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.NewbornAndInfantPhysicalExamination`.
(function () {
'use strict';
window.NewbornAndInfantPhysicalExamination =
  window.NewbornAndInfantPhysicalExamination || {};

/**
 * Build a fresh, fully-blank examination.
 * Strings default to `''`; numeric fields default to `null`.
 * @returns {ExaminationData}
 */
function emptyAssessment() {
  return {
    context: {
      practitionerName: '',
      practitionerRole: '',
      examinedAt: '',
      examinationContext: '',
      careSetting: ''
    },
    identification: {
      babyIdentifier: '',
      babyName: '',
      dateOfBirth: '',
      sex: '',
      gestationalAgeWeeks: null,
      birthWeightGrams: null
    },
    riskFactors: {
      breechPresentation: '',
      familyHistoryHipProblems: '',
      antenatalConcerns: ''
    },
    eyes: {
      eyesRedReflexRight: '',
      eyesRedReflexLeft: '',
      eyesAppearance: ''
    },
    heart: {
      heartMurmur: '',
      femoralPulsesRight: '',
      femoralPulsesLeft: '',
      centralCyanosis: '',
      oxygenSaturationPreductal: null,
      oxygenSaturationPostductal: null
    },
    hips: {
      barlowTest: '',
      ortolaniTest: '',
      hipAbduction: ''
    },
    testes: {
      testisRight: '',
      testisLeft: ''
    },
    systematic: {
      generalAppearance: '',
      skin: '',
      headAndFontanelles: '',
      faceAndPalate: '',
      neckAndClavicles: '',
      chestAndLungs: '',
      abdomen: '',
      genitalia: '',
      anusAndSpine: '',
      limbsAndDigits: '',
      feet: '',
      toneAndMovement: '',
      weightGrams: null,
      headCircumferenceCm: null,
      lengthCm: null
    },
    summary: {
      eyesResultRecorded: '',
      heartResultRecorded: '',
      hipsResultRecorded: '',
      testesResultRecorded: '',
      clinicalNote: ''
    }
  };
}

/** Overall screening-outcome label for display. */
function outcomeLabel(outcome) {
  switch (outcome) {
    case 'satisfactory': return 'Satisfactory';
    case 'refer': return 'Refer';
    case 'incomplete': return 'Incomplete';
    default: return '';
  }
}

/** CSS class hint for the overall-outcome badge (reuses the shared palette). */
function outcomeClass(outcome) {
  switch (outcome) {
    case 'satisfactory': return 'risk-low';
    case 'refer': return 'risk-high';
    case 'incomplete': return 'risk-moderate';
    default: return '';
  }
}

/** Per-component result label for display. */
function componentResultLabel(result) {
  switch (result) {
    case 'satisfactory': return 'Satisfactory';
    case 'refer': return 'Refer';
    case 'not-examined': return 'Not examined';
    case 'not-applicable': return 'Not applicable';
    default: return '';
  }
}

/** CSS class hint for a per-component result badge. */
function componentResultClass(result) {
  switch (result) {
    case 'satisfactory': return 'risk-low';
    case 'refer': return 'risk-high';
    case 'not-examined': return 'risk-moderate';
    case 'not-applicable': return 'risk-moderate';
    default: return '';
  }
}

/** Examining-practitioner role label. */
function practitionerRoleLabel(role) {
  switch (role) {
    case 'midwife': return 'Midwife';
    case 'neonatal-nurse': return 'Neonatal nurse';
    case 'paediatrician': return 'Paediatrician';
    case 'gp': return 'GP';
    case 'nurse-practitioner': return 'Nurse practitioner';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'maternity-ward': return 'Maternity ward';
    case 'neonatal-unit': return 'Neonatal unit';
    case 'community': return 'Community';
    case 'gp-surgery': return 'GP surgery';
    case 'home': return 'Home';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Examination-context label. */
function examinationContextLabel(context) {
  switch (context) {
    case 'newborn-72h': return 'Newborn (within 72 hours)';
    case 'infant-6-8-week': return 'Infant (6-8 week review)';
    default: return '';
  }
}

/** Baby-sex label. */
function sexLabel(sex) {
  switch (sex) {
    case 'male': return 'Male';
    case 'female': return 'Female';
    case 'indeterminate': return 'Indeterminate';
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

Object.assign(window.NewbornAndInfantPhysicalExamination, {
  emptyAssessment,
  outcomeLabel,
  outcomeClass,
  componentResultLabel,
  componentResultClass,
  practitionerRoleLabel,
  careSettingLabel,
  examinationContextLabel,
  sexLabel,
  priorityLabel
});
})();
