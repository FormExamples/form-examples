// Epilepsy-review classification rules (NICE NG217). Pure helper functions, no
// I/O. This module owns the domain logic the grader orchestrates:
//
//   classifyControl(data)   -> seizure-free | controlled | uncontrolled
//   COMPONENTS + satisfied  -> review-completeness components
//   componentApplicable(..) -> applicable-only domains (childbearing)
//
// The engine is a control-classification and documentation-completeness tool,
// NOT a numeric score. See spec §4.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').SeizureControl} SeizureControl
 */

// Wrapped in an IIFE; published via window.EpilepsyReview.
(function () {
'use strict';
window.EpilepsyReview = window.EpilepsyReview || {};

/** A numeric field is present when it is neither null nor undefined nor NaN. */
function present(v) {
  return v !== null && v !== undefined && !Number.isNaN(v);
}

/** A text / enum field is documented when it is a non-empty string. */
function filled(v) {
  return typeof v === 'string' && v.trim() !== '';
}

/**
 * Classify seizure control from the worst finding (spec §4.1).
 *
 * uncontrolled = increasing trend, OR any status epilepticus, OR weekly/daily
 *                seizure frequency.
 * seizure-free = not uncontrolled AND (no seizures OR a seizure-free trend).
 * controlled   = seizures present but stable/decreasing (everything else).
 *
 * @param {AssessmentData} data
 * @returns {SeizureControl}
 */
function classifyControl(data) {
  const s = data.seizures;
  const uncontrolled =
    s.seizureTrend === 'increasing' ||
    data.injuries.statusEpilepticus === 'yes' ||
    s.seizureFrequency === 'weekly' ||
    s.seizureFrequency === 'daily';

  const seizureFree =
    !uncontrolled &&
    (s.seizureFrequency === 'none' || s.seizureTrend === 'seizure-free');

  return uncontrolled ? 'uncontrolled' : seizureFree ? 'seizure-free' : 'controlled';
}

/**
 * The required review domains graded for completeness (spec §4.2). Seizure and
 * medication are the gates: their absence forces `incomplete`. The remaining
 * domains contribute to complete vs partial. The valproate / PPP and folic-acid
 * domains are applicable only when the patient is a woman of childbearing
 * potential.
 *
 * @type {{ component: string, label: string, gate?: boolean,
 *          applicable?: (d: AssessmentData) => boolean,
 *          satisfied: (d: AssessmentData) => boolean }[]}
 */
const COMPONENTS = [
  {
    component: 'seizure',
    label: 'Seizure type and frequency',
    gate: true,
    satisfied: (d) => filled(d.seizures.seizureFrequency)
  },
  {
    component: 'medication',
    label: 'Anti-seizure medication and adherence',
    gate: true,
    satisfied: (d) => filled(d.medication.asmAdherence)
  },
  {
    component: 'triggers',
    label: 'Triggers',
    satisfied: (d) => filled(d.triggers.triggers)
  },
  {
    component: 'sudep',
    label: 'SUDEP risk discussion',
    satisfied: (d) => filled(d.sudep.sudepDiscussed)
  },
  {
    component: 'injuries-status',
    label: 'Injuries and status epilepticus',
    satisfied: (d) =>
      filled(d.injuries.statusEpilepticus) || filled(d.injuries.seizureInjury)
  },
  {
    component: 'safety',
    label: 'Safety (DVLA driving / bathing)',
    satisfied: (d) =>
      filled(d.safety.dvlaEligible) ||
      filled(d.safety.currentlyDriving) ||
      filled(d.safety.bathingAdviceGiven)
  },
  {
    component: 'mental-health',
    label: 'Mental health',
    satisfied: (d) => filled(d.mentalHealth.mentalHealthConcern)
  },
  {
    component: 'care-plan',
    label: 'Care plan',
    satisfied: (d) =>
      filled(d.summary.carePlan) || filled(d.summary.nextReviewDue)
  },
  {
    component: 'valproate-ppp',
    label: 'Valproate and pregnancy prevention',
    applicable: (d) => d.childbearing.womanOfChildbearingPotential === 'yes',
    satisfied: (d) => filled(d.childbearing.onValproate)
  },
  {
    component: 'folic-acid',
    label: 'Folic acid',
    applicable: (d) => d.childbearing.womanOfChildbearingPotential === 'yes',
    satisfied: (d) => filled(d.childbearing.folicAcid)
  }
];

/**
 * Whether a component is required (applicable) for the given data.
 * @param {{ applicable?: (d: AssessmentData) => boolean }} component
 * @param {AssessmentData} data
 * @returns {boolean}
 */
function componentApplicable(component, data) {
  return component.applicable ? !!component.applicable(data) : true;
}

Object.assign(window.EpilepsyReview, {
  present,
  filled,
  classifyControl,
  COMPONENTS,
  componentApplicable
});
})();
