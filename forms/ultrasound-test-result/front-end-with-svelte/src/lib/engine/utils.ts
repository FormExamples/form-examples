import type {
	UltrasoundResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	BodyRegion,
	ReportStatus,
	Laterality
} from './types';

// ──────────────────────────────────────────────
// Structured-findings predicates
// ──────────────────────────────────────────────

/**
 * A critical finding (DVT present on venous Doppler, or an aneurysm such as a
 * ruptured / large abdominal aortic aneurysm) auto-escalates Axis D to
 * critical-alert. Sonographic signs of testicular torsion are likewise critical
 * and are captured via the narrative on a scrotum-testes examination. Mirrors
 * the back-end invariant.
 */
export function hasCriticalFinding(r: UltrasoundResult): boolean {
	return r.dvtPresent || r.aneurysm;
}

/** Whether any structured abnormal finding is present. */
export function hasAnyAbnormalFinding(r: UltrasoundResult): boolean {
	return (
		r.massOrLesion ||
		r.cyst ||
		r.gallstones ||
		r.hydronephrosis ||
		r.freeFluid ||
		r.dvtPresent ||
		r.aneurysm ||
		r.organEnlargement ||
		// gradeSeverity independently grades a lesion >= 30mm as major from the
		// raw measurement, even when the massOrLesion checkbox itself is unset —
		// Axis A must agree.
		(r.largestLesionSizeMm !== null && r.largestLesionSizeMm >= 30)
	);
}

/** Whether the report describes only incidental findings (no abnormal ones). */
export function hasOnlyIncidentalFinding(r: UltrasoundResult): boolean {
	return r.incidentalFinding && !hasAnyAbnormalFinding(r);
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

/** Human-readable body-region label. */
export function bodyRegionLabel(value: BodyRegion | string): string {
	switch (value) {
		case 'abdomen':
			return 'Abdomen';
		case 'pelvis':
			return 'Pelvis';
		case 'renal-tract':
			return 'Renal tract';
		case 'liver-biliary':
			return 'Liver / biliary';
		case 'thyroid-neck':
			return 'Thyroid / neck';
		case 'scrotum-testes':
			return 'Scrotum / testes';
		case 'breast':
			return 'Breast';
		case 'soft-tissue':
			return 'Soft tissue';
		case 'vascular-doppler':
			return 'Vascular Doppler';
		case 'dvt-leg':
			return 'DVT leg';
		case 'carotid':
			return 'Carotid';
		case 'msk-joint':
			return 'MSK / joint';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable laterality label. */
export function lateralityLabel(value: Laterality | string): string {
	switch (value) {
		case 'left':
			return 'Left';
		case 'right':
			return 'Right';
		case 'bilateral':
			return 'Bilateral';
		case 'not-applicable':
			return 'Not applicable';
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
