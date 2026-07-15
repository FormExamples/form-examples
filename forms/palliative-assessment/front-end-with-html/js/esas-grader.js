import { rules } from './rules.js';
import { ESAS_ITEMS, classifyESASTotal } from './types.js';

// ESAS-r grader. Pure functions: take an `AssessmentData` object, return
// the total ESAS-r score (0-100), the SeverityBand, the list of fired
// rules, and the per-symptom individual flags (any symptom >= 7).
//
// Banding (ESAS-r total 0-100):
//   0-10    -> none
//   11-30   -> mild
//   31-60   -> moderate
//   61-100  -> severe
//
// Items the patient has not answered (null) are excluded from the total
// and from the answered count.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').SeverityBand} SeverityBand
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').IndividualFlag} IndividualFlag
 */

// Wrapped in an IIFE; published via window.PalliativeAssessment.

/**
 * Evaluate the ten-item ESAS-r against the supplied assessment data and
 * produce the total, severity band, audit trail of fired rules, and
 * per-symptom severe-symptom flags. Ancillary (non-ESAS) rules are also
 * evaluated and returned via `firedRules` for completeness.
 *
 * @param {AssessmentData} data
 * @returns {{
 *   esasTotal: number,
 *   severityBand: SeverityBand,
 *   answeredCount: number,
 *   firedRules: FiredRule[],
 *   individualFlags: IndividualFlag[]
 * }}
 */
function gradeESAS(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  /** @type {IndividualFlag[]} */
  const individualFlags = [];

  let total = 0;
  let answeredCount = 0;

  // Build a quick lookup of the static ESAS metadata so we can attach
  // human-readable labels to individual flags.
  const labelByKey = Object.create(null);
  for (const item of ESAS_ITEMS) {
    labelByKey[item.key] = item.label;
  }

  for (const rule of rules) {
    let score = 0;
    try {
      score = rule.evaluate(data);
    } catch (e) {
      console.warn(`Palliative rule ${rule.id} evaluation failed:`, e);
      continue;
    }

    if (rule.kind === 'esas') {
      const raw = data.esasrSymptoms[rule.symptomKey];
      const answered = raw !== null && raw !== undefined;
      if (answered) {
        answeredCount += 1;
        total += score;
        firedRules.push({
          id: rule.id,
          category: rule.category,
          description: rule.description,
          score
        });
        if (score >= 7) {
          individualFlags.push({
            symptomKey: rule.symptomKey,
            symptomLabel: labelByKey[rule.symptomKey] || rule.category,
            score
          });
        }
      }
    } else if (rule.kind === 'ancillary') {
      if (score > 0) {
        firedRules.push({
          id: rule.id,
          category: rule.category,
          description: rule.description,
          score
        });
      }
    }
  }

  const severityBand = classifyESASTotal(total);

  return {
    esasTotal: total,
    severityBand,
    answeredCount,
    firedRules,
    individualFlags
  };
}

export { gradeESAS };
