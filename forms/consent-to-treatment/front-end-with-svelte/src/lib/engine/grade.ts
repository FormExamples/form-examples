import type { AssessmentData, GradingResult } from './types';
import { validateForm } from './form-validator';
import { detectAdditionalFlags } from './flagged-issues';

/**
 * Grade a consent-to-treatment form: assemble the full {@link GradingResult}
 * from the completeness validator and the additional-flag detector. This is the
 * single engine entry point shared by the wizard and the dashboard so both stay
 * aligned.
 */
export function gradeConsent(data: AssessmentData): GradingResult {
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
