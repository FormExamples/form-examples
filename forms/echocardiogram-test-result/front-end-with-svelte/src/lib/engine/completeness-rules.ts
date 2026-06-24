import type { EchocardiogramResult, FiredRule } from './types';

/** A mandatory report section, used to compute Axis C completeness. */
interface SectionCheck {
	ruleId: string;
	category: string;
	label: string;
	present: (r: EchocardiogramResult) => boolean;
}

/**
 * The six mandatory report sections per the British Society of Echocardiography
 * minimum dataset: clinical history, LV function, valves, pulmonary pressure,
 * findings narrative, and impression.
 */
const sections: SectionCheck[] = [
	{
		ruleId: 'R-COMP-HISTORY-01',
		category: 'history',
		label: 'clinical history',
		present: (r) => r.clinicalHistory.trim() !== ''
	},
	{
		ruleId: 'R-COMP-LV-FUNCTION-01',
		category: 'lv-function',
		label: 'left-ventricular function',
		present: (r) => r.lvFunction !== '' || r.lvEjectionFractionPercent !== null
	},
	{
		ruleId: 'R-COMP-VALVES-01',
		category: 'valves',
		label: 'valve assessment',
		present: (r) =>
			r.aorticStenosis !== '' ||
			r.aorticRegurgitation !== '' ||
			r.mitralStenosis !== '' ||
			r.mitralRegurgitation !== ''
	},
	{
		ruleId: 'R-COMP-PULMONARY-01',
		category: 'pulmonary-pressure',
		label: 'pulmonary artery systolic pressure',
		present: (r) => r.pulmonaryArterySystolicPressureMmhg !== null
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
export function gradeCompleteness(r: EchocardiogramResult): {
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
