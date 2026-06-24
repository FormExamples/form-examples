import type {
	MammographyResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	ExamType,
	Laterality,
	BreastDensity,
	BiRadsCategory,
	ReportStatus
} from './types';

// ──────────────────────────────────────────────
// Structured-findings predicates
// ──────────────────────────────────────────────

/** Whether any structured abnormal finding is present. */
export function hasAnyAbnormalFinding(r: MammographyResult): boolean {
	return (
		r.mass ||
		r.calcifications ||
		r.architecturalDistortion ||
		r.asymmetry ||
		r.skinOrNippleChange ||
		r.lymphadenopathy
	);
}

/** Whether the report describes only incidental findings (no abnormal ones). */
export function hasOnlyIncidentalFinding(r: MammographyResult): boolean {
	return r.incidentalFinding && !hasAnyAbnormalFinding(r);
}

// ──────────────────────────────────────────────
// BI-RADS band helpers (the key structured score)
// ──────────────────────────────────────────────

/**
 * A BI-RADS 4 or 5 (or 4a/4b/4c) final assessment is a critical / urgent band
 * that auto-escalates Axis D and raises the abnormal-requiring-action /
 * urgent-referral flags regardless of the other axes. Mirrors the back-end
 * invariant.
 */
export function isBiRadsUrgent(category: BiRadsCategory | string): boolean {
	return (
		category === '4a' ||
		category === '4b' ||
		category === '4c' ||
		category === '5'
	);
}

/**
 * A BI-RADS 4c or 5 final assessment maps to the critical classification band
 * (≥ 50 % likelihood of malignancy).
 */
export function isBiRadsCritical(category: BiRadsCategory | string): boolean {
	return category === '4c' || category === '5';
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

/** Human-readable exam-type label. */
export function examTypeLabel(value: ExamType | string): string {
	switch (value) {
		case 'screening':
			return 'Screening';
		case 'diagnostic':
			return 'Diagnostic';
		case 'symptomatic':
			return 'Symptomatic';
		case 'surveillance':
			return 'Surveillance';
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
		default:
			return 'Unspecified';
	}
}

/** Human-readable ACR breast-density label. */
export function breastDensityLabel(value: BreastDensity | string): string {
	switch (value) {
		case 'a':
			return 'a — almost entirely fatty';
		case 'b':
			return 'b — scattered fibroglandular';
		case 'c':
			return 'c — heterogeneously dense';
		case 'd':
			return 'd — extremely dense';
		default:
			return 'Unspecified';
	}
}

/** Human-readable BI-RADS final-assessment label. */
export function biRadsLabel(value: BiRadsCategory | string): string {
	switch (value) {
		case '0':
			return 'BI-RADS 0 — incomplete';
		case '1':
			return 'BI-RADS 1 — negative';
		case '2':
			return 'BI-RADS 2 — benign';
		case '3':
			return 'BI-RADS 3 — probably benign';
		case '4a':
			return 'BI-RADS 4a — suspicious (low)';
		case '4b':
			return 'BI-RADS 4b — suspicious (intermediate)';
		case '4c':
			return 'BI-RADS 4c — suspicious (moderate)';
		case '5':
			return 'BI-RADS 5 — highly suggestive of malignancy';
		case '6':
			return 'BI-RADS 6 — known biopsy-proven malignancy';
		default:
			return 'Not assigned';
	}
}

/** Short BI-RADS label (for compact dashboard columns and badges). */
export function biRadsShortLabel(value: BiRadsCategory | string): string {
	return value === '' || value === undefined ? '—' : `BI-RADS ${value}`;
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

/** BI-RADS final-assessment badge colour (by malignancy band). */
export function biRadsColor(value: BiRadsCategory | string): string {
	switch (value) {
		case '1':
		case '2':
			return 'bg-green-100 text-green-800 border-green-300';
		case '3':
			return 'bg-yellow-100 text-yellow-800 border-yellow-300';
		case '0':
			return 'bg-gray-100 text-gray-700 border-gray-300';
		case '4a':
		case '4b':
			return 'bg-orange-100 text-orange-800 border-orange-300';
		case '4c':
		case '5':
			return 'bg-red-100 text-red-800 border-red-300';
		case '6':
			return 'bg-purple-100 text-purple-800 border-purple-300';
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
