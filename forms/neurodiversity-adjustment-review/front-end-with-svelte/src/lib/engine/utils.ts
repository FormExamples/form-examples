import type {
	NeurodiversityAdjustmentReview,
	EffectivenessRating,
	EffectivenessBand,
	WellbeingRiskBand,
	NextStepUrgency,
	ReviewStatus,
	ReviewMethod,
	ManagerRole,
	WorkerSatisfied,
	WellbeingChange,
	Recommendation
} from './types';

// ──────────────────────────────────────────────
// Derived predicates (shared by every axis)
// ──────────────────────────────────────────────

/** The eight per-category effectiveness field values, in a stable order. */
export function effValues(r: NeurodiversityAdjustmentReview): EffectivenessRating[] {
	return [
		r.effectivenessWorkingEnvironment,
		r.effectivenessEquipmentTechnology,
		r.effectivenessWorkingArrangements,
		r.effectivenessCommunication,
		r.effectivenessSupportMentoring,
		r.effectivenessRecruitmentProcess,
		r.effectivenessPolicyDress,
		r.effectivenessOther
	];
}

/**
 * Effectiveness values for adjustments actually in place: working-well, partial,
 * or not-working (excludes '' unanswered and 'not-in-place').
 */
export function ratedValues(r: NeurodiversityAdjustmentReview): EffectivenessRating[] {
	return effValues(r).filter(
		(v) => v === 'working-well' || v === 'partial' || v === 'not-working'
	);
}

/** Number of adjustments in place that have been rated. */
export function ratedCount(r: NeurodiversityAdjustmentReview): number {
	return ratedValues(r).length;
}

/** Number of rated adjustments that are working well. */
export function workingWellCount(r: NeurodiversityAdjustmentReview): number {
	return ratedValues(r).filter((v) => v === 'working-well').length;
}

/** Any rated adjustment is not working. */
export function anyNotWorking(r: NeurodiversityAdjustmentReview): boolean {
	return ratedValues(r).some((v) => v === 'not-working');
}

/** Any of the eight effectiveness fields has been answered. */
export function anyEffectivenessAnswered(r: NeurodiversityAdjustmentReview): boolean {
	return effValues(r).some((v) => v !== '');
}

/**
 * Whole calendar days between two ISO `YYYY-MM-DD` strings (b − a). Returns null
 * if either date is empty or unparseable, so callers can skip the rule.
 */
export function daysBetween(a: string, b: string): number | null {
	if (!a || !b) return null;
	const ta = Date.parse(`${a}T00:00:00Z`);
	const tb = Date.parse(`${b}T00:00:00Z`);
	if (Number.isNaN(ta) || Number.isNaN(tb)) return null;
	return Math.round((tb - ta) / 86_400_000);
}

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

/** Axis A effectiveness-band display label. */
export function effectivenessBandLabel(value: string): string {
	switch (value) {
		case 'effective':
			return 'Effective';
		case 'partially-effective':
			return 'Partially effective';
		case 'ineffective':
			return 'Ineffective';
		case 'not-yet-assessed':
			return 'Not yet assessed';
		default:
			return 'Not graded';
	}
}

/** Axis B wellbeing-risk-band display label. */
export function wellbeingRiskBandLabel(value: string): string {
	switch (value) {
		case 'ok':
			return 'OK';
		case 'caution':
			return 'Caution';
		case 'high-risk':
			return 'High risk';
		default:
			return 'Not graded';
	}
}

/** Axis D next-step-urgency display label. */
export function nextStepUrgencyLabel(value: string): string {
	switch (value) {
		case 'none':
			return 'None';
		case 'review-scheduled':
			return 'Review scheduled';
		case 'adjust-now':
			return 'Adjust now';
		case 'escalate':
			return 'Escalate';
		default:
			return 'Not graded';
	}
}

/** Overall-recommendation display label (matches the engine spec). */
export function recommendationLabel(value: Recommendation | string): string {
	switch (value) {
		case 'maintain':
			return 'Maintain the current adjustments';
		case 'adjust-adjustments':
			return 'Adjust the adjustments';
		case 'seek-occupational-health':
			return 'Seek an occupational-health assessment';
		case 'schedule-next-review':
			return 'Schedule the next review';
		case 'escalate-to-hr':
			return 'Escalate to HR';
		default:
			return 'No recommendation';
	}
}

/** Human-readable per-category effectiveness label. */
export function effectivenessRatingLabel(value: EffectivenessRating | string): string {
	switch (value) {
		case 'working-well':
			return 'Working well';
		case 'partial':
			return 'Partially working';
		case 'not-working':
			return 'Not working';
		case 'not-in-place':
			return 'Not in place';
		default:
			return 'Not rated';
	}
}

/** Human-readable worker-satisfaction label. */
export function workerSatisfiedLabel(value: WorkerSatisfied | string): string {
	switch (value) {
		case 'yes':
			return 'Satisfied';
		case 'partially':
			return 'Partially satisfied';
		case 'no':
			return 'Not satisfied';
		default:
			return 'Not recorded';
	}
}

/** Human-readable wellbeing-change label. */
export function wellbeingChangeLabel(value: WellbeingChange | string): string {
	switch (value) {
		case 'improved':
			return 'Improved';
		case 'unchanged':
			return 'Unchanged';
		case 'worse':
			return 'Worse';
		default:
			return 'Not recorded';
	}
}

/** Human-readable review-status label. */
export function reviewStatusLabel(value: ReviewStatus | string): string {
	switch (value) {
		case 'draft':
			return 'Draft';
		case 'completed':
			return 'Completed';
		case 'changes-agreed':
			return 'Changes agreed';
		case 'escalated':
			return 'Escalated';
		case 'cancelled':
			return 'Cancelled';
		default:
			return 'Unspecified';
	}
}

/** Human-readable review-method label. */
export function reviewMethodLabel(value: ReviewMethod | string): string {
	switch (value) {
		case 'meeting':
			return 'Meeting';
		case 'occupational-health-review':
			return 'Occupational-health review';
		case 'email':
			return 'Email';
		case 'hr-review':
			return 'HR review';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable manager / HR role label. */
export function managerRoleLabel(value: ManagerRole | string): string {
	switch (value) {
		case 'line-manager':
			return 'Line manager';
		case 'hr-adviser':
			return 'HR adviser';
		case 'occupational-health':
			return 'Occupational health';
		case 'diversity-lead':
			return 'Diversity lead';
		case 'senior-manager':
			return 'Senior manager';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

// ──────────────────────────────────────────────
// Display colours (Tailwind / Lily utility classes)
// ──────────────────────────────────────────────

/** Axis A effectiveness-band badge colour. */
export function effectivenessBandColor(value: EffectivenessBand | string): string {
	switch (value) {
		case 'effective':
			return 'bg-success text-success-content border-success';
		case 'partially-effective':
			return 'bg-warning text-warning-content border-warning';
		case 'ineffective':
			return 'bg-error text-error-content border-error';
		case 'not-yet-assessed':
			return 'bg-info text-info-content border-info';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis B wellbeing-risk-band badge colour. */
export function wellbeingRiskBandColor(value: WellbeingRiskBand | string): string {
	switch (value) {
		case 'ok':
			return 'bg-success text-success-content border-success';
		case 'caution':
			return 'bg-warning text-warning-content border-warning';
		case 'high-risk':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis D next-step-urgency badge colour. */
export function nextStepUrgencyColor(value: NextStepUrgency | string): string {
	switch (value) {
		case 'none':
			return 'bg-success text-success-content border-success';
		case 'review-scheduled':
			return 'bg-info text-info-content border-info';
		case 'adjust-now':
			return 'bg-warning text-warning-content border-warning';
		case 'escalate':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Flag-priority badge colour. */
export function priorityColor(value: string): string {
	switch (value) {
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-base-300 text-base-content border-base-300';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}
