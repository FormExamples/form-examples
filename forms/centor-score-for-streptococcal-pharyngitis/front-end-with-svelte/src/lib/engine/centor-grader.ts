import type { AssessmentData, FiredCriterion, GradingResult, RiskBand } from './types';
import { centorRules } from './centor-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Compute the McIsaac age modifier for a whole-year age.
 * +1 for ages 3-14, -1 for ages >= 45, 0 for 15-44, and 0 when age is missing.
 */
export function ageModifierFor(ageYears: number | null): -1 | 0 | 1 {
	if (ageYears === null || ageYears === undefined) return 0;
	if (ageYears >= 3 && ageYears <= 14) return 1;
	if (ageYears >= 45) return -1;
	return 0;
}

/**
 * Evaluate the four Centor criterion rules and collect the ones that fired.
 */
export function evaluateCriteria(data: AssessmentData): FiredCriterion[] {
	const fired: FiredCriterion[] = [];
	for (const rule of centorRules) {
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
			console.warn(`Centor rule ${rule.id} evaluation failed:`, e);
		}
	}
	return fired;
}

/**
 * Pure function: compute the full Centor / McIsaac grade for the supplied data.
 *
 * Algorithm (spec §4):
 *   tonsillarExudatePoint = tonsillarExudate == 'yes'            ? 1 : 0
 *   tenderNodesPoint      = tenderAnteriorCervicalNodes == 'yes' ? 1 : 0
 *   feverPoint            = feverOver38 == 'yes'
 *                           || (measuredTemperatureCelsius != null && > 38.0) ? 1 : 0
 *   coughAbsentPoint      = absenceOfCough == 'yes'              ? 1 : 0
 *   centorScore  = sum (0..4)
 *   ageModifier  = ageYears == null ? 0 : (3..14 ? +1 : >=45 ? -1 : 0)
 *   mcIsaacScore = centorScore + ageModifier   (-1..5)
 *   riskBand     = mcIsaacScore <= 1 ? 'low' : mcIsaacScore <= 3 ? 'moderate' : 'high'
 *
 * A missing age applies a modifier of 0 (the adult 15-44 default);
 * `flagged-issues.ts` raises a data-completeness flag separately. Banding uses
 * the McIsaac score so the age-related probability is reflected; the original
 * Centor total is retained alongside.
 */
export function calculateCentorGrade(data: AssessmentData): GradingResult {
	const firedCriteria = evaluateCriteria(data);
	const has = (criterion: string) => firedCriteria.some((f) => f.criterion === criterion);

	const tonsillarExudatePoint: 0 | 1 = has('tonsillar-exudate') ? 1 : 0;
	const tenderNodesPoint: 0 | 1 = has('tender-nodes') ? 1 : 0;
	const feverPoint: 0 | 1 = has('fever') ? 1 : 0;
	const coughAbsentPoint: 0 | 1 = has('cough-absent') ? 1 : 0;

	const centorScore = (tonsillarExudatePoint +
		tenderNodesPoint +
		feverPoint +
		coughAbsentPoint) as 0 | 1 | 2 | 3 | 4;

	const ageModifier = ageModifierFor(data.identification.ageYears);
	const mcIsaacScore = centorScore + ageModifier;

	const riskBand: RiskBand = mcIsaacScore <= 1 ? 'low' : mcIsaacScore <= 3 ? 'moderate' : 'high';

	// Record the age modifier as an audit row, mirroring the grade_rule table's
	// `age-modifier` criterion.
	firedCriteria.push({
		id: 'R-AGE-MODIFIER-01',
		criterion: 'age-modifier',
		points: ageModifier,
		category: 'mcisaac-modifier',
		description:
			data.identification.ageYears === null
				? 'Age not recorded — McIsaac age modifier 0 (adult 15–44 default)'
				: ageModifier > 0
					? 'Age 3–14 — McIsaac age modifier +1'
					: ageModifier < 0
						? 'Age 45 or over — McIsaac age modifier −1'
						: 'Age 15–44 — McIsaac age modifier 0'
	});

	// Record the derived risk-band decision as a `band` audit row, mirroring the
	// grade_rule table's `band` criterion.
	firedCriteria.push({
		id: 'R-BAND-01',
		criterion: 'band',
		points: 0,
		category: 'risk-band',
		description:
			riskBand === 'high'
				? 'McIsaac 4–5 — high probability of streptococcal pharyngitis'
				: riskBand === 'moderate'
					? 'McIsaac 2–3 — moderate probability of streptococcal pharyngitis'
					: 'McIsaac ≤ 1 — low probability of streptococcal pharyngitis'
	});

	const flaggedIssues = detectFlaggedIssues(data, mcIsaacScore);

	return {
		tonsillarExudatePoint,
		tenderNodesPoint,
		feverPoint,
		coughAbsentPoint,
		centorScore,
		ageModifier,
		mcIsaacScore,
		riskBand,
		firedCriteria,
		flaggedIssues,
		timestamp: new Date().toISOString()
	};
}
