import type { AssessmentData, RiskLevel, FiredRule, GradingResult } from './types';
import { ng201Rules } from './antenatal-rules';
import { detectAdditionalFlags } from './flagged-issues';

/**
 * NICE NG201 Antenatal Risk grader. Pure function: takes an `AssessmentData`
 * object, evaluates every NG201 rule, and returns the overall risk level plus
 * the audit trail of fired rules and clinician-facing flags.
 *
 * Risk stratification:
 *   any rule fires 'high'      -> overall 'high'      (consultant-led care)
 *   else any 'moderate' fires  -> overall 'moderate'  (obstetric input at milestones)
 *   otherwise                  -> overall 'low'       (midwifery-led care)
 */
export function calculateAntenatalRisk(data: AssessmentData): GradingResult {
	const firedRules: FiredRule[] = [];

	for (const rule of ng201Rules) {
		try {
			const risk = rule.evaluate(data);
			if (risk) {
				firedRules.push({
					id: rule.id,
					category: rule.category,
					description: rule.description,
					risk
				});
			}
		} catch (e) {
			// Rule evaluation failed - log for debugging but continue grading.
			console.warn(`NG201 rule ${rule.id} evaluation failed:`, e);
		}
	}

	let riskLevel: RiskLevel = 'low';
	if (firedRules.some((r) => r.risk === 'high')) {
		riskLevel = 'high';
	} else if (firedRules.some((r) => r.risk === 'moderate')) {
		riskLevel = 'moderate';
	}

	// Sort fired rules: high first, then moderate, then low (by id within bucket).
	const order: Record<RiskLevel, number> = { high: 0, moderate: 1, low: 2 };
	firedRules.sort((a, b) => order[a.risk] - order[b.risk] || a.id.localeCompare(b.id));

	const additionalFlags = detectAdditionalFlags(data);
	const answeredCount = countAnsweredInputs(data);

	return {
		riskLevel,
		answeredCount,
		firedRules,
		additionalFlags,
		timestamp: new Date().toISOString()
	};
}

/**
 * Count answered top-level questionnaire inputs to provide a denominator the
 * report can show ("X relevant fields answered").
 */
function countAnsweredInputs(data: AssessmentData): number {
	let count = 0;
	const isAnswered = (v: unknown) => v !== null && v !== undefined && v !== '';
	for (const section of Object.values(data) as Record<string, unknown>[]) {
		for (const value of Object.values(section)) {
			if (isAnswered(value)) count++;
		}
	}
	return count;
}
