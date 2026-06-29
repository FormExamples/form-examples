import type {
	AppropriatenessBand,
	PreanalyticalBand,
	TriageTier,
	Recommendation,
	SpecimenType,
	Indication
} from './types';

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

/** Human-readable specimen-type label. */
export function specimenTypeLabel(value: SpecimenType | string): string {
	switch (value) {
		case 'cervical-smear':
			return 'Cervical smear';
		case 'urine-cytology':
			return 'Urine cytology';
		case 'sputum-cytology':
			return 'Sputum cytology';
		case 'fluid-pleural-ascitic':
			return 'Fluid — pleural / ascitic';
		case 'fine-needle-aspiration-thyroid':
			return 'FNA — thyroid';
		case 'fine-needle-aspiration-breast':
			return 'FNA — breast';
		case 'csf-cytology':
			return 'CSF cytology';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable indication label. */
export function indicationLabel(value: Indication | string): string {
	switch (value) {
		case 'cervical-screening':
			return 'Cervical screening';
		case 'suspected-malignancy':
			return 'Suspected malignancy';
		case 'haematuria':
			return 'Haematuria';
		case 'effusion-investigation':
			return 'Effusion investigation';
		case 'thyroid-nodule':
			return 'Thyroid nodule';
		case 'breast-lump':
			return 'Breast lump';
		case 'follow-up':
			return 'Follow-up';
		case 'other':
			return 'Other';
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

/** Axis B pre-analytical adequacy display label. */
export function preanalyticalLabel(value: string): string {
	switch (value) {
		case 'ok':
			return 'OK';
		case 'caution':
			return 'Caution';
		case 'reject-risk':
			return 'Reject risk';
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
		case 'two-week-wait':
			return 'Two-week-wait';
		default:
			return 'Not graded';
	}
}

/** Overall recommendation display label. */
export function recommendationLabel(value: string): string {
	switch (value) {
		case 'accept':
			return 'Accept and process';
		case 'query-referrer':
			return 'Query the referrer';
		case 'redirect':
			return 'Redirect / recollect';
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

/** Axis B pre-analytical adequacy badge colour. */
export function preanalyticalColor(value: PreanalyticalBand | string): string {
	switch (value) {
		case 'ok':
			return 'bg-success text-success-content border-success';
		case 'caution':
			return 'bg-warning text-warning-content border-warning';
		case 'reject-risk':
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
		case 'two-week-wait':
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
