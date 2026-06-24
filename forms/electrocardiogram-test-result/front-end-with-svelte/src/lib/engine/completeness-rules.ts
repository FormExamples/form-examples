import type { ElectrocardiogramResult, FiredRule } from './types';

/** A mandatory report section, used to compute Axis C completeness. */
interface SectionCheck {
	ruleId: string;
	category: string;
	label: string;
	present: (r: ElectrocardiogramResult) => boolean;
}

/**
 * The five mandatory report sections per AHA/ACCF/HRS reporting standards:
 * clinical history, rate/rhythm, intervals, interpretation, and impression.
 */
const sections: SectionCheck[] = [
	{
		ruleId: 'R-COMP-HISTORY-01',
		category: 'history',
		label: 'clinical history',
		present: (r) => r.clinicalHistory.trim() !== ''
	},
	{
		ruleId: 'R-COMP-RATE-RHYTHM-01',
		category: 'rate-rhythm',
		label: 'ventricular rate and rhythm',
		present: (r) => r.ventricularRateBpm !== null && r.rhythm !== ''
	},
	{
		ruleId: 'R-COMP-INTERVALS-01',
		category: 'intervals',
		label: 'PR / QRS / QT / QTc intervals',
		present: (r) =>
			r.prIntervalMs !== null &&
			r.qrsDurationMs !== null &&
			r.qtIntervalMs !== null &&
			r.qtcMs !== null
	},
	{
		ruleId: 'R-COMP-INTERPRETATION-01',
		category: 'interpretation',
		label: 'interpretation narrative',
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
export function gradeCompleteness(r: ElectrocardiogramResult): {
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
