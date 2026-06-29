import type {
	AssessmentData,
	Eligibility,
	RiskLevel,
	FiredRule,
	GradingResult
} from './types';
import { donorRules } from './donor-rules';
import { detectAdditionalFlags } from './flagged-issues';
import { hlaMatchLabel, collectionMethodLabel } from './utils';

/**
 * Pure function: evaluates every donor eligibility rule against the assessment
 * data and derives the overall donor classification — eligibility, risk level,
 * HLA match level, final collection method, the fired rules, and any additional
 * safety flags.
 */
export function calculateDonorGrade(data: AssessmentData): GradingResult {
	const firedRules: FiredRule[] = [];

	for (const rule of donorRules) {
		try {
			if (rule.evaluate(data)) {
				firedRules.push({
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

	const overallRisk = deriveOverallRisk(firedRules);
	const eligibility = deriveEligibility(data, overallRisk);
	const additionalFlags = detectAdditionalFlags(data);

	return {
		eligibility,
		overallRisk,
		hlaMatchLevel: hlaMatchLabel(data.donorRegistrationHlaTyping.hlaMatchLevel),
		collectionMethod: collectionMethodLabel(data.collectionMethodAssessment.finalCollectionMethod),
		firedRules,
		additionalFlags,
		timestamp: new Date().toISOString()
	};
}

/** Derive overall donor risk from the worst fired-rule grade (1–4). */
function deriveOverallRisk(firedRules: FiredRule[]): RiskLevel {
	const maxGrade = firedRules.length > 0 ? Math.max(...firedRules.map((r) => r.grade)) : 0;
	if (maxGrade >= 4) return 'critical';
	if (maxGrade >= 3) return 'high';
	if (maxGrade >= 2) return 'moderate';
	return 'low';
}

/**
 * Derive donor eligibility. An explicit eligibility decision recorded on the
 * consent step takes precedence; otherwise it is inferred from the overall risk
 * level (critical → unsuitable, high/moderate → conditionally suitable, low →
 * suitable).
 */
function deriveEligibility(data: AssessmentData, overallRisk: RiskLevel): Eligibility {
	const decision = data.consentEligibility.eligibilityDecision;
	if (decision === 'suitable' || decision === 'conditionally-suitable' || decision === 'unsuitable') {
		return decision;
	}
	if (overallRisk === 'critical') return 'unsuitable';
	if (overallRisk === 'high' || overallRisk === 'moderate') return 'conditionally-suitable';
	return 'suitable';
}
