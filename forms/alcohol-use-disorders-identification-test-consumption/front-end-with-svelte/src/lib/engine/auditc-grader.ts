import type { AssessmentData, FiredItem, GradingResult, RiskBand } from './types';
import { auditcRules } from './auditc-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Evaluate the three consumption-item rules and collect one fired record per
 * item, carrying the awarded 0-4 point value.
 */
export function evaluateItems(data: AssessmentData): FiredItem[] {
	const fired: FiredItem[] = [];
	for (const rule of auditcRules) {
		try {
			fired.push({
				id: rule.id,
				item: rule.item,
				points: rule.points(data),
				category: rule.category,
				description: rule.description
			});
		} catch (e) {
			// Rule evaluation failed - log for debugging but continue grading.
			console.warn(`AUDIT-C rule ${rule.id} evaluation failed:`, e);
		}
	}
	return fired;
}

/** Derive the risk band from a total AUDIT-C score (0-12). */
export function bandForScore(auditcScore: number): RiskBand {
	if (auditcScore >= 11) return 'possible-dependence';
	if (auditcScore >= 8) return 'higher';
	if (auditcScore >= 5) return 'increasing';
	return 'lower';
}

/**
 * Pure function: compute the full AUDIT-C grade for the supplied assessment
 * data.
 *
 * Algorithm (spec §4): each item contributes its own 0-4 point value; a
 * missing input contributes 0. The total (0-12) drives the risk band and the
 * positive-screen indicator against the >= 5 UK default cut.
 * `flagged-issues.ts` raises a data-completeness flag separately.
 */
export function calculateAuditcGrade(data: AssessmentData): GradingResult {
	const firedItems = evaluateItems(data);
	const pointFor = (item: string): 0 | 1 | 2 | 3 | 4 =>
		(firedItems.find((f) => f.item === item)?.points ?? 0) as 0 | 1 | 2 | 3 | 4;

	const frequencyOfDrinkingPoint = pointFor('frequency-of-drinking');
	const typicalQuantityPoint = pointFor('typical-quantity');
	const heavyEpisodeFrequencyPoint = pointFor('heavy-episode-frequency');

	const auditcScore =
		frequencyOfDrinkingPoint + typicalQuantityPoint + heavyEpisodeFrequencyPoint;

	const riskBand = bandForScore(auditcScore);
	const positiveScreen = auditcScore >= 5;

	// Record the derived risk-band decision as a `total` audit row, mirroring
	// the grade_rule table's `total` parameter.
	firedItems.push({
		id: 'R-TOTAL-BAND-01',
		item: 'total',
		points: 0,
		category: 'total-band',
		description: positiveScreen
			? `AUDIT-C ${auditcScore} of 12 (>= 5) — positive screen (${riskBand})`
			: `AUDIT-C ${auditcScore} of 12 — below the positive-screen cut of 5 (lower risk)`
	});

	const flaggedIssues = detectFlaggedIssues(data, auditcScore);

	return {
		frequencyOfDrinkingPoint,
		typicalQuantityPoint,
		heavyEpisodeFrequencyPoint,
		auditcScore,
		riskBand,
		positiveScreen,
		firedItems,
		flaggedIssues,
		timestamp: new Date().toISOString()
	};
}
