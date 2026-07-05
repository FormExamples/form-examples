import type { NeurodiversityAdjustmentRequest, ImpactBand, FiredRule } from './types';

/** Impact bands in ascending severity; the highest firing rule wins. */
const ORDER: ImpactBand[] = ['ok', 'caution', 'high-risk'];

function raise(current: ImpactBand, next: ImpactBand): ImpactBand {
	return ORDER.indexOf(next) > ORDER.indexOf(current) ? next : current;
}

/**
 * Axis B — impact / wellbeing risk.
 *
 * Escalation ladder (ok → caution → high-risk). Every firing rule raises the
 * band to at least its level (max wins) and is recorded in the audit trail. A
 * worker at risk of sickness absence / burnout, or reporting severe current
 * impact, drives the band to high-risk. The least-alarming band is chosen only
 * when no rule fires.
 */
export function gradeImpact(r: NeurodiversityAdjustmentRequest): {
	impactBand: ImpactBand;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	let band: ImpactBand = 'ok';

	if (r.atRiskOfAbsence) {
		firedRules.push({
			ruleId: 'R-IMPACT-ABSENCE-RISK',
			axis: 'impact',
			category: 'absence-risk',
			description:
				'Worker at risk of sickness absence or burnout without adjustments — act promptly.'
		});
		band = raise(band, 'high-risk');
	}

	if (r.currentImpact === 'severe') {
		firedRules.push({
			ruleId: 'R-IMPACT-SEVERE',
			axis: 'impact',
			category: 'severe-impact',
			description: 'Severe current impact on work and wellbeing.'
		});
		band = raise(band, 'high-risk');
	}

	if (r.currentImpact === 'high') {
		firedRules.push({
			ruleId: 'R-IMPACT-HIGH',
			axis: 'impact',
			category: 'high-impact',
			description: 'High current impact on work and wellbeing.'
		});
		band = raise(band, 'caution');
	}

	if (r.difficultyBurnoutWellbeing) {
		firedRules.push({
			ruleId: 'R-IMPACT-BURNOUT',
			axis: 'impact',
			category: 'burnout',
			description: 'Fatigue / burnout difficulty reported.'
		});
		band = raise(band, 'caution');
	}

	if (r.currentImpact === 'moderate') {
		firedRules.push({
			ruleId: 'R-IMPACT-MODERATE',
			axis: 'impact',
			category: 'moderate-impact',
			description: 'Moderate current impact on work and wellbeing.'
		});
		band = raise(band, 'caution');
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-IMPACT-OK',
			axis: 'impact',
			category: 'no-risk',
			description: 'No wellbeing risk detected from the impact screen.'
		});
	}

	return { impactBand: band, firedRules };
}
