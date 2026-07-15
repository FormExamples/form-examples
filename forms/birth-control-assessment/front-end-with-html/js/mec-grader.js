import { detectAdditionalFlags } from './flagged-issues.js';
import { mecRules } from './mec-rules.js';

// UK MEC grader. Pure functions: take an `AssessmentData` object, evaluate
// every MEC rule, derive per-method MEC categories (worst category wins) and
// an overall risk level. Mirrors `src/lib/engine/mec-grader.ts` from the
// SvelteKit reference.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').MethodMEC} MethodMEC
 * @typedef {import('./types.js').MECCategory} MECCategory
 * @typedef {import('./types.js').RiskLevel} RiskLevel
 * @typedef {import('./types.js').GradingResult} GradingResult
 */

/**
 * Evaluate every MEC rule and return the grading result.
 * @param {AssessmentData} data
 * @returns {GradingResult}
 */
function calculateMECGrade(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  for (const rule of mecRules) {
    try {
      if (rule.evaluate(data)) {
        firedRules.push({
          id: rule.id,
          category: rule.category,
          description: rule.description,
          mecCategory: rule.mecCategory,
          affectedMethods: rule.affectedMethods.slice()
        });
      }
    } catch (e) {
      console.warn(`MEC rule ${rule.id} evaluation failed:`, e);
    }
  }

  const methodMEC = deriveMethodMEC(firedRules);
  const overallRisk = deriveOverallRisk(methodMEC);
  const additionalFlags = detectAdditionalFlags(data);

  return {
    methodMEC,
    overallRisk,
    firedRules,
    additionalFlags,
    timestamp: new Date().toISOString()
  };
}

/**
 * Per-method MEC categories: worst category wins. Methods not affected by any
 * fired rule default to MEC 1.
 * @param {FiredRule[]} firedRules
 * @returns {MethodMEC}
 */
function deriveMethodMEC(firedRules) {
  /** @type {(keyof MethodMEC)[]} */
  const methods = ['coc', 'pop', 'implant', 'injection', 'iud', 'ius'];
  /** @type {MethodMEC} */
  const result = { coc: 1, pop: 1, implant: 1, injection: 1, iud: 1, ius: 1 };

  for (const rule of firedRules) {
    for (const method of methods) {
      if (rule.affectedMethods.includes(method)) {
        if (rule.mecCategory > result[method]) {
          result[method] = rule.mecCategory;
        }
      }
    }
  }

  return result;
}

/**
 * Map the worst MEC category across methods to a risk level.
 * @param {MethodMEC} methodMEC
 * @returns {RiskLevel}
 */
function deriveOverallRisk(methodMEC) {
  const worstMEC = Math.max(
    methodMEC.coc,
    methodMEC.pop,
    methodMEC.implant,
    methodMEC.injection,
    methodMEC.iud,
    methodMEC.ius
  );
  if (worstMEC >= 4) return 'critical';
  if (worstMEC >= 3) return 'high';
  if (worstMEC >= 2) return 'moderate';
  return 'low';
}

export { calculateMECGrade, deriveMethodMEC, deriveOverallRisk };
