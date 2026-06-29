import type { Outcome, Priority } from './types';

/** Outcome label. */
export function outcomeLabel(outcome: Outcome): string {
	switch (outcome) {
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

/** Outcome description (one-liner shown on the report banner). */
export function outcomeDescription(outcome: Outcome): string {
	switch (outcome) {
		case 'complete':
			return 'All mandatory items confirmed and countersigned';
		case 'partial':
			return 'Non-blocking items outstanding; exit date may proceed with waiver';
		case 'incomplete':
			return 'Mandatory item(s) outstanding; exit should not proceed without manager escalation';
		default:
			return '';
	}
}

/** Outcome colour class (Lily tokens). */
export function outcomeColor(outcome: Outcome): string {
	switch (outcome) {
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

/** Priority label. */
export function priorityLabel(priority: Priority): string {
	switch (priority) {
		case 'high':
			return 'HIGH';
		case 'medium':
			return 'MEDIUM';
		case 'low':
			return 'LOW';
		default:
			return '';
	}
}

/** Priority colour class (Lily tokens). */
export function priorityColor(priority: Priority): string {
	switch (priority) {
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

/** Human label for the reason-for-leaving enum. */
export function reasonLabel(reason: string): string {
	switch (reason) {
		case 'resignation':
			return 'Resignation';
		case 'retirement':
			return 'Retirement';
		case 'redundancy':
			return 'Redundancy';
		case 'dismissal':
			return 'Dismissal';
		case 'end-of-fixed-term':
			return 'End of fixed term';
		case 'transfer':
			return 'Transfer';
		case 'other':
			return 'Other';
		default:
			return 'Not recorded';
	}
}

/** Format a date string for display. */
export function formatDate(dateStr: string): string {
	if (!dateStr) return 'N/A';
	const d = new Date(dateStr);
	if (isNaN(d.getTime())) return dateStr;
	return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Check whether a date string parses to a date in the past. */
export function isDatePast(dateStr: string): boolean {
	if (!dateStr) return false;
	const d = new Date(dateStr);
	if (isNaN(d.getTime())) return false;
	return d < new Date();
}
