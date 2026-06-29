import type {
	AssessmentData,
	FiredRule,
	SectionCompleteness,
	SectionKey,
	ValidationResult
} from './types';
import { b1Rules } from './b1-rules';

/**
 * Pure function: validates the DVLA B1 form data for completeness.
 *
 * Each rule in `b1Rules` is checked first against `applies()` to honour the
 * conditional logic of the form (Q4 No → skip Q5/Q6, Q10 No → skip Q10a/b,
 * etc.). When a rule applies, it must also be `isSatisfied()` for the form to
 * be complete; otherwise the rule is recorded as a missing field.
 *
 * The validator returns an aggregate ValidationResult plus a per-section
 * breakdown so the dashboard can highlight exactly which questions are
 * outstanding for the patient.
 */
export function validateB1(data: AssessmentData): ValidationResult {
	const sectionMap = new Map<SectionKey, SectionCompleteness>();
	const missing: FiredRule[] = [];
	let totalRequired = 0;
	let totalSatisfied = 0;

	for (const rule of b1Rules) {
		let applies = false;
		try {
			applies = rule.applies(data);
		} catch (e) {
			console.warn(`B1 rule ${rule.id} applies() failed:`, e);
		}
		if (!applies) continue;

		totalRequired++;

		let satisfied = false;
		try {
			satisfied = rule.isSatisfied(data);
		} catch (e) {
			console.warn(`B1 rule ${rule.id} isSatisfied() failed:`, e);
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
