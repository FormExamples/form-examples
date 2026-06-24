import type { AmbulatoryBloodPressureResult, FiredRule } from './types';

/** A mandatory report section, used to compute Axis C completeness. */
interface SectionCheck {
	ruleId: string;
	category: string;
	label: string;
	present: (r: AmbulatoryBloodPressureResult) => boolean;
}

/**
 * The five mandatory report sections per NICE NG136 / BIHS ABPM reporting:
 * clinical history, the averaged measurements, nocturnal dipping, findings,
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
		ruleId: 'R-COMP-AVERAGES-01',
		category: 'averages',
		label: 'averaged blood-pressure measurements',
		present: (r) =>
			(r.daytimeAverageSystolic !== null && r.daytimeAverageDiastolic !== null) ||
			(r.twentyFourHourAverageSystolic !== null && r.twentyFourHourAverageDiastolic !== null)
	},
	{
		ruleId: 'R-COMP-DIPPING-01',
		category: 'dipping',
		label: 'nocturnal dipping',
		present: (r) => r.nocturnalDipPercent !== null || r.dipperStatus !== ''
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
export function gradeCompleteness(r: AmbulatoryBloodPressureResult): {
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
