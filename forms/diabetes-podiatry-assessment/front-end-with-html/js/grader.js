import { reviewRules, deriveContext, RISK_SEVERITY } from './rules.js';

// Diabetes-podiatry-assessment grader. Pure functions: take an
// `AssessmentData` object, classify each foot, derive the overall risk
// category, apply the gated first-match review-pathway cascade in
// `reviewRules`, and return the per-foot and overall risk, the review
// pathway, referral, review interval, a completeness status, and the audit
// trail of the winning rule.
//
// Classification algorithm (spec §4): per-foot risk-factor count then
// worst-foot with overrides.
//   perFootRisk(foot) — active ulcer / suspected Charcot -> active-urgent;
//     previous ulcer / amputation -> at least high; otherwise the
//     risk-factor count (0 low, 1 moderate, 2+ high).
//   overallRisk — the worse of the two feet, raised to at least high by
//     renal replacement therapy.
//   reviewPathway — urgent-mdt-referral (active-urgent), high-risk-review
//     (high; 1 month with an ulcer/amputation history, else 3 months),
//     moderate-risk-review (moderate; 6 months), annual-review (low; 12
//     months).
//
// This is a result-classification outcome, not a numeric score.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').Risk} Risk
 * @typedef {import('./types.js').ReviewPathway} ReviewPathway
 * @typedef {import('./types.js').Referral} Referral
 * @typedef {import('./types.js').Status} Status
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

/**
 * Completeness of one foot's examination: it must carry a neuropathy status
 * and a pulses status.
 * @param {import('./types.js').FootExam} foot
 * @returns {boolean}
 */
function footComplete(foot) {
  return foot.neuropathyStatus !== '' && foot.neuropathyStatus !== 'not-tested' &&
    foot.pulsesStatus !== '' && foot.pulsesStatus !== 'not-tested';
}

/**
 * Completeness status: complete when both feet have a neuropathy and pulses
 * status recorded (and tested); otherwise incomplete.
 * @param {AssessmentData} d
 * @returns {Status}
 */
function computeStatus(d) {
  return footComplete(d.rightFoot) && footComplete(d.leftFoot)
    ? 'complete'
    : 'incomplete';
}

/**
 * Overall risk: the worse of the two feet, raised to at least 'high' by
 * renal replacement therapy.
 * @param {import('./rules.js').OverallContext} ctx
 * @returns {Risk}
 */
function computeOverallRisk(ctx) {
  if (ctx.onRenalReplacementTherapy && RISK_SEVERITY[ctx.worstFootRisk] < RISK_SEVERITY['high']) {
    return 'high';
  }
  return ctx.worstFootRisk;
}

/**
 * Compute the full classification for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ rightFootRisk: Risk,
 *             leftFootRisk: Risk,
 *             overallRisk: Risk,
 *             reviewPathway: ReviewPathway,
 *             reviewIntervalMonths: 1 | 3 | 6 | 12 | null,
 *             referral: Referral,
 *             status: Status,
 *             firedRules: FiredRule[] }}
 */
function calculateGrade(data) {
  const ctx = deriveContext(data);
  const overallRisk = computeOverallRisk(ctx);

  /** @type {import('./rules.js').ReviewRule} */
  let winner = reviewRules[reviewRules.length - 1];
  for (const rule of reviewRules) {
    try {
      if (rule.evaluate(ctx)) {
        winner = rule;
        break;
      }
    } catch (e) {
      console.warn(`Diabetes-podiatry-assessment rule ${rule.id} evaluation failed:`, e);
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
    rightFootRisk: ctx.rightFootRisk,
    leftFootRisk: ctx.leftFootRisk,
    overallRisk,
    reviewPathway: winner.reviewPathway,
    reviewIntervalMonths: winner.intervalMonths,
    referral: winner.referral,
    status,
    firedRules
  };
}

export { calculateGrade, computeStatus, footComplete, computeOverallRisk };
