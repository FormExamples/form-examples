// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Glasgow Coma Scale (GCS) form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_glasgow_coma_scale.sql`. This file builds and exports
// the canonical empty AssessmentData shape used by the wizard, so that
// newly-added fields automatically default correctly when older saved state is
// rehydrated from localStorage. It also exports display helpers
// (severityBandLabel, severityBandClass, assessorRoleLabel, settingLabel,
// reactivityLabel, priorityLabel, and the E/V/M descriptor labels).

/**
 * @typedef {'doctor' | 'nurse' | 'paramedic' | 'emergency-medical-technician' | 'advanced-clinical-practitioner' | 'neuro-observation-staff' | 'other' | ''} AssessorRole
 * @typedef {'ed' | 'neuro' | 'critical-care' | 'pre-hospital' | 'other' | ''} Setting
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'spontaneous' | 'to-sound' | 'to-pressure' | 'none' | 'NT' | ''} EyeResponse
 * @typedef {'orientated' | 'confused' | 'words' | 'sounds' | 'none' | 'NT' | ''} VerbalResponse
 * @typedef {'obeys-commands' | 'localising' | 'normal-flexion' | 'abnormal-flexion' | 'extension' | 'none' | 'NT' | ''} MotorResponse
 * @typedef {'reactive' | 'sluggish' | 'unreactive' | ''} Reactivity
 * @typedef {'mild' | 'moderate' | 'severe' | ''} SeverityBand
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} assessorName
 * @property {AssessorRole} assessorRole
 * @property {string} assessedAt        - ISO-ish datetime-local string; '' when unset
 * @property {Setting} setting
 * @property {string} reason
 */

/**
 * Step 2 — confounders (each may force a component to NT).
 * @typedef {Object} Confounders
 * @property {YesNo} intubated
 * @property {YesNo} sedated
 * @property {YesNo} paralysed
 */

/**
 * Step 3 — eye opening (E, 1-4), or NT.
 * @typedef {Object} Eye
 * @property {EyeResponse} eyeResponse
 * @property {string} eyeNotTestableReason
 */

/**
 * Step 4 — verbal response (V, 1-5), or NT.
 * @typedef {Object} Verbal
 * @property {VerbalResponse} verbalResponse
 * @property {string} verbalNotTestableReason
 */

/**
 * Step 5 — motor response (M, 1-6), or NT.
 * @typedef {Object} Motor
 * @property {MotorResponse} motorResponse
 * @property {string} motorNotTestableReason
 */

/**
 * Step 6 — pupils (for GCS-Pupils).
 * @typedef {Object} Pupils
 * @property {Reactivity} leftPupilReactivity
 * @property {Reactivity} rightPupilReactivity
 * @property {number | null} leftPupilSizeMm
 * @property {number | null} rightPupilSizeMm
 */

/**
 * Step 7 — trend.
 * @typedef {Object} Trend
 * @property {number | null} previousTotal
 * @property {number | null} previousMotorScore
 * @property {string} previousAssessedAt
 */

/**
 * Step 8 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Confounders} confounders
 * @property {Eye} eye
 * @property {Verbal} verbal
 * @property {Motor} motor
 * @property {Pupils} pupils
 * @property {Trend} trend
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-EYE-SPONTANEOUS-01
 * @property {string} component    - eye | verbal | motor | total | pupils | gcs-p | trend | other
 * @property {number | null} points
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
 * @property {number | null} eyeScore
 * @property {number | null} verbalScore
 * @property {number | null} motorScore
 * @property {number | null} totalScore
 * @property {string} breakdown
 * @property {string} totalDisplay
 * @property {SeverityBand} severityBand
 * @property {number | null} pupilReactivityScore
 * @property {number | null} gcsP
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.GlasgowComaScale`.

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
      assessedAt: '',
      setting: '',
      reason: ''
    },
    confounders: {
      intubated: '',
      sedated: '',
      paralysed: ''
    },
    eye: {
      eyeResponse: '',
      eyeNotTestableReason: ''
    },
    verbal: {
      verbalResponse: '',
      verbalNotTestableReason: ''
    },
    motor: {
      motorResponse: '',
      motorNotTestableReason: ''
    },
    pupils: {
      leftPupilReactivity: '',
      rightPupilReactivity: '',
      leftPupilSizeMm: null,
      rightPupilSizeMm: null
    },
    trend: {
      previousTotal: null,
      previousMotorScore: null,
      previousAssessedAt: ''
    },
    note: {
      clinicalNote: ''
    }
  };
}

/** Severity-band label for display. */
function severityBandLabel(band) {
  switch (band) {
    case 'mild': return 'Mild (13-15)';
    case 'moderate': return 'Moderate (9-12)';
    case 'severe': return 'Severe (3-8) — coma';
    default: return 'Not scored';
  }
}

/** CSS class hint for the severity-band badge (reuses the shared risk palette). */
function severityBandClass(band) {
  switch (band) {
    case 'mild': return 'risk-low';
    case 'moderate': return 'risk-medium';
    case 'severe': return 'risk-high';
    default: return '';
  }
}

/** Assessing-observer role label. */
function assessorRoleLabel(role) {
  switch (role) {
    case 'doctor': return 'Doctor';
    case 'nurse': return 'Nurse';
    case 'paramedic': return 'Paramedic';
    case 'emergency-medical-technician': return 'Emergency medical technician';
    case 'advanced-clinical-practitioner': return 'Advanced clinical practitioner';
    case 'neuro-observation-staff': return 'Neuro-observation staff';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function settingLabel(setting) {
  switch (setting) {
    case 'ed': return 'Emergency department';
    case 'neuro': return 'Neuro / neurosurgical unit';
    case 'critical-care': return 'Critical care / HDU';
    case 'pre-hospital': return 'Pre-hospital / ambulance';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Pupil-reactivity label. */
function reactivityLabel(reactivity) {
  switch (reactivity) {
    case 'reactive': return 'Reactive';
    case 'sluggish': return 'Sluggish';
    case 'unreactive': return 'Unreactive';
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

export { emptyAssessment, severityBandLabel, severityBandClass, assessorRoleLabel, settingLabel, reactivityLabel, priorityLabel };
