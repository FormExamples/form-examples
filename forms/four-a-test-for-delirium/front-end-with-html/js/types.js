// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the 4AT (4 'A's Test) rapid
// delirium and cognitive-impairment screen.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_four_a_test_for_delirium.sql`. This file builds and
// exports the canonical empty AssessmentData shape used by the wizard, so that
// newly-added fields automatically default correctly when older saved state is
// rehydrated from localStorage. It also exports display helpers
// (interpretationBandLabel, interpretationBandClass, settingLabel,
// alertnessLabel, amt4Label, attentionLabel, acuteChangeLabel,
// acuteChangeSourceLabel, priorityLabel).

/**
 * @typedef {'acute' | 'ed' | 'periop' | 'careHome' | 'community' | 'other' | ''} Setting
 * @typedef {'normal' | 'mildTransient' | 'abnormal' | ''} Alertness
 * @typedef {'noMistakes' | 'oneMistake' | 'twoOrMoreOrUntestable' | ''} Amt4
 * @typedef {'sevenOrMore' | 'startsButUnderSevenOrRefuses' | 'untestable' | ''} AttentionMonths
 * @typedef {'no' | 'yes' | ''} AcuteChange
 * @typedef {'patient' | 'collateral' | 'records' | 'none' | ''} AcuteChangeSource
 * @typedef {'unlikely' | 'possibleCognitiveImpairment' | 'possibleDelirium'} InterpretationBand
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — patient and assessment identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {string} patientName
 * @property {string | null} dateOfBirth   - ISO date string; null when unset
 * @property {string | null} assessmentDate - ISO date string; null when unset
 * @property {string | null} assessmentTime - HH:MM string; null when unset
 * @property {Setting} setting
 * @property {string} assessorName
 * @property {string} assessorRole
 */

/**
 * Step 2 — item 1 alertness.
 * @typedef {Object} Item1
 * @property {Alertness} alertness
 */

/**
 * Step 3 — item 2 AMT4 (age, date of birth, place, current year).
 * @typedef {Object} Item2
 * @property {Amt4} amt4
 */

/**
 * Step 4 — item 3 attention (months of the year backwards).
 * @typedef {Object} Item3
 * @property {AttentionMonths} attentionMonths
 */

/**
 * Step 5 — item 4 acute change or fluctuating course.
 * @typedef {Object} Item4
 * @property {AcuteChange} acuteChange
 * @property {AcuteChangeSource} acuteChangeSource
 */

/**
 * Step 6 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Identification} identification
 * @property {Item1} item1
 * @property {Item2} item2
 * @property {Item3} item3
 * @property {Item4} item4
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-ALERTNESS-01
 * @property {string} item         - alertness | amt4 | attention | acute-change | band
 * @property {number} points       - points contributed (0, 1, 2, or 4)
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
 * @property {0 | 4} item1Score
 * @property {0 | 1 | 2} item2Score
 * @property {0 | 1 | 2} item3Score
 * @property {0 | 4} item4Score
 * @property {number} totalScore                    - 0..12
 * @property {InterpretationBand} interpretationBand
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.FourATestForDelirium`.

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; date/time fields default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    identification: {
      patientIdentifier: '',
      patientName: '',
      dateOfBirth: null,
      assessmentDate: null,
      assessmentTime: null,
      setting: '',
      assessorName: '',
      assessorRole: ''
    },
    item1: {
      alertness: ''
    },
    item2: {
      amt4: ''
    },
    item3: {
      attentionMonths: ''
    },
    item4: {
      acuteChange: '',
      acuteChangeSource: ''
    },
    note: {
      clinicalNotes: ''
    }
  };
}

/** Interpretation-band label for display. */
function interpretationBandLabel(band) {
  switch (band) {
    case 'unlikely':
      return 'Delirium unlikely (score 0)';
    case 'possibleCognitiveImpairment':
      return 'Possible cognitive impairment (score 1-3)';
    case 'possibleDelirium':
      return 'Possible delirium (score 4 or more)';
    default:
      return '';
  }
}

/** CSS class hint for the interpretation-band badge (shared risk palette). */
function interpretationBandClass(band) {
  switch (band) {
    case 'unlikely': return 'risk-low';
    case 'possibleCognitiveImpairment': return 'risk-moderate';
    case 'possibleDelirium': return 'risk-high';
    default: return '';
  }
}

/** Care-setting label. */
function settingLabel(setting) {
  switch (setting) {
    case 'acute': return 'Acute medical admission';
    case 'ed': return 'Emergency department';
    case 'periop': return 'Peri-operative / post-operative';
    case 'careHome': return 'Care home';
    case 'community': return 'Community';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Item 1 alertness label. */
function alertnessLabel(value) {
  switch (value) {
    case 'normal': return 'Normal — fully alert, not agitated';
    case 'mildTransient': return 'Mild sleepiness < 10 seconds after waking, then normal';
    case 'abnormal': return 'Clearly abnormal — markedly drowsy or agitated / hyperactive';
    default: return '';
  }
}

/** Item 2 AMT4 mistake-band label. */
function amt4Label(value) {
  switch (value) {
    case 'noMistakes': return 'No mistakes';
    case 'oneMistake': return '1 mistake';
    case 'twoOrMoreOrUntestable': return '2 or more mistakes, or untestable';
    default: return '';
  }
}

/** Item 3 attention (months backwards) label. */
function attentionLabel(value) {
  switch (value) {
    case 'sevenOrMore': return 'Achieves 7 or more months correctly';
    case 'startsButUnderSevenOrRefuses': return 'Starts but scores < 7 months, or refuses to start';
    case 'untestable': return 'Untestable — cannot start (unwell, drowsy, or inattentive)';
    default: return '';
  }
}

/** Item 4 acute-change label. */
function acuteChangeLabel(value) {
  switch (value) {
    case 'no': return 'No';
    case 'yes': return 'Yes';
    default: return '';
  }
}

/** Item 4 acute-change information-source label. */
function acuteChangeSourceLabel(value) {
  switch (value) {
    case 'patient': return 'Patient';
    case 'collateral': return 'Collateral history';
    case 'records': return 'Records';
    case 'none': return 'None available';
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

export { emptyAssessment, interpretationBandLabel, interpretationBandClass, settingLabel, alertnessLabel, amt4Label, attentionLabel, acuteChangeLabel, acuteChangeSourceLabel, priorityLabel };
