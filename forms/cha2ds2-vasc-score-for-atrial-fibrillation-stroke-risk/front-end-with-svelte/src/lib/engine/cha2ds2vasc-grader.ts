import type {
	AnticoagulationRecommendation,
	AssessmentData,
	FiredCriterion,
	GradingResult,
	RiskBand
} from './types';
import { cha2ds2VascRules } from './cha2ds2vasc-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Adjusted annual ischaemic-stroke rate (%) indexed by total score 0-9
 * (Lip et al., Chest 2010).
 */
export const ANNUAL_STROKE_RATE_PERCENT = [0.2, 1.3, 2.2, 3.2, 4.0, 6.7, 9.8, 9.6, 6.7, 15.2];

/**
 * Evaluate the eight criterion rules and collect the ones that fired.
 */
export function evaluateCriteria(data: AssessmentData): FiredCriterion[] {
	const fired: FiredCriterion[] = [];
	for (const rule of cha2ds2VascRules) {
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
			console.warn(`CHA2DS2-VASc rule ${rule.id} evaluation failed:`, e);
		}
	}
	return fired;
}

/** Compute the age point (mutually-exclusive bands: >= 75 → 2, 65-74 → 1). */
export function calculateAgePoint(ageYears: number | null): 0 | 1 | 2 {
	if (ageYears === null || ageYears === undefined) return 0;
	if (ageYears >= 75) return 2;
	if (ageYears >= 65) return 1;
	return 0;
}

/**
 * Pure function: compute the full CHA2DS2-VASc grade for the supplied
 * assessment data.
 *
 * Algorithm (spec §4). Age is mutually exclusive (never scores both bands):
 *   congestiveHeartFailurePoint = congestiveHeartFailure == 'yes'        ? 1 : 0
 *   hypertensionPoint           = hypertension == 'yes'                  ? 1 : 0
 *   diabetesPoint               = diabetes == 'yes'                      ? 1 : 0
 *   strokePoint                 = priorStrokeTiaThromboembolism == 'yes' ? 2 : 0
 *   vascularDiseasePoint        = vascularDisease == 'yes'               ? 1 : 0
 *   agePoint = ageYears == null ? 0 : >= 75 ? 2 : >= 65 ? 1 : 0
 *   sexPoint                    = sex == 'female'                        ? 1 : 0
 *   cha2ds2VascScore = sum (0..9)
 *   riskBand = (male && score==0) low | (female && score==1) low
 *            | (male && score==1) intermediate | otherwise high
 *
 * A missing enum input is treated as absent (0 points); a missing ageYears
 * scores 0 for age. `flagged-issues.ts` raises data-completeness flags.
 */
export function calculateCha2ds2VascGrade(data: AssessmentData): GradingResult {
	const firedCriteria = evaluateCriteria(data);

	const congestiveHeartFailurePoint: 0 | 1 = data.cardiac.congestiveHeartFailure === 'yes' ? 1 : 0;
	const hypertensionPoint: 0 | 1 = data.cardiac.hypertension === 'yes' ? 1 : 0;
	const agePoint = calculateAgePoint(data.identification.ageYears);
	const diabetesPoint: 0 | 1 = data.metabolic.diabetes === 'yes' ? 1 : 0;
	const strokePoint: 0 | 2 = data.metabolic.priorStrokeTiaThromboembolism === 'yes' ? 2 : 0;
	const vascularDiseasePoint: 0 | 1 = data.cardiac.vascularDisease === 'yes' ? 1 : 0;
	const sexPoint: 0 | 1 = data.identification.sex === 'female' ? 1 : 0;

	const cha2ds2VascScore = (congestiveHeartFailurePoint +
		hypertensionPoint +
		agePoint +
		diabetesPoint +
		strokePoint +
		vascularDiseasePoint +
		sexPoint) as GradingResult['cha2ds2VascScore'];

	const sex = data.identification.sex;
	let riskBand: RiskBand;
	if (sex === 'male' && cha2ds2VascScore === 0) {
		riskBand = 'low';
	} else if (sex === 'female' && cha2ds2VascScore === 1) {
		riskBand = 'low'; // sex point only
	} else if (sex === 'male' && cha2ds2VascScore === 1) {
		riskBand = 'intermediate';
	} else if (cha2ds2VascScore === 0) {
		riskBand = 'low'; // no risk factors and sex not yet recorded
	} else {
		riskBand = 'high';
	}

	const anticoagulationRecommendation: AnticoagulationRecommendation =
		riskBand === 'low' ? 'none' : riskBand === 'intermediate' ? 'consider' : 'recommended';

	const annualStrokeRatePercent = ANNUAL_STROKE_RATE_PERCENT[cha2ds2VascScore] ?? 0;

	// Record the derived risk-band decision as a `risk-band` audit row, mirroring
	// the grade_rule table's `risk-band` criterion.
	firedCriteria.push({
		id: 'R-RISK-BAND-01',
		criterion: 'risk-band',
		points: 0,
		category: 'risk-band',
		description:
			`CHA2DS2-VASc ${cha2ds2VascScore} of 9 — ${riskBand} risk; ` +
			`estimated annual stroke rate ${annualStrokeRatePercent}%`
	});

	const flaggedIssues = detectFlaggedIssues(data, { riskBand, cha2ds2VascScore });

	return {
		congestiveHeartFailurePoint,
		hypertensionPoint,
		agePoint,
		diabetesPoint,
		strokePoint,
		vascularDiseasePoint,
		sexPoint,
		cha2ds2VascScore,
		riskBand,
		annualStrokeRatePercent,
		anticoagulationRecommendation,
		firedCriteria,
		flaggedIssues,
		timestamp: new Date().toISOString()
	};
}
