import type { AssessmentData, Band, FiredCriterion, GradingResult } from './types';
import { rosierRules } from './rosier-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Evaluate the seven ROSIER criterion rules and collect the ones that fired.
 */
export function evaluateCriteria(data: AssessmentData): FiredCriterion[] {
	const fired: FiredCriterion[] = [];
	for (const rule of rosierRules) {
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
			console.warn(`ROSIER rule ${rule.id} evaluation failed:`, e);
		}
	}
	return fired;
}

/**
 * Pure function: compute the full ROSIER grade for the supplied assessment data.
 *
 * Algorithm (spec §4) — signed additive:
 *   lossOfConsciousnessPoint = lossOfConsciousness == 'yes' ? -1 : 0
 *   seizureActivityPoint     = seizureActivity     == 'yes' ? -1 : 0
 *   facialWeaknessPoint      = facialWeakness       == 'yes' ?  1 : 0
 *   armWeaknessPoint         = armWeakness          == 'yes' ?  1 : 0
 *   legWeaknessPoint         = legWeakness          == 'yes' ?  1 : 0
 *   speechDisturbancePoint   = speechDisturbance    == 'yes' ?  1 : 0
 *   visualFieldDefectPoint   = visualFieldDefect    == 'yes' ?  1 : 0
 *   rosierScore = sum (-2..+5)
 *   band        = rosierScore > 0 ? 'stroke-likely' : 'stroke-unlikely'
 *
 * The `> 0` threshold is strict: a total of exactly 0 is `stroke-unlikely`. An
 * unanswered criterion contributes 0 points for that criterion (absent, not
 * positive); `flagged-issues.ts` raises a data-completeness flag separately.
 */
export function calculateRosierGrade(data: AssessmentData): GradingResult {
	const firedCriteria = evaluateCriteria(data);
	const pointFor = (criterion: string): number => {
		const hit = firedCriteria.find((f) => f.criterion === criterion);
		return hit ? hit.points : 0;
	};

	const lossOfConsciousnessPoint = pointFor('loss-of-consciousness') as 0 | -1;
	const seizureActivityPoint = pointFor('seizure-activity') as 0 | -1;
	const facialWeaknessPoint = pointFor('facial-weakness') as 0 | 1;
	const armWeaknessPoint = pointFor('arm-weakness') as 0 | 1;
	const legWeaknessPoint = pointFor('leg-weakness') as 0 | 1;
	const speechDisturbancePoint = pointFor('speech-disturbance') as 0 | 1;
	const visualFieldDefectPoint = pointFor('visual-field-defect') as 0 | 1;

	const rosierScore =
		lossOfConsciousnessPoint +
		seizureActivityPoint +
		facialWeaknessPoint +
		armWeaknessPoint +
		legWeaknessPoint +
		speechDisturbancePoint +
		visualFieldDefectPoint;

	const band: Band = rosierScore > 0 ? 'stroke-likely' : 'stroke-unlikely';

	// Record the derived band decision as a `band` audit row, mirroring the
	// grade_rule table's `band` criterion.
	firedCriteria.push({
		id: 'R-BAND-01',
		criterion: 'band',
		points: 0,
		category: 'band',
		description:
			rosierScore > 0
				? 'ROSIER > 0 — positive screen; stroke likely, activate the acute stroke pathway'
				: 'ROSIER <= 0 — stroke unlikely but not excluded'
	});

	const flaggedIssues = detectFlaggedIssues(data, rosierScore);

	return {
		lossOfConsciousnessPoint,
		seizureActivityPoint,
		facialWeaknessPoint,
		armWeaknessPoint,
		legWeaknessPoint,
		speechDisturbancePoint,
		visualFieldDefectPoint,
		rosierScore,
		band,
		firedCriteria,
		flaggedIssues,
		timestamp: new Date().toISOString()
	};
}
