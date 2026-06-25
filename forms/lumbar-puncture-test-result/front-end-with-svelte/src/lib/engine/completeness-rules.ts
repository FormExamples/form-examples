import type { LumbarPunctureResult, FiredRule } from './types';

/** A mandatory report section, used to compute Axis C completeness. */
interface SectionCheck {
	ruleId: string;
	category: string;
	label: string;
	present: (r: LumbarPunctureResult) => boolean;
}

/**
 * The five mandatory report sections for a CSF analysis report: clinical
 * history, CSF appearance, cell counts, biochemistry, and impression.
 */
const sections: SectionCheck[] = [
	{
		ruleId: 'R-COMP-HISTORY-01',
		category: 'history',
		label: 'clinical history',
		present: (r) => r.clinicalHistory.trim() !== ''
	},
	{
		ruleId: 'R-COMP-APPEARANCE-01',
		category: 'appearance',
		label: 'CSF appearance',
		present: (r) => r.csfAppearance !== ''
	},
	{
		ruleId: 'R-COMP-CELLCOUNTS-01',
		category: 'cell-counts',
		label: 'CSF cell counts',
		present: (r) => r.csfWhiteCellCount !== null || r.csfRedCellCount !== null
	},
	{
		ruleId: 'R-COMP-BIOCHEMISTRY-01',
		category: 'biochemistry',
		label: 'CSF biochemistry',
		present: (r) => r.csfProteinGL !== null || r.csfGlucoseMmolL !== null
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
export function gradeCompleteness(r: LumbarPunctureResult): {
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
