import type {
	SleepStudyResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	OsaSeverity,
	StudyType,
	ReportStatus
} from './types';

// ──────────────────────────────────────────────
// Structured-findings predicates
// ──────────────────────────────────────────────

/** AASM AHI severity threshold (events/hour) for severe OSA. */
export const SEVERE_AHI_THRESHOLD = 30;

/** Whether the recorded AHI corresponds to the severe band (>= 30). */
export function isSevereAhi(r: SleepStudyResult): boolean {
	return r.apnoeaHypopnoeaIndex !== null && r.apnoeaHypopnoeaIndex >= SEVERE_AHI_THRESHOLD;
}

/**
 * A critical finding — severe OSA (AHI >= 30) with significant desaturation, or
 * nocturnal hypoventilation — auto-escalates Axis D to critical-alert. Mirrors
 * the back-end invariant.
 */
export function hasCriticalFinding(r: SleepStudyResult): boolean {
	return (isSevereAhi(r) && r.significantDesaturation) || r.nocturnalHypoventilation;
}

/** Whether any structured abnormal finding (sleep-disordered breathing) is present. */
export function hasAnyAbnormalFinding(r: SleepStudyResult): boolean {
	const band = ahiSeverityBand(r.apnoeaHypopnoeaIndex);
	return (
		r.obstructiveSleepApnoea ||
		r.centralSleepApnoea ||
		r.nocturnalHypoventilation ||
		r.significantDesaturation ||
		// gradeSeverity independently grades a mild/moderate/severe AHI band
		// from the raw apnoeaHypopnoeaIndex measurement, even when none of the
		// structured booleans above are set — Axis A must agree.
		(band !== '' && band !== 'none')
	);
}

/**
 * Whether the report describes only periodic limb movements (no sleep-disordered
 * breathing and not flagged as a normal study).
 */
export function hasOnlyPeriodicLimbMovements(r: SleepStudyResult): boolean {
	return r.periodicLimbMovements && !hasAnyAbnormalFinding(r);
}

/** Maps an AHI value to the AASM OSA severity band. */
export function ahiSeverityBand(ahi: number | null): OsaSeverity {
	if (ahi === null) return '';
	if (ahi < 5) return 'none';
	if (ahi < 15) return 'mild';
	if (ahi < 30) return 'moderate';
	return 'severe';
}

/** A free-text structured-reporting label for the AHI severity band. */
export function ahiReportingCategory(ahi: number | null): string {
	switch (ahiSeverityBand(ahi)) {
		case 'none':
			return 'No OSA (AHI <5)';
		case 'mild':
			return 'Mild OSA (AHI 5 to <15)';
		case 'moderate':
			return 'Moderate OSA (AHI 15 to <30)';
		case 'severe':
			return 'Severe OSA (AHI >=30)';
		default:
			return 'AHI not recorded';
	}
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

/** Human-readable study-type label. */
export function studyTypeLabel(value: StudyType | string): string {
	switch (value) {
		case 'home-sleep-apnoea-test':
			return 'Home sleep apnoea test';
		case 'polysomnography':
			return 'Polysomnography';
		case 'overnight-oximetry':
			return 'Overnight oximetry';
		case 'multiple-sleep-latency-test':
			return 'Multiple sleep latency test';
		case 'actigraphy':
			return 'Actigraphy';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable OSA-severity label. */
export function osaSeverityLabel(value: OsaSeverity | string): string {
	switch (value) {
		case 'none':
			return 'None';
		case 'mild':
			return 'Mild';
		case 'moderate':
			return 'Moderate';
		case 'severe':
			return 'Severe';
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
