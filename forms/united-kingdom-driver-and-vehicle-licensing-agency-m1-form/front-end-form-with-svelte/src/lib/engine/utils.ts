import type { RulePriority } from './types';

/** Calculate age (years) from a YYYY-MM-DD date string. Returns null on bad input. */
export function calculateAge(dob: string): number | null {
	if (!dob) return null;
	const birth = new Date(dob);
	if (isNaN(birth.getTime())) return null;
	const today = new Date();
	let age = today.getFullYear() - birth.getFullYear();
	const m = today.getMonth() - birth.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
	return age;
}

/** Tailwind colour classes for a priority badge. */
export function priorityColor(priority: RulePriority | ''): string {
	switch (priority) {
		case 'urgent':
			return 'bg-red-200 text-red-900 border-red-400';
		case 'high':
			return 'bg-red-100 text-red-800 border-red-300';
		case 'medium':
			return 'bg-orange-100 text-orange-800 border-orange-300';
		case 'low':
			return 'bg-yellow-100 text-yellow-800 border-yellow-300';
		default:
			return 'bg-gray-100 text-gray-700 border-gray-300';
	}
}

/** Human-readable label for a priority. */
export function priorityLabel(priority: RulePriority | ''): string {
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

/** Numeric ordering for priority sort: urgent < high < medium < low. */
export function priorityOrder(priority: RulePriority): number {
	switch (priority) {
		case 'urgent':
			return 0;
		case 'high':
			return 1;
		case 'medium':
			return 2;
		case 'low':
			return 3;
	}
}

/** True when a string looks like a non-empty trimmed value. */
export function isFilled(value: string): boolean {
	return typeof value === 'string' && value.trim().length > 0;
}

/** True when a UK postcode-shaped string is present. Light validation only. */
export function looksLikePostcode(value: string): boolean {
	if (!isFilled(value)) return false;
	// Forgiving: alpha-num + space, 5-8 chars; the DVLA accepts free-form.
	return /^[A-Za-z0-9 ]{5,8}$/.test(value.trim());
}
