import type {
	AmbulatoryBloodPressureResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	MonitoringType,
	ReportStatus,
	DipperStatus
} from './types';

// ──────────────────────────────────────────────
// Clinical thresholds (NICE NG136 / BIHS / ESH ABPM averages, mmHg)
// ──────────────────────────────────────────────

/** Daytime average hypertension threshold (>= 135/85). */
export const DAYTIME_HTN_SYSTOLIC = 135;
export const DAYTIME_HTN_DIASTOLIC = 85;
/** 24-hour average hypertension threshold (>= 130/80). */
export const TWENTY_FOUR_HOUR_HTN_SYSTOLIC = 130;
export const TWENTY_FOUR_HOUR_HTN_DIASTOLIC = 80;
/** Nighttime / nocturnal hypertension threshold (>= 120/70). */
export const NIGHTTIME_HTN_SYSTOLIC = 120;
export const NIGHTTIME_HTN_DIASTOLIC = 70;
/** Severe-hypertension threshold (ABPM average >= 150/95 ≈ clinic >= 180/120). */
export const SEVERE_HTN_SYSTOLIC = 150;
export const SEVERE_HTN_DIASTOLIC = 95;
/** Stage-2 hypertension threshold (ABPM daytime average >= 150/95 in NICE banding). */
export const STAGE2_HTN_SYSTOLIC = 150;
export const STAGE2_HTN_DIASTOLIC = 95;
/** Recording adequacy threshold (>= 70% valid readings). */
export const ADEQUATE_READINGS_PERCENT = 70;

// ──────────────────────────────────────────────
// Structured / threshold predicates
// ──────────────────────────────────────────────

/**
 * Whether the daytime average meets or exceeds the hypertension threshold
 * (>= 135/85). Either component crossing is sufficient.
 */
export function daytimeHypertensive(r: AmbulatoryBloodPressureResult): boolean {
	return (
		(r.daytimeAverageSystolic !== null && r.daytimeAverageSystolic >= DAYTIME_HTN_SYSTOLIC) ||
		(r.daytimeAverageDiastolic !== null && r.daytimeAverageDiastolic >= DAYTIME_HTN_DIASTOLIC)
	);
}

/** Whether the 24-hour average meets or exceeds the threshold (>= 130/80). */
export function twentyFourHourHypertensive(r: AmbulatoryBloodPressureResult): boolean {
	return (
		(r.twentyFourHourAverageSystolic !== null &&
			r.twentyFourHourAverageSystolic >= TWENTY_FOUR_HOUR_HTN_SYSTOLIC) ||
		(r.twentyFourHourAverageDiastolic !== null &&
			r.twentyFourHourAverageDiastolic >= TWENTY_FOUR_HOUR_HTN_DIASTOLIC)
	);
}

/** Whether the nighttime average meets or exceeds the threshold (>= 120/70). */
export function nighttimeHypertensive(r: AmbulatoryBloodPressureResult): boolean {
	return (
		(r.nighttimeAverageSystolic !== null &&
			r.nighttimeAverageSystolic >= NIGHTTIME_HTN_SYSTOLIC) ||
		(r.nighttimeAverageDiastolic !== null &&
			r.nighttimeAverageDiastolic >= NIGHTTIME_HTN_DIASTOLIC)
	);
}

/**
 * Whether the study shows severe hypertension by the averaged measurements
 * (any average >= 150/95). Mirrors the structured `severeHypertension` boolean.
 */
export function severeByAverages(r: AmbulatoryBloodPressureResult): boolean {
	const sys = [
		r.daytimeAverageSystolic,
		r.nighttimeAverageSystolic,
		r.twentyFourHourAverageSystolic
	];
	const dia = [
		r.daytimeAverageDiastolic,
		r.nighttimeAverageDiastolic,
		r.twentyFourHourAverageDiastolic
	];
	return (
		sys.some((v) => v !== null && v >= SEVERE_HTN_SYSTOLIC) ||
		dia.some((v) => v !== null && v >= SEVERE_HTN_DIASTOLIC)
	);
}

/**
 * A critical (severe-hypertension) result auto-escalates Axis D to
 * critical-alert. Either the structured boolean or the averaged measurements
 * can fire it. Mirrors the back-end invariant.
 */
export function hasCriticalFinding(r: AmbulatoryBloodPressureResult): boolean {
	return r.severeHypertension || severeByAverages(r);
}

/** Whether any structured abnormal interpretation is present. */
export function hasAnyAbnormalFinding(r: AmbulatoryBloodPressureResult): boolean {
	return (
		r.hypertensionConfirmed ||
		r.maskedHypertension ||
		r.severeHypertension ||
		r.nocturnalHypertension ||
		daytimeHypertensive(r) ||
		twentyFourHourHypertensive(r)
	);
}

/** Whether the recording met the adequacy threshold (>= 70% valid readings). */
export function recordingIsAdequate(r: AmbulatoryBloodPressureResult): boolean {
	if (r.recordingAdequate) return true;
	return r.validReadingsPercent !== null && r.validReadingsPercent >= ADEQUATE_READINGS_PERCENT;
}

/** Whether the recording is inadequate (low valid-readings percentage). */
export function recordingIsInadequate(r: AmbulatoryBloodPressureResult): boolean {
	return (
		!r.recordingAdequate &&
		r.validReadingsPercent !== null &&
		r.validReadingsPercent < ADEQUATE_READINGS_PERCENT
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

/** Human-readable monitoring-type label. */
export function monitoringTypeLabel(value: MonitoringType | string): string {
	switch (value) {
		case '24-hour-abpm':
			return '24-hour ABPM';
		case 'home-blood-pressure-monitoring':
			return 'Home BP monitoring';
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

/** Human-readable dipper-status label. */
export function dipperStatusLabel(value: DipperStatus | string): string {
	switch (value) {
		case 'dipper':
			return 'Dipper';
		case 'non-dipper':
			return 'Non-dipper';
		case 'reverse-dipper':
			return 'Reverse-dipper';
		case 'extreme-dipper':
			return 'Extreme-dipper';
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
