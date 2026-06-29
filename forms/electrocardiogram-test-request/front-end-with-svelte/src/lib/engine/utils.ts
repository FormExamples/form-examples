import type {
	AppropriatenessBand,
	EcgType,
	Indication,
	KnownArrhythmia,
	PriorityBand,
	Recommendation,
	Setting,
	TriageTier,
	Urgency
} from './types';

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

/** Human-readable label for an ECG type. */
export function ecgTypeLabel(value: EcgType | string): string {
	switch (value) {
		case 'resting-12-lead':
			return 'Resting 12-lead';
		case 'exercise-stress':
			return 'Exercise stress';
		case 'ambulatory-holter-24h':
			return 'Ambulatory Holter 24h';
		case 'ambulatory-48h':
			return 'Ambulatory 48h';
		case 'event-recorder':
			return 'Event recorder';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable label for a primary indication. */
export function indicationLabel(value: Indication | string): string {
	switch (value) {
		case 'chest-pain':
			return 'Chest pain';
		case 'palpitations':
			return 'Palpitations';
		case 'syncope':
			return 'Syncope';
		case 'suspected-arrhythmia':
			return 'Suspected arrhythmia';
		case 'suspected-mi-acs':
			return 'Suspected MI / ACS';
		case 'pre-operative':
			return 'Pre-operative';
		case 'medication-monitoring-qt':
			return 'Medication monitoring (QT)';
		case 'hypertension':
			return 'Hypertension';
		case 'heart-failure':
			return 'Heart failure';
		case 'screening':
			return 'Screening';
		case 'follow-up':
			return 'Follow-up';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable label for a known / suspected arrhythmia. */
export function knownArrhythmiaLabel(value: KnownArrhythmia | string): string {
	switch (value) {
		case 'none':
			return 'None';
		case 'af':
			return 'Atrial fibrillation';
		case 'svt':
			return 'Supraventricular tachycardia';
		case 'vt':
			return 'Ventricular tachycardia';
		case 'heart-block':
			return 'Heart block';
		case 'other':
			return 'Other';
		default:
			return 'Not specified';
	}
}

/** Axis A appropriateness band display label. */
export function appropriatenessLabel(value: AppropriatenessBand | string): string {
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

/** Axis B triage-tier display label. */
export function triageTierLabel(value: TriageTier | string): string {
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

/** Axis D clinical-priority display label. */
export function priorityLabel(value: PriorityBand | string): string {
	switch (value) {
		case 'low':
			return 'Low';
		case 'moderate':
			return 'Moderate';
		case 'high':
			return 'High';
		default:
			return 'Not graded';
	}
}

/** Overall recommendation display label. */
export function recommendationLabel(value: Recommendation | string): string {
	switch (value) {
		case 'accept':
			return 'Accept and book';
		case 'query-referrer':
			return 'Query the referrer';
		case 'redirect':
			return 'Redirect';
		case 'reject':
			return 'Reject';
		default:
			return 'Not graded';
	}
}

/** Requested-urgency display label. */
export function urgencyLabel(value: Urgency | string): string {
	switch (value) {
		case 'routine':
			return 'Routine';
		case 'urgent':
			return 'Urgent';
		case 'emergency':
			return 'Emergency';
		default:
			return 'Unspecified';
	}
}

/** Care-setting display label. */
export function settingLabel(value: Setting | string): string {
	switch (value) {
		case 'outpatient':
			return 'Outpatient';
		case 'inpatient':
			return 'Inpatient';
		case 'community':
			return 'Community';
		case 'emergency':
			return 'Emergency department';
		case 'pre-operative':
			return 'Pre-operative clinic';
		default:
			return 'Unspecified';
	}
}

// ──────────────────────────────────────────────
// Display colours (Lily token utility classes)
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

/** Axis B triage-tier badge colour. */
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

/** Axis D clinical-priority badge colour. */
export function priorityColor(value: PriorityBand | string): string {
	switch (value) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
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
export function flagPriorityColor(value: string): string {
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
