import { detectFlaggedIssues } from './flags.js';
import { deriveOverallOutcome, deriveReferralStatus, deriveReferrals, deriveSampleQuality, normaliseConditionResults } from './rules.js';
import { computeAgeAtSampleDays } from './types.js';

// Newborn blood spot grader. Pure function `gradeBloodspot(data)`, no I/O.
//
// Orchestrates the classification helpers in `rules.js` and the flag detection
// in `flags.js`:
//   1. recompute the baby's age at sample (day of birth = day 0),
//   2. normalise each of the nine per-condition result classes,
//   3. emit one urgent referral per suspected condition,
//   4. derive the overall outcome by precedence and the referral status,
//   5. derive the sample-quality object (adequacy, day 5–8 window, avoidable
//      repeat),
//   6. detect flagged issues.

/**
 * @typedef {import('./types.js').ScreeningData} ScreeningData
 * @typedef {import('./types.js').GradingResult} GradingResult
 */

// Wrapped in an IIFE; published via window.NewbornBloodSpotScreening.

/**
 * Classify a newborn blood spot screening record.
 * @param {ScreeningData} data
 * @returns {GradingResult}
 */
function gradeBloodspot(data) {
  const ageAtSampleDays = computeAgeAtSampleDays(
    data.babyId.dateOfBirth,
    data.sampleEvent.sampleDate
  );

  const conditionResults = normaliseConditionResults(data);
  const referrals = deriveReferrals(conditionResults);
  const overallOutcome = deriveOverallOutcome(conditionResults);
  const referralStatus = deriveReferralStatus(overallOutcome);
  const sampleQuality = deriveSampleQuality(data, ageAtSampleDays);
  const flaggedIssues = detectFlaggedIssues(data, {
    conditionResults,
    sampleQuality,
    ageAtSampleDays
  });

  return {
    ageAtSampleDays,
    conditionResults,
    referrals,
    overallOutcome,
    referralStatus,
    sampleQuality,
    flaggedIssues,
    timestamp: new Date().toISOString()
  };
}

export { gradeBloodspot };
