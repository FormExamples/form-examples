import type { RulePriority } from './types';

/**
 * Number of whole weeks between two YYYY-MM-DD dates (later - earlier).
 * Returns null when either input is missing or unparseable.
 */
export function weeksBetween(earlier: string, later: string): number | null {
	if (!earlier || !later) return null;
	const a = new Date(earlier);
	const b = new Date(later);
	if (isNaN(a.getTime()) || isNaN(b.getTime())) return null;
	const ms = b.getTime() - a.getTime();
	return Math.floor(ms / (7 * 24 * 60 * 60 * 1000));
}

/**
 * Whole-day difference (later - earlier) for two YYYY-MM-DD dates.
 * Returns null if either date is missing or unparseable.
 */
export function daysBetween(earlier: string, later: string): number | null {
	if (!earlier || !later) return null;
	const a = new Date(earlier);
	const b = new Date(later);
	if (isNaN(a.getTime()) || isNaN(b.getTime())) return null;
	const ms = b.getTime() - a.getTime();
	return Math.floor(ms / (24 * 60 * 60 * 1000));
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

/**
 * Light-touch shape check for an NMC PIN.
 *
 * An NMC PIN is documented as a 2-digit year + 1-letter prefix + 4-digit
 * sequence + 1-letter suffix (e.g. 12A3456E). This check is forgiving:
 * it accepts 6-12 alphanumeric characters with no spaces.
 */
export function looksLikeNmcPin(value: string): boolean {
	if (!isFilled(value)) return false;
	return /^[A-Za-z0-9]{6,12}$/.test(value.trim());
}
