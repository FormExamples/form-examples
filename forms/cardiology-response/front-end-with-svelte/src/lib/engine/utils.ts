import type {
	CardiologyResponse,
	ResponseClassification,
	Severity,
	FollowUpUrgency,
	ConsultationType,
	ResponseStatus,
	PrimaryDiagnosisCategory
} from './types';

// ──────────────────────────────────────────────
// Structured-findings predicates
// ──────────────────────────────────────────────

/**
 * A critical result auto-escalates Axis D to critical-alert and raises the
 * critical-finding flag. The clinician sets `criticalResult` explicitly when a
 * critical or unexpected significant cardiac result is present (e.g. critical
 * arrhythmia, severe symptomatic aortic stenosis, acute coronary syndrome).
 * Mirrors the back-end invariant.
 */
export function hasCriticalFinding(r: CardiologyResponse): boolean {
	return r.criticalResult;
}

/** Whether any structured cardiac finding is present. */
export function hasAnyCardiacFinding(r: CardiologyResponse): boolean {
	return (
		r.ischaemiaOrCad ||
		r.significantArrhythmia ||
		r.reducedEjectionFraction ||
		r.significantValveDisease ||
		r.structuralAbnormality ||
		r.uncontrolledHypertension
	);
}

/** Reduced ejection fraction is present if the flag is set or LVEF < 40 %. */
export function hasReducedEjectionFraction(r: CardiologyResponse): boolean {
	return (
		r.reducedEjectionFraction ||
		(r.lvEjectionFractionPercent !== null && r.lvEjectionFractionPercent < 40)
	);
}

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

/** Axis A response-classification display label. */
export function responseClassificationLabel(value: string): string {
	switch (value) {
		case 'no-abnormality':
			return 'No abnormality';
		case 'cardiac-condition':
			return 'Cardiac condition';
		case 'critical':
			return 'Critical';
		case 'inconclusive':
			return 'Inconclusive';
		default:
			return 'Not graded';
	}
}

/** Axis B severity display label. */
export function severityLabel(value: string): string {
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

/** Human-readable consultation-type label. */
export function consultationTypeLabel(value: ConsultationType | string): string {
	switch (value) {
		case 'clinic-review':
			return 'Clinic review';
		case 'advice-and-guidance':
			return 'Advice and guidance';
		case 'telephone':
			return 'Telephone';
		case 'inpatient-review':
			return 'Inpatient review';
		case 'virtual':
			return 'Virtual';
		default:
			return 'Unspecified';
	}
}

/** Human-readable response-status label. */
export function responseStatusLabel(value: ResponseStatus | string): string {
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

/** Human-readable primary-diagnosis-category label. */
export function primaryDiagnosisCategoryLabel(value: PrimaryDiagnosisCategory | string): string {
	switch (value) {
		case 'coronary-artery-disease':
			return 'Coronary artery disease';
		case 'heart-failure':
			return 'Heart failure';
		case 'arrhythmia':
			return 'Arrhythmia';
		case 'valve-disease':
			return 'Valve disease';
		case 'hypertension':
			return 'Hypertension';
		case 'cardiomyopathy':
			return 'Cardiomyopathy';
		case 'non-cardiac':
			return 'Non-cardiac';
		case 'no-abnormality':
			return 'No abnormality';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

// ──────────────────────────────────────────────
// Display colours (Tailwind utility classes)
// ──────────────────────────────────────────────

/** Axis A response-classification badge colour. */
export function responseClassificationColor(value: ResponseClassification | string): string {
	switch (value) {
		case 'no-abnormality':
			return 'bg-success text-success-content border-success';
		case 'cardiac-condition':
			return 'bg-warning text-warning-content border-warning';
		case 'critical':
			return 'bg-error text-error-content border-error';
		case 'inconclusive':
			return 'bg-base-300 text-base-content border-base-300';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis B severity badge colour. */
export function severityColor(value: Severity | string): string {
	switch (value) {
		case 'none':
			return 'bg-success text-success-content border-success';
		case 'minor':
			return 'bg-info text-info-content border-info';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'major':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis D follow-up-urgency badge colour. */
export function followUpUrgencyColor(value: FollowUpUrgency | string): string {
	switch (value) {
		case 'routine':
			return 'bg-success text-success-content border-success';
		case 'recommended':
			return 'bg-info text-info-content border-info';
		case 'urgent':
			return 'bg-warning text-warning-content border-warning';
		case 'critical-alert':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Flag-priority badge colour. */
export function priorityColor(value: string): string {
	switch (value) {
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-base-300 text-base-content border-base-300';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}
