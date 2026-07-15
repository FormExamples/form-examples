// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the SOAP Note form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_soap_note.sql`. This file builds and exports the
// canonical empty AssessmentData shape used by the wizard, so that newly-added
// fields automatically default correctly when older saved state is rehydrated
// from localStorage. It also exports display helpers (statusLabel, statusClass,
// priorityLabel, and enum label maps for the context / identification fields).
//
// Unlike a numeric-score form, the engine here grades DOCUMENTATION COMPLETENESS
// across the four SOAP sections (Subjective, Objective, Assessment, Plan). It
// classifies the note as Complete / Partial / Incomplete, reports a
// `completenessPercent`, and — independently — raises safety flags with a
// priority. It is NOT a numeric clinical severity score.

/**
 * @typedef {'doctor' | 'nurse' | 'paramedic' | 'pharmacist' | 'allied-health' | 'other' | ''} ClinicianRole
 * @typedef {'general-practice' | 'outpatient' | 'ward' | 'emergency-department' | 'community' | 'telehealth' | 'other' | ''} CareSetting
 * @typedef {'new-problem' | 'follow-up' | 'review' | 'other' | ''} EncounterType
 * @typedef {'under-18' | '18-39' | '40-59' | '60-74' | '75-plus' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'complete' | 'partial' | 'incomplete'} CompletenessStatus
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — encounter context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} encounteredAt      - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {EncounterType} encounterType
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 */

/**
 * Step 3 — Subjective (S).
 * @typedef {Object} Subjective
 * @property {string} presentingComplaint            - required component
 * @property {string} historyOfPresentingComplaint   - required component
 * @property {string} patientReportedSymptoms        - optional
 * @property {string} relevantHistory                - past history / medication / allergies
 * @property {YesNo} redFlagSymptoms                 - drives conditional safety-netting requirement
 */

/**
 * Step 4 — Objective (O).
 * @typedef {Object} Objective
 * @property {string} examinationFindings   - satisfies Objective when non-empty
 * @property {string} vitalSigns            - satisfies Objective when non-empty
 * @property {YesNo} abnormalVitalsPresent  - drives the abnormal-vitals-unaddressed flag
 * @property {string} investigationResults  - satisfies Objective when non-empty
 */

/**
 * Step 5 — Assessment (A).
 * @typedef {Object} Assessment
 * @property {string} primaryDiagnosis    - primary diagnosis or problem — required component
 * @property {string} problemList         - optional
 * @property {string} differential        - optional
 * @property {string} clinicalImpression  - optional
 */

/**
 * Step 6 — Plan (P).
 * @typedef {Object} Plan
 * @property {string} investigationsPlan  - plan item
 * @property {string} treatmentPlan       - plan item
 * @property {string} referrals           - plan item
 * @property {string} followUp            - plan item + satisfies conditional follow-up requirement
 * @property {string} safetyNetting       - conditional safety component
 * @property {YesNo} managedAtHome        - drives the conditional safety-netting requirement
 */

/**
 * Step 7 — summary.
 * @typedef {Object} Summary
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Subjective} subjective
 * @property {Objective} objective
 * @property {Assessment} assessment
 * @property {Plan} plan
 * @property {Summary} summary
 */

/**
 * Per-SOAP-section presence row.
 * @typedef {Object} SectionStatus
 * @property {string} section     - subjective | objective | assessment | plan
 * @property {string} label       - human-readable section name
 * @property {boolean} present    - true when the section's required component(s) are recorded
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-ASSESSMENT-PRESENT-01
 * @property {string} section      - subjective | objective | assessment | plan | completeness
 * @property {string} category
 * @property {string} description
 */

/**
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category      - missing-assessment | missing-plan | red-flag-no-plan | ...
 * @property {Priority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

/**
 * @typedef {Object} GradingResult
 * @property {CompletenessStatus} status
 * @property {number} completenessPercent      - 0..100
 * @property {SectionStatus[]} sectionStatuses
 * @property {{subjectivePresent: boolean, objectivePresent: boolean, assessmentPresent: boolean, planPresent: boolean}} presence
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.SoapNote`.

/**
 * Build a fresh, fully-blank note. Every text / enum field defaults to `''`;
 * there are no numeric input fields in this documentation instrument.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    context: {
      clinicianName: '',
      clinicianRole: '',
      encounteredAt: '',
      careSetting: '',
      encounterType: ''
    },
    identification: {
      patientIdentifier: '',
      ageBand: '',
      sex: ''
    },
    subjective: {
      presentingComplaint: '',
      historyOfPresentingComplaint: '',
      patientReportedSymptoms: '',
      relevantHistory: '',
      redFlagSymptoms: ''
    },
    objective: {
      examinationFindings: '',
      vitalSigns: '',
      abnormalVitalsPresent: '',
      investigationResults: ''
    },
    assessment: {
      primaryDiagnosis: '',
      problemList: '',
      differential: '',
      clinicalImpression: ''
    },
    plan: {
      investigationsPlan: '',
      treatmentPlan: '',
      referrals: '',
      followUp: '',
      safetyNetting: '',
      managedAtHome: ''
    },
    summary: {
      clinicalNote: ''
    }
  };
}

/** The four SOAP sections, in order. */
const SOAP_SECTIONS = [
  { section: 'subjective', label: 'Subjective' },
  { section: 'objective',  label: 'Objective' },
  { section: 'assessment', label: 'Assessment' },
  { section: 'plan',       label: 'Plan' }
];

/** Completeness-status label for display. */
function statusLabel(status) {
  switch (status) {
    case 'complete': return 'Complete';
    case 'partial': return 'Partial';
    case 'incomplete': return 'Incomplete';
    default: return '';
  }
}

/** CSS class hint for the completeness-status badge (shared risk palette). */
function statusClass(status) {
  switch (status) {
    case 'complete': return 'risk-low';       // green — note stands alone
    case 'partial': return 'risk-moderate';   // amber — documentation gaps
    case 'incomplete': return 'risk-high';    // red — a critical section is absent
    default: return '';
  }
}

/** Authoring-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'doctor': return 'Doctor';
    case 'nurse': return 'Nurse';
    case 'paramedic': return 'Paramedic';
    case 'pharmacist': return 'Pharmacist';
    case 'allied-health': return 'Allied-health professional';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'general-practice': return 'General practice';
    case 'outpatient': return 'Outpatient clinic';
    case 'ward': return 'Hospital ward';
    case 'emergency-department': return 'Emergency department';
    case 'community': return 'Community / allied-health';
    case 'telehealth': return 'Telehealth';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Encounter-type label. */
function encounterTypeLabel(type) {
  switch (type) {
    case 'new-problem': return 'New problem';
    case 'follow-up': return 'Follow-up';
    case 'review': return 'Review';
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

/** Age-band label. */
function ageBandLabel(band) {
  switch (band) {
    case 'under-18': return 'Under 18';
    case '18-39': return '18-39';
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

export { emptyAssessment, SOAP_SECTIONS, statusLabel, statusClass, clinicianRoleLabel, careSettingLabel, encounterTypeLabel, sexLabel, ageBandLabel, priorityLabel };
