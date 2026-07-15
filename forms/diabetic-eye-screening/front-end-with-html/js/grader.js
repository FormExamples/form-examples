import { classificationRules, deriveContext } from './rules.js';

// Diabetic-eye-screening grader. Pure functions: take a `ScreeningData` object,
// derive the worst-eye summary, apply the gated first-match classification
// cascade in `classificationRules`, and return the worst R/M grade, the
// any-ungradable marker, the recall / referral outcome, the recall interval,
// the referral destination, a completeness status, and the audit trail of the
// winning rule.
//
// Classification algorithm (spec §4). Retinopathy severity ranks
// R0 < R1 < R2 < R3S < R3A. Take the worst R and M grade across both eyes plus
// any ungradable marker, then map to a recall / referral pathway by clinical
// urgency (most urgent wins):
//   worstRetinopathy == 'R3A'                         -> refer-hes-urgent      (null)
//   worstMaculopathy == 'M1' || worstRetinopathy == 'R3S' -> refer-hes         (null)
//   anyUngradable                                     -> refer-slit-lamp       (null)
//   worstRetinopathy == 'R2'                          -> surveillance-6-month  (6)
//   worstRetinopathy == 'R1'                          -> routine-12-month      (12)
//   worstRetinopathy == 'R0' && lowRiskEligible       -> routine-24-month      (24)
//   otherwise (R0, not low-risk eligible)             -> routine-12-month      (12)
//
// This is a result-classification outcome, not a numeric score.

/**
 * @typedef {import('./types.js').ScreeningData} ScreeningData
 * @typedef {import('./types.js').Outcome} Outcome
 * @typedef {import('./types.js').Referral} Referral
 * @typedef {import('./types.js').Status} Status
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

/**
 * Completeness of one eye's grading: it must carry an R and an M grade, unless
 * it is explicitly marked ungradable.
 * @param {import('./types.js').EyeGrade} eye
 * @returns {boolean}
 */
function eyeComplete(eye) {
  if (eye.ungradable === 'yes') return true;
  return eye.retinopathy !== '' && eye.maculopathy !== '';
}

/**
 * Completeness status: complete when both eyes have an R and M grade (or are
 * marked ungradable); otherwise incomplete.
 * @param {ScreeningData} d
 * @returns {Status}
 */
function computeStatus(d) {
  return eyeComplete(d.rightEye) && eyeComplete(d.leftEye)
    ? 'complete'
    : 'incomplete';
}

/**
 * Compute the full classification for the supplied screening data.
 * @param {ScreeningData} data
 * @returns {{ rightEyeGrade: import('./types.js').EyeGrade,
 *             leftEyeGrade: import('./types.js').EyeGrade,
 *             worstRetinopathy: 'R0' | 'R1' | 'R2' | 'R3S' | 'R3A',
 *             worstMaculopathy: 'M0' | 'M1',
 *             anyUngradable: boolean,
 *             recallPathway: Outcome,
 *             recallIntervalMonths: 6 | 12 | 24 | null,
 *             referral: Referral,
 *             status: Status,
 *             firedRules: FiredRule[] }}
 */
function calculateGrade(data) {
  const ctx = deriveContext(data);

  /** @type {import('./rules.js').ClassificationRule} */
  let winner = classificationRules[classificationRules.length - 1];
  for (const rule of classificationRules) {
    try {
      if (rule.evaluate(ctx)) {
        winner = rule;
        break;
      }
    } catch (e) {
      console.warn(`Diabetic-eye-screening rule ${rule.id} evaluation failed:`, e);
    }
  }

  const status = computeStatus(data);

  /** @type {FiredRule[]} */
  const firedRules = [
    {
      id: winner.id,
      stage: winner.stage,
      category: winner.category,
      description: winner.description
    }
  ];

  return {
    rightEyeGrade: data.rightEye,
    leftEyeGrade: data.leftEye,
    worstRetinopathy: ctx.worstRetinopathy,
    worstMaculopathy: ctx.worstMaculopathy,
    anyUngradable: ctx.anyUngradable,
    recallPathway: winner.outcome,
    recallIntervalMonths: winner.intervalMonths,
    referral: winner.referral,
    status,
    firedRules
  };
}

export { calculateGrade, computeStatus, eyeComplete };
