import { ppeRules } from './rules.js';

// PPE clearance grader. Pure functions: take an `AssessmentData` object,
// run every rule in `ppeRules`, and aggregate the highest-grade rule that
// fired into a single `Clearance` decision.
//
// Aggregation:
//   any rule with grade 4  -> not-cleared
//   else any grade 3       -> pending
//   else any grade 2       -> conditional
//   else                   -> cleared

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').Clearance} Clearance
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

/**
 * @param {FiredRule[]} firedRules
 * @returns {Clearance}
 */
function aggregateClearance(firedRules) {
  let maxGrade = 0;
  for (const r of firedRules) {
    if (r.grade > maxGrade) maxGrade = r.grade;
  }
  if (maxGrade >= 4) return 'not-cleared';
  if (maxGrade === 3) return 'pending';
  if (maxGrade === 2) return 'conditional';
  return 'cleared';
}

/**
 * Run every PPE rule against the supplied assessment data and produce
 * the resulting clearance decision.
 *
 * @param {AssessmentData} data
 * @returns {{ clearance: Clearance, firedRules: FiredRule[] }}
 */
function gradePPE(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  for (const rule of ppeRules) {
    try {
      if (rule.fires(data)) {
        firedRules.push({
          id: rule.id,
          category: rule.category,
          description: rule.description,
          grade: rule.grade
        });
      }
    } catch (e) {
      console.warn(`PPE rule ${rule.id} evaluation failed:`, e);
    }
  }

  // Sort highest grade first so the report reads worst-first.
  firedRules.sort((a, b) => b.grade - a.grade);

  const clearance = aggregateClearance(firedRules);
  return { clearance, firedRules };
}

export { gradePPE, aggregateClearance };
