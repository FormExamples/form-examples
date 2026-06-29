import type {
	AppropriatenessBand,
	TriageTier,
	RiskBand,
	Recommendation,
	Procedure,
	Indication
} from './types';

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

/** Human-readable procedure label. */
export function procedureLabel(value: Procedure | string): string {
	switch (value) {
		case 'flexible-bronchoscopy':
			return 'Flexible bronchoscopy';
		case 'ebus':
			return 'EBUS (endobronchial ultrasound)';
		case 'rigid-bronchoscopy':
			return 'Rigid bronchoscopy';
		case 'bronchoalveolar-lavage':
			return 'Bronchoalveolar lavage';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable indication label. */
export function indicationLabel(value: Indication | string): string {
	switch (value) {
		case 'suspected-lung-cancer':
			return 'Suspected lung cancer';
		case 'haemoptysis':
			return 'Haemoptysis';
		case 'persistent-cough':
			return 'Persistent cough';
		case 'lung-mass-on-imaging':
			return 'Lung mass on imaging';
		case 'mediastinal-lymphadenopathy':
			return 'Mediastinal lymphadenopathy';
		case 'infection-sampling':
			return 'Infection sampling';
		case 'foreign-body':
			return 'Foreign body';
		case 'stridor':
			return 'Stridor';
		case 'other':
			return 'Other';
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

/** Axis B triage-tier display label. */
export function triageTierLabel(value: TriageTier | string): string {
	switch (value) {
		case 'routine':
			return 'Routine';
		case 'urgent':
			return 'Urgent';
		case 'two-week-wait':
			return 'Two-week-wait';
		case 'emergency':
			return 'Emergency';
		default:
			return 'Not graded';
	}
}

/** Axis D pre-procedure risk display label. */
export function riskBandLabel(value: RiskBand | string): string {
	switch (value) {
		case 'low':
			return 'Low risk';
		case 'moderate':
			return 'Moderate risk';
		case 'high':
			return 'High risk';
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
			return 'Redirect to a more suitable procedure';
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

/** Axis B triage-tier badge colour. */
export function triageTierColor(value: TriageTier | string): string {
	switch (value) {
		case 'routine':
			return 'bg-success text-success-content border-success';
		case 'urgent':
			return 'bg-warning text-warning-content border-warning';
		case 'two-week-wait':
			return 'bg-info text-info-content border-info';
		case 'emergency':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis D risk-band badge colour. */
export function riskBandColor(value: RiskBand | string): string {
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
