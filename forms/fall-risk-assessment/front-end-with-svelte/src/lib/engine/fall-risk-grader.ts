// Fall Risk grader. Pure functions: take an `AssessmentData` object and return
// the total Morse Fall Scale score (0-125), the `Severity`, the list of fired
// item rules, the Critical-override metadata, and the additional flags.
//
// Severity cutoffs (raw MFS):
//   0-24   -> low
//   25-44  -> moderate
//   >=45   -> high
//
// Critical-override (raises severity to 'critical' regardless of raw MFS):
//   - recurrent falls with injury
//   - anticoagulated patient
//   - MFS >= 75

import type { AssessmentData, FiredRule, GradingResult, MfsItem, Severity } from './types';
import { mfsItems, ancillaryRules } from './mfs-rules';
import { detectAdditionalFlags } from './flagged-issues';

/**
 * Classify a numeric MFS score (0-125) into the base severity. The
 * Critical-override is applied separately by `calculateFallRiskGrade`.
 */
export function classifyMfsScore(score: number): Severity {
	if (score >= 45) return 'high';
	if (score >= 25) return 'moderate';
	return 'low';
}

/** Look up the option label for an MFS field's selected score. */
function mfsOptionLabel(item: MfsItem, score: number | null): string {
	if (score === null || score === undefined) return '';
	const opt = item.options.find((o) => o.score === score);
	return opt ? opt.label : '';
}

/**
 * Evaluate the six-item Morse Fall Scale against the supplied assessment data,
 * apply the Critical-override, and collect the additional flags.
 */
export function calculateFallRiskGrade(data: AssessmentData): GradingResult {
	const firedRules: FiredRule[] = [];
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

	const criticalReasons: string[] = [];
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
	const severity: Severity = criticalOverride ? 'critical' : baseSeverity;

	return {
		mfsScore,
		severity,
		criticalOverride,
		criticalReasons,
		answeredCount,
		firedRules,
		additionalFlags: detectAdditionalFlags(data),
		timestamp: new Date().toISOString()
	};
}
