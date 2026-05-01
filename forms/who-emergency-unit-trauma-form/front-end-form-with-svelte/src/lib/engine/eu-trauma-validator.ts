import type {
	AssessmentData,
	FiredRule,
	SectionCompleteness,
	SectionKey,
	ValidationResult
} from './types';
import { euTraumaRules } from './eu-trauma-rules';

/**
 * Pure function: validates the WHO Emergency Unit (Trauma) form data for
 * completeness.
 *
 * Each rule in `euTraumaRules` is checked first against `applies()` to
 * honour the conditional logic of the form (e.g. cause of death only when
 * disposition is died, time of death only when patient is dead-on-arrival,
 * GCS recording only when triage is RED, etc.).
 *
 * The validator returns an aggregate ValidationResult plus a per-section
 * breakdown so the dashboard can highlight exactly which fields are still
 * outstanding.
 */
export function validateEuTrauma(data: AssessmentData): ValidationResult {
	const sectionMap = new Map<SectionKey, SectionCompleteness>();
	const missing: FiredRule[] = [];
	let totalRequired = 0;
	let totalSatisfied = 0;

	for (const rule of euTraumaRules) {
		let applies = false;
		try {
			applies = rule.applies(data);
		} catch (e) {
			console.warn(`EU Trauma rule ${rule.id} applies() failed:`, e);
		}
		if (!applies) continue;

		totalRequired++;

		let satisfied = false;
		try {
			satisfied = rule.isSatisfied(data);
		} catch (e) {
			console.warn(`EU Trauma rule ${rule.id} isSatisfied() failed:`, e);
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
