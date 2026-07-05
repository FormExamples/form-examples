import type { NeurodiversityAdjustmentReview, FiredRule } from './types';
import { anyEffectivenessAnswered } from './utils';

/** A weighted mandatory section, used to compute Axis C completeness. */
interface SectionCheck {
	ruleId: string;
	weight: number;
	label: string;
	present: (r: NeurodiversityAdjustmentReview) => boolean;
}

/**
 * The mandatory review sections and their weights, per the engine spec. The
 * effectiveness ratings and the worker's own feedback carry the most weight;
 * identification and dating carry the least. Total weight 17.
 */
const sections: SectionCheck[] = [
	{
		ruleId: 'R-COMPLETE-EFFECTIVENESS',
		weight: 3,
		label: 'effectiveness ratings',
		present: (r) => anyEffectivenessAnswered(r)
	},
	{
		ruleId: 'R-COMPLETE-WORKER-FEEDBACK',
		weight: 3,
		label: 'worker feedback',
		present: (r) => r.workerFeedback.trim() !== ''
	},
	{
		ruleId: 'R-COMPLETE-SATISFACTION',
		weight: 2,
		label: 'worker satisfaction',
		present: (r) => r.workerSatisfied !== ''
	},
	{
		ruleId: 'R-COMPLETE-WELLBEING',
		weight: 2,
		label: 'wellbeing change',
		present: (r) => r.wellbeingChange !== ''
	},
	{
		ruleId: 'R-COMPLETE-NEXT-REVIEW',
		weight: 2,
		label: 'next review date',
		present: (r) => r.nextReviewDate.trim() !== ''
	},
	{
		ruleId: 'R-COMPLETE-REVIEW-DATE',
		weight: 1,
		label: 'review date',
		present: (r) => r.reviewDate.trim() !== ''
	},
	{
		ruleId: 'R-COMPLETE-METHOD',
		weight: 1,
		label: 'review method',
		present: (r) => r.reviewMethod !== ''
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
	},
	{
		ruleId: 'R-COMPLETE-STATUS',
		weight: 1,
		label: 'review status',
		present: (r) => r.reviewStatus !== ''
	}
];

const TOTAL_WEIGHT = sections.reduce((sum, s) => sum + s.weight, 0);

/**
 * Axis C — review completeness.
 *
 * Returns the weighted percentage (0–100, rounded) of mandatory sections that
 * are present, plus an audit-trail rule for each missing section.
 */
export function gradeCompleteness(r: NeurodiversityAdjustmentReview): {
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
				description: `Mandatory review section missing: ${section.label}.`
			});
		}
	}

	const completenessPercent = Math.round((presentWeight / TOTAL_WEIGHT) * 100);
	return { completenessPercent, firedRules };
}
