import type {
	NuclearMedicineResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	ScanType,
	ReportStatus
} from './types';

// ──────────────────────────────────────────────
// Structured-findings predicates
// ──────────────────────────────────────────────

/**
 * A critical finding auto-escalates Axis D to critical-alert. Mirrors the
 * back-end invariant: a high-probability pulmonary embolism on a V/Q lung scan
 * (a perfusion defect on a vq-lung-scan), or a widespread metastatic pattern
 * (e.g. multiple foci on a bone scan), is a critical result.
 */
export function hasCriticalFinding(r: NuclearMedicineResult): boolean {
	const highProbabilityPe = r.scanType === 'vq-lung-scan' && r.perfusionDefect;
	return highProbabilityPe || r.metastaticPattern;
}

/** Whether any structured abnormal finding is present. */
export function hasAnyAbnormalFinding(r: NuclearMedicineResult): boolean {
	return (
		r.abnormalUptake ||
		r.metastaticPattern ||
		r.perfusionDefect ||
		r.photopenicArea ||
		// A markedly reduced ejection fraction (< 40 %) is itself an abnormal
		// structured finding — Axis B (`gradeSeverity`) already grades it
		// `major` via R-SEV-MAJOR-02; Axis A must agree, or a gated study with
		// reduced EF and no other structured finding classifies `normal` with
		// severity `major` and follow-up `urgent`, an axis-A/axis-B
		// contradiction.
		(r.ejectionFractionPercent !== null && r.ejectionFractionPercent < 40)
	);
}

/** Whether the report describes only incidental findings (no abnormal ones). */
export function hasOnlyIncidentalFinding(r: NuclearMedicineResult): boolean {
	return r.incidentalFinding && !hasAnyAbnormalFinding(r);
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

/** Human-readable scan-type label. */
export function scanTypeLabel(value: ScanType | string): string {
	switch (value) {
		case 'bone-scan':
			return 'Bone scan';
		case 'myocardial-perfusion':
			return 'Myocardial perfusion';
		case 'vq-lung-scan':
			return 'V/Q lung scan';
		case 'thyroid-uptake':
			return 'Thyroid uptake';
		case 'renal-dmsa':
			return 'Renal DMSA';
		case 'renal-mag3':
			return 'Renal MAG3';
		case 'gallium-octreotide':
			return 'Gallium / octreotide';
		case 'white-cell-scan':
			return 'White-cell scan';
		case 'sentinel-node':
			return 'Sentinel node';
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
