import type { BloodCrossMatchResult, FiredRule } from './types';

/** A mandatory report section, used to compute Axis C completeness. */
interface SectionCheck {
	ruleId: string;
	category: string;
	label: string;
	present: (r: BloodCrossMatchResult) => boolean;
}

/**
 * The five mandatory report sections per BSH pre-transfusion compatibility
 * reporting: clinical history, grouping, antibody screen, crossmatch, and
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
		ruleId: 'R-COMP-GROUPING-01',
		category: 'grouping',
		label: 'ABO / RhD grouping',
		present: (r) => r.aboGroup !== '' && r.rhdGroup !== ''
	},
	{
		ruleId: 'R-COMP-ANTIBODY-01',
		category: 'antibody-screen',
		label: 'antibody screen',
		present: (r) => r.antibodyScreenResult !== ''
	},
	{
		ruleId: 'R-COMP-CROSSMATCH-01',
		category: 'crossmatch',
		label: 'crossmatch / compatibility outcome',
		present: (r) => r.crossmatchResult !== ''
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
export function gradeCompleteness(r: BloodCrossMatchResult): {
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
