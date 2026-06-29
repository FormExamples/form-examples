import type { AssessmentData, GradingResult } from './types';
import { validateForm } from './form-validator';
import { detectAdditionalFlags } from './flagged-issues';

/**
 * Grader entry point: validate completeness, detect additional flags, and
 * assemble the full {@link GradingResult} used by both the report view and the
 * dashboard. Pure — no side effects.
 */
export function gradeForm(data: AssessmentData): GradingResult {
	const { completeness, status, firedRules } = validateForm(data);
	const additionalFlags = detectAdditionalFlags(data);
	return {
		completenessPercent: completeness,
		status,
		firedRules,
		additionalFlags,
		timestamp: new Date().toISOString()
	};
}
