import type { MicrobiologyCultureResult, FiredRule } from './types';

/** A mandatory report section, used to compute Axis C completeness. */
interface SectionCheck {
	ruleId: string;
	category: string;
	label: string;
	present: (r: MicrobiologyCultureResult) => boolean;
}

/**
 * The five mandatory report sections per RCPath / UK SMI reporting standards:
 * clinical history, specimen, microscopy/culture, sensitivities, and impression.
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
		label: 'specimen type',
		present: (r) => r.specimenType !== ''
	},
	{
		ruleId: 'R-COMP-CULTURE-01',
		category: 'culture',
		label: 'microscopy / culture result',
		present: (r) => r.cultureResult !== '' || r.gramStainResult.trim() !== ''
	},
	{
		ruleId: 'R-COMP-SENSITIVITIES-01',
		category: 'sensitivities',
		label: 'antibiotic sensitivities',
		present: (r) => r.antibioticSensitivities.trim() !== ''
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
export function gradeCompleteness(r: MicrobiologyCultureResult): {
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
