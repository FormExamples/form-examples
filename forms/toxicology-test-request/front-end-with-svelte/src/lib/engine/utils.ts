import type {
	Assays,
	AssayField,
	ToxicologyRequest,
	AppropriatenessBand,
	TimingBand,
	TriageTier,
	Recommendation,
	PrimaryIndication
} from './types';
import { ASSAYS } from './defaults';

// ──────────────────────────────────────────────
// Assay helpers
// ──────────────────────────────────────────────

/** Count the number of selected (true) assays. */
export function countSelectedAssays(assays: Assays | undefined): number {
	if (!assays) return 0;
	return ASSAYS.reduce((n, a) => (assays[a.field] === true ? n + 1 : n), 0);
}

/** List the selected assay fields on the request. */
export function selectedAssayFields(r: ToxicologyRequest): AssayField[] {
	const a = r.assays;
	return ASSAYS.map((x) => x.field).filter((f) => a[f] === true);
}

/** The human-readable labels of the selected assays. */
export function selectedAssayLabels(r: ToxicologyRequest): string[] {
	return ASSAYS.filter((a) => r.assays[a.field] === true).map((a) => a.label);
}

/** Human-readable label for an assay field, falling back to the raw value. */
export function assayLabel(field: AssayField | string): string {
	const a = ASSAYS.find((x) => x.field === field);
	return a ? a.label : String(field || '');
}

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

const INDICATION_LABELS: Record<string, string> = {
	'suspected-overdose': 'Suspected overdose',
	'deliberate-self-harm': 'Deliberate self-harm',
	'therapeutic-drug-monitoring': 'Therapeutic drug monitoring',
	'suspected-poisoning': 'Suspected poisoning',
	'substance-misuse-screen': 'Substance-misuse screen',
	'occupational-screen': 'Occupational screen',
	forensic: 'Forensic',
	other: 'Other'
};

/** Human-readable label for a primary indication. */
export function indicationLabel(value: PrimaryIndication | string): string {
	return INDICATION_LABELS[value] || (value ? String(value) : 'Unspecified');
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

/** Axis B ingestion-timing display label. */
export function timingLabel(value: string): string {
	switch (value) {
		case 'ok':
			return 'OK';
		case 'caution':
			return 'Caution';
		case 'invalid':
			return 'Invalid';
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
		case 'stat':
			return 'Stat';
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
			return 'Redirect to a more suitable assay';
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

/** Axis B ingestion-timing badge colour. */
export function timingColor(value: TimingBand | string): string {
	switch (value) {
		case 'ok':
			return 'bg-success text-success-content border-success';
		case 'caution':
			return 'bg-warning text-warning-content border-warning';
		case 'invalid':
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
		case 'stat':
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
