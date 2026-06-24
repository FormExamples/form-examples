import type {
	ElectrocardiogramResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	EcgType,
	Rhythm,
	CardiacAxis,
	ReportStatus
} from './types';

/** The QTc threshold (ms) at or above which the QT is markedly prolonged. */
export const QTC_PROLONGED_MS = 500;

// ──────────────────────────────────────────────
// Structured-findings predicates
// ──────────────────────────────────────────────

/**
 * A critical finding auto-escalates Axis D to critical-alert. Mirrors the
 * back-end invariant: ST-segment elevation (STEMI / acute injury pattern),
 * ventricular tachycardia, complete (third-degree) heart block, or a markedly
 * prolonged QTc (>= 500 ms).
 */
export function hasCriticalFinding(r: ElectrocardiogramResult): boolean {
	return (
		r.stElevation ||
		r.rhythm === 'ventricular-tachycardia' ||
		r.rhythm === 'heart-block' ||
		(r.qtcMs !== null && r.qtcMs >= QTC_PROLONGED_MS)
	);
}

/** Whether any structured abnormal finding is present. */
export function hasAnyAbnormalFinding(r: ElectrocardiogramResult): boolean {
	return (
		r.stElevation ||
		r.stDepression ||
		r.tWaveInversion ||
		r.pathologicalQWaves ||
		r.leftVentricularHypertrophy ||
		r.bundleBranchBlock ||
		r.ischaemia
	);
}

/** Whether an abnormal rhythm (anything other than sinus / paced) is present. */
export function hasAbnormalRhythm(r: ElectrocardiogramResult): boolean {
	return (
		r.rhythm === 'atrial-fibrillation' ||
		r.rhythm === 'atrial-flutter' ||
		r.rhythm === 'svt' ||
		r.rhythm === 'ventricular-tachycardia' ||
		r.rhythm === 'heart-block'
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

/** Human-readable ECG-type label. */
export function ecgTypeLabel(value: EcgType | string): string {
	switch (value) {
		case 'resting-12-lead':
			return 'Resting 12-lead';
		case 'exercise-stress':
			return 'Exercise / stress';
		case 'ambulatory-holter-24h':
			return 'Ambulatory Holter 24h';
		case 'ambulatory-48h':
			return 'Ambulatory 48h';
		case 'event-recorder':
			return 'Event recorder';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable rhythm label. */
export function rhythmLabel(value: Rhythm | string): string {
	switch (value) {
		case 'sinus':
			return 'Sinus';
		case 'atrial-fibrillation':
			return 'Atrial fibrillation';
		case 'atrial-flutter':
			return 'Atrial flutter';
		case 'svt':
			return 'SVT';
		case 'ventricular-tachycardia':
			return 'Ventricular tachycardia';
		case 'heart-block':
			return 'Heart block';
		case 'paced':
			return 'Paced';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable cardiac-axis label. */
export function cardiacAxisLabel(value: CardiacAxis | string): string {
	switch (value) {
		case 'normal':
			return 'Normal';
		case 'left-deviation':
			return 'Left deviation';
		case 'right-deviation':
			return 'Right deviation';
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
