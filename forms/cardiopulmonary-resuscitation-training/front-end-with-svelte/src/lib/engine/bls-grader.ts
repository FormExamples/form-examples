import type { AssessmentData, Outcome, FiredRule, TriState, GradingResult } from './types';
import { blsRules } from './bls-rules';
import { detectAdditionalFlags } from './flagged-issues';

/**
 * Maximum number of non-critical deficiencies tolerated before the overall
 * outcome is a Fail.
 */
export const NON_CRITICAL_DEFICIENCY_LIMIT = 2;

/**
 * Pure function: evaluates every BLS rule in the registry against the trainee's
 * observed performance and classifies the overall pass/fail outcome.
 *
 * AHA pass/fail logic:
 *   - Any critical-action rule firing 'no' -> overall Fail.
 *   - More than two non-critical 'no' deficiencies -> Fail.
 *   - Nothing assessed yet -> Fail (prompt the examiner to record items).
 *   - Otherwise -> Pass.
 *   - Items the examiner has not assessed ('na' or '') do not count as
 *     deficiencies.
 */
export function gradeBLS(data: AssessmentData): GradingResult {
	const firedRules: FiredRule[] = [];
	const criticalFailures: FiredRule[] = [];
	const nonCriticalDeficiencies: FiredRule[] = [];
	let answeredCount = 0;

	for (const rule of blsRules) {
		let status: TriState = '';
		try {
			status = rule.evaluate(data);
		} catch (e) {
			console.warn(`BLS rule ${rule.id} evaluation failed:`, e);
			status = '';
		}

		const entry: FiredRule = {
			id: rule.id,
			step: rule.step,
			category: rule.category,
			description: rule.label,
			critical: rule.critical,
			status
		};
		firedRules.push(entry);

		if (status === 'yes' || status === 'no') answeredCount++;

		if (status === 'no') {
			if (rule.critical) {
				criticalFailures.push(entry);
			} else {
				nonCriticalDeficiencies.push(entry);
			}
		}
	}

	let outcome: Outcome;
	if (criticalFailures.length > 0) {
		outcome = 'fail';
	} else if (nonCriticalDeficiencies.length > NON_CRITICAL_DEFICIENCY_LIMIT) {
		outcome = 'fail';
	} else if (answeredCount === 0) {
		// Nothing assessed yet — surface a neutral "fail" on submission so the
		// examiner is prompted to actually mark items, but don't claim success.
		outcome = 'fail';
	} else {
		outcome = 'pass';
	}

	const additionalFlags = detectAdditionalFlags(data, {
		criticalFailures,
		nonCriticalDeficiencies
	});

	return {
		outcome,
		criticalFailures,
		nonCriticalDeficiencies,
		firedRules,
		additionalFlags,
		answeredCount,
		totalRules: blsRules.length,
		timestamp: new Date().toISOString()
	};
}
