import type {
	DexaBoneDensityResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	ScanRegion,
	ReportStatus,
	WhoClassification
} from './types';

// ──────────────────────────────────────────────
// WHO densitometric classification (from the lowest T-score)
// ──────────────────────────────────────────────

/**
 * Derive the WHO densitometric classification from the lowest (most negative)
 * T-score and whether a fragility / vertebral fracture is identified:
 * - T ≥ −1.0 → normal
 * - −1.0 > T > −2.5 → osteopenia
 * - T ≤ −2.5 → osteoporosis
 * - T ≤ −2.5 with a fragility / vertebral fracture → severe-osteoporosis
 *
 * Returns '' when the lowest T-score has not been recorded.
 */
export function deriveWhoClassification(
	lowestTScore: number | null,
	vertebralFractureIdentified: boolean
): WhoClassification {
	if (lowestTScore === null) return '';
	if (lowestTScore <= -2.5) {
		return vertebralFractureIdentified ? 'severe-osteoporosis' : 'osteoporosis';
	}
	if (lowestTScore < -1.0) return 'osteopenia';
	return 'normal';
}

/**
 * The effective WHO classification used by the engine: the explicitly recorded
 * classification when present, otherwise the value derived from the lowest
 * T-score. Severe osteoporosis is upgraded when a fracture is identified.
 */
export function effectiveWhoClassification(r: DexaBoneDensityResult): WhoClassification {
	const derived = deriveWhoClassification(r.lowestTScore, r.vertebralFractureIdentified);
	if (derived !== '') {
		// A fragility / vertebral fracture with T ≤ −2.5 establishes severe disease
		// even if the recorded classification was the plain "osteoporosis" band.
		if (derived === 'severe-osteoporosis') return 'severe-osteoporosis';
		if (r.whoClassification === 'severe-osteoporosis' && r.vertebralFractureIdentified) {
			return 'severe-osteoporosis';
		}
		return r.whoClassification !== '' ? r.whoClassification : derived;
	}
	return r.whoClassification;
}

// ──────────────────────────────────────────────
// Structured-findings predicates
// ──────────────────────────────────────────────

/**
 * A critical finding for a DEXA report: established (severe) osteoporosis —
 * T ≤ −2.5 together with an identified fragility / vertebral fracture. This
 * auto-escalates Axis D to critical-alert. Mirrors the back-end invariant.
 */
export function hasCriticalFinding(r: DexaBoneDensityResult): boolean {
	return effectiveWhoClassification(r) === 'severe-osteoporosis';
}

/** Whether the result describes osteoporosis (T ≤ −2.5), severe or not. */
export function hasOsteoporosis(r: DexaBoneDensityResult): boolean {
	const w = effectiveWhoClassification(r);
	return w === 'osteoporosis' || w === 'severe-osteoporosis';
}

/** Whether the result describes osteopenia (low bone mass). */
export function hasOsteopenia(r: DexaBoneDensityResult): boolean {
	return effectiveWhoClassification(r) === 'osteopenia';
}

/** Whether any abnormal (non-normal) densitometric finding is present. */
export function hasAnyAbnormalFinding(r: DexaBoneDensityResult): boolean {
	const w = effectiveWhoClassification(r);
	return w === 'osteopenia' || w === 'osteoporosis' || w === 'severe-osteoporosis';
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

/** WHO densitometric classification display label. */
export function whoClassificationLabel(value: WhoClassification | string): string {
	switch (value) {
		case 'normal':
			return 'Normal';
		case 'osteopenia':
			return 'Osteopenia';
		case 'osteoporosis':
			return 'Osteoporosis';
		case 'severe-osteoporosis':
			return 'Severe osteoporosis';
		default:
			return 'Not classified';
	}
}

/** Human-readable scan-region label. */
export function scanRegionLabel(value: ScanRegion | string): string {
	switch (value) {
		case 'hip':
			return 'Hip';
		case 'spine':
			return 'Spine';
		case 'hip-and-spine':
			return 'Hip and spine';
		case 'forearm':
			return 'Forearm';
		case 'whole-body':
			return 'Whole body';
		case 'other':
			return 'Other';
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

/** Format a nullable T-score / Z-score for display. */
export function scoreLabel(value: number | null): string {
	return value === null ? 'N/A' : value.toFixed(1);
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

/** WHO densitometric classification badge colour. */
export function whoClassificationColor(value: WhoClassification | string): string {
	switch (value) {
		case 'normal':
			return 'bg-green-100 text-green-800 border-green-300';
		case 'osteopenia':
			return 'bg-yellow-100 text-yellow-800 border-yellow-300';
		case 'osteoporosis':
			return 'bg-orange-100 text-orange-800 border-orange-300';
		case 'severe-osteoporosis':
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
