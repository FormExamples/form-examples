import type {
	AssessmentData,
	FiredRule,
	GradingResult,
	InterpretationBand
} from './types';
import { fouratRules } from './fourat-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Evaluate the 4AT scoring rules and collect the ones that fired.
 */
export function evaluateRules(data: AssessmentData): FiredRule[] {
	const fired: FiredRule[] = [];
	for (const rule of fouratRules) {
		try {
			if (rule.evaluate(data)) {
				fired.push({
					id: rule.id,
					item: rule.item,
					points: rule.points,
					category: rule.category,
					description: rule.description
				});
			}
		} catch (e) {
			// Rule evaluation failed - log for debugging but continue grading.
			console.warn(`4AT rule ${rule.id} evaluation failed:`, e);
		}
	}
	return fired;
}

/**
 * Pure function: compute the full 4AT grade for the supplied assessment data.
 *
 * Algorithm (spec §4):
 *   item1Score = alertness === 'abnormal'                        ? 4 : 0
 *   item2Score = amt4 oneMistake -> 1, twoOrMoreOrUntestable -> 2, else 0
 *   item3Score = attention startsButUnderSevenOrRefuses -> 1,
 *                          untestable -> 2, else 0
 *   item4Score = acuteChange === 'yes'                           ? 4 : 0
 *   totalScore = item1 + item2 + item3 + item4  (0..12)
 *   band = totalScore >= 4 ? 'possibleDelirium'
 *        : totalScore >= 1 ? 'possibleCognitiveImpairment'
 *        : 'unlikely'
 *
 * An unanswered item contributes 0 points (absent, not positive);
 * `flagged-issues.ts` raises the incomplete-acute-change flag separately.
 */
export function calculateFourATGrade(data: AssessmentData): GradingResult {
	const firedRules = evaluateRules(data);
	const pointsFor = (item: string) =>
		firedRules.filter((f) => f.item === item).reduce((sum, f) => sum + f.points, 0);

	const item1Score = pointsFor('alertness') as 0 | 4; // 0 or 4
	const item2Score = pointsFor('amt4') as 0 | 1 | 2; // 0, 1, or 2
	const item3Score = pointsFor('attention') as 0 | 1 | 2; // 0, 1, or 2
	const item4Score = pointsFor('acute-change') as 0 | 4; // 0 or 4

	const totalScore = item1Score + item2Score + item3Score + item4Score;

	const interpretationBand: InterpretationBand =
		totalScore >= 4
			? 'possibleDelirium'
			: totalScore >= 1
				? 'possibleCognitiveImpairment'
				: 'unlikely';

	// Record the derived interpretation as a `band` audit row, mirroring the
	// grade_rule table's `band` item.
	firedRules.push({
		id: 'R-BAND-01',
		item: 'band',
		points: 0,
		category: 'interpretation-band',
		description:
			totalScore >= 4
				? 'Total 4 or more — possible delirium; prompt full clinical assessment'
				: totalScore >= 1
					? 'Total 1-3 — possible cognitive impairment; further cognitive testing'
					: 'Total 0 — delirium or severe cognitive impairment unlikely'
	});

	const flaggedIssues = detectFlaggedIssues(data, totalScore);

	return {
		item1Score,
		item2Score,
		item3Score,
		item4Score,
		totalScore,
		interpretationBand,
		firedRules,
		flaggedIssues,
		timestamp: new Date().toISOString()
	};
}
