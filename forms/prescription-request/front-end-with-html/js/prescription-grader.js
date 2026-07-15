import { prescriptionRules } from './prescription-rules.js';

// Pure priority-classification engine for the Prescription Request form.
// Mirrors `src/lib/engine/prescription-grader.ts`. Evaluates every rule
// from `prescription-rules.js` against the supplied AssessmentData and
// returns the maximum priority level among the rules that fired.

/** @type {Record<string, number>} */
const PRIORITY_ORDER = { routine: 0, urgent: 1, emergency: 2 };

/**
 * Pure function: evaluates all prescription rules against request data.
 * Returns the maximum priority level among all fired rules,
 * defaulting to `routine` when no rules fire.
 *
 * @param {import('./types.js').AssessmentData} data
 * @returns {{ priorityLevel: import('./types.js').PriorityLevel,
 *             firedRules: import('./types.js').FiredRule[] }}
 */
function calculatePriorityLevel(data) {
  /** @type {import('./types.js').FiredRule[]} */
  const firedRules = [];

  for (const rule of prescriptionRules) {
    try {
      if (rule.evaluate(data)) {
        firedRules.push({
          id: rule.id,
          category: rule.category,
          description: rule.description,
          priorityLevel: rule.priorityLevel
        });
      }
    } catch (e) {
      console.warn(`Prescription rule ${rule.id} evaluation failed:`, e);
    }
  }

  let priorityLevel = 'routine';
  for (const r of firedRules) {
    if (PRIORITY_ORDER[r.priorityLevel] > PRIORITY_ORDER[priorityLevel]) {
      priorityLevel = r.priorityLevel;
    }
  }

  return { priorityLevel, firedRules };
}

export { calculatePriorityLevel };
