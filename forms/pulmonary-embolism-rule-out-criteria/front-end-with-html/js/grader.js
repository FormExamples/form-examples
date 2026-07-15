import { percRules } from './rules.js';

// PERC grader. Pure functions: take an `AssessmentData` object, evaluate the
// eight criterion rules in `percRules`, apply the pre-test-probability gate, and
// derive a binary classification. This is a status / classification form — there
// is NO numeric total, no cut-off, and no band table.
//
// Classification algorithm (spec §4):
//   allCriteriaSatisfied = c1 AND c2 AND ... AND c8   (boolean conjunction)
//   applicable           = pretestProbability === 'low'
//   classification       = (applicable AND allCriteriaSatisfied)
//                            ? 'perc-negative'   // PE excluded, no D-dimer/imaging
//                            : 'perc-positive';  // proceed to D-dimer / imaging
//
// The rule is deliberately conservative: a single failed criterion, or a
// pre-test probability that is not low, yields 'perc-positive'. A criterion whose
// input is missing is treated as FAILED (the reassuring state must be positively
// documented). It is not a count or a sum — one failure is decisive.
//
// The engine returns `criterionResults` (one per criterion, satisfied|failed) and
// `failedCriteria` (the subset of {1..8} that failed) so the reasoning is
// auditable, plus a `firedRules` audit trail mirroring the SQL grade_rule table
// (criterion rows, the applicability gate row, and the composite row).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').Classification} Classification
 * @typedef {import('./types.js').CriterionResult} CriterionResult
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

/**
 * Evaluate the eight PERC criterion rules.
 * @param {AssessmentData} data
 * @returns {{ criterionResults: CriterionResult[], firedRules: FiredRule[] }}
 */
function evaluateCriteria(data) {
  /** @type {CriterionResult[]} */
  const criterionResults = [];
  /** @type {FiredRule[]} */
  const firedRules = [];
  for (const rule of percRules) {
    let satisfied = false;
    try {
      satisfied = rule.evaluate(data) === true;
    } catch (e) {
      console.warn(`PERC rule ${rule.id} evaluation failed:`, e);
    }
    criterionResults.push({
      number: rule.number,
      criterion: rule.criterion,
      satisfied,
      label: rule.label
    });
    firedRules.push({
      id: rule.id,
      instrument: 'criterion',
      satisfied,
      outcome: satisfied ? 'satisfied' : 'failed',
      category: rule.category,
      description: `Criterion ${rule.number} — ${rule.description} — ${satisfied ? 'SATISFIED' : 'FAILED'}`
    });
  }
  return { criterionResults, firedRules };
}

/**
 * Compute the full PERC classification for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ classification: Classification, allCriteriaSatisfied: boolean,
 *             applicable: boolean, criterionResults: CriterionResult[],
 *             failedCriteria: number[], firedRules: FiredRule[] }}
 */
function calculatePercGrade(data) {
  // ─── Evaluate the eight criteria ────────────────────────────────
  const { criterionResults, firedRules } = evaluateCriteria(data);
  const allCriteriaSatisfied = criterionResults.every((c) => c.satisfied);
  const failedCriteria = criterionResults
    .filter((c) => !c.satisfied)
    .map((c) => c.number);

  // ─── Applicability gate (pre-test probability low) ──────────────
  const applicable = data.pretest.pretestProbability === 'low';
  firedRules.push({
    id: 'R-APPLICABILITY-GATE-01',
    instrument: 'gate',
    satisfied: null,
    outcome: applicable ? 'applicable' : 'not-applicable',
    category: 'applicability',
    description: applicable
      ? 'Pre-test probability is low — PERC applies'
      : 'Pre-test probability is not low — PERC does not apply; criteria are informational only'
  });

  // ─── Composite classification ───────────────────────────────────
  /** @type {Classification} */
  const classification =
    applicable && allCriteriaSatisfied ? 'perc-negative' : 'perc-positive';
  firedRules.push({
    id: 'R-CLASSIFICATION-01',
    instrument: 'composite',
    satisfied: null,
    outcome: classification,
    category: 'classification',
    description:
      classification === 'perc-negative'
        ? 'Pre-test probability low AND all eight criteria satisfied — PERC-negative; PE excluded without D-dimer or imaging'
        : 'Pre-test probability not low, or at least one criterion failed — PERC-positive; proceed to D-dimer and/or imaging'
  });

  return {
    classification,
    allCriteriaSatisfied,
    applicable,
    criterionResults,
    failedCriteria,
    firedRules
  };
}

export { evaluateCriteria, calculatePercGrade };
