import type { AssessmentData, FiredRule, GradingResult, Outcome } from './types';
import { fawRules } from './faw-rules';
import { detectAdditionalFlags } from './flagged-issues';

/**
 * First Aid at Work (FAW) competency grader. Pure function: evaluates each
 * declarative rule in the registry and returns the pass / needs-development /
 * fail outcome plus the audit trail of fired rules and flagged issues.
 *
 * HSE / St John outcome logic:
 *   - Any critical-skill rule firing 'no' -> overall Fail.
 *   - 3 or more non-critical 'no' deficiencies -> Fail.
 *   - 1 or 2 non-critical 'no' deficiencies   -> Needs Development.
 *   - Otherwise (no deficiencies, at least one assessed) -> Pass.
 *   - Items the examiner has not assessed ('na' or '') do not count.
 */
export const NEEDS_DEVELOPMENT_DEFICIENCY_LIMIT = 2;

export function gradeFirstAid(data: AssessmentData): GradingResult {
	const firedRules: FiredRule[] = [];
	const criticalFailures: FiredRule[] = [];
	const deficiencies: FiredRule[] = [];
	let answeredCount = 0;
	let passedCount = 0;

	for (const rule of fawRules) {
		let status: FiredRule['status'] = '';
		try {
			status = rule.evaluate(data);
		} catch (e) {
			console.warn(`FAW rule ${rule.id} evaluation failed:`, e);
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
		if (status === 'yes') passedCount++;

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
	} else if (deficiencies.length > NEEDS_DEVELOPMENT_DEFICIENCY_LIMIT) {
		outcome = 'fail';
	} else if (deficiencies.length >= 1) {
		outcome = 'needs-development';
	} else if (answeredCount === 0) {
		// Nothing assessed yet — surface a neutral "fail" on submission so the
		// examiner is prompted to actually mark items, but don't claim success.
		outcome = 'fail';
	} else {
		outcome = 'pass';
	}

	const additionalFlags = detectAdditionalFlags(data, { criticalFailures, deficiencies });

	return {
		outcome,
		criticalFailures,
		deficiencies,
		firedRules,
		additionalFlags,
		answeredCount,
		passedCount,
		totalRules: fawRules.length,
		timestamp: new Date().toISOString()
	};
}
