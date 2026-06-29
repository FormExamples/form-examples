import type {
	AppropriatenessBand,
	WindowFit,
	TriageTier,
	Recommendation,
	ScanType,
	Indication
} from './types';

// ──────────────────────────────────────────────
// Gestational-age helpers
// ──────────────────────────────────────────────

/**
 * Convert a gestational age expressed as weeks + days into a total number of
 * days. Returns null when no gestational age has been entered.
 */
export function gestationalAgeToDays(
	weeks: number | null | undefined,
	days: number | null | undefined
): number | null {
	if (weeks === null || weeks === undefined) return null;
	const w = Number(weeks);
	const d = days === null || days === undefined ? 0 : Number(days);
	if (Number.isNaN(w) || Number.isNaN(d)) return null;
	return w * 7 + d;
}

/** Format a gestational age (weeks + days) in the canonical "W+D" form. */
export function formatGestationalAge(
	weeks: number | null | undefined,
	days: number | null | undefined
): string {
	if (weeks === null || weeks === undefined) return '';
	const d = days === null || days === undefined ? 0 : Number(days);
	return `${Number(weeks)}+${d}`;
}

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

const SCAN_TYPE_LABELS: Record<string, string> = {
	viability: 'Viability',
	dating: 'Dating',
	'nuchal-translucency': 'Nuchal translucency / combined',
	anomaly: 'Anomaly (anatomy)',
	growth: 'Growth / wellbeing',
	doppler: 'Doppler surveillance',
	presentation: 'Presentation',
	'cervical-length': 'Cervical length',
	'placental-location': 'Placental location',
	'liquor-volume': 'Liquor volume',
	reassurance: 'Reassurance',
	other: 'Other'
};

/** Human-readable scan-type label, falling back to the raw value. */
export function scanTypeLabel(value: ScanType | string): string {
	return SCAN_TYPE_LABELS[value] || value || 'Unspecified';
}

const INDICATION_LABELS: Record<string, string> = {
	dating: 'Dating',
	viability: 'Viability',
	'exclude-ectopic': 'Exclude ectopic',
	bleeding: 'Bleeding',
	pain: 'Pain',
	'aneuploidy-screening': 'Aneuploidy screening',
	'anomaly-screening': 'Anomaly screening',
	'suspected-anomaly': 'Suspected anomaly',
	'growth-restriction': 'Growth restriction',
	'large-for-dates': 'Large for dates',
	'reduced-fetal-movements': 'Reduced fetal movements',
	'multiple-pregnancy': 'Multiple pregnancy',
	'placental-location': 'Placental location',
	'liquor-assessment': 'Liquor assessment',
	presentation: 'Presentation',
	'cervical-assessment': 'Cervical assessment',
	'antepartum-haemorrhage': 'Antepartum haemorrhage',
	'maternal-condition': 'Maternal condition',
	'doppler-surveillance': 'Doppler surveillance',
	'follow-up': 'Follow-up',
	other: 'Other'
};

/** Human-readable indication label, falling back to the raw value. */
export function indicationLabel(value: Indication | string): string {
	return INDICATION_LABELS[value] || value || 'Unspecified';
}

/** Axis A appropriateness-band display label. */
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

/** Axis B gestational-age window-fit display label. */
export function windowFitLabel(value: string): string {
	switch (value) {
		case 'appropriate':
			return 'Within window';
		case 'borderline':
			return 'Borderline';
		case 'outside-window':
			return 'Outside window';
		default:
			return 'Not assessed';
	}
}

/** Axis D triage-tier display label. */
export function triageTierLabel(value: string): string {
	switch (value) {
		case 'routine':
			return 'Routine';
		case 'soon':
			return 'Soon';
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

/** Axis B window-fit badge colour. */
export function windowFitColor(value: WindowFit | string): string {
	switch (value) {
		case 'appropriate':
			return 'bg-success text-success-content border-success';
		case 'borderline':
			return 'bg-warning text-warning-content border-warning';
		case 'outside-window':
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
		case 'soon':
			return 'bg-info text-info-content border-info';
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
