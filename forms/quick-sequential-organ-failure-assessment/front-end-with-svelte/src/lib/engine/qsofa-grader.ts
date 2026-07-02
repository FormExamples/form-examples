import type { AssessmentData, FiredCriterion, GradingResult, RiskBand } from './types';
import { qsofaRules } from './qsofa-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Evaluate the three qSOFA criterion rules and collect the ones that fired.
 */
export function evaluateCriteria(data: AssessmentData): FiredCriterion[] {
	const fired: FiredCriterion[] = [];
	for (const rule of qsofaRules) {
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
			console.warn(`qSOFA rule ${rule.id} evaluation failed:`, e);
		}
	}
	return fired;
}

/**
 * Pure function: compute the full qSOFA grade for the supplied assessment data.
 *
 * Algorithm (spec §4):
 *   respiratoryRatePoint       = respiratoryRate      != null && >= 22  ? 1 : 0
 *   mentationPoint             = (GCS != null && GCS < 15) || altered=='yes' ? 1 : 0
 *   systolicBloodPressurePoint = systolicBloodPressure != null && <= 100 ? 1 : 0
 *   qsofaScore = sum (0..3); riskBand = qsofaScore >= 2 ? 'higher' : 'lower'
 *
 * A missing numeric input contributes 0 points (absent, not positive);
 * `flagged-issues.ts` raises a data-completeness flag separately.
 */
export function calculateQsofaGrade(data: AssessmentData): GradingResult {
	const firedCriteria = evaluateCriteria(data);
	const has = (criterion: string) => firedCriteria.some((f) => f.criterion === criterion);

	const respiratoryRatePoint: 0 | 1 = has('respiratory-rate') ? 1 : 0;
	const mentationPoint: 0 | 1 = has('mentation') ? 1 : 0;
	const systolicBloodPressurePoint: 0 | 1 = has('systolic-blood-pressure') ? 1 : 0;

	const qsofaScore = (respiratoryRatePoint +
		mentationPoint +
		systolicBloodPressurePoint) as 0 | 1 | 2 | 3;

	const riskBand: RiskBand = qsofaScore >= 2 ? 'higher' : 'lower';
	const thresholdMet: 'yes' | 'no' = qsofaScore >= 2 ? 'yes' : 'no';

	// Record the derived risk-band decision as a `band` audit row, mirroring the
	// grade_rule table's `band` criterion.
	firedCriteria.push({
		id: 'R-BAND-01',
		criterion: 'band',
		points: 0,
		category: 'risk-band',
		description:
			qsofaScore >= 2
				? 'qSOFA >= 2 — positive screen; higher risk band'
				: 'qSOFA < 2 — negative screen; lower risk band'
	});

	const flaggedIssues = detectFlaggedIssues(data, qsofaScore);

	return {
		respiratoryRatePoint,
		mentationPoint,
		systolicBloodPressurePoint,
		qsofaScore,
		riskBand,
		thresholdMet,
		firedCriteria,
		flaggedIssues,
		timestamp: new Date().toISOString()
	};
}
