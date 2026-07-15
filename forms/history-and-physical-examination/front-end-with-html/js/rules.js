// Declarative H&P completeness rules.
//
// Unlike a scored instrument, the H&P is graded on DOCUMENTATION COMPLETENESS:
// ten required components are each evaluated as satisfied (documented) or
// missing. Each rule below returns true when its required component is
// satisfactorily documented; the grader (`grader.js`) counts the satisfied
// components, derives the completeness percentage, and classifies the record as
// complete / partial / incomplete. Rows here mirror the
// `history_and_physical_examination_grade_rule` SQL table
// (rule_id, section, category, description).
//
// This module also exports the shared predicates and vital-sign reference
// ranges used by both the grader and the flag detector, so the completeness
// contract lives in exactly one place.

/**
 * @typedef {import('./types.js').ClerkingRecord} ClerkingRecord
 *
 * @typedef {Object} ComponentRule
 * @property {string} id           - stable rule id
 * @property {string} component    - required-component id (kebab-case)
 * @property {string} label        - human-readable component name
 * @property {string} section      - history | examination | vitals | impression | plan
 * @property {string} category
 * @property {string} description
 * @property {(r: ClerkingRecord) => boolean} evaluate
 */

// Wrapped in an IIFE; published via window.HistoryAndPhysicalExamination.

/** Trim helper — treats undefined / null as empty. */
function nonEmpty(v) {
  return typeof v === 'string' && v.trim() !== '';
}

// Normal ranges per spec §3; a recorded value outside its range is abnormal.
const VITAL_RANGES = {
  temperature: { min: 36.1, max: 38.0, unit: '°C', label: 'Temperature' },
  heartRate: { min: 51, max: 90, unit: 'bpm', label: 'Heart rate' },
  respiratoryRate: { min: 12, max: 20, unit: '/min', label: 'Respiratory rate' },
  systolicBloodPressure: { min: 111, max: 219, unit: 'mmHg', label: 'Systolic blood pressure' },
  oxygenSaturation: { min: 96, max: 100, unit: '%', label: 'Oxygen saturation' }
};

// The four core examination systems that must be examined or explicitly
// deferred for the core-examination component to be satisfied.
const CORE_EXAM_FIELDS = [
  { field: 'examCardiovascular', label: 'Cardiovascular' },
  { field: 'examRespiratory', label: 'Respiratory' },
  { field: 'examAbdominal', label: 'Abdominal' },
  { field: 'examNeurological', label: 'Neurological' }
];

// The required history sections that drive the incomplete-history flag.
const REQUIRED_HISTORY_FIELDS = [
  { field: 'presentingComplaint', label: 'Presenting complaint' },
  { field: 'historyOfPresentingComplaint', label: 'History of presenting complaint' },
  { field: 'pastMedicalSurgicalHistory', label: 'Past medical and surgical history' },
  { field: 'drugHistory', label: 'Drug history' },
  { field: 'socialHistory', label: 'Social history' },
  { field: 'systemsReview', label: 'Systems review' }
];

/** Allergy status is documented when it is recorded and not 'not-documented'. */
function allergyDocumented(r) {
  return r.allergyStatus !== '' && r.allergyStatus !== 'not-documented' &&
    r.allergyStatus != null;
}

/** At least one vital sign (numeric or consciousness level) has been recorded. */
function anyVitalRecorded(r) {
  return (
    r.temperature !== null && r.temperature !== undefined ||
    r.heartRate !== null && r.heartRate !== undefined ||
    r.respiratoryRate !== null && r.respiratoryRate !== undefined ||
    r.systolicBloodPressure !== null && r.systolicBloodPressure !== undefined ||
    r.oxygenSaturation !== null && r.oxygenSaturation !== undefined ||
    nonEmpty(r.consciousnessLevel)
  );
}

/** All four core examination systems examined or explicitly deferred. */
function coreExamAddressed(r) {
  return CORE_EXAM_FIELDS.every((c) => nonEmpty(r[c.field]));
}

/** Core exam systems not yet examined or deferred. */
function missingCoreExam(r) {
  return CORE_EXAM_FIELDS.filter((c) => !nonEmpty(r[c.field])).map((c) => c.label);
}

/** Required history sections left blank. */
function missingHistory(r) {
  const missing = REQUIRED_HISTORY_FIELDS
    .filter((h) => !nonEmpty(r[h.field]))
    .map((h) => h.label);
  if (!allergyDocumented(r)) missing.push('Allergy status');
  return missing;
}

/**
 * A single recorded vital sign is abnormal when it falls outside its normal
 * range. Null (not measured) is never abnormal. Consciousness is abnormal when
 * recorded as anything other than 'alert'.
 */
function abnormalVitals(r) {
  const abnormal = [];
  for (const key of Object.keys(VITAL_RANGES)) {
    const v = r[key];
    if (v === null || v === undefined) continue;
    const range = VITAL_RANGES[key];
    if (v < range.min || v > range.max) {
      abnormal.push(`${range.label} ${v}${range.unit} (normal ${range.min}-${range.max}${range.unit})`);
    }
  }
  if (nonEmpty(r.consciousnessLevel) && r.consciousnessLevel !== 'alert') {
    abnormal.push(`Consciousness level not alert (${r.consciousnessLevel})`);
  }
  return abnormal;
}

/** @type {ComponentRule[]} */
const componentRules = [
  {
    id: 'R-COMPONENT-PRESENTING-COMPLAINT-01',
    component: 'presenting-complaint',
    label: 'Presenting complaint',
    section: 'history',
    category: 'required-component',
    description: 'Presenting complaint documented',
    evaluate: (r) => nonEmpty(r.presentingComplaint)
  },
  {
    id: 'R-COMPONENT-HISTORY-OF-PRESENTING-COMPLAINT-01',
    component: 'history-of-presenting-complaint',
    label: 'History of presenting complaint',
    section: 'history',
    category: 'required-component',
    description: 'History of the presenting complaint documented',
    evaluate: (r) => nonEmpty(r.historyOfPresentingComplaint)
  },
  {
    id: 'R-COMPONENT-PAST-MEDICAL-SURGICAL-HISTORY-01',
    component: 'past-medical-surgical-history',
    label: 'Past medical and surgical history',
    section: 'history',
    category: 'required-component',
    description: 'Past medical and surgical history documented (or explicit "nil")',
    evaluate: (r) => nonEmpty(r.pastMedicalSurgicalHistory)
  },
  {
    id: 'R-COMPONENT-DRUG-HISTORY-AND-ALLERGIES-01',
    component: 'drug-history-and-allergies',
    label: 'Drug history and allergies',
    section: 'history',
    category: 'required-component',
    description: 'Drug history documented and allergy status explicitly recorded',
    evaluate: (r) => nonEmpty(r.drugHistory) && allergyDocumented(r)
  },
  {
    id: 'R-COMPONENT-SOCIAL-HISTORY-01',
    component: 'social-history',
    label: 'Social history',
    section: 'history',
    category: 'required-component',
    description: 'Social history documented',
    evaluate: (r) => nonEmpty(r.socialHistory)
  },
  {
    id: 'R-COMPONENT-SYSTEMS-REVIEW-01',
    component: 'systems-review',
    label: 'Systems review',
    section: 'history',
    category: 'required-component',
    description: 'Systems review documented',
    evaluate: (r) => nonEmpty(r.systemsReview)
  },
  {
    id: 'R-COMPONENT-VITAL-SIGNS-01',
    component: 'vital-signs',
    label: 'Vital signs',
    section: 'vitals',
    category: 'required-component',
    description: 'At least one vital sign recorded',
    evaluate: (r) => anyVitalRecorded(r)
  },
  {
    id: 'R-COMPONENT-CORE-EXAMINATION-01',
    component: 'core-examination',
    label: 'Core examination',
    section: 'examination',
    category: 'required-component',
    description: 'All four core systems examined or explicitly deferred',
    evaluate: (r) => coreExamAddressed(r)
  },
  {
    id: 'R-COMPONENT-IMPRESSION-01',
    component: 'impression',
    label: 'Impression / problem list',
    section: 'impression',
    category: 'required-component',
    description: 'Working impression / problem list documented',
    evaluate: (r) => nonEmpty(r.impression)
  },
  {
    id: 'R-COMPONENT-MANAGEMENT-PLAN-01',
    component: 'management-plan',
    label: 'Management plan',
    section: 'plan',
    category: 'required-component',
    description: 'Management plan documented',
    evaluate: (r) => nonEmpty(r.managementPlan)
  }
];

export { componentRules, VITAL_RANGES, CORE_EXAM_FIELDS, REQUIRED_HISTORY_FIELDS, nonEmpty, allergyDocumented, anyVitalRecorded, coreExamAddressed, missingCoreExam, missingHistory, abnormalVitals };
