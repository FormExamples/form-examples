import type {
	HearingResult,
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
 * A critical finding — sudden sensorineural hearing loss (an otological
 * emergency) or a marked asymmetry between ears (red flag for retrocochlear
 * pathology) — auto-escalates Axis D to critical-alert. Mirrors the back-end
 * invariant.
 */
export function hasCriticalFinding(r: HearingResult): boolean {
	return r.suddenSensorineuralLoss || r.asymmetricLoss;
}

/** Whether any structured abnormal finding is present. */
export function hasAnyAbnormalFinding(r: HearingResult): boolean {
	return (
		r.hearingLossPresent ||
		r.asymmetricLoss ||
		r.suddenSensorineuralLoss ||
		r.conductiveComponent
	);
}

/** Whether the report demonstrates normal hearing with no abnormal finding. */
export function isNormalHearing(r: HearingResult): boolean {
	return r.normalHearing && !hasAnyAbnormalFinding(r);
}

/** The more-severe (worse) of the two per-ear PTAs, or null if neither given. */
export function worstPureToneAverage(r: HearingResult): number | null {
	const values = [r.pureToneAverageRightDb, r.pureToneAverageLeftDb].filter(
		(v): v is number => v !== null
	);
	if (values.length === 0) return null;
	return Math.max(...values);
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
		case 'pure-tone-audiometry':
			return 'Pure-tone audiometry';
		case 'tympanometry':
			return 'Tympanometry';
		case 'speech-audiometry':
			return 'Speech audiometry';
		case 'otoacoustic-emissions':
			return 'Otoacoustic emissions';
		case 'auditory-brainstem-response':
			return 'Auditory brainstem response';
		case 'newborn-hearing-screen':
			return 'Newborn hearing screen';
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

/** Human-readable hearing-loss-type label. */
export function hearingLossTypeLabel(value: string): string {
	switch (value) {
		case 'none':
			return 'None';
		case 'conductive':
			return 'Conductive';
		case 'sensorineural':
			return 'Sensorineural';
		case 'mixed':
			return 'Mixed';
		default:
			return 'Unspecified';
	}
}

/** Human-readable hearing-loss-severity label (BSA descriptors). */
export function hearingLossSeverityLabel(value: string): string {
	switch (value) {
		case 'normal':
			return 'Normal';
		case 'mild':
			return 'Mild';
		case 'moderate':
			return 'Moderate';
		case 'moderately-severe':
			return 'Moderately severe';
		case 'severe':
			return 'Severe';
		case 'profound':
			return 'Profound';
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
