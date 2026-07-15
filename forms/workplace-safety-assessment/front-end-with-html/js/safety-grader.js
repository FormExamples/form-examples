import { safetyRules } from './rules.js';
import { gradeToFindingLevel } from './types.js';

// Workplace Safety Assessment grader. Pure functions: take an
// `AssessmentData` object, return the overall outcome, the per-category
// findings tally, and the list of rules that fired (compliant + non-compliant).
//
// Outcome rules:
//   any rule fired at grade 4         -> 'critical'
//   any rule fired at grade 3 (no 4s) -> 'major'
//   any rule fired at grade 2 (no 3-4) -> 'minor'
//   only grade-1 rules                -> 'compliant'
//
// Rules that score 0 are unanswered and excluded entirely from the grading
// totals (so a partially-completed audit doesn't auto-fail).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').Outcome} Outcome
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').CategoryFindings} CategoryFindings
 * @typedef {import('./types.js').SeverityGrade} SeverityGrade
 */

// Wrapped in an IIFE; published via window.WorkplaceSafetyAssessment.

/**
 * Determine the worst outcome from a set of fired rules.
 * @param {FiredRule[]} firedRules
 * @returns {Outcome}
 */
function highestOutcome(firedRules) {
  let worst = 1;
  for (const r of firedRules) {
    if (r.grade > worst) worst = r.grade;
  }
  return gradeToFindingLevel(worst);
}

/**
 * Evaluate the workplace safety audit checklist against the supplied data.
 *
 * @param {AssessmentData} data
 * @returns {{
 *   outcome: Outcome,
 *   findingsByCategory: Object<string, CategoryFindings>,
 *   firedRules: FiredRule[],
 *   answeredCount: number
 * }}
 */
function gradeSafety(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  /** @type {Object<string, CategoryFindings>} */
  const findingsByCategory = {};
  let answeredCount = 0;

  for (const rule of safetyRules) {
    let grade;
    try {
      grade = rule.evaluate(data);
    } catch (e) {
      console.warn(`Safety rule ${rule.id} evaluation failed:`, e);
      continue;
    }

    if (grade === 0) continue; // unanswered
    answeredCount++;

    /** @type {SeverityGrade} */
    const g = /** @type {any} */ (grade);
    firedRules.push({
      id: rule.id,
      category: rule.category,
      description: rule.description,
      grade: g
    });

    if (!findingsByCategory[rule.category]) {
      findingsByCategory[rule.category] = {
        category: rule.category,
        compliant: 0,
        minor: 0,
        major: 0,
        critical: 0,
        total: 0
      };
    }
    const bucket = findingsByCategory[rule.category];
    bucket.total++;
    if (g === 4) bucket.critical++;
    else if (g === 3) bucket.major++;
    else if (g === 2) bucket.minor++;
    else bucket.compliant++;
  }

  const outcome = answeredCount === 0 ? 'compliant' : highestOutcome(firedRules);

  return { outcome, findingsByCategory, firedRules, answeredCount };
}

export { gradeSafety, highestOutcome };
