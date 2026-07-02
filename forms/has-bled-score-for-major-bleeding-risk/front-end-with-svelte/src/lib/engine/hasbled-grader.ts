import type { AssessmentData, FiredCriterion, GradingResult, RiskBand } from './types';
import { hasBledRules } from './hasbled-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Evaluate the nine HAS-BLED criterion rules and collect the ones that fired.
 */
export function evaluateCriteria(data: AssessmentData): FiredCriterion[] {
	const fired: FiredCriterion[] = [];
	for (const rule of hasBledRules) {
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
			console.warn(`HAS-BLED rule ${rule.id} evaluation failed:`, e);
		}
	}
	return fired;
}

/** Derive the risk band from the total HAS-BLED score. */
export function deriveRiskBand(hasBledScore: number): RiskBand {
	if (hasBledScore >= 3) return 'high';
	if (hasBledScore >= 1) return 'moderate';
	return 'low';
}

/** Summarise the correctable (modifiable) bleeding-risk factors present. */
export function summariseModifiableFactors(data: AssessmentData): string {
	const factors: string[] = [];
	if (data.hypertension.hypertensionUncontrolled === 'yes') {
		factors.push('uncontrolled hypertension (SBP > 160 mmHg)');
	}
	if (data.labileInr.labileInr === 'yes') {
		factors.push('labile INR / time in therapeutic range < 60%');
	}
	if (data.drugsAlcohol.antiplateletOrNsaid === 'yes') {
		factors.push('concomitant antiplatelets or NSAIDs');
	}
	if (data.drugsAlcohol.alcoholUnitsPerWeek !== null && data.drugsAlcohol.alcoholUnitsPerWeek >= 8) {
		factors.push('alcohol >= 8 units per week');
	}
	return factors.join('; ');
}

/**
 * Pure function: compute the full HAS-BLED grade for the supplied assessment
 * data.
 *
 * Algorithm (spec §4):
 *   hypertensionPoint = hypertensionUncontrolled == 'yes' ? 1 : 0
 *   renalPoint        = abnormalRenalFunction    == 'yes' ? 1 : 0
 *   liverPoint        = abnormalLiverFunction     == 'yes' ? 1 : 0
 *   strokePoint       = strokeHistory             == 'yes' ? 1 : 0
 *   bleedingPoint     = bleedingHistory           == 'yes' ? 1 : 0
 *   labileInrPoint    = labileInr                 == 'yes' ? 1 : 0
 *   elderlyPoint      = ageYears != null && ageYears > 65  ? 1 : 0
 *   drugsPoint        = antiplateletOrNsaid       == 'yes' ? 1 : 0
 *   alcoholPoint      = alcoholUnitsPerWeek != null && >= 8 ? 1 : 0
 *   hasBledScore = sum (0..9)
 *   riskBand     = hasBledScore >= 3 ? 'high' : hasBledScore >= 1 ? 'moderate' : 'low'
 *
 * A missing numeric input contributes 0 points (absent, not positive);
 * `flagged-issues.ts` raises a data-completeness flag separately.
 */
export function calculateHasBledGrade(data: AssessmentData): GradingResult {
	const firedCriteria = evaluateCriteria(data);
	const has = (criterion: string) => firedCriteria.some((f) => f.criterion === criterion);

	const hypertensionPoint: 0 | 1 = has('hypertension') ? 1 : 0;
	const renalPoint: 0 | 1 = has('renal') ? 1 : 0;
	const liverPoint: 0 | 1 = has('liver') ? 1 : 0;
	const strokePoint: 0 | 1 = has('stroke') ? 1 : 0;
	const bleedingPoint: 0 | 1 = has('bleeding') ? 1 : 0;
	const labileInrPoint: 0 | 1 = has('labile-inr') ? 1 : 0;
	const elderlyPoint: 0 | 1 = has('elderly') ? 1 : 0;
	const drugsPoint: 0 | 1 = has('drugs') ? 1 : 0;
	const alcoholPoint: 0 | 1 = has('alcohol') ? 1 : 0;

	const hasBledScore = (hypertensionPoint +
		renalPoint +
		liverPoint +
		strokePoint +
		bleedingPoint +
		labileInrPoint +
		elderlyPoint +
		drugsPoint +
		alcoholPoint) as GradingResult['hasBledScore'];

	const riskBand = deriveRiskBand(hasBledScore);
	const modifiableFactors = summariseModifiableFactors(data);

	// Record the derived risk-band decision as a `band` audit row, mirroring the
	// grade_rule table's `band` criterion.
	firedCriteria.push({
		id: 'R-BAND-01',
		criterion: 'band',
		points: 0,
		category: 'risk-band',
		description:
			hasBledScore >= 3
				? 'HAS-BLED >= 3 — higher estimated risk of major bleeding; high risk band'
				: hasBledScore >= 1
					? 'HAS-BLED 1-2 — moderate estimated bleeding risk; moderate risk band'
					: 'HAS-BLED 0 — low estimated bleeding risk; low risk band'
	});

	const flaggedIssues = detectFlaggedIssues(data, hasBledScore);

	return {
		hypertensionPoint,
		renalPoint,
		liverPoint,
		strokePoint,
		bleedingPoint,
		labileInrPoint,
		elderlyPoint,
		drugsPoint,
		alcoholPoint,
		hasBledScore,
		riskBand,
		modifiableFactors,
		firedCriteria,
		flaggedIssues,
		timestamp: new Date().toISOString()
	};
}
