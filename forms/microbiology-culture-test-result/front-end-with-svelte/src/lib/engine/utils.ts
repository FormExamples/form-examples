import type {
	MicrobiologyCultureResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	SpecimenType,
	ReportStatus
} from './types';

// ──────────────────────────────────────────────
// Structured-findings predicates
// ──────────────────────────────────────────────

/**
 * A critical organism / result auto-escalates Axis D to critical-alert.
 * Mirrors the back-end invariant: a positive blood culture, a CSF isolate, a
 * carbapenemase-producing Enterobacterales (CPE), or any record explicitly
 * flagged `criticalOrganism`.
 */
export function hasCriticalOrganism(r: MicrobiologyCultureResult): boolean {
	const grown = isPositiveCulture(r);
	const positiveBloodCulture = r.specimenType === 'blood-culture' && grown;
	const csfIsolate = r.specimenType === 'csf' && grown;
	return r.criticalOrganism || r.resistanceCpe || positiveBloodCulture || csfIsolate;
}

/** Whether the culture grew a clinically significant organism. */
export function isPositiveCulture(r: MicrobiologyCultureResult): boolean {
	return r.cultureResult === 'significant-growth' || r.cultureResult === 'positive';
}

/** Whether any resistance marker (MRSA / ESBL / CPE) is present. */
export function hasResistanceMarker(r: MicrobiologyCultureResult): boolean {
	return r.resistanceMrsa || r.resistanceEsbl || r.resistanceCpe;
}

/** Whether a specialised test (C. difficile toxin or AFB) is positive. */
export function hasPositiveSpecialisedTest(r: MicrobiologyCultureResult): boolean {
	return r.cDifficileToxin === 'positive' || r.acidFastBacilli === 'positive';
}

/** Whether any abnormal microbiological finding is present. */
export function hasAnyAbnormalFinding(r: MicrobiologyCultureResult): boolean {
	return (
		hasCriticalOrganism(r) ||
		isPositiveCulture(r) ||
		hasResistanceMarker(r) ||
		hasPositiveSpecialisedTest(r)
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

/** Human-readable specimen-type label. */
export function specimenTypeLabel(value: SpecimenType | string): string {
	switch (value) {
		case 'blood-culture':
			return 'Blood culture';
		case 'urine':
			return 'Urine';
		case 'wound-swab':
			return 'Wound swab';
		case 'sputum':
			return 'Sputum';
		case 'throat-swab':
			return 'Throat swab';
		case 'stool':
			return 'Stool';
		case 'csf':
			return 'CSF';
		case 'tissue':
			return 'Tissue';
		case 'catheter-tip':
			return 'Catheter tip';
		case 'genital-swab':
			return 'Genital swab';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable culture-result label. */
export function cultureResultLabel(value: string): string {
	switch (value) {
		case 'no-growth':
			return 'No growth';
		case 'mixed-growth':
			return 'Mixed growth';
		case 'significant-growth':
			return 'Significant growth';
		case 'positive':
			return 'Positive';
		default:
			return 'Unspecified';
	}
}

/** Human-readable report-status label. */
export function reportStatusLabel(value: ReportStatus | string): string {
	switch (value) {
		case 'preliminary':
			return 'Preliminary';
		case 'interim':
			return 'Interim';
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
