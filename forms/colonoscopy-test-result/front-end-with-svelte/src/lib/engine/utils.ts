import type {
	ColonoscopyResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	Procedure,
	ReportStatus
} from './types';

// ──────────────────────────────────────────────
// Structured-findings predicates
// ──────────────────────────────────────────────

/**
 * A critical finding (a mass lesion suspicious for malignancy, or a perforation
 * complication) auto-escalates Axis D to critical-alert. Mirrors the back-end
 * invariant.
 */
export function hasCriticalFinding(r: ColonoscopyResult): boolean {
	return r.massLesion || r.complication === 'perforation';
}

/** Whether any structured abnormal finding is present. */
export function hasAnyAbnormalFinding(r: ColonoscopyResult): boolean {
	return (
		r.polypsFound ||
		r.massLesion ||
		r.diverticulosis ||
		r.inflammationIbd ||
		r.angiodysplasia ||
		r.bleedingSourceIdentified
	);
}

/** Whether the report describes only diverticulosis (a common incidental finding). */
export function hasOnlyIncidentalFinding(r: ColonoscopyResult): boolean {
	return (
		r.diverticulosis &&
		!r.polypsFound &&
		!r.massLesion &&
		!r.inflammationIbd &&
		!r.angiodysplasia &&
		!r.bleedingSourceIdentified
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

/** Human-readable procedure label. */
export function procedureLabel(value: Procedure | string): string {
	switch (value) {
		case 'colonoscopy':
			return 'Colonoscopy';
		case 'flexible-sigmoidoscopy':
			return 'Flexible sigmoidoscopy';
		case 'ct-colonography':
			return 'CT colonography';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable extent-reached label. */
export function extentReachedLabel(value: string): string {
	switch (value) {
		case 'caecum':
			return 'Caecum';
		case 'terminal-ileum':
			return 'Terminal ileum';
		case 'hepatic-flexure':
			return 'Hepatic flexure';
		case 'splenic-flexure':
			return 'Splenic flexure';
		case 'descending-colon':
			return 'Descending colon';
		case 'rectum-sigmoid':
			return 'Rectum / sigmoid';
		case 'incomplete':
			return 'Incomplete';
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
