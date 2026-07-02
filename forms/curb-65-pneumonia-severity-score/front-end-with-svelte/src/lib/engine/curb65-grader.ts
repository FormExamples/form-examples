import type {
	AssessmentData,
	Disposition,
	FiredCriterion,
	GradingResult,
	RiskBand,
	ScoreVariant
} from './types';
import { curb65Rules } from './curb65-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Evaluate the five CURB-65 criterion rules and collect the ones that fired.
 */
export function evaluateCriteria(data: AssessmentData): FiredCriterion[] {
	const fired: FiredCriterion[] = [];
	for (const rule of curb65Rules) {
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
			console.warn(`CURB-65 rule ${rule.id} evaluation failed:`, e);
		}
	}
	return fired;
}

/** Recommended-setting prose for a band. */
function recommendedSettingFor(band: RiskBand): string {
	switch (band) {
		case 'low':
			return 'Consider treatment at home / outpatient management.';
		case 'intermediate':
			return 'Consider short-stay inpatient care or hospital-supervised outpatient treatment.';
		case 'high':
			return 'Hospitalise and manage as severe community-acquired pneumonia; for scores 4-5 assess for intensive-care / HDU admission.';
		default:
			return '';
	}
}

function dispositionFor(band: RiskBand): Disposition {
	switch (band) {
		case 'low':
			return 'home-outpatient';
		case 'intermediate':
			return 'short-stay-supervised';
		case 'high':
			return 'hospital-admission';
		default:
			return 'home-outpatient';
	}
}

/** Band a CURB-65 total (0-5): 0-1 low, 2 intermediate, 3-5 high. */
function bandCurb65(score: number): RiskBand {
	if (score >= 3) return 'high';
	if (score === 2) return 'intermediate';
	return 'low';
}

/** Band a CRB-65 total (0-4): 0 low, 1-2 intermediate, 3-4 high. */
function bandCrb65(score: number): RiskBand {
	if (score >= 3) return 'high';
	if (score >= 1) return 'intermediate';
	return 'low';
}

/**
 * Pure function: compute the full CURB-65 (or CRB-65 fallback) grade for the
 * supplied assessment data.
 *
 * Algorithm (spec §4):
 *   confusionScore        = confusionPresent === 'yes'                 ? 1 : 0
 *   ureaScore             = ureaMeasured && ureaMmolL   > 7            ? 1 : 0
 *   respiratoryRateScore  = respiratoryRate            >= 30           ? 1 : 0
 *   bloodPressureScore    = (systolicBp < 90) || (diastolicBp <= 60)   ? 1 : 0
 *   ageScore              = ageYears                   >= 65           ? 1 : 0
 *   curb65Score = C + U + R + B + A65 (0-5); band 0-1 low, 2 intermediate, 3-5 high
 *
 * CRB-65 fallback: when serum urea was NOT measured, the urea criterion is
 * dropped and the four-criterion CRB-65 total (0-4) is computed and banded on
 * its own scale (0 low, 1-2 intermediate, 3-4 high). In that case `curb65Score`
 * is left partial and `crb65Score` is the primary result; `totalScore` /
 * `scoreVariant` reflect whichever variant applies.
 *
 * A missing numeric/enum input contributes 0 points (absent, not positive);
 * `flagged-issues.ts` raises a data-completeness flag separately.
 */
export function calculateCurb65Grade(data: AssessmentData): GradingResult {
	const firedCriteria = evaluateCriteria(data);
	const has = (criterion: string) => firedCriteria.some((f) => f.criterion === criterion);

	const confusionScore: 0 | 1 = has('confusion') ? 1 : 0;
	const ureaScore: 0 | 1 = has('urea') ? 1 : 0;
	const respiratoryRateScore: 0 | 1 = has('respiratory-rate') ? 1 : 0;
	const bloodPressureScore: 0 | 1 = has('blood-pressure') ? 1 : 0;
	const ageScore: 0 | 1 = has('age') ? 1 : 0;

	const ureaMeasured = data.urea.ureaMeasured === 'yes';

	// CURB-65 (five criteria) and CRB-65 (four criteria, no urea).
	const crb65Sum = (confusionScore + respiratoryRateScore + bloodPressureScore + ageScore) as
		| 0
		| 1
		| 2
		| 3
		| 4;
	const curb65Score = (crb65Sum + ureaScore) as 0 | 1 | 2 | 3 | 4 | 5;

	const scoreVariant: ScoreVariant = ureaMeasured ? 'curb-65' : 'crb-65';
	const crb65Score = ureaMeasured ? null : crb65Sum;
	const totalScore = ureaMeasured ? curb65Score : crb65Sum;

	const riskBand: RiskBand = ureaMeasured ? bandCurb65(curb65Score) : bandCrb65(crb65Sum);
	const recommendedSetting = recommendedSettingFor(riskBand);
	const recommendedDisposition = dispositionFor(riskBand);

	// Record the derived risk-band decision as a `band` audit row, mirroring the
	// grade_rule table's `band` criterion.
	const variantLabel = ureaMeasured ? 'CURB-65' : 'CRB-65';
	firedCriteria.push({
		id: 'R-BAND-01',
		criterion: 'band',
		points: 0,
		category: 'risk-band',
		description: `${variantLabel} score ${totalScore} — ${riskBand} risk band`
	});

	const flaggedIssues = detectFlaggedIssues(data, { totalScore, scoreVariant });

	return {
		confusionScore,
		ureaScore,
		respiratoryRateScore,
		bloodPressureScore,
		ageScore,
		curb65Score,
		crb65Score,
		totalScore,
		scoreVariant,
		riskBand,
		recommendedDisposition,
		recommendedSetting,
		criteria: {
			confusion: confusionScore === 1,
			urea: ureaScore === 1,
			respiratoryRate: respiratoryRateScore === 1,
			bloodPressure: bloodPressureScore === 1,
			ageOver65: ageScore === 1
		},
		firedCriteria,
		flaggedIssues,
		timestamp: new Date().toISOString()
	};
}
