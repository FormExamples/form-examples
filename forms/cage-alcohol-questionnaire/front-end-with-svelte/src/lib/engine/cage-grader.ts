import type { AssessmentData, FiredCriterion, GradingResult, ResultBand } from './types';
import { cageRules } from './cage-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Evaluate the four CAGE criterion rules and collect the ones that fired.
 */
export function evaluateCriteria(data: AssessmentData): FiredCriterion[] {
	const fired: FiredCriterion[] = [];
	for (const rule of cageRules) {
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
			console.warn(`CAGE rule ${rule.id} evaluation failed:`, e);
		}
	}
	return fired;
}

/**
 * Pure function: compute the full CAGE grade for the supplied assessment data.
 *
 * Algorithm (spec §4):
 *   cutDownPoint   = cutDown   == 'yes' ? 1 : 0
 *   annoyedPoint   = annoyed   == 'yes' ? 1 : 0
 *   guiltyPoint    = guilty    == 'yes' ? 1 : 0
 *   eyeOpenerPoint = eyeOpener == 'yes' ? 1 : 0
 *   cageScore  = sum (0..4)
 *   resultBand = cageScore >= 2 ? 'positive' : cageScore == 1 ? 'low' : 'negative'
 *
 * An unanswered item ('') contributes 0 points (treated as "no" for scoring);
 * `flagged-issues.ts` raises a data-completeness flag separately.
 */
export function calculateCageGrade(data: AssessmentData): GradingResult {
	const firedCriteria = evaluateCriteria(data);
	const has = (criterion: string) => firedCriteria.some((f) => f.criterion === criterion);

	const cutDownPoint: 0 | 1 = has('cut-down') ? 1 : 0;
	const annoyedPoint: 0 | 1 = has('annoyed') ? 1 : 0;
	const guiltyPoint: 0 | 1 = has('guilty') ? 1 : 0;
	const eyeOpenerPoint: 0 | 1 = has('eye-opener') ? 1 : 0;

	const cageScore = (cutDownPoint +
		annoyedPoint +
		guiltyPoint +
		eyeOpenerPoint) as 0 | 1 | 2 | 3 | 4;

	const resultBand: ResultBand =
		cageScore >= 2 ? 'positive' : cageScore === 1 ? 'low' : 'negative';
	const thresholdMet: 'yes' | 'no' = cageScore >= 2 ? 'yes' : 'no';

	// Record the derived result-band decision as a `total` audit row, mirroring
	// the grade_rule table's `total` parameter.
	firedCriteria.push({
		id: 'R-TOTAL-BAND-01',
		criterion: 'total',
		points: 0,
		category: 'total-band',
		description:
			cageScore >= 2
				? `CAGE ${cageScore} of 4 (>= 2) — positive screen`
				: cageScore === 1
					? 'CAGE 1 of 4 — one positive item; below the standard cut-off'
					: 'CAGE 0 of 4 — no positive items'
	});

	const flaggedIssues = detectFlaggedIssues(data, cageScore);

	return {
		cutDownPoint,
		annoyedPoint,
		guiltyPoint,
		eyeOpenerPoint,
		cageScore,
		resultBand,
		thresholdMet,
		firedCriteria,
		flaggedIssues,
		timestamp: new Date().toISOString()
	};
}
