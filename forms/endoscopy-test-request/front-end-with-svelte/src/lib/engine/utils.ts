import type {
	AppropriatenessBand,
	TriageTier,
	RiskBand,
	Recommendation,
	RequestedProcedure,
	PrimaryIndication
} from './types';

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

/** Human-readable label for a procedure, falling back to the raw value. */
export function procedureLabel(value: RequestedProcedure | string): string {
	switch (value) {
		case 'ogd':
			return 'OGD / gastroscopy';
		case 'gastroscopy':
			return 'Gastroscopy';
		case 'colonoscopy':
			return 'Colonoscopy';
		case 'flexible-sigmoidoscopy':
			return 'Flexible sigmoidoscopy';
		case 'ercp':
			return 'ERCP';
		case 'eus':
			return 'EUS';
		case 'capsule':
			return 'Capsule';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable label for an indication, falling back to the raw value. */
export function indicationLabel(value: PrimaryIndication | string): string {
	switch (value) {
		case 'dyspepsia':
			return 'Dyspepsia';
		case 'gord':
			return 'GORD';
		case 'dysphagia':
			return 'Dysphagia';
		case 'upper-gi-bleeding':
			return 'Upper-GI bleeding';
		case 'iron-deficiency-anaemia':
			return 'Iron-deficiency anaemia';
		case 'weight-loss':
			return 'Weight loss';
		case 'suspected-malignancy':
			return 'Suspected malignancy';
		case 'barretts-surveillance':
			return "Barrett's surveillance";
		case 'h-pylori':
			return 'H. pylori';
		case 'rectal-bleeding':
			return 'Rectal bleeding';
		case 'change-in-bowel-habit':
			return 'Change in bowel habit';
		case 'positive-fit':
			return 'Positive FIT';
		case 'ibd-surveillance':
			return 'IBD surveillance';
		case 'polyp-surveillance':
			return 'Polyp surveillance';
		case 'abnormal-imaging':
			return 'Abnormal imaging';
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

/** Axis B triage-tier display label. */
export function triageTierLabel(value: string): string {
	switch (value) {
		case 'routine':
			return 'Routine';
		case 'urgent':
			return 'Urgent';
		case 'two-week-wait':
			return 'Two-week wait';
		case 'emergency':
			return 'Emergency';
		default:
			return 'Not graded';
	}
}

/** Axis D risk-band display label. */
export function riskBandLabel(value: string): string {
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
