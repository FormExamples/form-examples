// ──────────────────────────────────────────────
// Display labels and badge colours for the Colonoscopy Test Request.
//
// Colours use Lily Design System token utilities only
// (success / warning / error / info / base-300) — never raw palette classes.
// ──────────────────────────────────────────────

import type {
	AppropriatenessBand,
	TriageTier,
	RiskBand,
	Recommendation,
	Procedure,
	Indication,
	Setting,
	AsaGrade
} from './types';

// ─── Display labels ───

/** Human-readable procedure label. */
export function procedureLabel(value: Procedure | string): string {
	switch (value) {
		case 'colonoscopy':
			return 'Colonoscopy';
		case 'flexible-sigmoidoscopy':
			return 'Flexible sigmoidoscopy';
		case 'ct-colonography':
			return 'CT colonography';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable indication label. */
export function indicationLabel(value: Indication | string): string {
	switch (value) {
		case 'rectal-bleeding':
			return 'Rectal bleeding';
		case 'change-in-bowel-habit':
			return 'Change in bowel habit';
		case 'iron-deficiency-anaemia':
			return 'Iron-deficiency anaemia';
		case 'positive-fit':
			return 'Positive FIT';
		case 'abdominal-mass':
			return 'Abdominal / rectal mass';
		case 'ibd-diagnosis':
			return 'IBD diagnosis';
		case 'ibd-surveillance':
			return 'IBD surveillance';
		case 'polyp-surveillance':
			return 'Polyp surveillance';
		case 'crc-screening':
			return 'CRC screening';
		case 'abnormal-imaging':
			return 'Abnormal imaging';
		case 'chronic-diarrhoea':
			return 'Chronic diarrhoea';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable care-setting label. */
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

/** Human-readable ASA grade label. */
export function asaLabel(value: AsaGrade | string): string {
	switch (value) {
		case 'I':
			return 'I — Normal healthy patient';
		case 'II':
			return 'II — Mild systemic disease';
		case 'III':
			return 'III — Severe systemic disease';
		case 'IV':
			return 'IV — Severe disease, constant threat to life';
		case 'V':
			return 'V — Moribund';
		default:
			return 'Not recorded';
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

/** Axis D risk-band display label. */
export function riskLabel(value: RiskBand | string): string {
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
			return 'Redirect / review';
		case 'reject':
			return 'Reject';
		default:
			return 'Not graded';
	}
}

// ─── Display colours (Lily token utility classes) ───

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
export function riskColor(value: RiskBand | string): string {
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
