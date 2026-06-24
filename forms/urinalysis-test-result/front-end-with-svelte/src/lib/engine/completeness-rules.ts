import type { UrinalysisResult, FiredRule } from './types';

/** A mandatory report section, used to compute Axis C completeness. */
interface SectionCheck {
	ruleId: string;
	category: string;
	label: string;
	present: (r: UrinalysisResult) => boolean;
}

/**
 * The five mandatory report sections per UK SMI B41 / RCPath reporting
 * standards: clinical history, specimen, dipstick, microscopy/culture, and
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
		ruleId: 'R-COMP-SPECIMEN-01',
		category: 'specimen',
		label: 'specimen type and condition',
		present: (r) => r.specimenType !== '' && r.specimenCondition !== ''
	},
	{
		ruleId: 'R-COMP-DIPSTICK-01',
		category: 'dipstick',
		label: 'dipstick results',
		present: (r) =>
			r.leucocytes !== '' ||
			r.nitrites !== '' ||
			r.protein !== '' ||
			r.blood !== '' ||
			r.glucose !== '' ||
			r.ketones !== '' ||
			r.bilirubin !== '' ||
			r.ph !== null ||
			r.specificGravity !== null
	},
	{
		ruleId: 'R-COMP-CULTURE-01',
		category: 'microscopy-culture',
		label: 'microscopy / culture',
		present: (r) =>
			r.cultureResult !== '' ||
			r.organismsSeen ||
			r.whiteCellCount.trim() !== '' ||
			r.redCellCount.trim() !== '' ||
			r.organismIsolated.trim() !== ''
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
export function gradeCompleteness(r: UrinalysisResult): {
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
