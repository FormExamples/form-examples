// Discharge summary completeness validator. Pure functions: take an
// `AssessmentData` object, return the per-rule audit trail and the
// overall completeness level.
//
// Completeness cutoffs (NICE NG27):
//   All mandatory rules satisfied + all optional rules satisfied -> Complete
//   All mandatory rules satisfied + some optional rules missing  -> Partial
//   Any mandatory rule unsatisfied                                -> Incomplete

import type { AssessmentData, CompletenessLevel, FiredRule, GradingResult } from './types';
import { validationRules } from './validation-rules';
import { detectAdditionalFlags } from './flagged-issues';

/** The aggregated outcome of running every NICE NG27 validation rule. */
export interface ValidationSummary {
	completenessLevel: CompletenessLevel;
	mandatorySatisfied: number;
	mandatoryTotal: number;
	optionalSatisfied: number;
	optionalTotal: number;
	firedRules: FiredRule[];
}

/** Validate the discharge summary against all NICE NG27 rules. */
export function validateDischarge(data: AssessmentData): ValidationSummary {
	const firedRules: FiredRule[] = [];
	let mandatorySatisfied = 0;
	let mandatoryTotal = 0;
	let optionalSatisfied = 0;
	let optionalTotal = 0;

	for (const rule of validationRules) {
		let satisfied = false;
		try {
			satisfied = rule.evaluate(data) === true;
		} catch (e) {
			console.warn(`Validation rule ${rule.id} evaluation failed:`, e);
			satisfied = false;
		}
		if (rule.mandatory) {
			mandatoryTotal++;
			if (satisfied) mandatorySatisfied++;
		} else {
			optionalTotal++;
			if (satisfied) optionalSatisfied++;
		}
		firedRules.push({
			id: rule.id,
			category: rule.category,
			description: rule.description,
			mandatory: rule.mandatory,
			satisfied
		});
	}

	let completenessLevel: CompletenessLevel;
	if (mandatorySatisfied < mandatoryTotal) {
		completenessLevel = 'incomplete';
	} else if (optionalSatisfied < optionalTotal) {
		completenessLevel = 'partial';
	} else {
		completenessLevel = 'complete';
	}

	return {
		completenessLevel,
		mandatorySatisfied,
		mandatoryTotal,
		optionalSatisfied,
		optionalTotal,
		firedRules
	};
}

/**
 * Pure grader entry point: validate the discharge summary and attach the
 * clinician-facing flags, producing the full report payload.
 */
export function gradeDischarge(data: AssessmentData): GradingResult {
	const validation = validateDischarge(data);
	return {
		...validation,
		additionalFlags: detectAdditionalFlags(data),
		timestamp: new Date().toISOString()
	};
}
