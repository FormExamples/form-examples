import type { AssessmentData, GradingResult } from './types';
import { validateForm } from './form-validator';
import { detectAdditionalFlags } from './flagged-issues';

/**
 * Pure grader entry point: validates completeness of the code of conduct
 * notice and detects additional compliance flags, returning a single
 * `GradingResult`. The same engine drives both the wizard report and the
 * dashboard, so they stay aligned.
 */
export function calculateNoticeGrade(data: AssessmentData): GradingResult {
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
