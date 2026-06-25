import type {
	BiopsyResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	BiopsySite,
	BiopsyMethod,
	HistologicalGrade,
	ResectionMargins,
	ReportStatus
} from './types';

// ──────────────────────────────────────────────
// Diagnostic predicates
// ──────────────────────────────────────────────

/** Whether the resection margin is involved (tumour at the cut edge). */
export function hasInvolvedMargin(r: BiopsyResult): boolean {
	return r.resectionMargins === 'involved';
}

/**
 * A critical finding — an unexpected malignancy (malignancy present with no
 * originating request reference recorded) or an involved resection margin —
 * auto-escalates Axis D to critical-alert. Mirrors the back-end invariant.
 */
export function hasCriticalFinding(r: BiopsyResult): boolean {
	const unexpectedMalignancy = r.malignancyPresent && r.originatingRequestReference.trim() === '';
	return unexpectedMalignancy || hasInvolvedMargin(r);
}

/** Whether any abnormal diagnostic feature is present. */
export function hasAnyAbnormalFinding(r: BiopsyResult): boolean {
	return (
		r.malignancyPresent ||
		r.lymphovascularInvasion ||
		r.resectionMargins === 'involved' ||
		r.resectionMargins === 'close'
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

/** Human-readable biopsy-site label. */
export function biopsySiteLabel(value: BiopsySite | string): string {
	switch (value) {
		case 'skin':
			return 'Skin';
		case 'breast':
			return 'Breast';
		case 'lymph-node':
			return 'Lymph node';
		case 'liver':
			return 'Liver';
		case 'kidney':
			return 'Kidney';
		case 'prostate':
			return 'Prostate';
		case 'lung':
			return 'Lung';
		case 'bone-marrow':
			return 'Bone marrow';
		case 'gi-tract':
			return 'GI tract';
		case 'thyroid':
			return 'Thyroid';
		case 'soft-tissue':
			return 'Soft tissue';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable biopsy-method label. */
export function biopsyMethodLabel(value: BiopsyMethod | string): string {
	switch (value) {
		case 'punch':
			return 'Punch';
		case 'excision':
			return 'Excision';
		case 'incision':
			return 'Incision';
		case 'core-needle':
			return 'Core needle';
		case 'fine-needle-aspiration':
			return 'Fine-needle aspiration';
		case 'image-guided':
			return 'Image-guided';
		case 'endoscopic':
			return 'Endoscopic';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable histological-grade label. */
export function histologicalGradeLabel(value: HistologicalGrade | string): string {
	switch (value) {
		case 'well-differentiated':
			return 'Well differentiated (G1)';
		case 'moderately-differentiated':
			return 'Moderately differentiated (G2)';
		case 'poorly-differentiated':
			return 'Poorly differentiated (G3)';
		case 'undifferentiated':
			return 'Undifferentiated (G4)';
		case 'not-applicable':
			return 'Not applicable';
		default:
			return 'Unspecified';
	}
}

/** Human-readable resection-margin label. */
export function resectionMarginsLabel(value: ResectionMargins | string): string {
	switch (value) {
		case 'clear':
			return 'Clear';
		case 'involved':
			return 'Involved';
		case 'close':
			return 'Close';
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
		case 'supplementary':
			return 'Supplementary';
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
