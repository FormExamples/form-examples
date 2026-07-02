// Newborn blood spot grader. Pure function `gradeBloodspot(data)`, no I/O.
//
// Orchestrates the classification helpers in `bloodspot-rules.ts` and the flag
// detection in `flagged-issues.ts`:
//   1. recompute the baby's age at sample (day of birth = day 0),
//   2. normalise each of the nine per-condition result classes,
//   3. emit one urgent referral per suspected condition,
//   4. derive the overall outcome by precedence and the referral status,
//   5. derive the sample-quality object (adequacy, day 5–8 window, avoidable
//      repeat),
//   6. detect flagged issues.
//
// This is a classification form — there is NO numeric total, cut-off, or band.

import type { BloodspotScreening, GradingResult } from './types';
import {
	computeAgeAtSampleDays,
	deriveOverallOutcome,
	deriveReferralStatus,
	deriveReferrals,
	deriveSampleQuality,
	normaliseConditionResults
} from './bloodspot-rules';
import { detectFlaggedIssues } from './flagged-issues';

/** Classify a newborn blood spot screening record. */
export function gradeBloodspot(data: BloodspotScreening): GradingResult {
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
