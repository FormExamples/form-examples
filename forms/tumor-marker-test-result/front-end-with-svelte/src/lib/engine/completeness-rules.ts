import type { TumorMarkerResult, FiredRule } from './types';
import { hasAnyMeasuredMarker } from './utils';

/** A mandatory report section, used to compute Axis C completeness. */
interface SectionCheck {
	ruleId: string;
	category: string;
	label: string;
	present: (r: TumorMarkerResult) => boolean;
}

/**
 * The five mandatory report sections per ACB / RCPath reporting standards:
 * clinical history, specimen condition, measured values, comparison with
 * previous, and impression.
 */
const sections: SectionCheck[] = [
	{
		ruleId: 'R-COMP-HISTORY-01',
		category: 'history',
		label: 'clinical history',
		present: (r) => r.clinicalHistory.trim() !== ''
	},
	{
		ruleId: 'R-COMP-SPECIMEN-01',
		category: 'specimen-condition',
		label: 'specimen condition',
		present: (r) => r.specimenCondition !== ''
	},
	{
		ruleId: 'R-COMP-VALUES-01',
		category: 'measured-values',
		label: 'measured marker values',
		present: (r) => hasAnyMeasuredMarker(r)
	},
	{
		ruleId: 'R-COMP-COMPARISON-01',
		category: 'comparison',
		label: 'comparison with previous',
		present: (r) => r.comparisonWithPrevious.trim() !== '' || r.trend !== ''
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
export function gradeCompleteness(r: TumorMarkerResult): {
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
