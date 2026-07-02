import type {
	AssessmentData,
	FiredCriterion,
	GradingResult,
	RecommendedPathway,
	ThreeLevelBand,
	TwoLevelBand
} from './types';
import { wellsRules } from './wells-pe-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Evaluate the seven Wells rules and collect the ones that fired.
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
			console.warn(`Wells PE rule ${rule.id} evaluation failed:`, e);
		}
	}
	return fired;
}

/**
 * Pure function: compute the full Wells PE grade for the supplied data.
 *
 * Algorithm (spec §4):
 *   wellsScore = sum of weighted points for each positive criterion   // 0..12.5
 *   twoLevelBand       = wellsScore > 4 ? 'likely' : 'unlikely'
 *   recommendedPathway = twoLevelBand == 'likely' ? 'ctpa' : 'd-dimer'
 *   threeLevelBand     = wellsScore < 2 ? 'low'
 *                      : wellsScore <= 6 ? 'moderate' : 'high'
 *
 * A criterion left blank ('') / 'no', or a missing (null) heart rate,
 * contributes 0 points (absent, not positive); `flagged-issues.ts` raises a
 * data-completeness flag separately.
 */
export function calculateWellsGrade(data: AssessmentData): GradingResult {
	const firedCriteria = evaluateCriteria(data);

	const criterionPoints: Record<string, number> = {};
	for (const rule of wellsRules) {
		criterionPoints[rule.criterion] = rule.evaluate(data) ? rule.points : 0;
	}

	// Weighted sum of all positive criteria → 0..12.5.
	const wellsScore = wellsRules.reduce(
		(sum, r) => sum + (r.evaluate(data) ? r.points : 0),
		0
	);

	const twoLevelBand: TwoLevelBand = wellsScore > 4 ? 'likely' : 'unlikely';
	const threeLevelBand: ThreeLevelBand =
		wellsScore < 2 ? 'low' : wellsScore <= 6 ? 'moderate' : 'high';
	const recommendedPathway: RecommendedPathway =
		twoLevelBand === 'likely' ? 'ctpa' : 'd-dimer';

	// Record the derived band decisions as audit rows, mirroring the grade_rule
	// table's two-level / three-level instruments.
	firedCriteria.push({
		id: 'R-TWO-LEVEL-BAND-01',
		criterion: 'two-level-band',
		points: 0,
		category: 'risk-band',
		description:
			twoLevelBand === 'likely'
				? 'Wells > 4 — PE likely; arrange an immediate CTPA'
				: 'Wells <= 4 — PE unlikely; arrange a D-dimer test'
	});
	firedCriteria.push({
		id: 'R-THREE-LEVEL-BAND-01',
		criterion: 'three-level-band',
		points: 0,
		category: 'risk-band',
		description:
			threeLevelBand === 'high'
				? 'Wells > 6 — high probability (original three-level rule)'
				: threeLevelBand === 'moderate'
					? 'Wells 2-6 — moderate probability (original three-level rule)'
					: 'Wells < 2 — low probability (original three-level rule)'
	});

	const flaggedIssues = detectFlaggedIssues(data, wellsScore);

	return {
		criterionPoints,
		wellsScore,
		twoLevelBand,
		threeLevelBand,
		recommendedPathway,
		firedCriteria,
		flaggedIssues,
		timestamp: new Date().toISOString()
	};
}
