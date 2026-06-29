import type { CompletenessLevel, RuleStatus } from './types';

/** Calculate age (years) from a date-of-birth string. Returns null if invalid. */
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

/** Friendly label for an IPS completeness level. */
export function completenessLevelLabel(level: CompletenessLevel): string {
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

/** Lily-token colour triple for an IPS completeness level. */
export function completenessLevelColor(level: CompletenessLevel): string {
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

/** Friendly label for a per-section audit status. */
export function ruleStatusLabel(status: RuleStatus): string {
	switch (status) {
		case 'ok':
			return 'Populated';
		case 'empty':
			return 'Empty';
		case 'optional':
			return 'Optional — empty';
		default:
			return status;
	}
}

/** Lily-token colour triple for a per-section audit status. */
export function ruleStatusColor(status: RuleStatus): string {
	switch (status) {
		case 'ok':
			return 'bg-success text-success-content border-success';
		case 'empty':
			return 'bg-error text-error-content border-error';
		case 'optional':
			return 'bg-warning text-warning-content border-warning';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily-token colour triple for a flag priority. */
export function priorityColor(priority: 'urgent' | 'high' | 'medium' | 'low'): string {
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
