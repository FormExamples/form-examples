// Provider Transfer Request — completeness validator and grader entry point.
//
// `validateTransfer` is a pure function: it takes an `AssessmentData` object
// and returns a `ValidationResult` with per-section breakdown, an overall
// `CompletenessLevel`, and the list of fired (unsatisfied) rules.
//
// Completeness mapping:
//   - All applicable rules satisfied                       -> 'complete'
//   - All mandatory rules satisfied; some optional missing -> 'partial'
//   - Any mandatory rule unsatisfied                       -> 'incomplete'

import type {
	AssessmentData,
	CompletenessLevel,
	FiredRule,
	GradingResult,
	SectionCompleteness,
	ValidationResult
} from './types';
import { validationRules } from './validation-rules';
import { detectFlaggedIssues } from './flagged-issues';

export function validateTransfer(data: AssessmentData): ValidationResult {
	const sectionMap = new Map<string, SectionCompleteness>();
	const missing: FiredRule[] = [];

	let totalRequired = 0;
	let totalSatisfied = 0;
	let mandatoryRequired = 0;
	let mandatorySatisfied = 0;

	for (const rule of validationRules) {
		let applies = false;
		try {
			applies = rule.applies(data);
		} catch (e) {
			console.warn(`Validation rule ${rule.id} applies() failed:`, e);
		}
		if (!applies) continue;

		let satisfied = false;
		try {
			satisfied = rule.isSatisfied(data);
		} catch (e) {
			console.warn(`Validation rule ${rule.id} isSatisfied() failed:`, e);
		}

		totalRequired++;
		if (rule.mandatory) mandatoryRequired++;
		if (satisfied) {
			totalSatisfied++;
			if (rule.mandatory) mandatorySatisfied++;
		}

		let bucket = sectionMap.get(rule.section);
		if (!bucket) {
			bucket = {
				section: rule.section,
				required: 0,
				satisfied: 0,
				mandatoryRequired: 0,
				mandatorySatisfied: 0,
				missing: []
			};
			sectionMap.set(rule.section, bucket);
		}
		bucket.required++;
		if (rule.mandatory) bucket.mandatoryRequired++;
		if (satisfied) {
			bucket.satisfied++;
			if (rule.mandatory) bucket.mandatorySatisfied++;
		} else {
			const fired: FiredRule = {
				id: rule.id,
				section: rule.section,
				description: rule.description,
				mandatory: rule.mandatory
			};
			missing.push(fired);
			bucket.missing.push(fired);
		}
	}

	const sections = Array.from(sectionMap.values());

	let completeness: CompletenessLevel = 'complete';
	if (mandatorySatisfied < mandatoryRequired) {
		completeness = 'incomplete';
	} else if (totalSatisfied < totalRequired) {
		completeness = 'partial';
	}

	return {
		completeness,
		totalRequired,
		totalSatisfied,
		mandatoryRequired,
		mandatorySatisfied,
		sections,
		missing
	};
}

/**
 * Full grade entry point used by the wizard and dashboard: runs the
 * completeness validator and the flagged-issues detector and stamps the result.
 */
export function gradeTransfer(data: AssessmentData): GradingResult {
	return {
		validation: validateTransfer(data),
		flags: detectFlaggedIssues(data),
		timestamp: new Date().toISOString()
	};
}
