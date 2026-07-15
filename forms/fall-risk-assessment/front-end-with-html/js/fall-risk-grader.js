import { ancillaryRules, mfsItems } from './mfs-rules.js';

// Fall Risk grader. Pure functions: take an `AssessmentData` object,
// return the total Morse Fall Scale score (0-125), the `Severity`, the
// list of fired item rules, and the Critical-override metadata.
//
// Severity cutoffs (raw MFS):
//   0-24   -> low
//   25-44  -> moderate
//   >=45   -> high
//
// Critical-override (raises the severity to 'critical' regardless of
// raw MFS):
//   - recurrent falls with injury
//   - anticoagulated patient
//   - MFS >= 75

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').Severity} Severity
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.FallRiskAssessment.

/**
 * Classify a numeric MFS score (0-125) into the base severity. The
 * Critical-override is applied separately by `gradeFallRisk`.
 * @param {number} score
 * @returns {Severity}
 */
function classifyMfsScore(score) {
  if (score >= 45) return 'high';
  if (score >= 25) return 'moderate';
  return 'low';
}

/**
 * Look up the option label corresponding to an MFS field's selected score.
 * Returns '' if the field is unanswered or the score is unknown.
 * @param {import('./mfs-rules.js').MfsItem} item
 * @param {number | null} score
 */
function mfsOptionLabel(item, score) {
  if (score === null || score === undefined) return '';
  const opt = item.options.find((o) => o.score === score);
  return opt ? opt.label : '';
}

/**
 * Evaluate the six-item Morse Fall Scale against the supplied
 * assessment data and apply the Critical-override.
 *
 * @param {AssessmentData} data
 * @returns {{
 *   mfsScore: number,
 *   severity: Severity,
 *   criticalOverride: boolean,
 *   criticalReasons: string[],
 *   answeredCount: number,
 *   firedRules: FiredRule[]
 * }}
 */
function gradeFallRisk(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  let mfsScore = 0;
  let answeredCount = 0;

  for (const item of mfsItems) {
    const value = data.mfs ? data.mfs[item.field] : null;
    if (value !== null && value !== undefined) {
      answeredCount++;
      mfsScore += value;
      firedRules.push({
        id: item.id,
        category: item.label,
        description: mfsOptionLabel(item, value) || item.description,
        score: value
      });
    }
  }

  const baseSeverity = classifyMfsScore(mfsScore);

  /** @type {string[]} */
  const criticalReasons = [];
  if (ancillaryRules.hasRecurrentFallsWithInjury(data)) {
    criticalReasons.push('Recurrent falls with injury');
  }
  if (ancillaryRules.isAnticoagulated(data)) {
    criticalReasons.push('Anticoagulated patient');
  }
  if (mfsScore >= 75) {
    criticalReasons.push(`MFS ${mfsScore} (>= 75)`);
  }

  const criticalOverride = criticalReasons.length > 0;
  /** @type {Severity} */
  const severity = criticalOverride ? 'critical' : baseSeverity;

  return {
    mfsScore,
    severity,
    criticalOverride,
    criticalReasons,
    answeredCount,
    firedRules
  };
}

export { classifyMfsScore, gradeFallRisk };
