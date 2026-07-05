import type { NeurodiversityAdjustmentRequest, EligibilityBand, FiredRule } from './types';
import { anyCondition } from './utils';

/**
 * Axis A — Equality Act 2010 eligibility.
 *
 * Applies the disability test (substantial + long-term adverse effect) to the
 * neurodivergent profile. Being neurodivergent will often amount to a disability
 * under the Equality Act 2010 (ACAS); a formal diagnosis is not required.
 *
 * Rules are evaluated top-to-bottom; the first match wins, so exactly one Axis-A
 * rule fires. Rule IDs are stable and identical across every front-end and the
 * back-end.
 */
export function gradeEligibility(r: NeurodiversityAdjustmentRequest): {
	eligibilityBand: EligibilityBand;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const materialImpact =
		r.currentImpact === 'moderate' || r.currentImpact === 'high' || r.currentImpact === 'severe';
	const highImpact = r.currentImpact === 'high' || r.currentImpact === 'severe';

	// 1. Substantial and long-term adverse effect reported.
	if (r.substantialLongTermImpact) {
		firedRules.push({
			ruleId: 'R-ELIG-SUBSTANTIAL-LONG-TERM',
			axis: 'eligibility',
			category: 'substantial-long-term',
			description:
				'Substantial and long-term adverse effect reported — meets the Equality Act 2010 disability test; the duty to make reasonable adjustments is likely engaged.'
		});
		return { eligibilityBand: 'likely-covered', firedRules };
	}

	// 2. Diagnosed neurodivergence with material impact on work.
	if (r.diagnosisStatus === 'diagnosed' && materialImpact) {
		firedRules.push({
			ruleId: 'R-ELIG-DIAGNOSED-IMPACT',
			axis: 'eligibility',
			category: 'diagnosed-impact',
			description:
				'Diagnosed neurodivergence with material impact on work — likely a disability under the Equality Act 2010.'
		});
		return { eligibilityBand: 'likely-covered', firedRules };
	}

	// 3. Neurodivergence with a disability self-assessment or high impact.
	if (anyCondition(r) && (r.considersDisability === 'yes' || highImpact)) {
		firedRules.push({
			ruleId: 'R-ELIG-POSSIBLE',
			axis: 'eligibility',
			category: 'possible-disability',
			description:
				'Neurodivergence with disability self-assessment or high impact — may amount to a disability; assess the substantial + long-term test.'
		});
		return { eligibilityBand: 'possibly-covered', firedRules };
	}

	// 4. Neurodivergence recorded.
	if (anyCondition(r)) {
		firedRules.push({
			ruleId: 'R-ELIG-NEURODIVERGENCE-PRESENT',
			axis: 'eligibility',
			category: 'neurodivergence-present',
			description:
				'Neurodivergence recorded; being neurodivergent will often amount to a disability under the Equality Act 2010 (ACAS).'
		});
		return { eligibilityBand: 'possibly-covered', firedRules };
	}

	// 5. Insufficient information.
	firedRules.push({
		ruleId: 'R-ELIG-UNCLEAR',
		axis: 'eligibility',
		category: 'insufficient-information',
		description:
			'Insufficient information to judge Equality Act eligibility; clarify the neurodivergent profile and its impact.'
	});
	return { eligibilityBand: 'unclear', firedRules };
}
