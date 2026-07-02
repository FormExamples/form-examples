import type { AssessmentData, Decision, FiredCriterion, GradingResult } from './types';
import { ottawaRules } from './ottawa-knee-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Evaluate the five Ottawa criteria and record each as an audit row (fired
 * true/false), mirroring the `ottawa_knee_rule_grade_rule` table.
 */
export function evaluateCriteria(data: AssessmentData): FiredCriterion[] {
	const rows: FiredCriterion[] = [];
	for (const rule of ottawaRules) {
		let fired = false;
		try {
			fired = Boolean(rule.evaluate(data));
		} catch (e) {
			// Rule evaluation failed - log for debugging but continue grading.
			console.warn(`Ottawa Knee rule ${rule.id} evaluation failed:`, e);
		}
		rows.push({
			id: rule.id,
			criterion: rule.criterion,
			fired,
			category: rule.category,
			description: rule.description
		});
	}
	return rows;
}

/**
 * Pure function: compute the full Ottawa Knee Rule grade for the supplied data.
 *
 * Algorithm (spec §4) — DECISION RULE, not a score:
 *   ageCriterion              = ageYears != null && ageYears >= 55
 *   isolatedPatellarCriterion = patellarTenderness == 'yes' && otherBonyTenderness == 'no'
 *   fibularHeadCriterion      = fibularHeadTenderness == 'yes'
 *   flexionCriterion          = unableToFlex90 == 'yes'
 *   weightBearingCriterion    = unableToBearWeight == 'yes'
 *
 *   xrayIndicated = ageCriterion || isolatedPatellarCriterion
 *                || fibularHeadCriterion || flexionCriterion || weightBearingCriterion
 *   decision      = xrayIndicated ? 'xray-indicated' : 'xray-not-indicated'
 *
 * ANY-of, not additive: exactly one positive criterion produces the same
 * "X-ray indicated" decision as five. A missing input does not fire its
 * criterion (`flagged-issues.ts` raises a data-completeness flag separately).
 */
export function gradeOttawaKnee(data: AssessmentData): GradingResult {
	const auditRows = evaluateCriteria(data);
	const firedOf = (criterion: string): boolean =>
		auditRows.some((r) => r.criterion === criterion && r.fired);

	const ageCriterion = firedOf('age');
	const isolatedPatellarCriterion = firedOf('isolated-patellar-tenderness');
	const fibularHeadCriterion = firedOf('fibular-head-tenderness');
	const flexionCriterion = firedOf('flexion');
	const weightBearingCriterion = firedOf('weight-bearing');

	const xrayIndicated =
		ageCriterion ||
		isolatedPatellarCriterion ||
		fibularHeadCriterion ||
		flexionCriterion ||
		weightBearingCriterion;

	const decision: Decision = xrayIndicated ? 'xray-indicated' : 'xray-not-indicated';

	// Keep only the criteria that actually fired, then append the composite
	// decision as an audit row (mirrors the grade_rule table's `decision`
	// criterion / `composite` instrument).
	const firedCriteria = auditRows.filter((r) => r.fired);
	firedCriteria.push({
		id: 'R-DECISION-01',
		criterion: 'decision',
		fired: xrayIndicated,
		category: 'decision',
		description: xrayIndicated
			? 'One or more criteria present — a knee radiograph is indicated (ANY-of)'
			: 'All five criteria absent — a knee radiograph is not indicated by the rule'
	});

	const flaggedIssues = detectFlaggedIssues(data, xrayIndicated);

	return {
		ageCriterion,
		isolatedPatellarCriterion,
		fibularHeadCriterion,
		flexionCriterion,
		weightBearingCriterion,
		xrayIndicated,
		decision,
		firedCriteria,
		flaggedIssues,
		timestamp: new Date().toISOString()
	};
}
