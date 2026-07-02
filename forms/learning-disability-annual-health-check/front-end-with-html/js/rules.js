// Declarative required-component rules for the annual health check.
//
// The annual health check is a documentation-and-completeness instrument, not a
// numeric score. It is organised into REQUIRED COMPONENTS; each component is
// "completed" only when it carries a real recorded value. Per spec §4, the
// sentinel values `not-recorded`, `not-assessed`, `not-reviewed`, `not-done`
// and the empty string `''` do NOT count as completed, whereas values that
// document a considered outcome — `declined`, `not-applicable`, `not-eligible`,
// `no-carer`, and plain yes/no answers — DO count as completed.
//
// The grader (`grader.js`) evaluates every component rule, counts the completed
// ones, derives the completeness percentage and the complete/incomplete status,
// and appends an audit trail. Rows here mirror the
// `learning_disability_annual_health_check_grade_rule` SQL table
// (rule_id, component, category, description).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} ComponentRule
 * @property {string} id          - stable rule id, e.g. R-COMPONENT-DYSPHAGIA
 * @property {string} component   - stable component key
 * @property {string} group       - adjustments | physical | screening | medication | mental | syndrome | carer
 * @property {string} category
 * @property {string} label       - human-readable component name
 * @property {string} description
 * @property {(d: AssessmentData) => boolean} completed
 */

// Wrapped in an IIFE; published via window.LearningDisabilityAnnualHealthCheck.
(function () {
'use strict';
window.LearningDisabilityAnnualHealthCheck =
  window.LearningDisabilityAnnualHealthCheck || {};

// Sentinel enum values that mean "the component was not carried out". Any other
// non-empty value (including declined / not-applicable / not-eligible /
// no-carer / yes / no) counts as a recorded, completed component (spec §4).
const NOT_RECORDED = new Set([
  '',
  'not-recorded',
  'not-assessed',
  'not-reviewed',
  'not-done'
]);

/**
 * A single enum field is recorded when its value is present and is not one of
 * the "not carried out" sentinels.
 * @param {*} value
 * @returns {boolean}
 */
function isRecorded(value) {
  return value !== null && value !== undefined && !NOT_RECORDED.has(String(value));
}

/**
 * The required components, in wizard order. Each `completed` predicate reads the
 * relevant status field(s) via `isRecorded`. There are 18 required components:
 * reasonable adjustments (1), physical health (12 sub-components), screening and
 * immunisation (1), medication review (1), mental health and behaviour (1),
 * syndrome-specific (1), and carer and social (1).
 * @type {ComponentRule[]}
 */
const componentRules = [
  {
    id: 'R-COMPONENT-REASONABLE-ADJUSTMENTS',
    component: 'reasonable-adjustments',
    group: 'adjustments',
    category: 'component',
    label: 'Reasonable adjustments & communication',
    description: 'Reasonable adjustments and communication needs considered and recorded',
    completed: (d) => isRecorded(d.adjustments.reasonableAdjustmentsRecorded)
  },
  {
    id: 'R-COMPONENT-WEIGHT-BMI',
    component: 'weight-bmi',
    group: 'physical',
    category: 'component',
    label: 'Weight and BMI',
    description: 'Weight and body-mass index recorded (or declined)',
    completed: (d) => isRecorded(d.physical.weightBmiStatus)
  },
  {
    id: 'R-COMPONENT-BLOOD-PRESSURE',
    component: 'blood-pressure',
    group: 'physical',
    category: 'component',
    label: 'Blood pressure',
    description: 'Blood pressure recorded',
    completed: (d) => isRecorded(d.physical.bloodPressureStatus)
  },
  {
    id: 'R-COMPONENT-EPILEPSY',
    component: 'epilepsy',
    group: 'physical',
    category: 'component',
    label: 'Epilepsy review',
    description: 'Epilepsy reviewed (or not applicable)',
    completed: (d) => isRecorded(d.physical.epilepsyStatus)
  },
  {
    id: 'R-COMPONENT-CONSTIPATION',
    component: 'constipation',
    group: 'physical',
    category: 'component',
    label: 'Constipation',
    description: 'Constipation assessed',
    completed: (d) => isRecorded(d.physical.constipationStatus)
  },
  {
    id: 'R-COMPONENT-DYSPHAGIA',
    component: 'dysphagia',
    group: 'physical',
    category: 'component',
    label: 'Dysphagia (swallowing)',
    description: 'Swallowing / dysphagia assessed',
    completed: (d) => isRecorded(d.physical.dysphagiaStatus)
  },
  {
    id: 'R-COMPONENT-CONTINENCE',
    component: 'continence',
    group: 'physical',
    category: 'component',
    label: 'Continence',
    description: 'Continence assessed',
    completed: (d) => isRecorded(d.physical.continenceStatus)
  },
  {
    id: 'R-COMPONENT-MOBILITY-FALLS',
    component: 'mobility-falls',
    group: 'physical',
    category: 'component',
    label: 'Mobility and falls',
    description: 'Mobility and falls assessed',
    completed: (d) => isRecorded(d.physical.mobilityFallsStatus)
  },
  {
    id: 'R-COMPONENT-DENTAL',
    component: 'dental',
    group: 'physical',
    category: 'component',
    label: 'Dental / oral health',
    description: 'Dental and oral health assessed',
    completed: (d) => isRecorded(d.physical.dentalStatus)
  },
  {
    id: 'R-COMPONENT-VISION',
    component: 'vision',
    group: 'physical',
    category: 'component',
    label: 'Vision',
    description: 'Vision assessed',
    completed: (d) => isRecorded(d.physical.visionStatus)
  },
  {
    id: 'R-COMPONENT-HEARING',
    component: 'hearing',
    group: 'physical',
    category: 'component',
    label: 'Hearing',
    description: 'Hearing assessed',
    completed: (d) => isRecorded(d.physical.hearingStatus)
  },
  {
    id: 'R-COMPONENT-FOOT-HEALTH',
    component: 'foot-health',
    group: 'physical',
    category: 'component',
    label: 'Foot health',
    description: 'Foot health assessed',
    completed: (d) => isRecorded(d.physical.footHealthStatus)
  },
  {
    id: 'R-COMPONENT-SKIN',
    component: 'skin',
    group: 'physical',
    category: 'component',
    label: 'Skin',
    description: 'Skin assessed',
    completed: (d) => isRecorded(d.physical.skinStatus)
  },
  {
    id: 'R-COMPONENT-SCREENING-IMMUNISATION',
    component: 'screening-immunisation',
    group: 'screening',
    category: 'component',
    label: 'Screening & immunisation uptake',
    description: 'Eligible cancer-screening uptake and immunisation uptake recorded',
    completed: (d) =>
      isRecorded(d.screening.cancerScreeningStatus) &&
      isRecorded(d.screening.immunisationStatus)
  },
  {
    id: 'R-COMPONENT-MEDICATION-REVIEW',
    component: 'medication-review',
    group: 'medication',
    category: 'component',
    label: 'Medication review (incl. STOMP)',
    description: 'Medication list reconciled at the check',
    completed: (d) => isRecorded(d.medication.medicationReconciled)
  },
  {
    id: 'R-COMPONENT-MENTAL-HEALTH-BEHAVIOUR',
    component: 'mental-health-behaviour',
    group: 'mental',
    category: 'component',
    label: 'Mental health & behaviour',
    description: 'Mental health and behaviour that challenges assessed',
    completed: (d) =>
      isRecorded(d.mental.mentalHealthStatus) &&
      isRecorded(d.mental.behaviourStatus)
  },
  {
    id: 'R-COMPONENT-SYNDROME-SPECIFIC',
    component: 'syndrome-specific',
    group: 'syndrome',
    category: 'component',
    label: 'Syndrome-specific checks',
    description: 'Syndrome-specific health checks done (or not applicable)',
    completed: (d) => isRecorded(d.syndrome.syndromeSpecificStatus)
  },
  {
    id: 'R-COMPONENT-CARER-SOCIAL',
    component: 'carer-social',
    group: 'carer',
    category: 'component',
    label: 'Carer & social',
    description: 'Carer needs and social circumstances considered (or no carer)',
    completed: (d) => isRecorded(d.carer.carerNeedsStatus)
  }
];

Object.assign(window.LearningDisabilityAnnualHealthCheck, {
  componentRules,
  isRecorded,
  NOT_RECORDED
});
})();
