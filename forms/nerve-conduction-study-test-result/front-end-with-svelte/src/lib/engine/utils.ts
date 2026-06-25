import type {
	NerveConductionStudyResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	StudyType,
	Region,
	ReportStatus
} from './types';

// ──────────────────────────────────────────────
// Structured-findings predicates
// ──────────────────────────────────────────────

/**
 * A critical finding — motor neurone disease / anterior-horn-cell features, or a
 * severe acute neuropathy such as a Guillain-Barré syndrome (acute inflammatory
 * demyelinating) pattern — auto-escalates Axis D to critical-alert. Mirrors the
 * back-end invariant.
 */
export function hasCriticalFinding(r: NerveConductionStudyResult): boolean {
	return r.motorNeuroneDiseaseFeatures || isSevereAcuteNeuropathy(r);
}

/**
 * A severe acute neuropathy (e.g. a GBS / acute inflammatory demyelinating
 * pattern): a peripheral neuropathy that is severe and demyelinating.
 */
export function isSevereAcuteNeuropathy(r: NerveConductionStudyResult): boolean {
	return r.peripheralNeuropathy && r.severity === 'severe' && r.pattern === 'demyelinating';
}

/** Whether any structured abnormal (diagnostic) finding is present. */
export function hasAnyAbnormalFinding(r: NerveConductionStudyResult): boolean {
	return (
		r.carpalTunnelSyndrome ||
		r.peripheralNeuropathy ||
		r.radiculopathy ||
		r.motorNeuroneDiseaseFeatures ||
		r.myopathy ||
		r.neuromuscularJunctionDisorder
	);
}

/** Whether the study is recorded as electrodiagnostically normal. */
export function isNormalStudy(r: NerveConductionStudyResult): boolean {
	return r.normalStudy && !hasAnyAbnormalFinding(r);
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
		case 'nerve-conduction':
			return 'Nerve conduction';
		case 'emg':
			return 'Needle EMG';
		case 'nerve-conduction-and-emg':
			return 'Nerve conduction and EMG';
		case 'repetitive-stimulation':
			return 'Repetitive stimulation';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable region label. */
export function regionLabel(value: Region | string): string {
	switch (value) {
		case 'upper-limb':
			return 'Upper limb';
		case 'lower-limb':
			return 'Lower limb';
		case 'all-limbs':
			return 'All limbs';
		case 'cranial':
			return 'Cranial';
		case 'generalised':
			return 'Generalised';
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
