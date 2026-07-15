// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Breast Screening Record
// (NHS Breast Screening Programme).
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_breast_screening.sql`. This file builds and exports the
// canonical empty ScreeningData shape used by the wizard, so that newly-added
// fields automatically default correctly when older saved state is rehydrated
// from localStorage. It also exports display helpers (eligibilityLabel,
// readingOutcomeLabel, imagingClassLabel, screeningOutcomeLabel,
// outcomeBandLabel, outcomeBandClass, clinicianRoleLabel, episodeTypeLabel,
// priorityLabel).

/**
 * @typedef {'mammographer' | 'advanced-practitioner' | 'breast-radiologist' | 'screening-office' | 'other' | ''} ClinicianRole
 * @typedef {'routine-recall' | 'very-first-call' | 'self-referral' | 'higher-risk-surveillance' | ''} EpisodeType
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'yes' | 'no' | 'declined' | ''} Consent
 * @typedef {'standard-four-view' | 'additional-views' | 'unable-to-image' | ''} ViewsTaken
 * @typedef {'adequate' | 'inadequate' | ''} ImageAdequacy
 * @typedef {'normal' | 'recall' | 'technical' | ''} ReadOpinion
 * @typedef {'normal' | 'recall' | 'technical' | 'not-required' | ''} ArbitrationOutcome
 * @typedef {'normal-routine-recall' | 'technical-repeat' | 'recall-for-assessment' | ''} ReadingOutcome
 * @typedef {1 | 2 | 3 | 4 | 5 | null} ImagingClassification
 * @typedef {'eligible' | 'outside-age-range' | 'higher-risk-surveillance' | 'symptomatic-referral' | ''} EligibilityStatus
 * @typedef {'routine-recall' | 'technical-repeat' | 'recall-to-assessment-clinic' | 'short-interval-follow-up' | 'urgent-breast-clinic' | 'symptomatic-pathway-referral' | ''} ScreeningOutcome
 * @typedef {'routine' | 'repeat' | 'assessment' | 'urgent' | 'referral' | 'incomplete'} OutcomeBand
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — screening context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} reportedAt         - ISO-ish datetime-local string; '' when unset
 * @property {string} screeningUnit
 * @property {EpisodeType} episodeType
 */

/**
 * Step 2 — identification and eligibility.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {number | null} ageYears
 * @property {string} lastScreenedDate   - ISO date string; '' when unset
 * @property {YesNo} higherRiskSurveillance
 */

/**
 * Step 3 — symptom and consent check.
 * @typedef {Object} Eligibility
 * @property {YesNo} symptomatic
 * @property {Consent} consentGiven
 */

/**
 * Step 4 — mammogram.
 * @typedef {Object} Mammogram
 * @property {ViewsTaken} viewsTaken
 * @property {ImageAdequacy} imageAdequacy
 */

/**
 * Step 5 — reading outcome (double reading + arbitration).
 * @typedef {Object} Reading
 * @property {ReadOpinion} firstReadOpinion
 * @property {ReadOpinion} secondReadOpinion
 * @property {ArbitrationOutcome} arbitrationOutcome
 * @property {ReadingOutcome} readingOutcome
 */

/**
 * Step 6 — assessment result (only when recalled for assessment).
 * @typedef {Object} Assessment
 * @property {YesNo} assessmentPerformed
 * @property {string[]} assessmentModalities  - subset of mammography|ultrasound|biopsy
 * @property {ImagingClassification} imagingClassification
 */

/**
 * Step 7 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalContext
 */

/**
 * @typedef {Object} ScreeningData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Eligibility} eligibility
 * @property {Mammogram} mammogram
 * @property {Reading} reading
 * @property {Assessment} assessment
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-RECALL-ASSESSMENT-01
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
 * @property {EligibilityStatus} eligibilityStatus
 * @property {ReadingOutcome} readingOutcome
 * @property {ImagingClassification} imagingClassification
 * @property {ScreeningOutcome} screeningOutcome
 * @property {OutcomeBand} outcomeBand
 * @property {'complete' | 'incomplete'} status
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank screening record.
 * Strings default to `''`; numeric/date fields default to `null`/`''`;
 * multi-selects default to `[]`.
 * @returns {ScreeningData}
 */
function emptyAssessment() {
  return {
    context: {
      clinicianName: '',
      clinicianRole: '',
      reportedAt: '',
      screeningUnit: '',
      episodeType: ''
    },
    identification: {
      patientIdentifier: '',
      ageYears: null,
      lastScreenedDate: '',
      higherRiskSurveillance: ''
    },
    eligibility: {
      symptomatic: '',
      consentGiven: ''
    },
    mammogram: {
      viewsTaken: '',
      imageAdequacy: ''
    },
    reading: {
      firstReadOpinion: '',
      secondReadOpinion: '',
      arbitrationOutcome: '',
      readingOutcome: ''
    },
    assessment: {
      assessmentPerformed: '',
      assessmentModalities: [],
      imagingClassification: null
    },
    note: {
      clinicalContext: ''
    }
  };
}

/** Eligibility-status label for display. */
function eligibilityLabel(status) {
  switch (status) {
    case 'eligible': return 'Eligible for routine screening';
    case 'outside-age-range': return 'Outside eligible age range';
    case 'higher-risk-surveillance': return 'Higher-risk surveillance pathway';
    case 'symptomatic-referral': return 'Symptomatic — refer to breast pathway';
    default: return '';
  }
}

/** Reading-outcome label. */
function readingOutcomeLabel(outcome) {
  switch (outcome) {
    case 'normal-routine-recall': return 'Normal — routine recall';
    case 'technical-repeat': return 'Technical repeat';
    case 'recall-for-assessment': return 'Recall for assessment';
    default: return 'Not recorded';
  }
}

/** Five-point breast imaging classification label. */
function imagingClassLabel(cls) {
  switch (cls) {
    case 1: return '1 — Normal';
    case 2: return '2 — Benign';
    case 3: return '3 — Indeterminate / probably benign';
    case 4: return '4 — Suspicious';
    case 5: return '5 — Malignant';
    default: return 'Not assessed';
  }
}

/** Screening-outcome / next-action label. */
function screeningOutcomeLabel(outcome) {
  switch (outcome) {
    case 'routine-recall': return 'Routine 3-yearly recall';
    case 'technical-repeat': return 'Technical repeat mammogram';
    case 'recall-to-assessment-clinic': return 'Recall to assessment clinic';
    case 'short-interval-follow-up': return 'Short-interval follow-up';
    case 'urgent-breast-clinic': return 'Urgent breast-clinic referral';
    case 'symptomatic-pathway-referral': return 'Symptomatic-pathway referral';
    default: return 'Outcome incomplete';
  }
}

/** Outcome-band label. */
function outcomeBandLabel(band) {
  switch (band) {
    case 'routine': return 'Routine recall';
    case 'repeat': return 'Technical repeat';
    case 'assessment': return 'Assessment';
    case 'urgent': return 'Urgent';
    case 'referral': return 'Referral';
    case 'incomplete': return 'Incomplete';
    default: return '';
  }
}

/** CSS class hint for the outcome-band badge (reuses the shared risk palette). */
function outcomeBandClass(band) {
  switch (band) {
    case 'routine': return 'risk-low';
    case 'repeat': return 'risk-moderate';
    case 'assessment': return 'risk-medium';
    case 'urgent': return 'risk-critical';
    case 'referral': return 'risk-high';
    default: return '';
  }
}

/** Reporting-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'mammographer': return 'Mammographer';
    case 'advanced-practitioner': return 'Advanced-practitioner radiographer';
    case 'breast-radiologist': return 'Breast radiologist';
    case 'screening-office': return 'Screening office';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Episode-type label. */
function episodeTypeLabel(type) {
  switch (type) {
    case 'routine-recall': return 'Routine recall';
    case 'very-first-call': return 'Very first call';
    case 'self-referral': return 'Self-referral';
    case 'higher-risk-surveillance': return 'Higher-risk surveillance';
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

export { emptyAssessment, eligibilityLabel, readingOutcomeLabel, imagingClassLabel, screeningOutcomeLabel, outcomeBandLabel, outcomeBandClass, clinicianRoleLabel, episodeTypeLabel, priorityLabel };
