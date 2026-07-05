import type { NeurodiversityAdjustmentResponse, FiredRule } from './types';

/** A weighted mandatory section, used to compute Axis C completeness. */
interface SectionCheck {
	ruleId: string;
	weight: number;
	label: string;
	present: (r: NeurodiversityAdjustmentResponse) => boolean;
}

/**
 * The mandatory response sections and their weights, per the engine spec. The
 * decision and its rationale carry the most weight; identification and dating
 * carry the least.
 */
const sections: SectionCheck[] = [
	{
		ruleId: 'R-COMPLETE-DECISION',
		weight: 3,
		label: 'overall decision',
		present: (r) => r.overallDecision !== ''
	},
	{
		ruleId: 'R-COMPLETE-RATIONALE',
		weight: 3,
		label: 'decision rationale',
		present: (r) => r.decisionRationale.trim() !== ''
	},
	{
		ruleId: 'R-COMPLETE-AGREED-DETAIL',
		weight: 2,
		label: 'agreed-adjustments detail',
		present: (r) => r.agreedAdjustmentsDetail.trim() !== '' || r.overallDecision === 'declined'
	},
	{
		ruleId: 'R-COMPLETE-REVIEW',
		weight: 2,
		label: 'review arrangements',
		present: (r) => r.reviewScheduled === true && r.reviewDate.trim() !== ''
	},
	{
		ruleId: 'R-COMPLETE-CONTACT',
		weight: 1,
		label: 'point of contact',
		present: (r) => r.pointOfContact.trim() !== ''
	},
	{
		ruleId: 'R-COMPLETE-EFFECTIVE-DATE',
		weight: 1,
		label: 'effective date',
		present: (r) => r.effectiveDate.trim() !== ''
	},
	{
		ruleId: 'R-COMPLETE-RESPONDED-DATE',
		weight: 1,
		label: 'responded date',
		present: (r) => r.respondedDate.trim() !== ''
	},
	{
		ruleId: 'R-COMPLETE-RESPONSIBILITIES',
		weight: 1,
		label: 'responsibilities',
		present: (r) => r.responsibilitiesDetail.trim() !== ''
	},
	{
		ruleId: 'R-COMPLETE-WORKER-NAME',
		weight: 1,
		label: 'worker name',
		present: (r) => r.workerName.trim() !== ''
	},
	{
		ruleId: 'R-COMPLETE-MANAGER',
		weight: 1,
		label: 'manager / HR contact',
		present: (r) => r.managerName.trim() !== ''
	}
];

const TOTAL_WEIGHT = sections.reduce((sum, s) => sum + s.weight, 0);

/**
 * Axis C — response completeness.
 *
 * Returns the weighted percentage (0–100, rounded) of mandatory sections that
 * are present, plus an audit-trail rule for each missing section.
 */
export function gradeCompleteness(r: NeurodiversityAdjustmentResponse): {
	completenessPercent: number;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	let presentWeight = 0;

	for (const section of sections) {
		if (section.present(r)) {
			presentWeight += section.weight;
		} else {
			firedRules.push({
				ruleId: section.ruleId,
				axis: 'completeness',
				category: 'missing-field',
				description: `Mandatory response section missing: ${section.label}.`
			});
		}
	}

	const completenessPercent = Math.round((presentWeight / TOTAL_WEIGHT) * 100);
	return { completenessPercent, firedRules };
}
