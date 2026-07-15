// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Apgar Score form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_apgar_score.sql` (parent context + identification) and
// `sql/05_create_table_apgar_score_timepoint.sql` (the repeated per-timepoint
// five-sign scores). This file builds and exports the canonical empty
// AssessmentData shape used by the wizard, so that newly-added fields
// automatically default correctly when older saved state is rehydrated from
// localStorage. It also exports display helpers (bandLabel, bandClass,
// trendLabel, signScoreLabel, clinicianRoleLabel, careSettingLabel,
// modeOfDeliveryLabel, sexLabel, priorityLabel).

/**
 * @typedef {'midwife' | 'obstetrician' | 'neonatologist' | 'neonatal-nurse' | 'paediatrician' | 'other' | ''} ClinicianRole
 * @typedef {'delivery-room' | 'theatre' | 'birth-centre' | 'home' | 'neonatal-unit' | 'other' | ''} CareSetting
 * @typedef {'vaginal' | 'assisted' | 'caesarean' | 'other' | ''} ModeOfDelivery
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'0' | '1' | '2' | ''} SignScore
 * @typedef {'reassuring' | 'moderately-low' | 'low'} Band
 * @typedef {'improving' | 'static' | 'falling' | 'insufficient'} Trend
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — birth context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} bornAt              - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {number | null} gestationalAgeWeeks
 * @property {ModeOfDelivery} modeOfDelivery
 */

/**
 * Step 2 — newborn identification.
 * @typedef {Object} Identification
 * @property {string} newbornIdentifier
 * @property {Sex} sex
 * @property {number | null} birthOrder
 */

/**
 * One repeated timepoint (mirrors an apgar_score_timepoint row). The five
 * signs are each an explicit 0/1/2 selection; `total` and `band` are derived
 * by the grader and never stored as input here.
 * @typedef {Object} Timepoint
 * @property {number | null} timepointMinutes  - 1, 5, 10, 15, 20, ...
 * @property {SignScore} appearance            - A — skin colour
 * @property {SignScore} pulse                 - P — heart rate
 * @property {SignScore} grimace               - G — reflex irritability
 * @property {SignScore} activity              - A — muscle tone
 * @property {SignScore} respiration           - R — respiration
 */

/**
 * Step 4 — resuscitation measures and clinician note.
 * @typedef {Object} Summary
 * @property {string} resuscitationMeasures
 * @property {string} clinicianNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Timepoint[]} timepoints        - repeated per-timepoint scores
 * @property {Summary} summary
 */

/**
 * @typedef {Object} GradedTimepoint
 * @property {number | null} timepointMinutes
 * @property {number} total                  - 0..10 (sum of the five signs)
 * @property {Band} band                     - reassuring | moderately-low | low
 * @property {number} answeredCount          - how many of the five signs answered
 * @property {boolean} scored                - true when at least one sign answered
 */

/**
 * @typedef {Object} FiredSign
 * @property {string} id                     - stable rule id, e.g. R-APPEARANCE-01
 * @property {number | null} timepointMinutes
 * @property {string} sign                   - appearance | pulse | grimace | activity | respiration
 * @property {number} points                 - the 0/1/2 selection for this sign
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
 * @property {GradedTimepoint[]} timepoints
 * @property {Trend} trend
 * @property {FiredSign[]} firedSigns
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/**
 * Build a fresh, blank timepoint.
 * @param {number | null} minutes
 * @returns {Timepoint}
 */
function emptyTimepoint(minutes) {
  return {
    timepointMinutes: minutes === undefined ? null : minutes,
    appearance: '',
    pulse: '',
    grimace: '',
    activity: '',
    respiration: ''
  };
}

/**
 * Build a fresh, fully-blank assessment. The 1- and 5-minute timepoints are
 * always present; the clinician adds a 10-minute (and later) timepoint when
 * the 5-minute total is below 7.
 * Strings default to `''`; numeric fields default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    context: {
      clinicianName: '',
      clinicianRole: '',
      bornAt: '',
      careSetting: '',
      gestationalAgeWeeks: null,
      modeOfDelivery: ''
    },
    identification: {
      newbornIdentifier: '',
      sex: '',
      birthOrder: null
    },
    timepoints: [emptyTimepoint(1), emptyTimepoint(5)],
    summary: {
      resuscitationMeasures: '',
      clinicianNote: ''
    }
  };
}

/** The five Apgar signs, in APGAR order, with per-score descriptions. */
const SIGNS = [
  {
    field: 'appearance', letter: 'A', label: 'Appearance (skin colour)',
    scores: {
      '0': 'Blue or pale all over',
      '1': 'Body pink, extremities blue (acrocyanosis)',
      '2': 'Completely pink'
    }
  },
  {
    field: 'pulse', letter: 'P', label: 'Pulse (heart rate)',
    scores: {
      '0': 'Absent',
      '1': 'Below 100 beats per minute',
      '2': '100 beats per minute or more'
    }
  },
  {
    field: 'grimace', letter: 'G', label: 'Grimace (reflex irritability)',
    scores: {
      '0': 'No response to stimulation',
      '1': 'Grimace or feeble cry when stimulated',
      '2': 'Cry, cough, sneeze, or pulls away'
    }
  },
  {
    field: 'activity', letter: 'A', label: 'Activity (muscle tone)',
    scores: {
      '0': 'Limp / floppy',
      '1': 'Some flexion of limbs',
      '2': 'Active movement'
    }
  },
  {
    field: 'respiration', letter: 'R', label: 'Respiration',
    scores: {
      '0': 'Absent',
      '1': 'Slow, irregular, or weak cry',
      '2': 'Strong, regular cry'
    }
  }
];

/** Band label for display. */
function bandLabel(band) {
  switch (band) {
    case 'reassuring': return 'Reassuring (7-10)';
    case 'moderately-low': return 'Moderately low (4-6)';
    case 'low': return 'Low (0-3)';
    default: return '';
  }
}

/** CSS class hint for the band badge (reuses the shared risk palette). */
function bandClass(band) {
  switch (band) {
    case 'reassuring': return 'risk-low';
    case 'moderately-low': return 'risk-moderate';
    case 'low': return 'risk-critical';
    default: return '';
  }
}

/** Trend label for display. */
function trendLabel(trend) {
  switch (trend) {
    case 'improving': return 'Improving';
    case 'static': return 'Static';
    case 'falling': return 'Falling';
    case 'insufficient': return 'Insufficient data';
    default: return '';
  }
}

/** Human label for a single 0/1/2 sign score. */
function signScoreLabel(field, score) {
  const sign = SIGNS.find((s) => s.field === field);
  if (!sign || score === '' || score == null) return '';
  return sign.scores[String(score)] || '';
}

/** Attending-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'midwife': return 'Midwife';
    case 'obstetrician': return 'Obstetrician';
    case 'neonatologist': return 'Neonatologist';
    case 'neonatal-nurse': return 'Neonatal nurse';
    case 'paediatrician': return 'Paediatrician';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'delivery-room': return 'Delivery room';
    case 'theatre': return 'Obstetric theatre';
    case 'birth-centre': return 'Birth centre';
    case 'home': return 'Home birth';
    case 'neonatal-unit': return 'Neonatal unit';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Mode-of-delivery label. */
function modeOfDeliveryLabel(mode) {
  switch (mode) {
    case 'vaginal': return 'Vaginal';
    case 'assisted': return 'Assisted (forceps / ventouse)';
    case 'caesarean': return 'Caesarean';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Newborn-sex label. */
function sexLabel(sex) {
  switch (sex) {
    case 'female': return 'Female';
    case 'male': return 'Male';
    case 'intersex': return 'Intersex';
    case 'unknown': return 'Unknown';
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

export { emptyAssessment, emptyTimepoint, SIGNS, bandLabel, bandClass, trendLabel, signScoreLabel, clinicianRoleLabel, careSettingLabel, modeOfDeliveryLabel, sexLabel, priorityLabel };
