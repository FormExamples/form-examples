import type {
	CytologyResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	SpecimenType,
	ReportStatus,
	HpvResult
} from './types';

// ──────────────────────────────────────────────
// Cytology-finding predicates
// ──────────────────────────────────────────────

/** Lower-cased concatenation of the category fields, for keyword matching. */
function categoryText(r: CytologyResult): string {
	return `${r.cytologyResultCategory} ${r.reportingCategory}`.toLowerCase();
}

/**
 * Whether the recorded category text indicates a high-grade / malignant
 * reporting band: high-grade dyskaryosis, glandular neoplasia, Thy5, breast C5,
 * high-grade urothelial carcinoma, or an explicit "malignant" / "suspicious"
 * category. Used by the critical and severity rules.
 */
export function hasHighGradeCategory(r: CytologyResult): boolean {
	const t = categoryText(r);
	return (
		t.includes('high-grade') ||
		t.includes('high grade') ||
		t.includes('glandular') ||
		t.includes('thy5') ||
		t.includes('thy 5') ||
		t.includes('c5') ||
		t.includes('malignant') ||
		t.includes('carcinoma') ||
		t.includes('neoplasia')
	);
}

/**
 * Whether the category text indicates a borderline / low-grade / atypical /
 * suspicious band that is abnormal but not unambiguously critical.
 */
export function hasLowGradeCategory(r: CytologyResult): boolean {
	const t = categoryText(r);
	return (
		t.includes('low-grade') ||
		t.includes('low grade') ||
		t.includes('borderline') ||
		t.includes('atypia') ||
		t.includes('atypical') ||
		t.includes('suspicious') ||
		t.includes('thy3') ||
		t.includes('thy 3') ||
		t.includes('thy4') ||
		t.includes('thy 4') ||
		t.includes('c3') ||
		t.includes('c4')
	);
}

/**
 * A critical finding — malignant cells present, or a high-grade dyskaryosis /
 * Thy5 / breast C5 / malignant reporting category — auto-escalates Axis D to
 * critical-alert. Mirrors the back-end invariant.
 */
export function hasCriticalFinding(r: CytologyResult): boolean {
	return r.malignancyPresent || hasHighGradeCategory(r);
}

/** Whether any abnormal cytology finding is present. */
export function hasAnyAbnormalFinding(r: CytologyResult): boolean {
	return (
		r.malignancyPresent ||
		r.dysplasiaPresent ||
		hasHighGradeCategory(r) ||
		hasLowGradeCategory(r)
	);
}

/** Whether HPV is positive on an otherwise non-malignant specimen. */
export function hasIsolatedHpvPositive(r: CytologyResult): boolean {
	return r.hpvResult === 'positive' && !hasAnyAbnormalFinding(r);
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

/** Human-readable specimen-type label. */
export function specimenTypeLabel(value: SpecimenType | string): string {
	switch (value) {
		case 'cervical-smear':
			return 'Cervical smear';
		case 'urine-cytology':
			return 'Urine cytology';
		case 'sputum-cytology':
			return 'Sputum cytology';
		case 'fluid-pleural-ascitic':
			return 'Serous fluid (pleural / ascitic)';
		case 'fine-needle-aspiration-thyroid':
			return 'Thyroid FNA';
		case 'fine-needle-aspiration-breast':
			return 'Breast FNA';
		case 'csf-cytology':
			return 'CSF cytology';
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

/** Human-readable HPV-result label. */
export function hpvResultLabel(value: HpvResult | string): string {
	switch (value) {
		case 'positive':
			return 'Positive';
		case 'negative':
			return 'Negative';
		case 'not-tested':
			return 'Not tested';
		case 'not-applicable':
			return 'Not applicable';
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
