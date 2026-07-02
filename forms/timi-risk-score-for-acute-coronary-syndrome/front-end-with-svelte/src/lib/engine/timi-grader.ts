import type { AssessmentData, FiredCriterion, GradingResult, RiskBand } from './types';
import { timiRules } from './timi-rules';
import { FOURTEEN_DAY_RISK_PERCENT } from './utils';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Evaluate the seven TIMI criterion rules and collect the ones that fired.
 */
export function evaluateCriteria(data: AssessmentData): FiredCriterion[] {
	const fired: FiredCriterion[] = [];
	for (const rule of timiRules) {
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
			console.warn(`TIMI rule ${rule.id} evaluation failed:`, e);
		}
	}
	return fired;
}

/**
 * Derive the risk band from the total TIMI score.
 * 0-1 → low, 2-4 → intermediate, 5-7 → high.
 */
export function deriveRiskBand(timiScore: number): RiskBand {
	if (timiScore <= 1) return 'low';
	if (timiScore <= 4) return 'intermediate';
	return 'high';
}

/**
 * Pure function: compute the full TIMI grade for the supplied assessment data.
 *
 * Algorithm (spec §4):
 *   agePoint           = ageOver65                  == 'yes' ? 1 : 0
 *   riskFactorPoint    = threeOrMoreCadRiskFactors  == 'yes' ? 1 : 0
 *   knownCadPoint      = knownCadStenosis           == 'yes' ? 1 : 0
 *   aspirinPoint       = aspirinUsePrior7Days       == 'yes' ? 1 : 0
 *   anginaPoint        = twoOrMoreAnginaEpisodes24h == 'yes' ? 1 : 0
 *   stDeviationPoint   = stDeviation                == 'yes' ? 1 : 0
 *   cardiacMarkerPoint = positiveCardiacMarker      == 'yes' ? 1 : 0
 *   timiScore = sum (0..7)
 *   riskBand  = timiScore <= 1 ? 'low' : timiScore <= 4 ? 'intermediate' : 'high'
 *   fourteenDayRiskPercent = lookup(timiScore)
 *
 * A missing enum input ('') counts as absent (0 points) for its criterion;
 * `flagged-issues.ts` raises a data-completeness flag separately.
 */
export function calculateTimiGrade(data: AssessmentData): GradingResult {
	const firedCriteria = evaluateCriteria(data);
	const has = (criterion: string) => firedCriteria.some((f) => f.criterion === criterion);

	const agePoint: 0 | 1 = has('age') ? 1 : 0;
	const riskFactorPoint: 0 | 1 = has('risk-factors') ? 1 : 0;
	const knownCadPoint: 0 | 1 = has('known-cad') ? 1 : 0;
	const aspirinPoint: 0 | 1 = has('aspirin') ? 1 : 0;
	const anginaPoint: 0 | 1 = has('angina') ? 1 : 0;
	const stDeviationPoint: 0 | 1 = has('st-deviation') ? 1 : 0;
	const cardiacMarkerPoint: 0 | 1 = has('cardiac-marker') ? 1 : 0;

	const timiScore = (agePoint +
		riskFactorPoint +
		knownCadPoint +
		aspirinPoint +
		anginaPoint +
		stDeviationPoint +
		cardiacMarkerPoint) as GradingResult['timiScore'];

	const riskBand = deriveRiskBand(timiScore);
	const fourteenDayRiskPercent = FOURTEEN_DAY_RISK_PERCENT[timiScore];

	// Record the derived risk-band decision as a `band` audit row, mirroring the
	// grade_rule table's `band` criterion.
	firedCriteria.push({
		id: 'R-BAND-01',
		criterion: 'band',
		points: 0,
		category: 'risk-band',
		description:
			`TIMI ${timiScore} of 7 — ${riskBand} risk band; ` +
			`~${fourteenDayRiskPercent}% 14-day risk of death, MI, or urgent revascularisation`
	});

	const flaggedIssues = detectFlaggedIssues(data, timiScore);

	return {
		agePoint,
		riskFactorPoint,
		knownCadPoint,
		aspirinPoint,
		anginaPoint,
		stDeviationPoint,
		cardiacMarkerPoint,
		timiScore,
		riskBand,
		fourteenDayRiskPercent,
		firedCriteria,
		flaggedIssues,
		timestamp: new Date().toISOString()
	};
}
