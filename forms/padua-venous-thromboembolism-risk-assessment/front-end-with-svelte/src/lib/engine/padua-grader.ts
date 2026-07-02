import type {
	AssessmentData,
	FiredFactor,
	GradingResult,
	ProphylaxisRecommendation,
	RiskBand
} from './types';
import { paduaRules } from './padua-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Evaluate the eleven Padua factor rules and collect the ones that fired.
 */
export function evaluateFactors(data: AssessmentData): FiredFactor[] {
	const fired: FiredFactor[] = [];
	for (const rule of paduaRules) {
		try {
			if (rule.evaluate(data)) {
				fired.push({
					id: rule.id,
					factor: rule.factor,
					points: rule.points,
					category: rule.category,
					description: rule.description
				});
			}
		} catch (e) {
			// Rule evaluation failed - log for debugging but continue grading.
			console.warn(`Padua rule ${rule.id} evaluation failed:`, e);
		}
	}
	return fired;
}

/**
 * Whether a bleeding contraindication is present (gates the recommendation).
 */
export function hasBleedingContraindication(data: AssessmentData): boolean {
	return data.bleeding.activeBleeding === 'yes' || data.bleeding.highBleedingRisk === 'yes';
}

/**
 * Pure function: compute the full Padua grade for the supplied assessment data.
 *
 * Algorithm (spec §4): each factor contributes its weight when present; the
 * total 0-20 determines the risk band (>= 4 -> high). A missing numeric input
 * (ageYears, bodyMassIndex) contributes 0 points for its factor (absent, not
 * positive); `flagged-issues.ts` raises a data-completeness flag separately.
 * The bleeding-risk fields never change the score; they gate the prophylaxis
 * recommendation (spec §5).
 */
export function calculatePaduaGrade(data: AssessmentData): GradingResult {
	const firedFactors = evaluateFactors(data);

	// Per-factor contribution, keyed by factor name; 0 when the factor is absent.
	const factorPoints: Record<string, number> = {};
	for (const rule of paduaRules) {
		factorPoints[rule.factor] = 0;
	}
	for (const f of firedFactors) {
		factorPoints[f.factor] = f.points;
	}

	const paduaScore = firedFactors.reduce((sum, f) => sum + f.points, 0);

	const riskBand: RiskBand = paduaScore >= 4 ? 'high' : 'low';

	let prophylaxisRecommendation: ProphylaxisRecommendation;
	if (riskBand === 'high') {
		prophylaxisRecommendation = hasBleedingContraindication(data) ? 'mechanical' : 'pharmacological';
	} else {
		prophylaxisRecommendation = 'none';
	}

	// Record the derived risk-band decision as a `band` audit row, mirroring the
	// grade_rule table's `band` category.
	firedFactors.push({
		id: 'R-BAND-01',
		factor: 'band',
		points: 0,
		category: 'risk-band',
		description:
			paduaScore >= 4
				? 'Padua >= 4 — high risk band; consider pharmacological thromboprophylaxis subject to bleeding-risk check'
				: 'Padua < 4 — low risk band; routine pharmacological prophylaxis not indicated on risk grounds'
	});

	const flaggedIssues = detectFlaggedIssues(data, paduaScore);

	return {
		factorPoints,
		paduaScore,
		riskBand,
		prophylaxisRecommendation,
		firedFactors,
		flaggedIssues,
		timestamp: new Date().toISOString()
	};
}
