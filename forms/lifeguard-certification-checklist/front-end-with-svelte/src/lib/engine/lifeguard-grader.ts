// Lifeguard Competency Verification grader. Pure functions: take an
// `AssessmentData` object, evaluate each declarative rule in the registry,
// and return the outcome plus the audit trail of fired rules.
//
// RLSS UK NPLQ outcome logic:
//   - Any critical-competency rule firing 'no' -> overall Fail.
//   - With no critical failures and 0 deficiencies -> Pass.
//   - With no critical failures and >=1 non-critical deficiency ->
//     Needs Development (the candidate may remediate and re-present rather
//     than outright Fail when no critical breach occurs).
//   - Items the examiner has not assessed ('na' or '') do not count as
//     deficiencies.

import type { AssessmentData, FiredRule, GradingResult, Outcome } from './types';
import { lifeguardRules } from './rules';
import { detectAdditionalFlags } from './flagged-issues';

export const DEFICIENCY_LIMIT_FOR_PASS = 0;
export const DEFICIENCY_LIMIT_FOR_NEEDS_DEVELOPMENT = 2;

/**
 * Evaluate every lifeguard rule in the registry, classify the outcome, and
 * return the full audit trail plus the examiner flags.
 */
export function gradeLifeguard(data: AssessmentData): GradingResult {
	const firedRules: FiredRule[] = [];
	const criticalFailures: FiredRule[] = [];
	const deficiencies: FiredRule[] = [];
	let answeredCount = 0;

	for (const rule of lifeguardRules) {
		let status: FiredRule['status'] = '';
		try {
			status = rule.evaluate(data);
		} catch (e) {
			console.warn(`Lifeguard rule ${rule.id} evaluation failed:`, e);
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
				deficiencies.push(entry);
			}
		}
	}

	let outcome: Outcome = '';
	if (criticalFailures.length > 0) {
		outcome = 'fail';
	} else if (answeredCount === 0) {
		// Nothing assessed yet — surface a neutral "fail" on submission so the
		// examiner is prompted to actually mark items, but don't claim success.
		outcome = 'fail';
	} else if (deficiencies.length === DEFICIENCY_LIMIT_FOR_PASS) {
		outcome = 'pass';
	} else {
		// One or more non-critical deficiencies but no critical breach: the
		// candidate needs targeted development before recertification.
		outcome = 'needs-development';
	}

	const additionalFlags = detectAdditionalFlags(data, { criticalFailures, deficiencies });

	return {
		outcome,
		criticalFailures,
		deficiencies,
		firedRules,
		additionalFlags,
		answeredCount,
		totalRules: lifeguardRules.length,
		timestamp: new Date().toISOString()
	};
}
