import type {
	AppropriatenessBand,
	EchoType,
	PriorityBand,
	PrimaryIndication,
	Recommendation,
	TriageTier
} from './types';

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

const ECHO_TYPE_LABELS: Record<string, string> = {
	'transthoracic-tte': 'Transthoracic (TTE)',
	'transoesophageal-toe': 'Transoesophageal (TOE)',
	'stress-echo': 'Stress echo',
	'contrast-echo': 'Contrast echo',
	other: 'Other'
};

/** Human-readable label for an echo type, falling back to the raw value. */
export function echoTypeLabel(value: EchoType | string): string {
	return ECHO_TYPE_LABELS[value] || value || 'Unspecified';
}

const INDICATION_LABELS: Record<string, string> = {
	'heart-failure': 'Heart failure',
	murmur: 'Murmur',
	'suspected-valve-disease': 'Suspected valve disease',
	breathlessness: 'Breathlessness',
	palpitations: 'Palpitations',
	'chest-pain': 'Chest pain',
	hypertension: 'Hypertension',
	cardiomyopathy: 'Cardiomyopathy',
	endocarditis: 'Endocarditis',
	'post-mi': 'Post-MI',
	'pulmonary-hypertension': 'Pulmonary hypertension',
	'pre-chemotherapy': 'Pre-chemotherapy / cardio-oncology',
	'stroke-tia-source': 'Stroke / TIA source',
	congenital: 'Congenital',
	'surveillance-known-disease': 'Surveillance of known disease',
	other: 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
export function indicationLabel(value: PrimaryIndication | string): string {
	return INDICATION_LABELS[value] || value || 'Unspecified';
}

/** Axis A appropriateness display label. */
export function appropriatenessLabel(value: string): string {
	switch (value) {
		case 'appropriate':
			return 'Appropriate';
		case 'may-be-appropriate':
			return 'May be appropriate';
		case 'rarely-appropriate':
			return 'Rarely appropriate';
		default:
			return 'Not graded';
	}
}

/** Axis B urgency triage-tier display label. */
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

/** Axis D clinical-priority display label. */
export function priorityLabel(value: string): string {
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
export function recommendationLabel(value: string): string {
	switch (value) {
		case 'accept':
			return 'Accept and book';
		case 'query-referrer':
			return 'Query the referrer';
		case 'redirect':
			return 'Redirect to a more suitable study';
		case 'reject':
			return 'Reject';
		default:
			return 'Not graded';
	}
}

/** NYHA functional-class display label. */
export function nyhaLabel(value: string): string {
	switch (value) {
		case 'i':
			return 'NYHA I';
		case 'ii':
			return 'NYHA II';
		case 'iii':
			return 'NYHA III';
		case 'iv':
			return 'NYHA IV';
		default:
			return 'N/A';
	}
}

// ──────────────────────────────────────────────
// Display colours (Lily token utility classes)
// ──────────────────────────────────────────────

/** Axis A appropriateness badge colour. */
export function appropriatenessColor(value: AppropriatenessBand | string): string {
	switch (value) {
		case 'appropriate':
			return 'bg-success text-success-content border-success';
		case 'may-be-appropriate':
			return 'bg-warning text-warning-content border-warning';
		case 'rarely-appropriate':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis B urgency triage-tier badge colour. */
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
