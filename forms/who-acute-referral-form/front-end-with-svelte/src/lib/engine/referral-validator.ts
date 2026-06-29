import type {
	AssessmentData,
	FiredRule,
	SectionCompleteness,
	SectionKey,
	ValidationResult
} from './types';
import { referralRules } from './referral-rules';

/**
 * Pure function: validates the WHO acute referral form data for completeness.
 *
 * Each rule in `referralRules` is checked first against `applies()` to honour
 * the conditional logic of the form (e.g. "Other precaution" details only
 * required when the "Other" box is ticked, receiving provider details only
 * required once an arrival time has been recorded). When a rule applies, it
 * must also be `isSatisfied()` for the form to be complete; otherwise the
 * rule is recorded as a missing field.
 *
 * The validator returns an aggregate ValidationResult plus a per-section
 * breakdown so the dashboard can highlight exactly which fields are still
 * outstanding.
 */
export function validateReferral(data: AssessmentData): ValidationResult {
	const sectionMap = new Map<SectionKey, SectionCompleteness>();
	const missing: FiredRule[] = [];
	let totalRequired = 0;
	let totalSatisfied = 0;

	for (const rule of referralRules) {
		let applies = false;
		try {
			applies = rule.applies(data);
		} catch (e) {
			console.warn(`Referral rule ${rule.id} applies() failed:`, e);
		}
		if (!applies) continue;

		totalRequired++;

		let satisfied = false;
		try {
			satisfied = rule.isSatisfied(data);
		} catch (e) {
			console.warn(`Referral rule ${rule.id} isSatisfied() failed:`, e);
		}

		const bucket = sectionMap.get(rule.section) ?? {
			section: rule.section,
			required: 0,
			satisfied: 0,
			missing: []
		};
		bucket.required++;

		if (satisfied) {
			totalSatisfied++;
			bucket.satisfied++;
		} else {
			const fired: FiredRule = {
				id: rule.id,
				section: rule.section,
				description: rule.description
			};
			missing.push(fired);
			bucket.missing.push(fired);
		}

		sectionMap.set(rule.section, bucket);
	}

	const sections: SectionCompleteness[] = Array.from(sectionMap.values());

	return {
		complete: missing.length === 0,
		totalRequired,
		totalSatisfied,
		sections,
		missing
	};
}
