import type {
	ScanType,
	Indication,
	AppropriatenessBand,
	PrepSafetyBand,
	RadiationDoseBand,
	TriageTier,
	Recommendation,
	Urgency
} from './types';

export { isFdgStudy } from './safety-rules';

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

const SCAN_TYPE_LABELS: Record<string, string> = {
	'fdg-pet-ct': 'FDG-PET-CT ([18F]FDG)',
	'psma-pet': 'PSMA-PET',
	'dotatate-pet': 'DOTATATE-PET',
	'amyloid-pet': 'Amyloid-PET',
	'cardiac-pet': 'Cardiac-PET',
	other: 'Other'
};

/** Human-readable scan-type / tracer label. */
export function scanTypeLabel(value: ScanType | string): string {
	return SCAN_TYPE_LABELS[value] || value || 'Unspecified';
}

const INDICATION_LABELS: Record<string, string> = {
	'cancer-staging': 'Cancer staging',
	'cancer-restaging': 'Cancer restaging',
	'treatment-response': 'Treatment response',
	'suspected-recurrence': 'Suspected recurrence',
	'solitary-pulmonary-nodule': 'Solitary pulmonary nodule',
	lymphoma: 'Lymphoma',
	'cardiac-viability': 'Cardiac viability',
	'infection-inflammation': 'Infection / inflammation',
	'neurology-dementia': 'Neurology — dementia',
	other: 'Other'
};

/** Human-readable indication label. */
export function indicationLabel(value: Indication | string): string {
	return INDICATION_LABELS[value] || value || 'Unspecified';
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

/** Axis B preparation-safety display label. */
export function prepSafetyLabel(value: string): string {
	switch (value) {
		case 'ok':
			return 'OK';
		case 'caution':
			return 'Caution';
		case 'contraindicated':
			return 'Contraindicated';
		default:
			return 'Not graded';
	}
}

/** Axis B radiation-dose display label. */
export function radiationDoseLabel(value: string): string {
	switch (value) {
		case 'low':
			return 'Low';
		case 'moderate':
			return 'Moderate';
		case 'high':
			return 'High';
		default:
			return 'Not assessed';
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
			return 'Accept and book';
		case 'query-referrer':
			return 'Query the referrer';
		case 'redirect':
			return 'Redirect to a more suitable scan';
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

/** Axis B preparation-safety badge colour. */
export function prepSafetyColor(value: PrepSafetyBand | string): string {
	switch (value) {
		case 'ok':
			return 'bg-success text-success-content border-success';
		case 'caution':
			return 'bg-warning text-warning-content border-warning';
		case 'contraindicated':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis B radiation-dose badge colour. */
export function radiationDoseColor(value: RadiationDoseBand | string): string {
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
