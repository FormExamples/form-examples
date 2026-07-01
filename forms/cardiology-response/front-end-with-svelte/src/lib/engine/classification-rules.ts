import type { CardiologyResponse, ResponseClassification, FiredRule } from './types';
import { hasCriticalFinding, hasAnyCardiacFinding } from './utils';

/**
 * Axis A — response classification.
 *
 * Determines the overall assessment conclusion:
 * - critical: a critical result is present (auto-escalation invariant).
 * - inconclusive: no clinical summary recorded, or no diagnosis category and no
 *   structured finding (the assessment did not reach a conclusion).
 * - cardiac-condition: any structured cardiac finding is present, or the
 *   diagnosis category is a cardiac one.
 * - no-abnormality: no cardiac finding and a non-cardiac / no-abnormality
 *   conclusion on a completed assessment.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResponse(r: CardiologyResponse): {
	responseClassification: ResponseClassification;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	if (hasCriticalFinding(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-CRITICAL-01',
			axis: 'classification',
			category: 'critical-finding',
			description:
				'A critical or unexpected significant cardiac result is present; classified as critical.'
		});
		return { responseClassification: 'critical', firedRules };
	}

	if (r.clinicalSummary.trim() === '') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-01',
			axis: 'classification',
			category: 'no-summary',
			description: 'No clinical summary recorded; classified as inconclusive.'
		});
		return { responseClassification: 'inconclusive', firedRules };
	}

	const cardiacDiagnosis =
		r.primaryDiagnosisCategory === 'coronary-artery-disease' ||
		r.primaryDiagnosisCategory === 'heart-failure' ||
		r.primaryDiagnosisCategory === 'arrhythmia' ||
		r.primaryDiagnosisCategory === 'valve-disease' ||
		r.primaryDiagnosisCategory === 'hypertension' ||
		r.primaryDiagnosisCategory === 'cardiomyopathy';

	if (hasAnyCardiacFinding(r) || cardiacDiagnosis) {
		firedRules.push({
			ruleId: 'R-CLASS-CARDIAC-01',
			axis: 'classification',
			category: 'cardiac-condition',
			description:
				'One or more structured cardiac findings or a cardiac diagnosis are present; classified as a cardiac condition.'
		});
		return { responseClassification: 'cardiac-condition', firedRules };
	}

	if (
		r.primaryDiagnosisCategory === 'non-cardiac' ||
		r.primaryDiagnosisCategory === 'no-abnormality' ||
		r.nonCardiacCause
	) {
		firedRules.push({
			ruleId: 'R-CLASS-NONE-01',
			axis: 'classification',
			category: 'no-abnormality',
			description:
				'No structured cardiac finding and a non-cardiac / no-abnormality conclusion; classified as no abnormality.'
		});
		return { responseClassification: 'no-abnormality', firedRules };
	}

	// A summary exists but no diagnosis and no structured finding: not concluded.
	firedRules.push({
		ruleId: 'R-CLASS-INCONCLUSIVE-02',
		axis: 'classification',
		category: 'no-diagnosis',
		description:
			'A clinical summary exists but no diagnosis category and no structured finding were recorded; classified as inconclusive.'
	});
	return { responseClassification: 'inconclusive', firedRules };
}
