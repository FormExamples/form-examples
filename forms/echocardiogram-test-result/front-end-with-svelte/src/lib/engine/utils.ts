import type {
	EchocardiogramResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	ValveGrade,
	EchoType,
	ReportStatus
} from './types';

// ──────────────────────────────────────────────
// Structured-findings predicates
// ──────────────────────────────────────────────

/** All four valve grades, for convenience iteration. */
export function valveGrades(r: EchocardiogramResult): ValveGrade[] {
	return [r.aorticStenosis, r.aorticRegurgitation, r.mitralStenosis, r.mitralRegurgitation];
}

/** Whether any valve lesion is graded severe. */
export function hasSevereValveDisease(r: EchocardiogramResult): boolean {
	return valveGrades(r).some((g) => g === 'severe');
}

/** Whether any valve lesion is graded moderate (and none severe). */
export function hasModerateValveDisease(r: EchocardiogramResult): boolean {
	return valveGrades(r).some((g) => g === 'moderate');
}

/** Whether any valve lesion is graded mild or worse. */
export function hasAnyValveDisease(r: EchocardiogramResult): boolean {
	return valveGrades(r).some((g) => g === 'mild' || g === 'moderate' || g === 'severe');
}

/** Whether left-ventricular systolic function is severely impaired (by qualitative grade or EF). */
export function hasSevereLvImpairment(r: EchocardiogramResult): boolean {
	return (
		r.lvFunction === 'severely-impaired' ||
		(r.lvEjectionFractionPercent !== null && r.lvEjectionFractionPercent < 30)
	);
}

/** Whether left-ventricular systolic function is impaired to any degree. */
export function hasAnyLvImpairment(r: EchocardiogramResult): boolean {
	return (
		r.lvFunction === 'mildly-impaired' ||
		r.lvFunction === 'moderately-impaired' ||
		r.lvFunction === 'severely-impaired' ||
		(r.lvEjectionFractionPercent !== null && r.lvEjectionFractionPercent < 50)
	);
}

/**
 * A critical finding auto-escalates Axis D to critical-alert. Mirrors the
 * back-end invariant: severe valve disease, a valvular vegetation (suspected
 * endocarditis), a pericardial effusion (tamponade risk), severe LV impairment,
 * or an intracardiac thrombus.
 */
export function hasCriticalFinding(r: EchocardiogramResult): boolean {
	return (
		hasSevereValveDisease(r) ||
		r.vegetation ||
		r.pericardialEffusion ||
		hasSevereLvImpairment(r) ||
		r.intracardiacThrombus
	);
}

/** Whether any structured abnormal finding is present. */
export function hasAnyAbnormalFinding(r: EchocardiogramResult): boolean {
	return (
		hasAnyValveDisease(r) ||
		hasAnyLvImpairment(r) ||
		r.lvHypertrophy ||
		r.regionalWallMotionAbnormality ||
		r.pericardialEffusion ||
		r.vegetation ||
		r.intracardiacThrombus
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

/** Human-readable echo-type label. */
export function echoTypeLabel(value: EchoType | string): string {
	switch (value) {
		case 'transthoracic-tte':
			return 'Transthoracic (TTE)';
		case 'transoesophageal-toe':
			return 'Transoesophageal (TOE)';
		case 'stress-echo':
			return 'Stress echo';
		case 'contrast-echo':
			return 'Contrast echo';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable valve-grade label. */
export function valveGradeLabel(value: ValveGrade | string): string {
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
