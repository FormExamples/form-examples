import type {
	AppropriatenessBand,
	TriageTier,
	PriorityBand,
	Recommendation,
	EegType,
	Indication,
	Setting
} from './types';

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

/** Human-readable label for an EEG type. */
export function eegTypeLabel(value: EegType | string): string {
	switch (value) {
		case 'routine-awake':
			return 'Routine awake';
		case 'sleep-deprived':
			return 'Sleep-deprived';
		case 'ambulatory-24h':
			return 'Ambulatory 24-hour';
		case 'video-telemetry':
			return 'Video-telemetry';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable label for a primary indication. */
export function indicationLabel(value: Indication | string): string {
	switch (value) {
		case 'suspected-epilepsy':
			return 'Suspected epilepsy';
		case 'seizure-classification':
			return 'Seizure classification';
		case 'status-epilepticus':
			return 'Status epilepticus';
		case 'encephalopathy':
			return 'Encephalopathy';
		case 'first-seizure':
			return 'First seizure';
		case 'funny-turns':
			return 'Funny turns';
		case 'dementia':
			return 'Dementia';
		case 'pre-surgical-evaluation':
			return 'Pre-surgical evaluation';
		case 'medication-review':
			return 'Medication review';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Care-setting label. */
export function settingLabel(value: Setting | string): string {
	switch (value) {
		case 'outpatient':
			return 'Outpatient';
		case 'inpatient':
			return 'Inpatient';
		case 'community':
			return 'Community';
		case 'emergency':
			return 'Emergency';
		default:
			return 'Unspecified';
	}
}

/** Axis A appropriateness display label. */
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

/** Axis B urgency / triage-tier display label. */
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
export function priorityBandLabel(value: PriorityBand | string): string {
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

/** Axis B urgency / triage-tier badge colour. */
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
export function priorityBandColor(value: PriorityBand | string): string {
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
