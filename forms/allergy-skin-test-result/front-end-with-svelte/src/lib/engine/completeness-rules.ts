import type { AllergySkinResult, FiredRule } from './types';

/** A mandatory report section, used to compute Axis C completeness. */
interface SectionCheck {
	ruleId: string;
	category: string;
	label: string;
	present: (r: AllergySkinResult) => boolean;
}

/**
 * The five mandatory report sections per BSACI / EAACI reporting standards:
 * clinical history, validity controls, allergens / weal sizes, interpretation,
 * and impression.
 */
const sections: SectionCheck[] = [
	{
		ruleId: 'R-COMP-HISTORY-01',
		category: 'history',
		label: 'clinical history',
		present: (r) => r.clinicalHistory.trim() !== ''
	},
	{
		ruleId: 'R-COMP-VALIDITY-01',
		category: 'validity-controls',
		label: 'validity controls (antihistamine washout / positive control)',
		present: (r) => r.antihistaminesWithheld || r.positiveControlValid
	},
	{
		ruleId: 'R-COMP-ALLERGENS-01',
		category: 'allergens',
		label: 'allergens tested / weal sizes',
		present: (r) =>
			r.allergensTested.trim() !== '' ||
			r.whealSizes.trim() !== '' ||
			r.specificIgeResults.trim() !== ''
	},
	{
		ruleId: 'R-COMP-INTERPRETATION-01',
		category: 'interpretation',
		label: 'interpretation',
		present: (r) => r.interpretation.trim() !== ''
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
export function gradeCompleteness(r: AllergySkinResult): {
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
