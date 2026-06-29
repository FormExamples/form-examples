import type { AssessmentData, GradingResult } from './types';
import { validateForm } from './form-validator';
import { detectAdditionalFlags } from './flagged-issues';

/**
 * Pure engine entry point: validate the form for completeness, detect the
 * safety/process flags, and assemble the full grading result. The same
 * function backs both the wizard's submit step and the dashboard's derived
 * rows, so the report and the dashboard always agree.
 */
export function gradeForm(data: AssessmentData): GradingResult {
	const { completenessScore, completenessStatus, validationStatusLabel, firedRules } =
		validateForm(data);
	const additionalFlags = detectAdditionalFlags(data);
	return {
		completenessScore,
		completenessStatus,
		validationStatus: validationStatusLabel,
		firedRules,
		additionalFlags,
		timestamp: new Date().toISOString()
	};
}
