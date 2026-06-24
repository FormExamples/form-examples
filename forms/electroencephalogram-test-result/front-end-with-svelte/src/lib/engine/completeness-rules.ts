import type { ElectroencephalogramResult, FiredRule } from './types';

/** A mandatory report section, used to compute Axis C completeness. */
interface SectionCheck {
	ruleId: string;
	category: string;
	label: string;
	present: (r: ElectroencephalogramResult) => boolean;
}

/**
 * The five mandatory report sections per ILAE / IFCN reporting practice:
 * clinical history, technique, comparison, findings, and impression.
 */
const sections: SectionCheck[] = [
	{
		ruleId: 'R-COMP-HISTORY-01',
		category: 'history',
		label: 'clinical history',
		present: (r) => r.clinicalHistory.trim() !== ''
	},
	{
		ruleId: 'R-COMP-TECHNIQUE-01',
		category: 'technique',
		label: 'recording technique (EEG type)',
		present: (r) => r.eegType !== ''
	},
	{
		ruleId: 'R-COMP-COMPARISON-01',
		category: 'comparison',
		label: 'comparison with previous EEG',
		present: (r) => r.comparisonWithPrevious.trim() !== ''
	},
	{
		ruleId: 'R-COMP-FINDINGS-01',
		category: 'findings',
		label: 'findings narrative',
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
export function gradeCompleteness(r: ElectroencephalogramResult): {
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
