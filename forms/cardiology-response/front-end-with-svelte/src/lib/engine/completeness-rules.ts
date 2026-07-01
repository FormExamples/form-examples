import type { CardiologyResponse, FiredRule } from './types';

/** A mandatory response section, used to compute Axis C completeness. */
interface SectionCheck {
	ruleId: string;
	category: string;
	label: string;
	present: (r: CardiologyResponse) => boolean;
}

/**
 * The five mandatory response sections per the NHS e-Referral advice-and-
 * guidance / counter-referral model: clinical summary, examination, diagnosis,
 * management plan, and recommended follow-up.
 */
const sections: SectionCheck[] = [
	{
		ruleId: 'R-COMP-SUMMARY-01',
		category: 'summary',
		label: 'clinical summary',
		present: (r) => r.clinicalSummary.trim() !== ''
	},
	{
		ruleId: 'R-COMP-EXAMINATION-01',
		category: 'examination',
		label: 'examination findings',
		present: (r) => r.examinationFindings.trim() !== ''
	},
	{
		ruleId: 'R-COMP-DIAGNOSIS-01',
		category: 'diagnosis',
		label: 'diagnosis',
		present: (r) => r.primaryDiagnosisCategory !== '' || r.diagnosisNarrative.trim() !== ''
	},
	{
		ruleId: 'R-COMP-MANAGEMENT-01',
		category: 'management',
		label: 'management plan',
		present: (r) => r.managementPlan.trim() !== ''
	},
	{
		ruleId: 'R-COMP-FOLLOWUP-01',
		category: 'follow-up',
		label: 'recommended follow-up',
		present: (r) => r.recommendedFollowUp.trim() !== ''
	}
];

/**
 * Axis C — response completeness.
 *
 * Returns the percentage (0–100, rounded) of mandatory response sections that
 * are present, plus an audit-trail rule for each missing section.
 */
export function gradeCompleteness(r: CardiologyResponse): {
	completenessPercent: number;
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
				description: `Mandatory response section missing: ${section.label}.`
			});
		}
	}

	const completenessPercent = Math.round((presentCount / sections.length) * 100);
	return { completenessPercent, firedRules };
}
