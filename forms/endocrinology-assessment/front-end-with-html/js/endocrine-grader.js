import { axisRules } from './rules.js';
import { axisStatusClass, axisStatusLabel, maxStatus } from './types.js';

// Endocrine grader. Pure functions: take an `AssessmentData` object,
// run each axis rule, and return per-axis grades plus the overall status.
//
// Overall status is the most-severe axis status across all assessed axes.
// Severity order: severe > moderate > mild > subclinical > normal > '' (not assessed).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AxisStatus} AxisStatus
 * @typedef {import('./types.js').AxisGrade} AxisGrade
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.EndocrinologyAssessment.

/**
 * @param {AssessmentData} data
 * @returns {{ axisGrades: AxisGrade[], overallStatus: AxisStatus, answeredCount: number, firedRules: FiredRule[] }}
 */
function calculateGrades(data) {
  /** @type {AxisGrade[]} */
  const axisGrades = [];
  /** @type {FiredRule[]} */
  const firedRules = [];
  /** @type {AxisStatus} */
  let overall = '';

  for (const rule of axisRules) {
    try {
      const { status, findings } = rule.evaluate(data);
      const rationale = findings.length === 0
        ? (status === 'normal'
            ? 'Indices within reference range.'
            : (status === ''
                ? 'No data provided.'
                : 'Status derived from clinical features.'))
        : findings.join(' ');

      axisGrades.push({
        axis: rule.axis,
        status,
        rationale,
        contributingFindings: findings
      });

      if (status && status !== '') {
        overall = maxStatus(overall, status);
        firedRules.push({
          id: rule.id,
          category: rule.axis,
          description: rule.description,
          status
        });
      }
    } catch (e) {
      console.warn(`Axis rule ${rule.id} evaluation failed:`, e);
    }
  }

  // Count tracked / answered fields contributed by graded axes (informational).
  const answeredCount = axisGrades.filter((g) => g.status !== '').length;

  return { axisGrades, overallStatus: overall || 'normal', answeredCount, firedRules };
}

export { calculateGrades };
