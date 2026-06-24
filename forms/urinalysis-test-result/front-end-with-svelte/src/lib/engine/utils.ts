import type {
	UrinalysisResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	SpecimenType,
	ReportStatus,
	DipstickGrade
} from './types';

// ──────────────────────────────────────────────
// Structured-findings predicates
// ──────────────────────────────────────────────

/** Whether a dipstick reagent grade is positive (anything above negative / blank). */
export function isDipstickPositive(value: DipstickGrade): boolean {
	return value === 'trace' || value === 'plus-one' || value === 'plus-two' || value === 'plus-three';
}

/** Whether a dipstick reagent grade is strongly positive (1+ or higher). */
export function isDipstickStrong(value: DipstickGrade): boolean {
	return value === 'plus-one' || value === 'plus-two' || value === 'plus-three';
}

/**
 * A critical finding auto-escalates Axis D to critical-alert. Mirrors the
 * back-end invariant: significant growth in pregnancy, a critical organism,
 * suspected urosepsis, or visible (frank) haematuria.
 */
export function hasCriticalFinding(r: UrinalysisResult): boolean {
	const significantGrowthInPregnancy = r.cultureResult === 'significant-growth' && r.pregnant;
	return (
		significantGrowthInPregnancy ||
		r.criticalOrganism ||
		r.suspectedUrosepsis ||
		r.visibleHaematuria ||
		r.overallResultStatus === 'critical'
	);
}

/** Whether significant bacteriuria (significant growth) is present. */
export function hasSignificantGrowth(r: UrinalysisResult): boolean {
	return r.cultureResult === 'significant-growth';
}

/** Whether dipstick / microscopy suggest a urinary tract infection. */
export function hasUtiFeatures(r: UrinalysisResult): boolean {
	return (
		isDipstickPositive(r.leucocytes) ||
		r.nitrites === 'positive' ||
		r.organismsSeen
	);
}

/** Whether any structured abnormal finding is present. */
export function hasAnyAbnormalFinding(r: UrinalysisResult): boolean {
	return (
		hasSignificantGrowth(r) ||
		hasUtiFeatures(r) ||
		isDipstickPositive(r.blood) ||
		isDipstickStrong(r.protein) ||
		isDipstickPositive(r.glucose) ||
		r.visibleHaematuria ||
		r.suspectedUrosepsis ||
		r.criticalOrganism ||
		r.overallResultStatus === 'abnormal' ||
		r.overallResultStatus === 'critical'
	);
}

/** Whether the report describes only an incidental finding (no UTI / growth). */
export function hasOnlyIncidentalFinding(r: UrinalysisResult): boolean {
	const incidental =
		isDipstickPositive(r.glucose) || r.casts.trim() !== '' || r.crystals.trim() !== '';
	const significant =
		hasSignificantGrowth(r) ||
		hasUtiFeatures(r) ||
		isDipstickPositive(r.blood) ||
		isDipstickStrong(r.protein) ||
		r.visibleHaematuria ||
		r.suspectedUrosepsis ||
		r.criticalOrganism;
	return incidental && !significant;
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
		case 'midstream':
			return 'Midstream (MSU)';
		case 'catheter':
			return 'Catheter (CSU)';
		case 'clean-catch':
			return 'Clean catch';
		case '24h':
			return '24-hour collection';
		case 'random':
			return 'Random';
		default:
			return 'Unspecified';
	}
}

/** Human-readable culture-result label. */
export function cultureResultLabel(value: string): string {
	switch (value) {
		case 'no-growth':
			return 'No growth';
		case 'mixed-growth-likely-contaminant':
			return 'Mixed growth (likely contaminant)';
		case 'significant-growth':
			return 'Significant growth';
		default:
			return 'Not reported';
	}
}

/** Human-readable dipstick-grade label. */
export function dipstickGradeLabel(value: string): string {
	switch (value) {
		case 'negative':
			return 'Negative';
		case 'trace':
			return 'Trace';
		case 'plus-one':
			return '1+';
		case 'plus-two':
			return '2+';
		case 'plus-three':
			return '3+';
		case 'positive':
			return 'Positive';
		default:
			return 'Not reported';
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
