import type { CardiacStressResult, FiredRule } from './types';

/** A mandatory report section, used to compute Axis C completeness. */
interface SectionCheck {
	ruleId: string;
	category: string;
	label: string;
	present: (r: CardiacStressResult) => boolean;
}

/**
 * The five mandatory report sections per ACC/AHA exercise-testing reporting
 * standards: clinical history, protocol, haemodynamic response, findings, and
 * impression.
 */
const sections: SectionCheck[] = [
	{
		ruleId: 'R-COMP-HISTORY-01',
		category: 'history',
		label: 'clinical history',
		present: (r) => r.clinicalHistory.trim() !== ''
	},
	{
		ruleId: 'R-COMP-PROTOCOL-01',
		category: 'protocol',
		label: 'stress protocol',
		present: (r) => r.protocol.trim() !== ''
	},
	{
		ruleId: 'R-COMP-HAEMODYNAMIC-01',
		category: 'haemodynamic',
		label: 'haemodynamic response',
		present: (r) =>
			r.maximumHeartRateBpm !== null ||
			r.percentPredictedHeartRate !== null ||
			r.metsAchieved !== null ||
			r.bloodPressureResponse !== ''
	},
	{
		ruleId: 'R-COMP-FINDINGS-01',
		category: 'findings',
		label: 'structured findings',
		present: (r) => r.testPositive || r.testNegative || r.testInconclusive
	},
	{
		ruleId: 'R-COMP-IMPRESSION-01',
		category: 'impression',
		label: 'impression',
		present: (r) => r.impression.trim() !== ''
	}
];

/**
 * Axis C — report completeness.
 *
 * Returns the percentage (0–100, rounded) of mandatory report sections that
 * are present, plus an audit-trail rule for each missing section.
 */
export function gradeCompleteness(r: CardiacStressResult): {
	reportCompletenessPercent: number;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	let presentCount = 0;

	for (const section of sections) {
		if (section.present(r)) {
			presentCount += 1;
		} else {
			firedRules.push({
				ruleId: section.ruleId,
				axis: 'completeness',
				category: section.category,
				description: `Mandatory report section missing: ${section.label}.`
			});
		}
	}

	const reportCompletenessPercent = Math.round((presentCount / sections.length) * 100);
	return { reportCompletenessPercent, firedRules };
}
