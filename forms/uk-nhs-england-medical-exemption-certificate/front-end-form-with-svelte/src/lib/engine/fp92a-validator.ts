import type {
	EligibilityResult,
	EligibleConditionCode,
	FiredRule,
	Fp92aApplication,
	Outcome,
	RedirectTarget
} from './types';
import { fp92aRules } from './fp92a-rules';
import { detectAdditionalFlags } from './flagged-issues';
import { addYears, ageInYears, isFilled, priorityOrder, todayIso } from './utils';

/**
 * Pure function: evaluate eligibility for an FP92A medical exemption application.
 *
 * Algorithm:
 *   1. Run every rule in `fp92aRules`. Collect fired rules.
 *   2. The "eligible conditions" are the set of contributing condition codes
 *      from fired `eligible-condition` rules.
 *   3. The outcome is:
 *        - `eligible`                — at least one eligible-condition rule
 *                                       fired AND no disqualifying rule fired
 *                                       for a contributing condition.
 *        - `requires-clarification`  — at least one selected qualifying
 *                                       condition lacks the required detail,
 *                                       or cancer is selected with pending
 *                                       histology, or disability lacks home-care
 *                                       attestation (but not declared as
 *                                       temporary).
 *        - `ineligible`              — no eligible-condition rule fired, OR
 *                                       a `disqualifying` rule fired and there
 *                                       are no other eligible conditions, OR
 *                                       a redirect rule applies (pregnancy /
 *                                       age) and no other ground for use.
 *   4. The redirect target is the most-specific applicable: pregnancy → FW8;
 *      else age-based exemption; else '' (none).
 *   5. The validity window is 5 years from today (or completionDate when set).
 *
 * The function is pure: no mutation, no side effects.
 */
export function evaluateFp92a(data: Fp92aApplication): EligibilityResult {
	const firedRules: FiredRule[] = [];

	for (const rule of fp92aRules) {
		try {
			if (rule.evaluate(data)) {
				firedRules.push({
					id: rule.id,
					category: rule.category,
					priority: rule.priority,
					description: rule.description,
					message: rule.message,
					contributingConditionCode: rule.contributingConditionCode ?? ''
				});
			}
		} catch (e) {
			console.warn(`FP92A rule ${rule.id} evaluation failed:`, e);
		}
	}

	firedRules.sort((a, b) => priorityOrder(a.priority) - priorityOrder(b.priority));

	// Eligible conditions = codes from fired eligible-condition rules.
	const eligibleConditions: EligibleConditionCode[] = [];
	for (const r of firedRules) {
		if (r.category === 'eligible-condition' && r.contributingConditionCode !== '') {
			if (!eligibleConditions.includes(r.contributingConditionCode)) {
				eligibleConditions.push(r.contributingConditionCode);
			}
		}
	}

	// Redirect target.
	const redirectTo: RedirectTarget = (() => {
		if (
			firedRules.some(
				(r) => r.category === 'redirect' && r.id === 'FP92A-REDIRECT-PREGNANCY'
			)
		) {
			return 'FW8';
		}
		if (firedRules.some((r) => r.category === 'redirect')) {
			return 'age-exemption';
		}
		return '';
	})();

	// Outcome.
	const hasAnySelectedCondition = data.qualifyingConditions.some((c) => c.selected);
	const hasCancerPending = data.qualifyingConditions.some(
		(c) => c.selected && c.code === 'cancer-or-effects' && c.histologyConfirmed === 'pending'
	);
	const hasDisabilityHomecareUnsure = data.qualifyingConditions.some(
		(c) =>
			c.selected &&
			c.code === 'continuing-physical-disability' &&
			c.cannotLeaveHomeUnaided === '' &&
			c.disabilityExpectedToBePermanent !== 'no'
	);

	let outcome: Outcome;
	if (eligibleConditions.length > 0 && redirectTo === '') {
		outcome = 'eligible';
	} else if (
		hasAnySelectedCondition &&
		eligibleConditions.length === 0 &&
		(hasCancerPending || hasDisabilityHomecareUnsure)
	) {
		outcome = 'requires-clarification';
	} else {
		outcome = 'ineligible';
	}

	// Validity window: 5 years from completion date, or today as a fallback.
	const fromDate = isFilled(data.practitioner.completionDate)
		? data.practitioner.completionDate
		: todayIso();
	const validFrom = outcome === 'eligible' ? fromDate : '';
	const validUntil = outcome === 'eligible' ? addYears(fromDate, 5) : '';

	const additionalFlags = detectAdditionalFlags(data);
	const ageYears = ageInYears(data.patient.birthDate);

	return {
		outcome,
		eligibleConditions,
		firedRules,
		additionalFlags,
		validFrom,
		validUntil,
		redirectTo,
		ageYears,
		timestamp: new Date().toISOString()
	};
}
