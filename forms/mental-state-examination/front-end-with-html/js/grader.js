// Mental State Examination completeness-and-risk grader. Pure functions: take
// an `AssessmentData` object and derive the documentation outputs (spec §4).
// This is NOT a numeric severity score. It emits:
//
//   status              = complete | partial
//   completenessPercent = round(100 * documentedDomains / 7)   (0..100)
//   domainStatuses[]    = per-domain documented flag (the seven ASEPTIC domains)
//   riskLevel           = none | low | moderate | high — the highest priority
//                         among the safety flags raised in flags.js (NOT a sum)
//   firedRules[]        = audit trail: each documented domain, plus a
//                         completeness row and a risk row
//   flags[]             = the safety flags (from flags.js)
//
// Classification (spec §4):
//   documentedCount == 7 -> 'complete'
//   otherwise            -> 'partial'
//   riskLevel = high if any high flag; else moderate if any moderate flag;
//               else low if any low flag; else none.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').DomainStatus} DomainStatus
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 * @typedef {import('./types.js').CompletenessStatus} CompletenessStatus
 * @typedef {import('./types.js').RiskLevel} RiskLevel
 * @typedef {import('./types.js').GradingResult} GradingResult
 */

// Wrapped in an IIFE; published via window.MentalStateExamination.
(function () {
'use strict';
window.MentalStateExamination = window.MentalStateExamination || {};
const NS = window.MentalStateExamination;
const { domainRules, detectFlaggedIssues } = NS;

/**
 * Evaluate each domain-documentation rule against the record.
 * @param {AssessmentData} data
 * @returns {DomainStatus[]}
 */
function computeDomainStatuses(data) {
  return domainRules.map((rule) => ({
    domain: rule.domain,
    label: rule.label,
    documented: !!rule.satisfied(data)
  }));
}

/**
 * Derive the risk level from the priorities of the flags raised. Highest wins;
 * never a sum of points (spec §4).
 * @param {FlaggedIssue[]} flags
 * @returns {RiskLevel}
 */
function deriveRiskLevel(flags) {
  if (flags.some((f) => f.priority === 'high')) return 'high';
  if (flags.some((f) => f.priority === 'moderate')) return 'moderate';
  if (flags.some((f) => f.priority === 'low')) return 'low';
  return 'none';
}

/**
 * Compute the completeness grade (no risk yet — risk needs the flags).
 *
 * @param {AssessmentData} data
 * @returns {{ status: CompletenessStatus, completenessPercent: number,
 *             domainStatuses: DomainStatus[], documentedCount: number,
 *             firedRules: FiredRule[] }}
 */
function calculateGrade(data) {
  const domainStatuses = computeDomainStatuses(data);
  const total = domainStatuses.length; // 7
  const documentedCount = domainStatuses.filter((d) => d.documented).length;
  const completenessPercent =
    total > 0 ? Math.round((100 * documentedCount) / total) : 0;

  /** @type {CompletenessStatus} */
  const status = documentedCount === total ? 'complete' : 'partial';

  // Audit trail: one row per documented domain, mirroring grade_rule.
  /** @type {FiredRule[]} */
  const firedRules = [];
  for (let i = 0; i < domainRules.length; i++) {
    const rule = domainRules[i];
    if (domainStatuses[i].documented) {
      firedRules.push({
        id: rule.id,
        domain: rule.domain,
        category: rule.category,
        description: rule.description
      });
    }
  }
  firedRules.push({
    id: 'R-COMPLETENESS-01',
    domain: 'completeness',
    category: 'completeness',
    description:
      status === 'complete'
        ? `All ${total} ASEPTIC domains documented — examination complete (100%)`
        : `${documentedCount} of ${total} ASEPTIC domains documented — examination partial (${completenessPercent}%)`
  });

  return {
    status,
    completenessPercent,
    domainStatuses,
    documentedCount,
    firedRules
  };
}

/**
 * Full assessment: completeness grade + safety flags + derived risk level.
 * Pure; no I/O. This is the canonical engine entry point (spec §6).
 *
 * @param {AssessmentData} data
 * @returns {GradingResult}
 */
function assess(data) {
  const grade = calculateGrade(data);
  const flags = detectFlaggedIssues(data, { status: grade.status });
  const riskLevel = deriveRiskLevel(flags);

  const firedRules = grade.firedRules.slice();
  firedRules.push({
    id: 'R-RISK-01',
    domain: 'risk',
    category: 'risk',
    description:
      riskLevel === 'none'
        ? 'No safety flags raised — risk level none'
        : `Risk level ${riskLevel} — driven by the highest-priority safety flag raised`
  });

  return {
    status: grade.status,
    riskLevel,
    completenessPercent: grade.completenessPercent,
    domainStatuses: grade.domainStatuses,
    firedRules,
    flags,
    timestamp: new Date().toISOString()
  };
}

Object.assign(NS, {
  computeDomainStatuses,
  deriveRiskLevel,
  calculateGrade,
  assess
});
})();
