// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Confusion Assessment Method
// (CAM) form.
//
// CAM is a status / classification instrument, not a numeric-score form: the
// engine emits a boolean delirium status and a derived classification
// (present / absent / unable-to-assess) plus the set of positive features — it
// does not sum a total. The camelCase property names here mirror the
// snake_case SQL columns in
// `sql/04_create_table_confusion_assessment_method.sql`. This file builds the
// canonical empty AssessmentData shape used by the wizard, so that newly-added
// fields default correctly when older saved state is rehydrated from
// localStorage. It also exports display helpers used by the wizard and report.

/**
 * @typedef {'nurse' | 'doctor' | 'geriatrician' | 'liaison-psychiatrist' | 'physiotherapist' | 'occupational-therapist' | 'researcher' | 'other' | ''} AssessorRole
 * @typedef {'cam' | 'cam-icu' | ''} CamVariant
 * @typedef {'16-39' | '40-59' | '60-74' | '75-plus' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'independent' | 'known-dementia' | 'mild-cognitive-impairment' | 'unknown' | ''} CognitiveBaseline
 * @typedef {'family' | 'carer' | 'nurse' | 'notes' | 'none' | ''} CollateralSource
 * @typedef {'present' | 'absent' | ''} FeatureState
 * @typedef {'hours' | 'days' | 'weeks' | 'unknown' | ''} OnsetTiming
 * @typedef {'digit-span' | 'months-backwards' | 'serial-sevens' | 'attention-screening-examination' | 'not-completable' | ''} AttentionTest
 * @typedef {'alert' | 'vigilant' | 'lethargic' | 'stupor' | 'coma' | ''} ConsciousnessLevel
 * @typedef {'hypoactive' | 'hyperactive' | 'mixed' | 'normal' | ''} MotoricSubtype
 * @typedef {'present' | 'absent' | 'unable-to-assess'} Classification
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessor and encounter.
 * @typedef {Object} Context
 * @property {string} assessorName
 * @property {AssessorRole} assessorRole
 * @property {string} assessedAt      - ISO-ish datetime-local string; '' when unset
 * @property {string} wardUnit
 * @property {CamVariant} camVariant
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 * @property {CognitiveBaseline} cognitiveBaseline
 * @property {CollateralSource} collateralSource
 */

/**
 * Step 3 — feature 1: acute onset and fluctuating course.
 * @typedef {Object} Feature1
 * @property {FeatureState} acuteOnsetFluctuating
 * @property {OnsetTiming} onsetTiming
 */

/**
 * Step 4 — feature 2: inattention.
 * @typedef {Object} Feature2
 * @property {FeatureState} inattention
 * @property {AttentionTest} attentionTest
 */

/**
 * Step 5 — feature 3: disorganised thinking.
 * @typedef {Object} Feature3
 * @property {FeatureState} disorganisedThinking
 */

/**
 * Step 6 — feature 4: altered level of consciousness.
 * @typedef {Object} Feature4
 * @property {FeatureState} alteredConsciousness
 * @property {ConsciousnessLevel} consciousnessLevel
 * @property {number | null} rassScore   - Richmond Agitation-Sedation Scale (-5..+4), CAM-ICU
 */

/**
 * Step 7 — motoric subtype and observations.
 * @typedef {Object} Observations
 * @property {MotoricSubtype} motoricSubtype
 * @property {boolean} hallucinations
 * @property {boolean} delusions
 * @property {boolean} sleepWakeDisturbance
 * @property {boolean} deliriogenicMedication
 * @property {string} deliriogenicMedicationDetail
 */

/**
 * Step 8 — result and disposition.
 * @typedef {Object} ResultNotes
 * @property {string} suspectedPrecipitants
 * @property {string} recommendedActions
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Feature1} feature1
 * @property {Feature2} feature2
 * @property {Feature3} feature3
 * @property {Feature4} feature4
 * @property {Observations} observations
 * @property {ResultNotes} result
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-FEATURE-1-POSITIVE-01
 * @property {string} feature      - acute-onset-fluctuating | inattention | disorganised-thinking | altered-consciousness | algorithm | arousal
 * @property {(boolean|null)} positive - whether the feature was positive (null for combiner / arousal rows)
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
 * @property {Classification} classification
 * @property {boolean | null} deliriumPresent
 * @property {number[]} positiveFeatures        - subset of [1,2,3,4]
 * @property {boolean | null} feature1Positive
 * @property {boolean | null} feature2Positive
 * @property {boolean | null} feature3Positive
 * @property {boolean | null} feature4Positive
 * @property {MotoricSubtype} motoricSubtype
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.ConfusionAssessmentMethod`.
(function () {
'use strict';
window.ConfusionAssessmentMethod = window.ConfusionAssessmentMethod || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`; booleans to false.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    context: {
      assessorName: '',
      assessorRole: '',
      assessedAt: '',
      wardUnit: '',
      camVariant: ''
    },
    identification: {
      patientIdentifier: '',
      ageBand: '',
      sex: '',
      cognitiveBaseline: '',
      collateralSource: ''
    },
    feature1: {
      acuteOnsetFluctuating: '',
      onsetTiming: ''
    },
    feature2: {
      inattention: '',
      attentionTest: ''
    },
    feature3: {
      disorganisedThinking: ''
    },
    feature4: {
      alteredConsciousness: '',
      consciousnessLevel: '',
      rassScore: null
    },
    observations: {
      motoricSubtype: '',
      hallucinations: false,
      delusions: false,
      sleepWakeDisturbance: false,
      deliriogenicMedication: false,
      deliriogenicMedicationDetail: ''
    },
    result: {
      suspectedPrecipitants: '',
      recommendedActions: '',
      clinicalNote: ''
    }
  };
}

/** Classification label for display. */
function classificationLabel(classification) {
  switch (classification) {
    case 'present': return 'Delirium present';
    case 'absent': return 'Delirium absent';
    case 'unable-to-assess': return 'Unable to assess';
    default: return '';
  }
}

/** CSS class hint for the classification badge (reuses the shared risk palette). */
function classificationClass(classification) {
  switch (classification) {
    case 'present': return 'risk-high';
    case 'absent': return 'risk-low';
    case 'unable-to-assess': return 'risk-medium';
    default: return '';
  }
}

/** Present / absent label for a single feature state. */
function featureStateLabel(state) {
  switch (state) {
    case 'present': return 'Present';
    case 'absent': return 'Absent';
    default: return 'Not recorded';
  }
}

/** Short label for one of the four CAM features. */
function featureLabel(n) {
  switch (n) {
    case 1: return 'Feature 1 — acute onset and fluctuating course';
    case 2: return 'Feature 2 — inattention';
    case 3: return 'Feature 3 — disorganised thinking';
    case 4: return 'Feature 4 — altered level of consciousness';
    default: return '';
  }
}

/** Assessor role label. */
function assessorRoleLabel(role) {
  switch (role) {
    case 'nurse': return 'Nurse';
    case 'doctor': return 'Doctor';
    case 'geriatrician': return 'Geriatrician';
    case 'liaison-psychiatrist': return 'Liaison psychiatrist';
    case 'physiotherapist': return 'Physiotherapist';
    case 'occupational-therapist': return 'Occupational therapist';
    case 'researcher': return 'Researcher';
    case 'other': return 'Other';
    default: return '';
  }
}

/** CAM variant label. */
function camVariantLabel(variant) {
  switch (variant) {
    case 'cam': return 'CAM (standard bedside)';
    case 'cam-icu': return 'CAM-ICU (ventilated / non-verbal)';
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

/** Cognitive-baseline label. */
function cognitiveBaselineLabel(value) {
  switch (value) {
    case 'independent': return 'Independent';
    case 'known-dementia': return 'Known dementia';
    case 'mild-cognitive-impairment': return 'Mild cognitive impairment';
    case 'unknown': return 'Unknown';
    default: return '';
  }
}

/** Collateral-history source label. */
function collateralSourceLabel(value) {
  switch (value) {
    case 'family': return 'Family';
    case 'carer': return 'Carer';
    case 'nurse': return 'Nurse';
    case 'notes': return 'Case notes';
    case 'none': return 'None available';
    default: return '';
  }
}

/** Onset-timing label. */
function onsetTimingLabel(value) {
  switch (value) {
    case 'hours': return 'Hours';
    case 'days': return 'Days';
    case 'weeks': return 'Weeks';
    case 'unknown': return 'Unknown';
    default: return '';
  }
}

/** Attention-test label. */
function attentionTestLabel(value) {
  switch (value) {
    case 'digit-span': return 'Digit span';
    case 'months-backwards': return 'Months of the year backwards';
    case 'serial-sevens': return 'Serial sevens';
    case 'attention-screening-examination': return 'Attention Screening Examination (CAM-ICU)';
    case 'not-completable': return 'Not completable';
    default: return '';
  }
}

/** Consciousness-level label. */
function consciousnessLevelLabel(value) {
  switch (value) {
    case 'alert': return 'Alert';
    case 'vigilant': return 'Vigilant (hyperalert)';
    case 'lethargic': return 'Lethargic (drowsy, easily roused)';
    case 'stupor': return 'Stupor (difficult to rouse)';
    case 'coma': return 'Coma (unrousable)';
    default: return '';
  }
}

/** Motoric-subtype label. */
function motoricSubtypeLabel(value) {
  switch (value) {
    case 'hypoactive': return 'Hypoactive';
    case 'hyperactive': return 'Hyperactive';
    case 'mixed': return 'Mixed';
    case 'normal': return 'Normal psychomotor activity';
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

Object.assign(window.ConfusionAssessmentMethod, {
  emptyAssessment,
  classificationLabel,
  classificationClass,
  featureStateLabel,
  featureLabel,
  assessorRoleLabel,
  camVariantLabel,
  sexLabel,
  ageBandLabel,
  cognitiveBaselineLabel,
  collateralSourceLabel,
  onsetTimingLabel,
  attentionTestLabel,
  consciousnessLevelLabel,
  motoricSubtypeLabel,
  priorityLabel
});
})();
