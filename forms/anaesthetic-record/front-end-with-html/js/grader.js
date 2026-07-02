// Anaesthetic Record completeness grader. Pure functions: take a `RecordData`
// object (the parent record plus its three repeating child lists — drugs, timed
// observations, and intra-operative events) and derive the completeness outputs
// (spec §4). This is NOT a numeric severity score. It emits:
//
//   status              = complete | partial | incomplete
//   completenessPercent = round(100 * satisfied / total)   (0..100)
//   firedRules[]        = every mandatory rule with its satisfied/unsatisfied
//                         state, criticality, and human-readable label
//
// Classification (spec §4):
//   anyCriticalMissing         -> 'incomplete'
//   else anyNoncriticalMissing -> 'partial'
//   else                       -> 'complete'

/**
 * @typedef {import('./types.js').RecordData} RecordData
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').CompletenessStatus} CompletenessStatus
 */

// Wrapped in an IIFE; published via window.AnaestheticRecord.
(function () {
'use strict';
window.AnaestheticRecord = window.AnaestheticRecord || {};
const { MANDATORY_RULES } = window.AnaestheticRecord;

/**
 * Evaluate every mandatory rule against the record, producing the audit trail
 * that mirrors the `anaesthetic_record_grade_rule` SQL table.
 * @param {RecordData} record
 * @returns {FiredRule[]}
 */
function evaluateRules(record) {
  return MANDATORY_RULES.map((rule) => ({
    id: rule.id,
    category: rule.category,
    label: rule.label,
    satisfied: !!rule.satisfied(record)
  }));
}

/**
 * Compute the completeness grade for the supplied record.
 *
 * @param {RecordData} record
 * @returns {{ status: CompletenessStatus, completenessPercent: number,
 *             firedRules: FiredRule[], criticalMissing: number,
 *             noncriticalMissing: number }}
 */
function calculateGrade(record) {
  const firedRules = evaluateRules(record);

  const total = firedRules.length;
  const satisfied = firedRules.filter((r) => r.satisfied).length;
  const completenessPercent =
    total > 0 ? Math.round((100 * satisfied) / total) : 0;

  const criticalMissing = firedRules.filter(
    (r) => r.category === 'critical' && !r.satisfied
  ).length;
  const noncriticalMissing = firedRules.filter(
    (r) => r.category === 'noncritical' && !r.satisfied
  ).length;

  /** @type {CompletenessStatus} */
  let status;
  if (criticalMissing > 0) {
    status = 'incomplete';
  } else if (noncriticalMissing > 0) {
    status = 'partial';
  } else {
    status = 'complete';
  }

  return {
    status,
    completenessPercent,
    firedRules,
    criticalMissing,
    noncriticalMissing
  };
}

Object.assign(window.AnaestheticRecord, {
  evaluateRules,
  calculateGrade
});
})();
