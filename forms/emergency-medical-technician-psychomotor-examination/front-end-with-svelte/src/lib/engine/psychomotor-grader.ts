// NREMT EMT Psychomotor Skills Examination grader. Pure function: takes an
// `AssessmentData` object, evaluates every declarative rule in the registry,
// composes the prioritised flag list, and returns the pass/fail outcome plus
// the audit trail of fired rules.
//
// NREMT pass/fail logic:
//   - Any critical-criterion rule firing 'no' -> automatic Fail.
//   - Else, points awarded < PASS_PERCENT_THRESHOLD% of maxPoints -> Fail.
//   - Else -> Pass.
//
// Scoring details:
//   - 'yes' awards the rule's `points`; counts toward maxPoints.
//   - 'no'  awards 0;                  counts toward maxPoints.
//   - 'na'  is excluded from both numerator and denominator.
//   - ''    (unanswered) is excluded from both numerator and denominator.

import type { AssessmentData, FiredRule, GradingResult, Outcome } from './types';
import { psychomotorRules, PASS_PERCENT_THRESHOLD } from './rules';
import { detectAdditionalFlags } from './flagged-issues';

/**
 * Evaluate every psychomotor rule, classify the outcome, attach the flag
 * list, and return the audit trail.
 */
export function gradePsychomotor(data: AssessmentData): GradingResult {
	const firedRules: FiredRule[] = [];
	const criticalFailures: FiredRule[] = [];
	let points = 0;
	let maxPoints = 0;
	let answeredCount = 0;

	for (const rule of psychomotorRules) {
		let status: ReturnType<typeof rule.evaluate> = '';
		try {
			status = rule.evaluate(data);
		} catch (e) {
			console.warn(`Psychomotor rule ${rule.id} evaluation failed:`, e);
			status = '';
		}

		let pointsAwarded = 0;
		if (status === 'yes') {
			pointsAwarded = rule.points;
			points += rule.points;
			maxPoints += rule.points;
			answeredCount++;
		} else if (status === 'no') {
			pointsAwarded = 0;
			maxPoints += rule.points;
			answeredCount++;
		}
		// 'na' and '' are excluded entirely.

		const entry: FiredRule = {
			id: rule.id,
			step: rule.step,
			category: rule.category,
			description: rule.label,
			critical: rule.critical,
			points: rule.points,
			status,
			pointsAwarded
		};
		firedRules.push(entry);

		if (status === 'no' && rule.critical) {
			criticalFailures.push(entry);
		}
	}

	const percent = maxPoints > 0 ? (points / maxPoints) * 100 : 0;

	let outcome: Outcome = '';
	if (criticalFailures.length > 0) {
		outcome = 'fail';
	} else if (answeredCount === 0) {
		// Nothing assessed yet — surface a neutral Fail on submission so the
		// examiner is prompted to actually mark items, but don't claim success.
		outcome = 'fail';
	} else if (percent < PASS_PERCENT_THRESHOLD) {
		outcome = 'fail';
	} else {
		outcome = 'pass';
	}

	const result: GradingResult = {
		outcome,
		points,
		maxPoints,
		percent,
		criticalFailures,
		firedRules,
		additionalFlags: [],
		answeredCount,
		totalRules: psychomotorRules.length,
		timestamp: new Date().toISOString()
	};

	result.additionalFlags = detectAdditionalFlags(data, result);

	return result;
}
