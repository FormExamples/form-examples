import { ng201Rules } from './rules.js';

// NICE NG201 Antenatal Risk grader. Pure functions: take an
// `AssessmentData` object, evaluate every NG201 rule, and return the
// overall risk level plus the audit trail of fired rules.
//
// Risk stratification:
//   any rule fires 'high'      -> overall 'high'      (consultant-led care)
//   else any 'moderate' fires  -> overall 'moderate'  (obstetric input at milestones)
//   otherwise                  -> overall 'low'       (midwifery-led care)

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').RiskLevel} RiskLevel
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.ObstetricsAssessment.

/**
 * Friendly label for a RiskLevel.
 * @param {RiskLevel} level
 */
function riskLevelLabel(level) {
  switch (level) {
    case 'high': return 'High Risk — Consultant-led / Multidisciplinary Care';
    case 'moderate': return 'Moderate Risk — Obstetric Input at Milestones';
    case 'low': return 'Low Risk — Midwifery-led Care';
    default: return '';
  }
}

/**
 * CSS class hint for the risk badge.
 * @param {RiskLevel} level
 */
function riskLevelClass(level) {
  switch (level) {
    case 'high': return 'risk-high';
    case 'moderate': return 'risk-moderate';
    case 'low': return 'risk-low';
    default: return '';
  }
}

/**
 * Evaluate every NG201 rule against the supplied assessment data and
 * combine the per-rule risk levels into an overall risk stratification.
 *
 * @param {AssessmentData} data
 * @returns {{ riskLevel: RiskLevel, answeredCount: number, firedRules: FiredRule[] }}
 */
function calculateAntenatalRisk(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  for (const rule of ng201Rules) {
    try {
      const risk = rule.evaluate(data);
      if (risk) {
        firedRules.push({
          id: rule.id,
          category: rule.category,
          description: rule.description,
          risk
        });
      }
    } catch (e) {
      console.warn(`NG201 rule ${rule.id} evaluation failed:`, e);
    }
  }

  /** @type {RiskLevel} */
  let riskLevel = 'low';
  if (firedRules.some((r) => r.risk === 'high')) {
    riskLevel = 'high';
  } else if (firedRules.some((r) => r.risk === 'moderate')) {
    riskLevel = 'moderate';
  }

  // Sort fired rules: high first, then moderate, then low (by id within bucket).
  const order = { high: 0, moderate: 1, low: 2 };
  firedRules.sort((a, b) => order[a.risk] - order[b.risk] || a.id.localeCompare(b.id));

  // Count answered fields used as primary inputs (a proxy for completeness).
  const answeredCount = countAnsweredInputs(data);

  return { riskLevel, answeredCount, firedRules };
}

/**
 * Count answered top-level questionnaire inputs to provide a denominator
 * the report can show ("X relevant fields answered").
 * @param {AssessmentData} data
 */
function countAnsweredInputs(data) {
  let count = 0;
  const isAnswered = (v) => v !== null && v !== undefined && v !== '';
  for (const section of Object.keys(data)) {
    for (const key of Object.keys(data[section])) {
      if (isAnswered(data[section][key])) count++;
    }
  }
  return count;
}

export { riskLevelLabel, riskLevelClass, calculateAntenatalRisk };
