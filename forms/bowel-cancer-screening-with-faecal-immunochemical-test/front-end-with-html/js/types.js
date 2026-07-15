// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Bowel Cancer Screening with
// Faecal Immunochemical Test (FIT) form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_bowel_cancer_screening_fit.sql`
// (`faecal_haemoglobin_ug_g` -> `faecalHaemoglobinUgG`,
// `threshold_applied` -> `thresholdApplied`,
// `red_flag_symptoms` -> `redFlagSymptoms`). This file builds and exports the
// canonical empty AssessmentData shape used by the wizard, so that newly-added
// fields automatically default correctly when older saved state is rehydrated
// from localStorage. It also exports display helpers (resultClassLabel,
// resultClassClass, managementActionLabel, clinicianRoleLabel, sexLabel,
// withinAgeRangeLabel, sampleAdequacyLabel, priorityLabel).

/**
 * @typedef {'screening-administrator' | 'screening-practitioner' | 'gp' | 'ssp' | 'other' | ''} ClinicianRole
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'eligible' | 'over-age-self-request' | 'not-eligible' | ''} WithinAgeRange
 * @typedef {'two-yearly' | 'other' | ''} RecallInterval
 * @typedef {'first-invitation' | 'prior-negative' | 'prior-positive' | 'unknown' | ''} PreviousOutcome
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'adequate' | 'spoilt' | 'insufficient' | 'expired' | ''} SampleAdequacy
 * @typedef {'leaked' | 'undated' | 'unlabelled' | 'too-old' | 'damaged' | ''} SpoiltReason
 * @typedef {'negative' | 'positive' | 'spoilt' | ''} ResultClass
 * @typedef {'routine-recall' | 'refer-colonoscopy' | 'repeat-kit' | ''} ManagementAction
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} reviewedAt        - ISO-ish datetime-local string; '' when unset
 * @property {string} screeningHub
 */

/**
 * Step 2 — participant identification.
 * @typedef {Object} Identification
 * @property {string} participantIdentifier
 * @property {string} nhsNumber
 * @property {number | null} participantAge   - years
 * @property {Sex} sex
 */

/**
 * Step 3 — eligibility and invitation.
 * @typedef {Object} Eligibility
 * @property {WithinAgeRange} withinAgeRange
 * @property {RecallInterval} recallInterval
 * @property {string} invitationDate          - date string; '' when unset
 * @property {PreviousOutcome} previousOutcome
 */

/**
 * Step 4 — kit return and adequacy.
 * @typedef {Object} Kit
 * @property {YesNo} kitReturned
 * @property {string} returnDate              - date string; '' when unset
 * @property {SampleAdequacy} sampleAdequacy
 * @property {SpoiltReason} spoiltReason
 */

/**
 * Step 5 — FIT result.
 * @typedef {Object} Result
 * @property {number | null} faecalHaemoglobinUgG - measured faecal Hb in ug Hb/g
 * @property {string} assay                        - analyser / assay identifier
 * @property {number | null} thresholdApplied      - programme threshold in ug Hb/g; default 120
 */

/**
 * Step 6 — symptoms.
 * @typedef {Object} Symptoms
 * @property {YesNo} redFlagSymptoms          - supports the symptomatic-suspected-cancer flag
 */

/**
 * Step 7 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Eligibility} eligibility
 * @property {Kit} kit
 * @property {Result} result
 * @property {Symptoms} symptoms
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-CLASSIFY-POSITIVE-01
 * @property {string} instrument   - return | adequacy | classification | symptomatic
 * @property {string} band         - negative | positive | spoilt | unknown
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
 * @property {ResultClass} resultClass
 * @property {ManagementAction} managementAction
 * @property {boolean} symptomaticPathway
 * @property {'complete' | 'incomplete' | ''} status
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/** Default programme (screening) threshold in ug Hb/g. */
const DEFAULT_THRESHOLD = 120;

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`; the programme
 * threshold pre-fills to the screening default of 120 ug Hb/g.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    context: {
      clinicianName: '',
      clinicianRole: '',
      reviewedAt: '',
      screeningHub: ''
    },
    identification: {
      participantIdentifier: '',
      nhsNumber: '',
      participantAge: null,
      sex: ''
    },
    eligibility: {
      withinAgeRange: '',
      recallInterval: '',
      invitationDate: '',
      previousOutcome: ''
    },
    kit: {
      kitReturned: '',
      returnDate: '',
      sampleAdequacy: '',
      spoiltReason: ''
    },
    result: {
      faecalHaemoglobinUgG: null,
      assay: '',
      thresholdApplied: DEFAULT_THRESHOLD
    },
    symptoms: {
      redFlagSymptoms: ''
    },
    note: {
      clinicalNote: ''
    }
  };
}

/** Result-class label for display. */
function resultClassLabel(resultClass) {
  switch (resultClass) {
    case 'negative': return 'Negative — below threshold';
    case 'positive': return 'Positive — at or above threshold';
    case 'spoilt': return 'Spoilt / inadequate';
    default: return 'Not classified';
  }
}

/** CSS class hint for the result-class badge (reuses the shared risk palette). */
function resultClassClass(resultClass) {
  switch (resultClass) {
    case 'negative': return 'risk-low';
    case 'spoilt': return 'risk-medium';
    case 'positive': return 'risk-high';
    default: return '';
  }
}

/** Management-action label for display. */
function managementActionLabel(action) {
  switch (action) {
    case 'routine-recall': return 'Routine two-yearly recall';
    case 'refer-colonoscopy': return 'Refer for colonoscopy';
    case 'repeat-kit': return 'Repeat kit / reminder';
    default: return 'Not determined';
  }
}

/** Reviewing clinician / administrator role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'screening-administrator': return 'Screening administrator';
    case 'screening-practitioner': return 'Screening practitioner';
    case 'gp': return 'GP';
    case 'ssp': return 'Specialist screening practitioner (SSP)';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Participant-sex label. */
function sexLabel(sex) {
  switch (sex) {
    case 'female': return 'Female';
    case 'male': return 'Male';
    case 'intersex': return 'Intersex';
    case 'unknown': return 'Unknown';
    default: return '';
  }
}

/** Eligibility-against-age-range label. */
function withinAgeRangeLabel(value) {
  switch (value) {
    case 'eligible': return 'Eligible (within age range)';
    case 'over-age-self-request': return 'Over age — self-request';
    case 'not-eligible': return 'Not eligible';
    default: return '';
  }
}

/** Sample-adequacy label. */
function sampleAdequacyLabel(value) {
  switch (value) {
    case 'adequate': return 'Adequate';
    case 'spoilt': return 'Spoilt';
    case 'insufficient': return 'Insufficient';
    case 'expired': return 'Expired';
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

export { DEFAULT_THRESHOLD, emptyAssessment, resultClassLabel, resultClassClass, managementActionLabel, clinicianRoleLabel, sexLabel, withinAgeRangeLabel, sampleAdequacyLabel, priorityLabel };
