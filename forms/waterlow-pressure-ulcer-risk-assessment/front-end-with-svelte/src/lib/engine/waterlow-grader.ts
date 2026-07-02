import type {
	AssessmentData,
	ContributingCategory,
	GradingResult,
	PointsFields,
	RiskBand
} from './types';
import { categoryDefs, pointsFor } from './waterlow-rules';
import { optionLabel, preventionActionLabel } from './utils';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Derive the risk band from the total Waterlow score (higher = worse):
 *   >= 20 very-high, >= 15 high, >= 10 at-risk, else low.
 */
export function bandForScore(score: number): RiskBand {
	if (score >= 20) return 'very-high';
	if (score >= 15) return 'high';
	if (score >= 10) return 'at-risk';
	return 'low';
}

/**
 * Pure function: compute the full Waterlow grade for the supplied data.
 *
 * Algorithm (spec §4) — a summed weighted score: each core category maps its
 * selected enum to points; sex-and-age adds `sexPoints + agePoints`; each
 * special-risk group maps its highest applicable enum to points. All
 * contributions are summed into the Waterlow total, which selects the band. An
 * unanswered enum ('') contributes 0 points for that category (the total can
 * then understate risk); `flagged-issues.ts` raises a data-completeness flag
 * separately.
 */
export function calculateWaterlowGrade(data: AssessmentData): GradingResult {
	const points: PointsFields = {
		buildPoints: 0,
		skinPoints: 0,
		sexPoints: 0,
		agePoints: 0,
		continencePoints: 0,
		mobilityPoints: 0,
		tissueMalnutritionPoints: 0,
		neurologicalDeficitPoints: 0,
		majorSurgeryTraumaPoints: 0,
		medicationPoints: 0
	};
	const contributingCategories: ContributingCategory[] = [];

	for (const def of categoryDefs) {
		const section = data[def.section] as unknown as Record<string, string>;
		const value = section?.[def.field] ?? '';
		const p = pointsFor(def.map, value);
		points[def.pointsField] = p;
		if (p > 0) {
			contributingCategories.push({
				key: def.key,
				label: def.label,
				optionLabel: optionLabel(def.field, value),
				points: p
			});
		}
	}

	const waterlowScore =
		points.buildPoints +
		points.skinPoints +
		points.sexPoints +
		points.agePoints +
		points.continencePoints +
		points.mobilityPoints +
		points.tissueMalnutritionPoints +
		points.neurologicalDeficitPoints +
		points.majorSurgeryTraumaPoints +
		points.medicationPoints;

	const riskBand = bandForScore(waterlowScore);

	const result: GradingResult = {
		...points,
		waterlowScore,
		riskBand,
		preventionAction: preventionActionLabel(riskBand),
		contributingCategories,
		flaggedIssues: [],
		timestamp: new Date().toISOString()
	};

	result.flaggedIssues = detectFlaggedIssues(data, result);
	return result;
}
