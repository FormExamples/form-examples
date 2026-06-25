import type {
	EyeVisionResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	TestType,
	ReportStatus,
	VisualFieldResult,
	RetinopathyGrade
} from './types';

// ──────────────────────────────────────────────
// Clinical thresholds
// ──────────────────────────────────────────────

/**
 * Acutely raised intraocular pressure threshold (mmHg). At or above this in
 * either eye is treated as an acute-angle-closure / ocular-emergency signal.
 */
export const ACUTE_IOP_MMHG = 40;

/**
 * NICE NG81 single referral / treatment intraocular-pressure threshold (mmHg).
 */
export const RAISED_IOP_MMHG = 24;

// ──────────────────────────────────────────────
// Structured-findings predicates
// ──────────────────────────────────────────────

/** Whether either eye has an acutely raised intraocular pressure (>= 40 mmHg). */
export function hasAcuteRaisedIop(r: EyeVisionResult): boolean {
	const right = r.intraocularPressureRightMmhg;
	const left = r.intraocularPressureLeftMmhg;
	return (
		(right !== null && right >= ACUTE_IOP_MMHG) || (left !== null && left >= ACUTE_IOP_MMHG)
	);
}

/** Whether either eye has an intraocular pressure at or above the NG81 threshold. */
export function hasElevatedIop(r: EyeVisionResult): boolean {
	const right = r.intraocularPressureRightMmhg;
	const left = r.intraocularPressureLeftMmhg;
	return (
		(right !== null && right >= RAISED_IOP_MMHG) || (left !== null && left >= RAISED_IOP_MMHG)
	);
}

/**
 * A critical finding auto-escalates Axis D to critical-alert. Mirrors the
 * back-end invariant. Critical ophthalmic findings are:
 * - proliferative diabetic retinopathy,
 * - acutely raised intraocular pressure (>= 40 mmHg), and
 * - a recorded reduced visual acuity together with an optic-disc abnormality
 *   (a proxy for sudden visual loss / GCA / retinal-detachment emergencies).
 */
export function hasCriticalFinding(r: EyeVisionResult): boolean {
	return (
		r.retinopathyGrade === 'proliferative' ||
		hasAcuteRaisedIop(r) ||
		(r.reducedVisualAcuity && r.opticDiscAbnormality)
	);
}

/** Whether any structured abnormal finding is present. */
export function hasAnyAbnormalFinding(r: EyeVisionResult): boolean {
	return (
		r.reducedVisualAcuity ||
		r.visualFieldDefect ||
		r.raisedIntraocularPressure ||
		r.diabeticRetinopathy ||
		r.opticDiscAbnormality ||
		r.macularAbnormality
	);
}

/** Whether the diabetic-retinopathy grade is referable (R2/R3-equivalent or maculopathy). */
export function hasReferableRetinopathy(r: EyeVisionResult): boolean {
	return (
		r.retinopathyGrade === 'pre-proliferative' ||
		r.retinopathyGrade === 'proliferative' ||
		r.retinopathyGrade === 'maculopathy'
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
		case 'visual-acuity':
			return 'Visual acuity';
		case 'visual-fields':
			return 'Visual fields';
		case 'refraction':
			return 'Refraction';
		case 'fundus-examination':
			return 'Fundus examination';
		case 'optical-coherence-tomography':
			return 'Optical coherence tomography';
		case 'fluorescein-angiography':
			return 'Fluorescein angiography';
		case 'tonometry':
			return 'Tonometry';
		case 'slit-lamp':
			return 'Slit-lamp examination';
		case 'orthoptic-assessment':
			return 'Orthoptic assessment';
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

/** Human-readable visual-field-result label. */
export function visualFieldResultLabel(value: VisualFieldResult | string): string {
	switch (value) {
		case 'full':
			return 'Full fields';
		case 'defect-right':
			return 'Defect — right';
		case 'defect-left':
			return 'Defect — left';
		case 'bilateral-defect':
			return 'Bilateral defect';
		default:
			return 'Not recorded';
	}
}

/** Human-readable diabetic-retinopathy-grade label. */
export function retinopathyGradeLabel(value: RetinopathyGrade | string): string {
	switch (value) {
		case 'none':
			return 'None (R0)';
		case 'background':
			return 'Background (R1)';
		case 'pre-proliferative':
			return 'Pre-proliferative (R2)';
		case 'proliferative':
			return 'Proliferative (R3)';
		case 'maculopathy':
			return 'Maculopathy (M1)';
		case 'not-applicable':
			return 'Not applicable';
		default:
			return 'Not recorded';
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
