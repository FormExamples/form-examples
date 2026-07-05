import type {
	NeurodiversityAdjustmentResponse,
	OutcomeClassification,
	LegalRiskBand,
	FollowUpUrgency,
	OverallDecision,
	DeclineReasonCategory,
	ResponseStatus,
	HandlingMethod,
	ManagerRole,
	Recommendation
} from './types';

// ──────────────────────────────────────────────
// Derived predicates (shared by every axis)
// ──────────────────────────────────────────────

/** Any of the eight agreed-adjustment categories is true. */
export function anyAgreed(r: NeurodiversityAdjustmentResponse): boolean {
	return (
		r.agreedWorkingEnvironment ||
		r.agreedEquipmentTechnology ||
		r.agreedWorkingArrangements ||
		r.agreedCommunication ||
		r.agreedSupportMentoring ||
		r.agreedRecruitmentProcess ||
		r.agreedPolicyDress ||
		r.agreedOther
	);
}

/** An alternative adjustment has been offered (free-text present). */
export function hasAlternative(r: NeurodiversityAdjustmentResponse): boolean {
	return r.alternativeAdjustmentsDetail.trim() !== '';
}

/**
 * A decline is justified when a rationale is recorded AND the reasonableness
 * category is neither empty nor the weakest ground ('not-reasonable').
 */
export function declineJustified(r: NeurodiversityAdjustmentResponse): boolean {
	return (
		r.decisionRationale.trim() !== '' &&
		r.declineReasonCategory !== '' &&
		r.declineReasonCategory !== 'not-reasonable'
	);
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

/** Axis A outcome-classification display label. */
export function outcomeClassificationLabel(value: string): string {
	switch (value) {
		case 'fully-agreed':
			return 'Fully agreed';
		case 'partially-agreed':
			return 'Partially agreed';
		case 'alternative-offered':
			return 'Alternative offered';
		case 'declined':
			return 'Declined';
		case 'deferred':
			return 'Deferred';
		default:
			return 'Not graded';
	}
}

/** Axis B legal-risk-band display label. */
export function legalRiskBandLabel(value: string): string {
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

/** Axis D follow-up-urgency display label. */
export function followUpUrgencyLabel(value: string): string {
	switch (value) {
		case 'none':
			return 'None';
		case 'review-scheduled':
			return 'Review scheduled';
		case 'urgent-review':
			return 'Urgent review';
		case 'escalation-needed':
			return 'Escalation needed';
		default:
			return 'Not graded';
	}
}

/** Overall-recommendation display label (matches the engine spec). */
export function recommendationLabel(value: Recommendation | string): string {
	switch (value) {
		case 'implement':
			return 'Implement the agreed adjustments';
		case 'schedule-review':
			return 'Schedule a review';
		case 'seek-occupational-health':
			return 'Seek an occupational-health assessment';
		case 'reconsider-decision':
			return 'Reconsider the decision';
		case 'escalate-to-hr':
			return 'Escalate to HR';
		default:
			return 'No recommendation';
	}
}

/** Human-readable overall-decision label. */
export function overallDecisionLabel(value: OverallDecision | string): string {
	switch (value) {
		case 'agreed':
			return 'Agreed';
		case 'partially-agreed':
			return 'Partially agreed';
		case 'alternative-offered':
			return 'Alternative offered';
		case 'declined':
			return 'Declined';
		case 'deferred':
			return 'Deferred';
		default:
			return 'Not recorded';
	}
}

/** Human-readable decline-reason-category label. */
export function declineReasonCategoryLabel(value: DeclineReasonCategory | string): string {
	switch (value) {
		case 'not-reasonable':
			return 'Not reasonable';
		case 'disproportionate-cost':
			return 'Disproportionate cost';
		case 'health-and-safety':
			return 'Health and safety';
		case 'operational-impact':
			return 'Operational impact';
		case 'alternative-provided':
			return 'Alternative provided';
		case 'insufficient-information':
			return 'Insufficient information';
		case 'none':
			return 'None';
		default:
			return 'Not applicable';
	}
}

/** Human-readable response-status label. */
export function responseStatusLabel(value: ResponseStatus | string): string {
	switch (value) {
		case 'draft':
			return 'Draft';
		case 'agreed':
			return 'Agreed';
		case 'partially-agreed':
			return 'Partially agreed';
		case 'trial':
			return 'Trial';
		case 'declined':
			return 'Declined';
		case 'deferred':
			return 'Deferred';
		case 'cancelled':
			return 'Cancelled';
		default:
			return 'Unspecified';
	}
}

/** Human-readable handling-method label. */
export function handlingMethodLabel(value: HandlingMethod | string): string {
	switch (value) {
		case 'meeting':
			return 'Meeting';
		case 'occupational-health-referral':
			return 'Occupational-health referral';
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

/** Axis A outcome-classification badge colour. */
export function outcomeClassificationColor(value: OutcomeClassification | string): string {
	switch (value) {
		case 'fully-agreed':
			return 'bg-success text-success-content border-success';
		case 'partially-agreed':
		case 'alternative-offered':
			return 'bg-warning text-warning-content border-warning';
		case 'declined':
			return 'bg-error text-error-content border-error';
		case 'deferred':
			return 'bg-info text-info-content border-info';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis B legal-risk-band badge colour. */
export function legalRiskBandColor(value: LegalRiskBand | string): string {
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

/** Axis D follow-up-urgency badge colour. */
export function followUpUrgencyColor(value: FollowUpUrgency | string): string {
	switch (value) {
		case 'none':
			return 'bg-success text-success-content border-success';
		case 'review-scheduled':
			return 'bg-info text-info-content border-info';
		case 'urgent-review':
			return 'bg-warning text-warning-content border-warning';
		case 'escalation-needed':
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
