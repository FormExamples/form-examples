import type { AssessmentData, FiredRule, GradingResult, ParameterPoint } from './types';
import {
	albuminPoints,
	ascitesPoints,
	bilirubinPoints,
	childPughRules,
	classBand,
	coagulationPoints,
	encephalopathyPoints
} from './child-pugh-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Evaluate the declarative rule table and collect the rows that fired (one per
 * answered parameter).
 */
export function evaluateRules(data: AssessmentData): FiredRule[] {
	const fired: FiredRule[] = [];
	for (const rule of childPughRules) {
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
			console.warn(`Child-Pugh rule ${rule.id} evaluation failed:`, e);
		}
	}
	return fired;
}

/**
 * Pure function: compute the full Child-Pugh grade for the supplied assessment
 * data.
 *
 * Grading algorithm (spec §4):
 *   bilirubinPoint      = totalBilirubin < 34 ? 1 : <= 50 ? 2 : 3        // µmol/L
 *   albuminPoint        = serumAlbumin   > 35 ? 1 : >= 28 ? 2 : 3        // g/L
 *   coagulationPoint    = inr < 1.7 ? 1 : <= 2.3 ? 2 : 3 (INR preferred; PT fallback)
 *   ascitesPoint        = none ? 1 : mild ? 2 : 3
 *   encephalopathyPoint = none ? 1 : grade-1-2 ? 2 : 3
 *   childPughScore      = sum of answered points (5..15 when complete)
 *   childPughClass      = childPughScore <= 6 ? 'A' : <= 9 ? 'B' : 'C'
 *
 * A missing parameter contributes no points to the (partial) total;
 * `flagged-issues.ts` raises a data-completeness flag separately. `complete` is
 * true only once all five parameters are answered.
 */
export function calculateChildPughGrade(data: AssessmentData): GradingResult {
	const bilirubinPoint = bilirubinPoints(data);
	const albuminPoint = albuminPoints(data);
	const coagulationPoint = coagulationPoints(data);
	const ascitesPoint = ascitesPoints(data);
	const encephalopathyPoint = encephalopathyPoints(data);

	const points: ParameterPoint[] = [
		bilirubinPoint,
		albuminPoint,
		coagulationPoint,
		ascitesPoint,
		encephalopathyPoint
	];
	const complete = points.every((p) => p !== null);
	const childPughScore = points.reduce<number>((sum, p) => sum + (p ?? 0), 0);

	const band = classBand(childPughScore);
	const firedRules = evaluateRules(data);

	// Record the derived class decision as a `class` audit row, mirroring the
	// grade_rule table's `class` parameter.
	firedRules.push({
		id: `R-CLASS-${band.childPughClass}-01`,
		parameter: 'class',
		points: null,
		category: 'class-band',
		description:
			`Child-Pugh total ${childPughScore}${complete ? '' : ' (partial)'} → ` +
			`Class ${band.childPughClass}; ~1-year survival ${band.oneYearSurvival}, ` +
			`~2-year survival ${band.twoYearSurvival}; ` +
			`peri-operative risk ${band.surgicalRisk}`
	});

	const result: GradingResult = {
		bilirubinPoint,
		albuminPoint,
		coagulationPoint,
		ascitesPoint,
		encephalopathyPoint,
		childPughScore,
		childPughClass: band.childPughClass,
		oneYearSurvival: band.oneYearSurvival,
		twoYearSurvival: band.twoYearSurvival,
		surgicalRisk: band.surgicalRisk,
		complete,
		firedRules,
		flaggedIssues: [],
		timestamp: new Date().toISOString()
	};

	result.flaggedIssues = detectFlaggedIssues(data, result);
	return result;
}
