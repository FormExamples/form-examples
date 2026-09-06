import type {
	AngiographyResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	AngiographyType,
	BodyRegion,
	ReportStatus
} from './types';

// ──────────────────────────────────────────────
// Structured-findings predicates
// ──────────────────────────────────────────────

/** A critical stenosis threshold (near-occlusion); NASCET-style diameter reduction. */
export const CRITICAL_STENOSIS_PERCENT = 99;

/** Whether the maximum stenosis is in the critical (near-occlusion) range. */
export function hasCriticalStenosis(r: AngiographyResult): boolean {
	return r.maxStenosisPercent !== null && r.maxStenosisPercent >= CRITICAL_STENOSIS_PERCENT;
}

/**
 * A critical finding (active extravasation, dissection, occlusion, or a
 * critical near-occlusive stenosis) auto-escalates Axis D to critical-alert.
 * Mirrors the back-end invariant.
 */
export function hasCriticalFinding(r: AngiographyResult): boolean {
	return r.activeExtravasation || r.dissection || r.occlusion || hasCriticalStenosis(r);
}

/** Whether any structured abnormal finding is present. */
export function hasAnyAbnormalFinding(r: AngiographyResult): boolean {
	return (
		r.significantStenosis ||
		r.occlusion ||
		r.aneurysm ||
		r.dissection ||
		r.activeExtravasation ||
		r.thrombus ||
		// gradeSeverity independently grades any stenosis >= 50% moderate (or
		// >= 70% major) from the raw maxStenosisPercent measurement, even when
		// the significantStenosis checkbox itself is unset — Axis A must agree.
		(r.maxStenosisPercent !== null && r.maxStenosisPercent >= 50)
	);
}

/** Whether the report describes only incidental findings (no abnormal ones). */
export function hasOnlyIncidentalFinding(r: AngiographyResult): boolean {
	return r.incidentalFinding && !hasAnyAbnormalFinding(r);
}

/**
 * NASCET / ECST stenosis-severity category from the maximum stenosis percent.
 * Categories: <50% / 50-69% / 70-99% / near-occlusion / occluded.
 */
export function stenosisSeverityCategory(r: AngiographyResult): string {
	if (r.occlusion) return 'occluded';
	const pct = r.maxStenosisPercent;
	if (pct === null) return '';
	if (pct >= CRITICAL_STENOSIS_PERCENT) return 'near-occlusion';
	if (pct >= 70) return '70-99%';
	if (pct >= 50) return '50-69%';
	return '<50%';
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

/** Human-readable angiography-type label. */
export function angiographyTypeLabel(value: AngiographyType | string): string {
	switch (value) {
		case 'ct-angiography':
			return 'CT angiography (CTA)';
		case 'mr-angiography':
			return 'MR angiography (MRA)';
		case 'catheter-dsa':
			return 'Catheter / DSA';
		case 'coronary-angiography':
			return 'Coronary angiography';
		case 'peripheral-angiography':
			return 'Peripheral angiography';
		case 'cerebral-angiography':
			return 'Cerebral angiography';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable body-region label. */
export function bodyRegionLabel(value: BodyRegion | string): string {
	switch (value) {
		case 'coronary':
			return 'Coronary';
		case 'cerebral':
			return 'Cerebral';
		case 'carotid':
			return 'Carotid';
		case 'aorta':
			return 'Aorta';
		case 'renal':
			return 'Renal';
		case 'peripheral-lower-limb':
			return 'Peripheral lower limb';
		case 'pulmonary':
			return 'Pulmonary';
		case 'mesenteric':
			return 'Mesenteric';
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
