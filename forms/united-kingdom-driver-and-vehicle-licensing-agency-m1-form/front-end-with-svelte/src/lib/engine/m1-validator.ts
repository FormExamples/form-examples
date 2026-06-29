import type { AssessmentData, FiredRule, ValidationResult } from './types';
import { m1Rules } from './m1-rules';
import { detectAdditionalFlags } from './flagged-issues';
import { priorityOrder } from './utils';

/**
 * Pure function: validate a DVLA M1 form submission.
 *
 * Conditional logic:
 *   - Q1 = No  → form stops at Q1; downstream Q2/Q3 rules are skipped and
 *                the result is marked `stoppedAtQ1: true`.
 *   - Q1 = Yes → all rules apply.
 *
 * The function does *not* mutate `data` and emits no side effects.
 */
export function validateM1(data: AssessmentData): ValidationResult {
	const stoppedAtQ1 = data.diagnosisConfirmation.hasMentalHealthDiagnosis === 'no';

	const firedRules: FiredRule[] = [];
	for (const rule of m1Rules) {
		// When the patient answered Q1 = No, skip Q2/Q3 rules entirely —
		// the DVLA instructions say not to complete those parts.
		if (stoppedAtQ1 && (rule.id.startsWith('M1-Q2') || rule.id.startsWith('M1-Q3'))) {
			continue;
		}
		try {
			if (rule.evaluate(data)) {
				firedRules.push({
					id: rule.id,
					category: rule.category,
					priority: rule.priority,
					description: rule.description,
					message: rule.message
				});
			}
		} catch (e) {
			console.warn(`M1 rule ${rule.id} evaluation failed:`, e);
		}
	}

	firedRules.sort((a, b) => priorityOrder(a.priority) - priorityOrder(b.priority));

	const additionalFlags = detectAdditionalFlags(data);
	const conditionCount = countConditions(data);

	const complete = firedRules.filter((r) => r.category === 'completeness').length === 0;

	return {
		complete,
		stoppedAtQ1,
		firedRules,
		additionalFlags,
		conditionCount,
		timestamp: new Date().toISOString()
	};
}

/** Count the number of Q2 mental health conditions marked "yes". */
export function countConditions(data: AssessmentData): number {
	const c = data.mentalHealthConditions;
	let n = 0;
	if (c.anxietyDepressionWithoutImpairment === 'yes') n++;
	if (c.anxietyDepressionWithImpairment === 'yes') n++;
	if (c.bipolarAffectiveDisorder === 'yes') n++;
	if (c.eatingDisorder === 'yes') n++;
	if (c.ocdOrPtsd === 'yes') n++;
	if (c.personalityDisorder === 'yes') n++;
	if (c.schizophreniaOrPsychosis === 'yes') n++;
	if (c.other === 'yes') n++;
	return n;
}
