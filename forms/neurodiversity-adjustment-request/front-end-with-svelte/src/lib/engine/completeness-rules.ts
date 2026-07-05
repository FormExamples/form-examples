import type { NeurodiversityAdjustmentRequest, FiredRule } from './types';
import { anyCondition, anyDifficulty, anyAdjustment } from './utils';

/** A mandatory request field, used to compute Axis C completeness. */
interface FieldCheck {
	ruleId: string;
	label: string;
	weight: number;
	present: (r: NeurodiversityAdjustmentRequest) => boolean;
}

/**
 * The mandatory request fields, weighted by importance to the request. The
 * neurodivergent profile, functional difficulties, and requested adjustments
 * are weighted highest. Completeness is the weighted percentage of fields
 * supplied.
 */
const fields: FieldCheck[] = [
	{
		ruleId: 'R-COMPLETE-CONDITIONS',
		label: 'neurodivergent profile',
		weight: 3,
		present: (r) => anyCondition(r)
	},
	{
		ruleId: 'R-COMPLETE-DIFFICULTIES',
		label: 'functional difficulties',
		weight: 3,
		present: (r) => anyDifficulty(r)
	},
	{
		ruleId: 'R-COMPLETE-ADJUSTMENTS',
		label: 'requested adjustments',
		weight: 3,
		present: (r) => anyAdjustment(r)
	},
	{
		ruleId: 'R-COMPLETE-TASKS',
		label: 'tasks and situations affected',
		weight: 2,
		present: (r) => r.tasksSituationsAffected.trim() !== ''
	},
	{
		ruleId: 'R-COMPLETE-CONSENT',
		label: 'disclosure consent',
		weight: 2,
		present: (r) => r.disclosureConsent === true
	},
	{
		ruleId: 'R-COMPLETE-WORKER-NAME',
		label: 'worker name',
		weight: 1,
		present: (r) => r.workerName.trim() !== ''
	},
	{
		ruleId: 'R-COMPLETE-JOB-TITLE',
		label: 'job title',
		weight: 1,
		present: (r) => r.workerJobTitle.trim() !== ''
	},
	{
		ruleId: 'R-COMPLETE-MANAGER',
		label: 'manager / HR contact',
		weight: 1,
		present: (r) => r.managerName.trim() !== ''
	},
	{
		ruleId: 'R-COMPLETE-REQUEST-DATE',
		label: 'request date',
		weight: 1,
		present: (r) => r.requestDate.trim() !== ''
	},
	{
		ruleId: 'R-COMPLETE-ADJUSTMENTS-DETAIL',
		label: 'requested-adjustments detail',
		weight: 1,
		present: (r) => r.adjustmentsRequestedDetail.trim() !== ''
	}
];

/**
 * Axis C — request completeness.
 *
 * Returns the weighted percentage (0–100, rounded) of mandatory request fields
 * that are present, plus an audit-trail rule for each missing field.
 */
export function gradeCompleteness(r: NeurodiversityAdjustmentRequest): {
	completenessPercent: number;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const totalWeight = fields.reduce((sum, f) => sum + f.weight, 0);
	let presentWeight = 0;

	for (const field of fields) {
		if (field.present(r)) {
			presentWeight += field.weight;
		} else {
			firedRules.push({
				ruleId: field.ruleId,
				axis: 'completeness',
				category: 'missing-field',
				description: `Mandatory field missing: ${field.label}.`
			});
		}
	}

	const completenessPercent = Math.round((presentWeight / totalWeight) * 100);
	return { completenessPercent, firedRules };
}
