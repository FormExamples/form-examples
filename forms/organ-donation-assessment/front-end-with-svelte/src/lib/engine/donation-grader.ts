import type { AssessmentData, Eligibility, FiredRule, GradingResult, RiskLevel } from './types';
import { donationRules } from './donation-rules';
import { detectAdditionalFlags } from './flagged-issues';

/**
 * Evaluate every declarative donor rule against the given assessment data.
 * Returns the list of fired rules.
 */
function evaluateRules(data: AssessmentData): FiredRule[] {
	const fired: FiredRule[] = [];
	for (const rule of donationRules) {
		try {
			if (rule.evaluate(data)) {
				fired.push({
					id: rule.id,
					category: rule.category,
					description: rule.description,
					grade: rule.grade
				});
			}
		} catch (e) {
			// Rule evaluation failed — log for debugging but continue grading.
			console.warn(`Donor rule ${rule.id} evaluation failed:`, e);
		}
	}
	return fired;
}

/**
 * Compute final eligibility + risk level from the fired rules and (where
 * recorded) the assessor's eligibility decision in step 10. When the assessor
 * explicitly recorded a decision, that decision wins for the displayed
 * eligibility, but the engine-derived risk level is preserved.
 *
 * The explicit "ideal donor" Grade-1 markers (e.g. SU-001 ASA-I) are excluded
 * from penalty counting, similar to the bone-marrow grader pattern.
 */
function classifyEligibility(
	firedRules: FiredRule[],
	data: AssessmentData
): { eligibility: Eligibility; suggestedEligibility: Eligibility; riskLevel: RiskLevel } {
	const positiveIdealIds = new Set(['SU-001']);

	const flagged = firedRules.filter((r) => !positiveIdealIds.has(r.id));
	const grade4 = flagged.filter((r) => r.grade === 4).length;
	const grade3 = flagged.filter((r) => r.grade === 3).length;
	const grade2 = flagged.filter((r) => r.grade === 2).length;

	let suggestedEligibility: Eligibility = 'suitable';
	let riskLevel: RiskLevel = 'low';

	if (grade4 > 0) {
		suggestedEligibility = 'unsuitable';
		riskLevel = 'critical';
	} else if (grade3 > 0) {
		suggestedEligibility = 'conditionally-suitable';
		riskLevel = 'high';
	} else if (grade2 > 0) {
		suggestedEligibility = 'conditionally-suitable';
		riskLevel = 'moderate';
	}

	const assessorDecision = data.eligibilityAllocation.eligibilityDecision;
	const eligibility: Eligibility = assessorDecision || suggestedEligibility;

	return { eligibility, suggestedEligibility, riskLevel };
}

/**
 * Pure function: evaluates all donor rules against assessment data and returns
 * the eligibility classification, risk level, fired rules, and flagged issues.
 */
export function gradeDonor(data: AssessmentData): GradingResult {
	const firedRules = evaluateRules(data);
	const { eligibility, suggestedEligibility, riskLevel } = classifyEligibility(firedRules, data);
	const additionalFlags = detectAdditionalFlags(data);

	return {
		eligibility,
		suggestedEligibility,
		riskLevel,
		firedRules,
		additionalFlags,
		timestamp: new Date().toISOString()
	};
}
