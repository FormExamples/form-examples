import type { ToxicologyResult, FiredRule } from './types';
import { hasAnyResultValue } from './utils';

/** A mandatory report section, used to compute Axis C completeness. */
interface SectionCheck {
	ruleId: string;
	category: string;
	label: string;
	present: (r: ToxicologyResult) => boolean;
}

/**
 * The five mandatory report sections for a toxicology report: clinical
 * history, specimen condition, result values, interpretation (findings
 * narrative), and impression.
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
		category: 'specimen',
		label: 'specimen condition',
		present: (r) => r.specimenCondition !== ''
	},
	{
		ruleId: 'R-COMP-RESULTS-01',
		category: 'result-values',
		label: 'result values',
		present: (r) => hasAnyResultValue(r)
	},
	{
		ruleId: 'R-COMP-INTERPRETATION-01',
		category: 'interpretation',
		label: 'interpretation / findings narrative',
		present: (r) => r.findingsNarrative.trim() !== ''
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
export function gradeCompleteness(r: ToxicologyResult): {
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
