import type { CompletenessLevel, FlagPriority, SectionKey } from './types';

/** True if a string is non-empty after trimming. */
export function hasText(s: string | null | undefined): boolean {
	return typeof s === 'string' && s.trim() !== '';
}

/** True if a Yes/No/Unknown field has been answered. */
export function isYesNoUnknownAnswered(value: string): boolean {
	return value === 'yes' || value === 'no' || value === 'unknown';
}

/** True if a value is a finite number (not null and not NaN). */
export function hasNumber(v: number | null | undefined): v is number {
	return typeof v === 'number' && Number.isFinite(v);
}

/** Human-readable label for a data-model section key. */
export function sectionLabel(section: SectionKey | string): string {
	switch (section) {
		case 'requestingProvider':
			return 'Requesting Provider';
		case 'receivingProvider':
			return 'Receiving Provider';
		case 'patientDemographics':
			return 'Patient Demographics';
		case 'situation':
			return 'Situation';
		case 'background':
			return 'Background';
		case 'assessment':
			return 'Assessment';
		case 'recommendation':
			return 'Recommendation';
		case 'transferLogistics':
			return 'Transfer Logistics';
		case 'signoffAcknowledgement':
			return 'Sign-off & Acknowledgement';
		default:
			return String(section);
	}
}

/** Flag-priority label. */
export function priorityLabel(priority: FlagPriority): string {
	switch (priority) {
		case 'urgent':
			return 'Urgent';
		case 'high':
			return 'High';
		case 'medium':
			return 'Medium';
		case 'low':
			return 'Low';
		default:
			return '';
	}
}

/** Completeness-level label. */
export function completenessLabel(level: CompletenessLevel): string {
	switch (level) {
		case 'complete':
			return 'Complete';
		case 'partial':
			return 'Partial';
		case 'incomplete':
			return 'Incomplete';
		default:
			return '';
	}
}

/** Lily token colour triple for a completeness level (used by report + dashboard). */
export function completenessColor(level: CompletenessLevel): string {
	switch (level) {
		case 'complete':
			return 'bg-success text-success-content border-success';
		case 'partial':
			return 'bg-warning text-warning-content border-warning';
		case 'incomplete':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily token colour triple for a flag priority. */
export function priorityColor(priority: FlagPriority): string {
	switch (priority) {
		case 'urgent':
			return 'bg-error text-error-content border-error';
		case 'high':
			return 'bg-warning text-warning-content border-warning';
		case 'medium':
			return 'bg-info text-info-content border-info';
		case 'low':
			return 'bg-base-300 text-base-content border-base-300';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Calculate age (years) from an ISO date-of-birth string. */
export function calculateAge(dob: string): number | null {
	if (!dob) return null;
	const birth = new Date(dob);
	if (isNaN(birth.getTime())) return null;
	const today = new Date();
	let age = today.getFullYear() - birth.getFullYear();
	const m = today.getMonth() - birth.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
		age--;
	}
	return age;
}

/** Human-readable label for a transfer urgency. */
export function urgencyLabel(urgency: string): string {
	switch (urgency) {
		case 'routine':
			return 'Routine';
		case 'urgent':
			return 'Urgent';
		case 'emergent':
			return 'Emergent';
		default:
			return '—';
	}
}
