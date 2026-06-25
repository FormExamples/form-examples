import type {
	GeneticResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	TestType,
	VariantClassification,
	ReportStatus
} from './types';

// ──────────────────────────────────────────────
// Structured-findings predicates
// ──────────────────────────────────────────────

/**
 * A critical / actionable finding — a pathogenic or likely-pathogenic variant,
 * or an actionable secondary finding — auto-escalates Axis D toward urgent /
 * critical-alert. Mirrors the back-end invariant.
 */
export function hasActionableFinding(r: GeneticResult): boolean {
	return (
		r.pathogenicVariantFound ||
		r.variantClassification === 'pathogenic' ||
		r.variantClassification === 'likely-pathogenic' ||
		r.secondaryFinding
	);
}

/** Whether a pathogenic / likely-pathogenic variant is reported. */
export function hasPathogenicVariant(r: GeneticResult): boolean {
	return (
		r.pathogenicVariantFound ||
		r.variantClassification === 'pathogenic' ||
		r.variantClassification === 'likely-pathogenic'
	);
}

/** Whether a variant of uncertain significance (VUS) is reported. */
export function hasVus(r: GeneticResult): boolean {
	return r.vusFound || r.variantClassification === 'variant-uncertain-significance';
}

/** Whether the report records a negative / benign result. */
export function isNegativeResult(r: GeneticResult): boolean {
	return (
		r.noClinicallySignificantVariant ||
		r.variantClassification === 'no-variant-detected' ||
		r.variantClassification === 'benign' ||
		r.variantClassification === 'likely-benign'
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

/** Human-readable test-type label. */
export function testTypeLabel(value: TestType | string): string {
	switch (value) {
		case 'diagnostic-single-gene':
			return 'Diagnostic single-gene';
		case 'gene-panel':
			return 'Gene panel';
		case 'whole-exome':
			return 'Whole exome';
		case 'whole-genome':
			return 'Whole genome';
		case 'chromosomal-microarray':
			return 'Chromosomal microarray';
		case 'karyotype':
			return 'Karyotype';
		case 'predictive-presymptomatic':
			return 'Predictive / presymptomatic';
		case 'carrier-testing':
			return 'Carrier testing';
		case 'pharmacogenomic':
			return 'Pharmacogenomic';
		case 'prenatal':
			return 'Prenatal';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable variant-classification label. */
export function variantClassificationLabel(value: VariantClassification | string): string {
	switch (value) {
		case 'pathogenic':
			return 'Pathogenic';
		case 'likely-pathogenic':
			return 'Likely pathogenic';
		case 'variant-uncertain-significance':
			return 'Variant of uncertain significance';
		case 'likely-benign':
			return 'Likely benign';
		case 'benign':
			return 'Benign';
		case 'no-variant-detected':
			return 'No variant detected';
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
