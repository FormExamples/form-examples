import type {
	TumorMarkerResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	Trend,
	ReportStatus
} from './types';

// ──────────────────────────────────────────────
// Measured-marker helpers
// ──────────────────────────────────────────────

/** The ten measured serum tumour markers, with display metadata. */
export const MARKERS = [
	{ key: 'psa', label: 'PSA', unit: 'ng/mL' },
	{ key: 'ca125', label: 'CA125', unit: 'IU/mL' },
	{ key: 'ca19_9', label: 'CA19-9', unit: 'U/mL' },
	{ key: 'carcinoembryonicAntigenCea', label: 'CEA', unit: 'ng/mL' },
	{ key: 'alphaFetoproteinAfp', label: 'AFP', unit: 'ng/mL' },
	{ key: 'betaHcg', label: 'beta-hCG', unit: 'IU/L' },
	{ key: 'ca15_3', label: 'CA15-3', unit: 'U/mL' },
	{ key: 'lactateDehydrogenaseLdh', label: 'LDH', unit: 'U/L' },
	{ key: 'calcitonin', label: 'Calcitonin', unit: 'ng/L' },
	{ key: 'chromograninA', label: 'Chromogranin A', unit: 'nmol/L' }
] as const satisfies ReadonlyArray<{ key: keyof TumorMarkerResult; label: string; unit: string }>;

/**
 * Germ-cell-tumour critical thresholds. A measured AFP or beta-hCG at or above
 * these "very high" levels suggests a germ-cell tumour and is treated as a
 * critical result (ASCO / ACB germ-cell tumour-marker guidance).
 */
export const AFP_CRITICAL = 1000; // ng/mL
export const BETA_HCG_CRITICAL = 5000; // IU/L

/** Whether any measured marker value is present (non-null). */
export function hasAnyMeasuredMarker(r: TumorMarkerResult): boolean {
	return MARKERS.some((m) => (r[m.key] as number | null) !== null);
}

/** The count of measured (non-null) markers. */
export function measuredMarkerCount(r: TumorMarkerResult): number {
	return MARKERS.filter((m) => (r[m.key] as number | null) !== null).length;
}

/**
 * A very high AFP or beta-hCG (suggesting a germ-cell tumour) is the
 * critical-result trigger. Mirrors the back-end invariant.
 */
export function hasGermCellCriticalMarker(r: TumorMarkerResult): boolean {
	return (
		(r.alphaFetoproteinAfp !== null && r.alphaFetoproteinAfp >= AFP_CRITICAL) ||
		(r.betaHcg !== null && r.betaHcg >= BETA_HCG_CRITICAL)
	);
}

/** Whether the result is critical (reported critical or a germ-cell critical marker). */
export function isCriticalResult(r: TumorMarkerResult): boolean {
	return r.overallResultStatus === 'critical' || hasGermCellCriticalMarker(r);
}

/**
 * A markedly elevated value, or a rising trend (on treatment), is the action
 * signal that drives an abnormal / urgent oncology review.
 */
export function hasActionSignal(r: TumorMarkerResult): boolean {
	return r.markedlyElevated || r.trend === 'rising';
}

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

/** Axis A result-classification display label. */
export function resultClassificationLabel(value: string): string {
	switch (value) {
		case 'normal':
			return 'Normal';
		case 'abnormal':
			return 'Abnormal';
		case 'critical':
			return 'Critical';
		case 'inconclusive':
			return 'Inconclusive';
		default:
			return 'Not graded';
	}
}

/** Axis B abnormality-severity display label. */
export function abnormalitySeverityLabel(value: string): string {
	switch (value) {
		case 'none':
			return 'None';
		case 'minor':
			return 'Minor';
		case 'moderate':
			return 'Moderate';
		case 'major':
			return 'Major';
		default:
			return 'Not graded';
	}
}

/** Axis D follow-up-urgency display label. */
export function followUpUrgencyLabel(value: string): string {
	switch (value) {
		case 'routine':
			return 'Routine';
		case 'recommended':
			return 'Recommended';
		case 'urgent':
			return 'Urgent';
		case 'critical-alert':
			return 'Critical alert';
		default:
			return 'Not graded';
	}
}

/** Human-readable trend label. */
export function trendLabel(value: Trend | string): string {
	switch (value) {
		case 'rising':
			return 'Rising';
		case 'stable':
			return 'Stable';
		case 'falling':
			return 'Falling';
		case 'not-applicable':
			return 'Not applicable';
		default:
			return 'Unspecified';
	}
}

/** Human-readable report-status label. */
export function reportStatusLabel(value: ReportStatus | string): string {
	switch (value) {
		case 'preliminary':
			return 'Preliminary';
		case 'final':
			return 'Final';
		case 'amended':
			return 'Amended';
		case 'cancelled':
			return 'Cancelled';
		default:
			return 'Unspecified';
	}
}

// ──────────────────────────────────────────────
// Display colours (Tailwind utility classes)
// ──────────────────────────────────────────────

/** Axis A result-classification badge colour. */
export function resultClassificationColor(value: ResultClassification | string): string {
	switch (value) {
		case 'normal':
			return 'bg-green-100 text-green-800 border-green-300';
		case 'abnormal':
			return 'bg-yellow-100 text-yellow-800 border-yellow-300';
		case 'critical':
			return 'bg-red-100 text-red-800 border-red-300';
		case 'inconclusive':
			return 'bg-gray-100 text-gray-700 border-gray-300';
		default:
			return 'bg-gray-100 text-gray-700 border-gray-300';
	}
}

/** Axis B abnormality-severity badge colour. */
export function abnormalitySeverityColor(value: AbnormalitySeverity | string): string {
	switch (value) {
		case 'none':
			return 'bg-green-100 text-green-800 border-green-300';
		case 'minor':
			return 'bg-blue-100 text-blue-800 border-blue-300';
		case 'moderate':
			return 'bg-yellow-100 text-yellow-800 border-yellow-300';
		case 'major':
			return 'bg-red-100 text-red-800 border-red-300';
		default:
			return 'bg-gray-100 text-gray-700 border-gray-300';
	}
}

/** Axis D follow-up-urgency badge colour. */
export function followUpUrgencyColor(value: FollowUpUrgency | string): string {
	switch (value) {
		case 'routine':
			return 'bg-green-100 text-green-800 border-green-300';
		case 'recommended':
			return 'bg-blue-100 text-blue-800 border-blue-300';
		case 'urgent':
			return 'bg-orange-100 text-orange-800 border-orange-300';
		case 'critical-alert':
			return 'bg-red-100 text-red-800 border-red-300';
		default:
			return 'bg-gray-100 text-gray-700 border-gray-300';
	}
}

/** Flag-priority badge colour. */
export function priorityColor(value: string): string {
	switch (value) {
		case 'high':
			return 'bg-red-100 text-red-800 border-red-300';
		case 'medium':
			return 'bg-yellow-100 text-yellow-800 border-yellow-300';
		case 'low':
			return 'bg-gray-100 text-gray-700 border-gray-300';
		default:
			return 'bg-gray-100 text-gray-700 border-gray-300';
	}
}
