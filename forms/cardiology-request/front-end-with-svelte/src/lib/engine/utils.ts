import type {
	CardiologyRequest,
	AppropriatenessBand,
	SafetyBand,
	TriageTier,
	Recommendation,
	RequestedService,
	ReferralReason,
	RequestStatus
} from './types';

// ──────────────────────────────────────────────
// Red-flag predicates
// ──────────────────────────────────────────────

/**
 * Any acute red flag (suspected acute coronary syndrome, exertional syncope, or
 * new-onset heart failure) drives the safety axis and auto-escalates the triage
 * tier. Mirrors the back-end invariant.
 */
export function hasRedFlag(r: CardiologyRequest): boolean {
	return r.suspectedAcs || r.exertionalSyncope || r.newOnsetHeartFailure;
}

/** Whether the referral describes typical-angina chest pain (a near-red-flag). */
export function hasTypicalAngina(r: CardiologyRequest): boolean {
	return r.symptomChestPain && r.chestPainCharacter === 'typical-angina';
}

/** Whether the requested service matches the typical service for the reason. */
export function serviceMatchesReason(r: CardiologyRequest): boolean {
	const map: Partial<Record<ReferralReason, RequestedService[]>> = {
		'chest-pain': ['rapid-access-chest-pain', 'general-cardiology'],
		breathlessness: ['heart-failure', 'general-cardiology'],
		'heart-failure-symptoms': ['heart-failure', 'general-cardiology'],
		palpitations: ['arrhythmia-ep', 'general-cardiology'],
		arrhythmia: ['arrhythmia-ep', 'general-cardiology'],
		syncope: ['arrhythmia-ep', 'general-cardiology'],
		'murmur-or-valve': ['valve-clinic', 'general-cardiology'],
		'abnormal-ecg': ['general-cardiology', 'arrhythmia-ep'],
		hypertension: ['general-cardiology'],
		'pre-operative-assessment': ['pre-operative-cardiac', 'general-cardiology']
	};
	const allowed = map[r.referralReason];
	if (!allowed) return false;
	return allowed.includes(r.requestedService);
}

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

/** Axis A appropriateness display label. */
export function appropriatenessLabel(value: string): string {
	switch (value) {
		case 'usually-appropriate':
			return 'Usually appropriate';
		case 'may-be-appropriate':
			return 'May be appropriate';
		case 'usually-not-appropriate':
			return 'Usually not appropriate';
		default:
			return 'Not graded';
	}
}

/** Axis B safety display label. */
export function safetyLabel(value: string): string {
	switch (value) {
		case 'ok':
			return 'OK';
		case 'caution':
			return 'Caution';
		case 'red-flag':
			return 'Red flag';
		default:
			return 'Not graded';
	}
}

/** Axis D triage-tier display label. */
export function triageTierLabel(value: string): string {
	switch (value) {
		case 'routine':
			return 'Routine';
		case 'urgent':
			return 'Urgent';
		case 'emergency':
			return 'Emergency';
		default:
			return 'Not graded';
	}
}

/** Overall recommendation display label. */
export function recommendationLabel(value: string): string {
	switch (value) {
		case 'accept':
			return 'Accept';
		case 'query-referrer':
			return 'Query referrer';
		case 'redirect':
			return 'Redirect';
		case 'reject':
			return 'Reject';
		default:
			return 'Not graded';
	}
}

/** Human-readable requested-service label. */
export function requestedServiceLabel(value: RequestedService | string): string {
	switch (value) {
		case 'general-cardiology':
			return 'General cardiology';
		case 'rapid-access-chest-pain':
			return 'Rapid-access chest-pain clinic';
		case 'heart-failure':
			return 'Heart-failure clinic';
		case 'arrhythmia-ep':
			return 'Arrhythmia / EP clinic';
		case 'valve-clinic':
			return 'Valve clinic';
		case 'inherited-cardiac-conditions':
			return 'Inherited cardiac conditions';
		case 'pre-operative-cardiac':
			return 'Pre-operative cardiac';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable referral-reason label. */
export function referralReasonLabel(value: ReferralReason | string): string {
	switch (value) {
		case 'chest-pain':
			return 'Chest pain';
		case 'breathlessness':
			return 'Breathlessness';
		case 'palpitations':
			return 'Palpitations';
		case 'syncope':
			return 'Syncope';
		case 'heart-failure-symptoms':
			return 'Heart-failure symptoms';
		case 'murmur-or-valve':
			return 'Murmur / valve disease';
		case 'abnormal-ecg':
			return 'Abnormal ECG';
		case 'hypertension':
			return 'Hypertension';
		case 'arrhythmia':
			return 'Arrhythmia';
		case 'pre-operative-assessment':
			return 'Pre-operative assessment';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable request-status label. */
export function statusLabel(value: RequestStatus | string): string {
	switch (value) {
		case 'draft':
			return 'Draft';
		case 'submitted':
			return 'Submitted';
		case 'triaged':
			return 'Triaged';
		case 'accepted':
			return 'Accepted';
		case 'redirected':
			return 'Redirected';
		case 'rejected':
			return 'Rejected';
		default:
			return 'Unspecified';
	}
}

// ──────────────────────────────────────────────
// Display colours (Tailwind utility classes)
// ──────────────────────────────────────────────

/** Axis A appropriateness badge colour. */
export function appropriatenessColor(value: AppropriatenessBand | string): string {
	switch (value) {
		case 'usually-appropriate':
			return 'bg-success text-success-content border-success';
		case 'may-be-appropriate':
			return 'bg-warning text-warning-content border-warning';
		case 'usually-not-appropriate':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis B safety badge colour. */
export function safetyColor(value: SafetyBand | string): string {
	switch (value) {
		case 'ok':
			return 'bg-success text-success-content border-success';
		case 'caution':
			return 'bg-warning text-warning-content border-warning';
		case 'red-flag':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis D triage-tier badge colour. */
export function triageTierColor(value: TriageTier | string): string {
	switch (value) {
		case 'routine':
			return 'bg-success text-success-content border-success';
		case 'urgent':
			return 'bg-warning text-warning-content border-warning';
		case 'emergency':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Overall recommendation badge colour. */
export function recommendationColor(value: Recommendation | string): string {
	switch (value) {
		case 'accept':
			return 'bg-success text-success-content border-success';
		case 'query-referrer':
			return 'bg-info text-info-content border-info';
		case 'redirect':
			return 'bg-warning text-warning-content border-warning';
		case 'reject':
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
