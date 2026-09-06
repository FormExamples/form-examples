import type {
	ToxicologyResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	SpecimenCondition,
	ReportStatus,
	ParacetamolNomogram,
	OverallResultStatus
} from './types';

// ──────────────────────────────────────────────
// Toxicology predicates
// ──────────────────────────────────────────────

// Therapeutic / toxic thresholds (grounded in TOXBASE / NPIS and the MHRA
// paracetamol nomogram). Modest elevation of a narrow-range drug (lithium) or
// a clear poisoning threshold (carboxyhaemoglobin) raises severity.
export const LITHIUM_TOXIC_MMOL_L = 1.5;
export const CARBOXYHAEMOGLOBIN_TOXIC_PERCENT = 10;
export const SALICYLATE_TOXIC_MG_L = 300;

/**
 * A toxic result (paracetamol above the treatment line, or any
 * `toxicLevelPresent`) auto-escalates Axis D to critical-alert. Mirrors the
 * back-end invariant.
 */
export function hasToxicResult(r: ToxicologyResult): boolean {
	return r.toxicLevelPresent || r.paracetamolNomogram === 'above-treatment-line';
}

/**
 * Whether the report describes a critical conclusion or toxic level.
 *
 * Deliberately not folded into hasToxicResult itself: gradeSeverity checks
 * hasToxicResult first, so widening it here would make its own dedicated
 * over-threshold branch (R-SEV-MAJOR-02) unreachable dead code. gradeSeverity
 * independently grades lithium, carboxyhaemoglobin, or salicylate above their
 * toxic thresholds as major — Axis A must classify these critical too, or the
 * study reports normal despite a major severity grade.
 */
export function isCriticalResult(r: ToxicologyResult): boolean {
	return (
		hasToxicResult(r) ||
		r.overallResultStatus === 'critical' ||
		(r.lithiumLevelMmolL !== null && r.lithiumLevelMmolL >= LITHIUM_TOXIC_MMOL_L) ||
		(r.carboxyhaemoglobinPercent !== null &&
			r.carboxyhaemoglobinPercent >= CARBOXYHAEMOGLOBIN_TOXIC_PERCENT) ||
		(r.salicylateLevelMgL !== null && r.salicylateLevelMgL >= SALICYLATE_TOXIC_MG_L)
	);
}

/** Whether any assay result value has been recorded. */
export function hasAnyResultValue(r: ToxicologyResult): boolean {
	return (
		r.paracetamolLevelMgL !== null ||
		r.salicylateLevelMgL !== null ||
		r.ethanolLevel !== null ||
		r.lithiumLevelMmolL !== null ||
		r.digoxinLevel !== null ||
		r.carboxyhaemoglobinPercent !== null ||
		r.drugsOfAbuseScreen.trim() !== '' ||
		r.specificDrugLevel.trim() !== ''
	);
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

/** Human-readable suspected-agent label (free text; passthrough). */
export function suspectedAgentLabel(value: string): string {
	return value.trim() === '' ? 'Unspecified' : value;
}

/** Human-readable paracetamol-nomogram label. */
export function paracetamolNomogramLabel(value: ParacetamolNomogram | string): string {
	switch (value) {
		case 'above-treatment-line':
			return 'Above treatment line';
		case 'below-treatment-line':
			return 'Below treatment line';
		case 'not-applicable':
			return 'Not applicable';
		default:
			return 'Unspecified';
	}
}

/** Human-readable overall-result-status label. */
export function overallResultStatusLabel(value: OverallResultStatus | string): string {
	switch (value) {
		case 'normal':
			return 'Normal';
		case 'abnormal':
			return 'Abnormal';
		case 'critical':
			return 'Critical';
		default:
			return 'Unspecified';
	}
}

/** Human-readable specimen-condition label. */
export function specimenConditionLabel(value: SpecimenCondition | string): string {
	switch (value) {
		case 'satisfactory':
			return 'Satisfactory';
		case 'insufficient':
			return 'Insufficient';
		case 'delayed':
			return 'Delayed';
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
