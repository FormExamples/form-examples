import type {
	AppropriatenessBand,
	ExamType,
	Indication,
	Laterality,
	PriorityBand,
	Recommendation,
	TriageTier,
	Urgency
} from './types';

// ──────────────────────────────────────────────
// Age helper
// ──────────────────────────────────────────────

/** Whole-years age from a date-of-birth string, or `null` if unparseable. */
export function ageInYears(dob: string): number | null {
	if (!dob) return null;
	const d = new Date(dob);
	if (Number.isNaN(d.getTime())) return null;
	const now = new Date();
	let age = now.getFullYear() - d.getFullYear();
	const m = now.getMonth() - d.getMonth();
	if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
	return age;
}

/** Title-case a hyphen / underscore separated value (e.g. `two-week-wait`). */
export function titleCase(value: string): string {
	return String(value || '')
		.replace(/[-_]/g, ' ')
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

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

/** Human-readable indication label. */
export function indicationLabel(value: Indication | string): string {
	switch (value) {
		case 'routine-screening':
			return 'Routine screening';
		case 'breast-lump':
			return 'Breast lump';
		case 'breast-pain':
			return 'Breast pain';
		case 'nipple-discharge':
			return 'Nipple discharge';
		case 'skin-change':
			return 'Skin change';
		case 'family-history':
			return 'Family history';
		case 'follow-up-known-cancer':
			return 'Follow-up known cancer';
		case 'post-treatment-surveillance':
			return 'Post-treatment surveillance';
		case 'recall-from-screening':
			return 'Recall from screening';
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

/** Axis A appropriateness-band display label. */
export function appropriatenessLabel(value: AppropriatenessBand | string): string {
	switch (value) {
		case 'usually-appropriate':
			return 'Usually appropriate';
		case 'may-be-appropriate':
			return 'May be appropriate';
		case 'usually-not-appropriate':
			return 'Usually not appropriate';
		default:
			return 'Not graded';
	}
}

/** Axis B triage-tier display label. */
export function triageTierLabel(value: TriageTier | string): string {
	switch (value) {
		case 'routine':
			return 'Routine';
		case 'urgent':
			return 'Urgent';
		case 'two-week-wait':
			return 'Two-week-wait';
		case 'emergency':
			return 'Emergency';
		default:
			return 'Not graded';
	}
}

/** Requested-urgency display label. */
export function urgencyLabel(value: Urgency | string): string {
	return triageTierLabel(value);
}

/** Axis D clinical-priority display label. */
export function priorityLabel(value: PriorityBand | string): string {
	switch (value) {
		case 'high':
			return 'High';
		case 'moderate':
			return 'Moderate';
		case 'low':
			return 'Low';
		default:
			return 'Not graded';
	}
}

/** Overall recommendation display label. */
export function recommendationLabel(value: Recommendation | string): string {
	switch (value) {
		case 'accept':
			return 'Accept and book';
		case 'query-referrer':
			return 'Query the referrer';
		case 'redirect':
			return 'Redirect';
		case 'reject':
			return 'Reject';
		default:
			return 'Not graded';
	}
}

// ──────────────────────────────────────────────
// Display colours (Lily Design System token utilities)
// ──────────────────────────────────────────────

/** Axis A appropriateness badge colour. */
export function appropriatenessColor(value: AppropriatenessBand | string): string {
	switch (value) {
		case 'usually-appropriate':
			return 'bg-success text-success-content border-success';
		case 'may-be-appropriate':
			return 'bg-warning text-warning-content border-warning';
		case 'usually-not-appropriate':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis B triage-tier badge colour. */
export function triageTierColor(value: TriageTier | string): string {
	switch (value) {
		case 'routine':
			return 'bg-success text-success-content border-success';
		case 'urgent':
			return 'bg-warning text-warning-content border-warning';
		case 'two-week-wait':
			return 'bg-error text-error-content border-error';
		case 'emergency':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis D clinical-priority badge colour. */
export function priorityBandColor(value: PriorityBand | string): string {
	switch (value) {
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-success text-success-content border-success';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Overall recommendation badge colour. */
export function recommendationColor(value: Recommendation | string): string {
	switch (value) {
		case 'accept':
			return 'bg-success text-success-content border-success';
		case 'query-referrer':
			return 'bg-warning text-warning-content border-warning';
		case 'redirect':
			return 'bg-info text-info-content border-info';
		case 'reject':
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
