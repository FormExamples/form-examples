import type {
	AppropriatenessBand,
	MatchFit,
	TriageTier,
	PriorityBand,
	Recommendation,
	MonitorType,
	PrimaryIndication,
	SymptomFrequency,
	KnownArrhythmia,
	Setting
} from './types';

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

/** Human-readable monitor-type label. */
export function monitorTypeLabel(value: MonitorType | string): string {
	switch (value) {
		case '24-hour':
			return '24-hour Holter';
		case '48-hour':
			return '48-hour Holter';
		case '7-day':
			return '7-day monitor';
		case '14-day':
			return '14-day monitor';
		case 'event-recorder':
			return 'Event recorder';
		case 'implantable-loop-recorder':
			return 'Implantable loop recorder';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable primary-indication label. */
export function indicationLabel(value: PrimaryIndication | string): string {
	switch (value) {
		case 'palpitations':
			return 'Palpitations';
		case 'suspected-arrhythmia':
			return 'Suspected arrhythmia';
		case 'syncope':
			return 'Syncope';
		case 'atrial-fibrillation-detection':
			return 'Atrial-fibrillation detection';
		case 'post-stroke-af-screen':
			return 'Post-stroke AF screen';
		case 'rate-control-assessment':
			return 'Rate-control assessment';
		case 'qt-monitoring':
			return 'QT monitoring';
		case 'pacemaker-check':
			return 'Pacemaker check';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable symptom-frequency label. */
export function frequencyLabel(value: SymptomFrequency | string): string {
	switch (value) {
		case 'daily':
			return 'Daily / near-daily';
		case 'weekly':
			return 'Weekly';
		case 'monthly':
			return 'Monthly';
		case 'rare':
			return 'Rare (< monthly)';
		default:
			return 'Not specified';
	}
}

/** Human-readable known-arrhythmia label. */
export function arrhythmiaLabel(value: KnownArrhythmia | string): string {
	switch (value) {
		case 'atrial-fibrillation':
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
			return 'None recorded';
	}
}

/** Human-readable setting label. */
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

/** Axis A appropriateness-band display label. */
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

/** Axis A.2 symptom-frequency / monitor match-fit display label. */
export function matchFitLabel(value: MatchFit | string): string {
	switch (value) {
		case 'matched':
			return 'Matched';
		case 'borderline':
			return 'Borderline';
		case 'mismatched':
			return 'Mismatched';
		default:
			return 'Not assessed';
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
			return 'Redirect to a more suitable monitor';
		case 'reject':
			return 'Reject';
		default:
			return 'Not graded';
	}
}

// ──────────────────────────────────────────────
// Display colours (Lily token utility classes)
// ──────────────────────────────────────────────

/** Axis A appropriateness-band badge colour. */
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

/** Axis A.2 match-fit badge colour. */
export function matchFitColor(value: MatchFit | string): string {
	switch (value) {
		case 'matched':
			return 'bg-success text-success-content border-success';
		case 'borderline':
			return 'bg-warning text-warning-content border-warning';
		case 'mismatched':
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
