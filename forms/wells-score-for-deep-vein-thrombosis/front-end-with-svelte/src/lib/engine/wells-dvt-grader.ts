import type {
	AssessmentData,
	FiredCriterion,
	GradingResult,
	RecommendedInvestigation,
	ThreeLevelBand,
	TwoLevelBand
} from './types';
import { wellsRules } from './wells-dvt-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Evaluate the ten Wells rules and collect the ones that fired.
 */
export function evaluateCriteria(data: AssessmentData): FiredCriterion[] {
	const fired: FiredCriterion[] = [];
	for (const rule of wellsRules) {
		try {
			if (rule.evaluate(data)) {
				fired.push({
					id: rule.id,
					criterion: rule.criterion,
					points: rule.points,
					category: rule.category,
					description: rule.description
				});
			}
		} catch (e) {
			// Rule evaluation failed - log for debugging but continue grading.
			console.warn(`Wells DVT rule ${rule.id} evaluation failed:`, e);
		}
	}
	return fired;
}

/**
 * Pure function: compute the full Wells DVT grade for the supplied data.
 *
 * Algorithm (spec §4):
 *   plus  = sum of +1 for each of the nine criteria whose value == 'yes'  // 0..9
 *   minus = alternativeDiagnosisAsLikely == 'yes' ? 2 : 0                  // 0 or 2
 *   wellsScore = plus - minus                                             // -2..9
 *   twoLevelBand   = wellsScore >= 2 ? 'likely' : 'unlikely'
 *   threeLevelBand = wellsScore >= 3 ? 'high' : wellsScore >= 1 ? 'moderate' : 'low'
 *   recommendedInvestigation = twoLevelBand == 'likely'
 *                            ? 'proximal-leg-vein-ultrasound' : 'd-dimer'
 *
 * A criterion left blank ('') or 'no' contributes 0 points (absent, not
 * positive); `flagged-issues.ts` raises a data-completeness flag separately.
 */
export function calculateWellsGrade(data: AssessmentData): GradingResult {
	const firedCriteria = evaluateCriteria(data);

	const criterionPoints: Record<string, number> = {};
	for (const rule of wellsRules) {
		criterionPoints[rule.criterion] = rule.evaluate(data) ? rule.points : 0;
	}

	const plus = wellsRules
		.filter((r) => r.points === 1 && r.evaluate(data))
		.reduce((sum, r) => sum + r.points, 0);
	const minus = data.alternative.alternativeDiagnosisAsLikely === 'yes' ? 2 : 0;

	const wellsScore = plus - minus;

	const twoLevelBand: TwoLevelBand = wellsScore >= 2 ? 'likely' : 'unlikely';
	const threeLevelBand: ThreeLevelBand =
		wellsScore >= 3 ? 'high' : wellsScore >= 1 ? 'moderate' : 'low';
	const recommendedInvestigation: RecommendedInvestigation =
		twoLevelBand === 'likely' ? 'proximal-leg-vein-ultrasound' : 'd-dimer';

	// Record the derived band decisions as audit rows, mirroring the grade_rule
	// table's `band` criteria.
	firedCriteria.push({
		id: 'R-TWO-LEVEL-BAND-01',
		criterion: 'two-level-band',
		points: 0,
		category: 'risk-band',
		description:
			twoLevelBand === 'likely'
				? 'Wells >= 2 — DVT likely; offer a proximal leg vein ultrasound'
				: 'Wells <= 1 — DVT unlikely; offer a D-dimer test'
	});
	firedCriteria.push({
		id: 'R-THREE-LEVEL-BAND-01',
		criterion: 'three-level-band',
		points: 0,
		category: 'risk-band',
		description:
			threeLevelBand === 'high'
				? 'Wells >= 3 — high probability (original three-level rule)'
				: threeLevelBand === 'moderate'
					? 'Wells 1-2 — moderate probability (original three-level rule)'
					: 'Wells <= 0 — low probability (original three-level rule)'
	});

	const flaggedIssues = detectFlaggedIssues(data, wellsScore);

	return {
		criterionPoints,
		wellsScore,
		twoLevelBand,
		threeLevelBand,
		recommendedInvestigation,
		firedCriteria,
		flaggedIssues,
		timestamp: new Date().toISOString()
	};
}
