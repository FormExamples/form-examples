import type {
	PetScanResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	ScanType,
	ReportStatus,
	TreatmentResponse
} from './types';

// ──────────────────────────────────────────────
// Structured-findings predicates
// ──────────────────────────────────────────────

/**
 * A critical finding — distant metastatic tracer-avid disease, or a
 * progressive metabolic treatment response — auto-escalates Axis D to
 * critical-alert. Mirrors the back-end invariant.
 */
export function hasCriticalFinding(r: PetScanResult): boolean {
	return r.distantMetastasis || r.treatmentResponse === 'progressive';
}

/** Whether any structured abnormal finding is present. */
export function hasAnyAbnormalFinding(r: PetScanResult): boolean {
	return r.hypermetabolicLesion || r.nodalUptake || r.distantMetastasis;
}

/** Whether the report describes only incidental findings (no abnormal ones). */
export function hasOnlyIncidentalFinding(r: PetScanResult): boolean {
	return r.incidentalFinding && !hasAnyAbnormalFinding(r);
}

/** Whether the study is negative (no abnormal uptake / physiological only). */
export function isNegativeStudy(r: PetScanResult): boolean {
	return (r.noAbnormalUptake || r.physiologicalUptakeOnly) && !hasAnyAbnormalFinding(r);
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

/** Human-readable scan-type (tracer) label. */
export function scanTypeLabel(value: ScanType | string): string {
	switch (value) {
		case 'fdg-pet-ct':
			return 'FDG PET-CT';
		case 'psma-pet':
			return 'PSMA PET';
		case 'dotatate-pet':
			return 'DOTATATE PET';
		case 'amyloid-pet':
			return 'Amyloid PET';
		case 'cardiac-pet':
			return 'Cardiac PET';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable treatment-response label. */
export function treatmentResponseLabel(value: TreatmentResponse | string): string {
	switch (value) {
		case 'complete':
			return 'Complete metabolic response';
		case 'partial':
			return 'Partial metabolic response';
		case 'stable':
			return 'Stable metabolic disease';
		case 'progressive':
			return 'Progressive metabolic disease';
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
