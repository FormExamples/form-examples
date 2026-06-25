import type { EyeVisionResult, FiredRule } from './types';

/** A mandatory report section, used to compute Axis C completeness. */
interface SectionCheck {
	ruleId: string;
	category: string;
	label: string;
	present: (r: EyeVisionResult) => boolean;
}

/**
 * The five mandatory report sections per RCOphth reporting standards:
 * clinical history, measurements, findings, impression, and follow-up.
 */
const sections: SectionCheck[] = [
	{
		ruleId: 'R-COMP-HISTORY-01',
		category: 'history',
		label: 'clinical history',
		present: (r) => r.clinicalHistory.trim() !== ''
	},
	{
		ruleId: 'R-COMP-MEASUREMENTS-01',
		category: 'measurements',
		label: 'measurements (visual acuity, intraocular pressure, or visual fields)',
		present: (r) =>
			r.visualAcuityRight.trim() !== '' ||
			r.visualAcuityLeft.trim() !== '' ||
			r.intraocularPressureRightMmhg !== null ||
			r.intraocularPressureLeftMmhg !== null ||
			r.visualFieldResult !== ''
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
	},
	{
		ruleId: 'R-COMP-FOLLOWUP-01',
		category: 'follow-up',
		label: 'recommended follow-up',
		present: (r) => r.recommendedFollowUp.trim() !== ''
	}
];

/**
 * Axis C — report completeness.
 *
 * Returns the percentage (0–100, rounded) of mandatory report sections that
 * are present, plus an audit-trail rule for each missing section.
 */
export function gradeCompleteness(r: EyeVisionResult): {
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
