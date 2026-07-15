import { cardioRules } from './rules.js';

// Cardiology grader. Pure functions: take an `AssessmentData` object,
// evaluate every rule in `cardioRules`, derive CCS Angina and NYHA Heart
// Failure classes from the patient's self-reported class, and return the
// overall risk level along with the audit trail of fired rules.
//
// Overall risk derivation (mirrors the SvelteKit reference engine):
//   maxGrade >= 4 OR CCS IV OR NYHA IV  -> 'critical'
//   maxGrade >= 3 OR CCS III OR NYHA III -> 'high'
//   maxGrade >= 2 OR CCS II  OR NYHA II  -> 'moderate'
//   otherwise (grade 1 or no rules)      -> 'low'

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').CCSClass} CCSClass
 * @typedef {import('./types.js').NYHAClass} NYHAClass
 * @typedef {import('./types.js').RiskLevel} RiskLevel
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.CardiologyAssessment.

/**
 * Derive the patient-reported CCS Angina Class.
 * @param {AssessmentData} data
 * @returns {CCSClass | null}
 */
function deriveCCSClass(data) {
  const ccs = data.chestPainAngina.ccsClass;
  if (ccs === '1') return 1;
  if (ccs === '2') return 2;
  if (ccs === '3') return 3;
  if (ccs === '4') return 4;
  return null;
}

/**
 * Derive the patient-reported NYHA Heart Failure Class.
 * @param {AssessmentData} data
 * @returns {NYHAClass | null}
 */
function deriveNYHAClass(data) {
  const nyha = data.heartFailureSymptoms.nyhaClass;
  if (nyha === '1') return 1;
  if (nyha === '2') return 2;
  if (nyha === '3') return 3;
  if (nyha === '4') return 4;
  return null;
}

/**
 * Derive overall cardiovascular risk from fired rules and classifications.
 * @param {FiredRule[]} firedRules
 * @param {CCSClass | null} ccsClass
 * @param {NYHAClass | null} nyhaClass
 * @returns {RiskLevel}
 */
function deriveOverallRisk(firedRules, ccsClass, nyhaClass) {
  const maxGrade =
    firedRules.length > 0
      ? Math.max.apply(null, firedRules.map((r) => r.grade))
      : 0;

  if (maxGrade >= 4 || ccsClass === 4 || nyhaClass === 4) return 'critical';
  if (maxGrade >= 3 || ccsClass === 3 || nyhaClass === 3) return 'high';
  if (maxGrade >= 2 || ccsClass === 2 || nyhaClass === 2) return 'moderate';
  return 'low';
}

/**
 * Evaluate every cardiology rule against the supplied assessment data.
 * Returns CCS class, NYHA class, overall risk level, and per-rule audit.
 * @param {AssessmentData} data
 * @returns {{ ccsClass: CCSClass | null, nyhaClass: NYHAClass | null,
 *             overallRisk: RiskLevel, firedRules: FiredRule[] }}
 */
function calculateCardioGrade(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  for (const rule of cardioRules) {
    try {
      if (rule.evaluate(data)) {
        firedRules.push({
          id: rule.id,
          system: rule.system,
          description: rule.description,
          grade: rule.grade
        });
      }
    } catch (e) {
      console.warn(`Cardio rule ${rule.id} evaluation failed:`, e);
    }
  }

  const ccsClass = deriveCCSClass(data);
  const nyhaClass = deriveNYHAClass(data);
  const overallRisk = deriveOverallRisk(firedRules, ccsClass, nyhaClass);

  return { ccsClass, nyhaClass, overallRisk, firedRules };
}

export { deriveCCSClass, deriveNYHAClass, deriveOverallRisk, calculateCardioGrade };
