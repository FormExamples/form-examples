import type {
	AssessmentData,
	FiredFactor,
	GradingResult,
	GroupSubtotals,
	Prophylaxis,
	RiskBand
} from './types';
import { capriniRules } from './caprini-rules';
import { ageBandPoints } from './utils';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Evaluate every weighted factor rule and collect the ones that fired.
 */
export function evaluateFactors(data: AssessmentData): FiredFactor[] {
	const fired: FiredFactor[] = [];
	for (const rule of capriniRules) {
		try {
			if (rule.evaluate(data)) {
				fired.push({
					id: rule.id,
					factor: rule.factor,
					weightGroup: rule.weightGroup,
					points: rule.points,
					category: rule.category,
					description: rule.description
				});
			}
		} catch (e) {
			// Rule evaluation failed - log for debugging but continue grading.
			console.warn(`Caprini rule ${rule.id} evaluation failed:`, e);
		}
	}
	return fired;
}

/** Derive the risk band from the total Caprini score. */
export function bandForScore(score: number): RiskBand {
	if (score <= 1) return 'very-low';
	if (score === 2) return 'low';
	if (score <= 4) return 'moderate';
	return 'high';
}

/** Base prophylaxis recommendation for a risk band (before any downgrade). */
export function baseProphylaxisForBand(band: RiskBand): Prophylaxis {
	switch (band) {
		case 'very-low':
			return 'early-ambulation';
		case 'low':
			return 'mechanical';
		case 'moderate':
			return 'pharmacological-or-mechanical';
		case 'high':
			return 'pharmacological-plus-mechanical';
		default:
			return 'early-ambulation';
	}
}

/**
 * Pure function: compute the full Caprini grade for the supplied data.
 *
 * Algorithm (spec §4): sum the age-band weight plus the fixed weight of every
 * fired factor; the total maps to a risk band and a base prophylaxis
 * recommendation. A high bleeding risk downgrades any pharmacological
 * recommendation to mechanical. A factor answered '' contributes 0 points;
 * `flagged-issues.ts` raises a data-completeness flag separately.
 */
export function calculateCapriniGrade(data: AssessmentData): GradingResult {
	const firedFactors = evaluateFactors(data);

	const groupSubtotals: GroupSubtotals = {
		'1-point': 0,
		'2-point': 0,
		'3-point': 0,
		'5-point': 0
	};
	for (const f of firedFactors) {
		if (f.weightGroup !== 'age') {
			groupSubtotals[f.weightGroup] += f.points;
		}
	}

	const ageBand = data.identification.ageBand;
	const agePoints = ageBand === '' ? 0 : ageBandPoints[ageBand];

	// Record the age-band contribution as an audit row (weight group 'age'),
	// mirroring the grade_rule table, whenever an age band has been chosen.
	if (ageBand !== '') {
		firedFactors.unshift({
			id: 'R-AGE-BAND-01',
			factor: 'age_band',
			weightGroup: 'age',
			points: agePoints,
			category: 'age-band',
			description: `Age band ${ageBand} contributes ${agePoints} point${agePoints === 1 ? '' : 's'}`
		});
	}

	const factorPointsTotal =
		groupSubtotals['1-point'] +
		groupSubtotals['2-point'] +
		groupSubtotals['3-point'] +
		groupSubtotals['5-point'];

	const capriniScore = agePoints + factorPointsTotal;
	const riskBand = bandForScore(capriniScore);
	const baseProphylaxis = baseProphylaxisForBand(riskBand);

	// Bleeding-risk downgrade: any pharmacological recommendation becomes
	// mechanical while the bleeding risk is high.
	const highBleeding = data.bleeding.highBleedingRisk === 'yes';
	const isPharmacological =
		baseProphylaxis === 'pharmacological-or-mechanical' ||
		baseProphylaxis === 'pharmacological-plus-mechanical';
	const bleedingDowngraded = highBleeding && isPharmacological;
	const recommendedProphylaxis: Prophylaxis = bleedingDowngraded ? 'mechanical' : baseProphylaxis;

	const flaggedIssues = detectFlaggedIssues(data, capriniScore, riskBand);

	return {
		ageBandPoints: agePoints,
		groupSubtotals,
		capriniScore,
		riskBand,
		baseProphylaxis,
		recommendedProphylaxis,
		bleedingDowngraded,
		firedFactors,
		flaggedIssues,
		timestamp: new Date().toISOString()
	};
}
