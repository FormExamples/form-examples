// Newborn blood spot classification rules (pure, no I/O).
//
// This form is a documentation-and-classification record, not a numeric score.
// The helpers here normalise each of the nine per-condition result classes,
// derive the referrals for suspected conditions, derive the overall screening
// outcome by precedence, derive the referral status, and derive the sample
// quality object. `grader.js` orchestrates these into `gradeBloodspot`.
//
// Overall outcome precedence (first match wins, top to bottom):
//   any suspected            -> 'referral-required'
//   any repeat-required      -> 'repeat-required'
//   any pending/outstanding  -> 'incomplete'
//   any declined (rest ok)   -> 'declined-only-outstanding'
//   otherwise                -> 'all-not-suspected'
//
// `carrier` is valid for SCD only; a carrier value on any other condition is a
// data-validity error and is treated as outstanding ('pending') for outcome
// purposes. An unanswered result ('') is likewise treated as outstanding.

/**
 * @typedef {import('./types.js').ScreeningData} ScreeningData
 * @typedef {import('./types.js').ConditionResult} ConditionResult
 * @typedef {import('./types.js').Referral} Referral
 * @typedef {import('./types.js').OverallOutcome} OverallOutcome
 * @typedef {import('./types.js').ReferralStatus} ReferralStatus
 * @typedef {import('./types.js').SampleQualityResult} SampleQualityResult
 */

// Wrapped in an IIFE; published via window.NewbornBloodSpotScreening.
(function () {
'use strict';
window.NewbornBloodSpotScreening = window.NewbornBloodSpotScreening || {};
const { CONDITIONS } = window.NewbornBloodSpotScreening;

// Repeat reasons that indicate an avoidable repeat (sampling technique or card
// fault, rather than a genuinely borderline result).
const AVOIDABLE_REPEAT_REASONS = ['inadequate-sample', 'too-early', 'technical'];

/**
 * Normalise each of the nine conditions into a ConditionResult carrying the
 * raw result, an `effectiveResult` used for outcome derivation, the specialist
 * referral target, and an `invalidCarrier` flag.
 * @param {ScreeningData} data
 * @returns {ConditionResult[]}
 */
function normaliseConditionResults(data) {
  return CONDITIONS.map((c) => {
    const raw = data.conditions[c.field] || '';
    const invalidCarrier = raw === 'carrier' && !c.carrierValid;
    // For outcome purposes an unanswered result and an invalid carrier are
    // both treated as outstanding ('pending').
    let effectiveResult = raw;
    if (raw === '' || invalidCarrier) effectiveResult = 'pending';
    return {
      code: c.code,
      label: c.label,
      short: c.short,
      result: raw,
      effectiveResult,
      referralTarget: c.service,
      invalidCarrier
    };
  });
}

/**
 * Emit one urgent Referral per condition whose (raw) result is 'suspected'.
 * @param {ConditionResult[]} conditionResults
 * @returns {Referral[]}
 */
function deriveReferrals(conditionResults) {
  const referrals = [];
  for (const cr of conditionResults) {
    if (cr.result === 'suspected') {
      referrals.push({ code: cr.code, service: cr.referralTarget, urgency: 'urgent' });
    }
  }
  return referrals;
}

/**
 * Derive the overall screening outcome by precedence.
 * @param {ConditionResult[]} conditionResults
 * @returns {OverallOutcome}
 */
function deriveOverallOutcome(conditionResults) {
  const eff = conditionResults.map((c) => c.effectiveResult);
  if (eff.includes('suspected')) return 'referral-required';
  if (eff.includes('repeat-required')) return 'repeat-required';
  if (eff.includes('pending')) return 'incomplete';
  // Every remaining result is 'not-suspected', 'carrier' (SCD), or 'declined'.
  if (eff.includes('declined')) return 'declined-only-outstanding';
  return 'all-not-suspected';
}

/**
 * Derive the referral status from the overall outcome.
 * @param {OverallOutcome} outcome
 * @returns {ReferralStatus}
 */
function deriveReferralStatus(outcome) {
  if (outcome === 'referral-required') return 'urgent';
  if (outcome === 'repeat-required') return 'repeat';
  return 'routine';
}

/**
 * Derive the sample-quality object from adequacy, the day 5–8 window on
 * `ageAtSampleDays`, and the repeat reason.
 * @param {ScreeningData} data
 * @param {number | null} ageAtSampleDays
 * @returns {SampleQualityResult}
 */
function deriveSampleQuality(data, ageAtSampleDays) {
  const sq = data.sampleQuality;
  const withinWindow =
    ageAtSampleDays !== null && ageAtSampleDays >= 5 && ageAtSampleDays <= 8;
  const avoidableRepeat =
    sq.isRepeat === 'yes' && AVOIDABLE_REPEAT_REASONS.indexOf(sq.repeatReason) !== -1;
  return {
    adequate: sq.sampleAdequacy === 'adequate',
    withinWindow,
    avoidableRepeat
  };
}

Object.assign(window.NewbornBloodSpotScreening, {
  AVOIDABLE_REPEAT_REASONS,
  normaliseConditionResults,
  deriveReferrals,
  deriveOverallOutcome,
  deriveReferralStatus,
  deriveSampleQuality
});
})();
