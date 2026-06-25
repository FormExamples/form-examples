import type {
	PulmonaryFunctionResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	TestType,
	ReportStatus
} from './types';

// ──────────────────────────────────────────────
// Structured-findings predicates
// ──────────────────────────────────────────────

/**
 * A critical finding auto-escalates Axis D to critical-alert. Mirrors the
 * back-end invariant: severe / very-severe airflow obstruction or restriction.
 */
export function hasCriticalFinding(r: PulmonaryFunctionResult): boolean {
	return (
		(r.airflowObstruction || r.restriction) &&
		(r.severity === 'severe' || r.severity === 'very-severe')
	);
}

/** Whether any structured abnormal finding is present. */
export function hasAnyAbnormalFinding(r: PulmonaryFunctionResult): boolean {
	return (
		r.airflowObstruction ||
		r.restriction ||
		r.reducedGasTransfer ||
		r.ventilatoryPattern === 'obstructive' ||
		r.ventilatoryPattern === 'restrictive' ||
		r.ventilatoryPattern === 'mixed'
	);
}

/** Whether the report describes a normal study (no abnormal findings). */
export function isNormalStudy(r: PulmonaryFunctionResult): boolean {
	return r.normalSpirometry && !hasAnyAbnormalFinding(r);
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

/** Human-readable test-type label. */
export function testTypeLabel(value: TestType | string): string {
	switch (value) {
		case 'spirometry':
			return 'Spirometry';
		case 'spirometry-with-reversibility':
			return 'Spirometry with reversibility';
		case 'full-lung-function':
			return 'Full lung function';
		case 'gas-transfer-dlco':
			return 'Gas transfer (DLCO)';
		case 'peak-flow':
			return 'Peak flow';
		case 'feno':
			return 'FeNO';
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

/** Human-readable ventilatory-pattern label. */
export function ventilatoryPatternLabel(value: string): string {
	switch (value) {
		case 'normal':
			return 'Normal';
		case 'obstructive':
			return 'Obstructive';
		case 'restrictive':
			return 'Restrictive';
		case 'mixed':
			return 'Mixed';
		default:
			return 'Unspecified';
	}
}

/** Human-readable severity label. */
export function severityLabel(value: string): string {
	switch (value) {
		case 'none':
			return 'None';
		case 'mild':
			return 'Mild';
		case 'moderate':
			return 'Moderate';
		case 'severe':
			return 'Severe';
		case 'very-severe':
			return 'Very severe';
		default:
			return 'Unspecified';
	}
}

/** Human-readable bronchodilator-reversibility label. */
export function bronchodilatorReversibilityLabel(value: string): string {
	switch (value) {
		case 'positive':
			return 'Positive';
		case 'negative':
			return 'Negative';
		case 'not-tested':
			return 'Not tested';
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
