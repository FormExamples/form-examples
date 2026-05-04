// IPS Completeness Validator. Pure functions: take an
// `AssessmentData` object, return the completeness level (Complete /
// Partial / Incomplete) plus per-section audit trail.
//
// Grading rules (per ISO 27269 / HL7 FHIR IPS IG):
//   All 8 mandatory + all 2 optional populated   -> Complete
//   All 8 mandatory populated, optional missing  -> Partial
//   Any 1 mandatory missing                      -> Incomplete

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').CompletenessLevel} CompletenessLevel
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.InternationalPatientSummary.
(function () {
'use strict';
window.InternationalPatientSummary = window.InternationalPatientSummary || {};
const { validationRules } = window.InternationalPatientSummary;

/**
 * @param {{ mandatoryPopulated: number, mandatoryTotal: number,
 *           optionalPopulated: number, optionalTotal: number }} counts
 * @returns {CompletenessLevel}
 */
function classifyCompleteness(counts) {
  if (counts.mandatoryPopulated < counts.mandatoryTotal) return 'incomplete';
  if (counts.optionalPopulated < counts.optionalTotal) return 'partial';
  return 'complete';
}

/**
 * Friendly label for a CompletenessLevel.
 * @param {CompletenessLevel} level
 */
function completenessLevelLabel(level) {
  switch (level) {
    case 'complete':   return 'Complete';
    case 'partial':    return 'Partial';
    case 'incomplete': return 'Incomplete';
    default:           return '';
  }
}

/**
 * CSS class hint for the completeness badge.
 * @param {CompletenessLevel} level
 */
function completenessLevelClass(level) {
  switch (level) {
    case 'complete':   return 'completeness-complete';
    case 'partial':    return 'completeness-partial';
    case 'incomplete': return 'completeness-incomplete';
    default:           return '';
  }
}

/**
 * Evaluate the IPS completeness rules against the supplied assessment
 * data and produce the completeness level plus per-section audit trail.
 *
 * @param {AssessmentData} data
 * @returns {{ completenessLevel: CompletenessLevel,
 *             mandatoryPopulated: number, mandatoryTotal: number,
 *             optionalPopulated: number, optionalTotal: number,
 *             firedRules: FiredRule[] }}
 */
function validateIPS(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  let mandatoryPopulated = 0;
  let mandatoryTotal = 0;
  let optionalPopulated = 0;
  let optionalTotal = 0;

  for (const rule of validationRules) {
    let outcome = 'empty';
    try {
      outcome = rule.evaluate(data);
    } catch (e) {
      console.warn(`IPS rule ${rule.id} evaluation failed:`, e);
    }
    if (rule.mandatory) {
      mandatoryTotal++;
      if (outcome === 'ok') mandatoryPopulated++;
    } else {
      optionalTotal++;
      if (outcome === 'ok') optionalPopulated++;
      // Optional sections are surfaced as "optional" in the audit
      // table when empty so they read as informational rather than as
      // blocking failures.
      if (outcome === 'empty') outcome = 'optional';
    }
    firedRules.push({
      id: rule.id,
      category: rule.category,
      description: rule.description,
      status: outcome,
      mandatory: rule.mandatory
    });
  }

  const completenessLevel = classifyCompleteness({
    mandatoryPopulated,
    mandatoryTotal,
    optionalPopulated,
    optionalTotal
  });

  return {
    completenessLevel,
    mandatoryPopulated,
    mandatoryTotal,
    optionalPopulated,
    optionalTotal,
    firedRules
  };
}

Object.assign(window.InternationalPatientSummary, {
  classifyCompleteness,
  completenessLevelLabel,
  completenessLevelClass,
  validateIPS
});
})();
