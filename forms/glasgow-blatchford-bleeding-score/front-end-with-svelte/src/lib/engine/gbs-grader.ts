import type { AssessmentData, FiredRule, GradingResult } from './types';
import {
	bloodUreaPoints,
	cardiacFailurePoint,
	gbsRules,
	haemoglobinPoints,
	hepaticDiseasePoint,
	melaenaPoint,
	pulsePoint,
	riskBandFor,
	syncopePoint,
	systolicBloodPressurePoints
} from './gbs-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * True when every scored parameter has an input and the patient's sex is known
 * (an unknown / unset sex is treated as incomplete because it changes the
 * haemoglobin banding).
 */
export function isComplete(d: AssessmentData): boolean {
	const num = (v: number | null) => v !== null && v !== undefined;
	const enm = (v: string) => v !== '' && v !== null && v !== undefined;
	return (
		num(d.labs.bloodUrea) &&
		num(d.labs.haemoglobin) &&
		num(d.haemodynamics.systolicBloodPressure) &&
		num(d.haemodynamics.pulse) &&
		enm(d.clinicalMarkers.melaenaPresent) &&
		enm(d.clinicalMarkers.syncope) &&
		enm(d.clinicalMarkers.hepaticDisease) &&
		enm(d.clinicalMarkers.cardiacFailure) &&
		d.identification.sex !== '' &&
		d.identification.sex !== 'unknown'
	);
}

/**
 * Evaluate the declarative rule table and collect the rows that fired.
 */
export function evaluateRules(data: AssessmentData): FiredRule[] {
	const fired: FiredRule[] = [];
	for (const rule of gbsRules) {
		try {
			if (rule.evaluate(data)) {
				fired.push({
					id: rule.id,
					parameter: rule.parameter,
					points: rule.points,
					category: rule.category,
					description: rule.description
				});
			}
		} catch (e) {
			console.warn(`GBS rule ${rule.id} evaluation failed:`, e);
		}
	}
	return fired;
}

/**
 * Pure function: compute the full Glasgow-Blatchford grade for the supplied
 * assessment data.
 *
 * Grading algorithm (spec §4):
 *   bloodUreaPoints             = < 6.5 ? 0 : 6.5-7.9 ? 2 : 8.0-9.9 ? 3 : 10.0-24.9 ? 4 : 6
 *   haemoglobinPoints           = sex-specific bands (men: 0/1/3/6; women: 0/1/6)
 *   systolicBloodPressurePoints = >= 110 ? 0 : 100-109 ? 1 : 90-99 ? 2 : 3
 *   pulsePoint                  = pulse >= 100 ? 1 : 0
 *   melaenaPoint                = melaena  == yes ? 1 : 0
 *   syncopePoint                = syncope  == yes ? 2 : 0
 *   hepaticDiseasePoint         = hepatic  == yes ? 2 : 0
 *   cardiacFailurePoint         = cardiac  == yes ? 2 : 0
 *   gbsScore  = sum of the eight contributions (0..23)
 *   riskBand  = gbsScore == 0 ? 'very-low' : gbsScore <= 5 ? 'low-moderate' : 'high'
 *
 * A missing numeric input contributes 0 points; `flagged-issues.ts` raises a
 * data-completeness flag separately. `complete` is true only once all eight
 * parameters are answered and the patient's sex is known.
 */
export function calculateGbsGrade(data: AssessmentData): GradingResult {
	const urea = bloodUreaPoints(data);
	const hb = haemoglobinPoints(data);
	const sbp = systolicBloodPressurePoints(data);
	const pulse = pulsePoint(data);
	const melaena = melaenaPoint(data);
	const syncope = syncopePoint(data);
	const hepatic = hepaticDiseasePoint(data);
	const cardiac = cardiacFailurePoint(data);

	const gbsScore = urea + hb + sbp + pulse + melaena + syncope + hepatic + cardiac;

	const band = riskBandFor(gbsScore);
	const complete = isComplete(data);
	const firedRules = evaluateRules(data);

	// Record the derived band decision as a `band` audit row, mirroring the
	// grade_rule table's `band` parameter.
	firedRules.push({
		id: `R-BAND-${band.riskBand.toUpperCase()}-01`,
		parameter: 'band',
		points: null,
		category: 'band-band',
		description: `GBS total ${gbsScore}${complete ? '' : ' (partial)'} → ${band.riskBand} risk`
	});

	const result: GradingResult = {
		bloodUreaPoints: urea,
		haemoglobinPoints: hb,
		systolicBloodPressurePoints: sbp,
		pulsePoint: pulse,
		melaenaPoint: melaena,
		syncopePoint: syncope,
		hepaticDiseasePoint: hepatic,
		cardiacFailurePoint: cardiac,
		gbsScore,
		riskBand: band.riskBand,
		recommendedManagement: band.recommendedManagement,
		complete,
		firedRules,
		flaggedIssues: [],
		timestamp: new Date().toISOString()
	};

	result.flaggedIssues = detectFlaggedIssues(data, result);
	return result;
}
