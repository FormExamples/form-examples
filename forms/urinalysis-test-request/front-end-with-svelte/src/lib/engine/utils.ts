import type {
	TestsSection,
	TestField,
	AppropriatenessBand,
	PreanalyticalBand,
	TriageTier,
	Recommendation,
	Indication
} from './types';
import { TESTS } from './defaults';

// ──────────────────────────────────────────────
// Test-panel helpers
// ──────────────────────────────────────────────

/** Count how many tests are selected in the panel. */
export function countSelectedTests(tests: TestsSection | undefined): number {
	if (!tests) return 0;
	return TESTS.reduce((n, t) => n + (tests[t.field] === true ? 1 : 0), 0);
}

/** Human-readable label for a test field, falling back to the raw value. */
export function testLabel(field: TestField | string): string {
	const entry = TESTS.find((t) => t.field === field);
	return entry ? entry.label : String(field || '');
}

/** Comma-joined labels of the tests selected in `tests`. */
export function selectedTestsLabel(tests: TestsSection | undefined): string {
	if (!tests) return '—';
	const labels = TESTS.filter((t) => tests[t.field] === true).map((t) => t.label);
	return labels.length === 0 ? '—' : labels.join(', ');
}

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

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

/** Axis B preanalytical display label. */
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
			return 'Redirect to a more suitable test';
		case 'reject':
			return 'Reject';
		default:
			return 'Not graded';
	}
}

/** Human-readable primary-indication label. */
export function indicationLabel(value: Indication | string): string {
	switch (value) {
		case 'suspected-uti':
			return 'Suspected UTI';
		case 'haematuria':
			return 'Haematuria';
		case 'proteinuria':
			return 'Proteinuria';
		case 'diabetes-monitoring':
			return 'Diabetes monitoring';
		case 'renal-monitoring':
			return 'Renal monitoring';
		case 'pregnancy-screen':
			return 'Pregnancy screen';
		case 'pre-operative':
			return 'Pre-operative';
		case 'catheter-related':
			return 'Catheter-related';
		case 'suspected-malignancy':
			return 'Suspected malignancy';
		case 'drug-monitoring':
			return 'Drug monitoring';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable specimen-type label. */
export function specimenTypeLabel(value: string): string {
	switch (value) {
		case 'midstream':
			return 'Midstream (MSU)';
		case 'catheter':
			return 'Catheter (CSU)';
		case 'clean-catch':
			return 'Clean-catch';
		case '24h':
			return '24-hour';
		case 'random':
			return 'Random';
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

/** Axis B preanalytical badge colour. */
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
