import type {
	CardiacStressResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	TestType,
	BloodPressureResponse,
	ReportStatus
} from './types';

// ──────────────────────────────────────────────
// Clinical thresholds
// ──────────────────────────────────────────────

/** A high-risk Duke treadmill score is <= -11 (≈65% five-year survival). */
export const DUKE_HIGH_RISK_MAX = -11;
/** A low-risk Duke treadmill score is >= +5 (≈97% five-year survival). */
export const DUKE_LOW_RISK_MIN = 5;
/** Ischaemia induced at or below this functional capacity (METs) is low-workload. */
export const LOW_WORKLOAD_METS = 5;

// ──────────────────────────────────────────────
// Structured-findings predicates
// ──────────────────────────────────────────────

/** A strongly positive test: positive conclusion with induced ischaemic ST changes. */
export function isStronglyPositive(r: CardiacStressResult): boolean {
	return r.testPositive && r.ischaemicStChanges;
}

/** Exertional hypotension: a hypotensive blood-pressure response to exercise. */
export function hasExertionalHypotension(r: CardiacStressResult): boolean {
	return r.bloodPressureResponse === 'hypotensive';
}

/** Ischaemia induced at a low workload (ST changes with low functional capacity). */
export function hasIschaemiaAtLowWorkload(r: CardiacStressResult): boolean {
	return (
		r.ischaemicStChanges && r.metsAchieved !== null && r.metsAchieved <= LOW_WORKLOAD_METS
	);
}

/** A high-risk Duke treadmill score (<= -11). */
export function hasHighRiskDukeScore(r: CardiacStressResult): boolean {
	return r.dukeTreadmillScore !== null && r.dukeTreadmillScore <= DUKE_HIGH_RISK_MAX;
}

/**
 * A critical result (strongly positive test, exertional hypotension, ischaemia
 * induced at low workload, or a high-risk Duke treadmill score) auto-escalates
 * Axis D to critical-alert. Mirrors the back-end invariant.
 */
export function hasCriticalResult(r: CardiacStressResult): boolean {
	return (
		isStronglyPositive(r) ||
		hasExertionalHypotension(r) ||
		hasIschaemiaAtLowWorkload(r) ||
		hasHighRiskDukeScore(r)
	);
}

/** Whether any structured abnormal finding is present. */
export function hasAnyAbnormalFinding(r: CardiacStressResult): boolean {
	return (
		r.testPositive ||
		r.ischaemicStChanges ||
		r.chestPainInduced ||
		r.arrhythmiaInduced ||
		hasExertionalHypotension(r)
	);
}

/** Whether the report describes an inconclusive / non-diagnostic study. */
export function isInconclusiveStudy(r: CardiacStressResult): boolean {
	return r.testInconclusive && !hasAnyAbnormalFinding(r);
}

/**
 * The Duke treadmill score risk band, used as the structured-reporting
 * `reportingCategory` label.
 */
export function dukeRiskBand(score: number | null): string {
	if (score === null) return '';
	if (score <= DUKE_HIGH_RISK_MAX) return 'duke-high-risk';
	if (score >= DUKE_LOW_RISK_MIN) return 'duke-low-risk';
	return 'duke-intermediate-risk';
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
		case 'exercise-treadmill-ecg':
			return 'Exercise treadmill ECG';
		case 'stress-echo':
			return 'Stress echocardiography';
		case 'dobutamine-stress-echo':
			return 'Dobutamine stress echo';
		case 'myocardial-perfusion-spect':
			return 'Myocardial perfusion SPECT';
		case 'stress-cardiac-mri':
			return 'Stress cardiac MRI';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable blood-pressure-response label. */
export function bloodPressureResponseLabel(value: BloodPressureResponse | string): string {
	switch (value) {
		case 'normal':
			return 'Normal';
		case 'hypertensive':
			return 'Hypertensive';
		case 'hypotensive':
			return 'Hypotensive (exertional)';
		case 'flat':
			return 'Flat';
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
