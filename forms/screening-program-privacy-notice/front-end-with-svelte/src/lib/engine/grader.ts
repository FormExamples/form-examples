import type { AssessmentData, GradingResult } from './types';
import { validateForm } from './form-validator';
import { detectAdditionalFlags } from './flagged-issues';

/**
 * Pure grader entry point: combines required-field validation (completeness
 * and status) with the additional governance flags into a single
 * {@link GradingResult}. Used by both the wizard (on submit) and the dashboard
 * (to derive sample rows), so the two surfaces always stay aligned.
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
