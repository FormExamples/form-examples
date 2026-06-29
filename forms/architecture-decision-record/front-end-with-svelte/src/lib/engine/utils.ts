import type { Status, DecisionGroup, FlagPriority } from './types';

/** Human-readable label for a workflow status. */
export function statusLabel(status: Status): string {
	switch (status) {
		case 'pending':
			return 'Pending';
		case 'decided':
			return 'Decided';
		case 'approved':
			return 'Approved';
		case 'superseded':
			return 'Superseded';
		case 'deprecated':
			return 'Deprecated';
		default:
			return status;
	}
}

/** Lily-token colour triple for a workflow status badge/banner. */
export function statusColor(status: Status): string {
	switch (status) {
		case 'approved':
			return 'bg-success text-success-content border-success';
		case 'decided':
			return 'bg-info text-info-content border-info';
		case 'pending':
			return 'bg-warning text-warning-content border-warning';
		case 'deprecated':
			return 'bg-error text-error-content border-error';
		case 'superseded':
			return 'bg-base-300 text-base-content border-base-300';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Human-readable label for an architectural decision group. */
export function groupLabel(group: DecisionGroup): string {
	if (!group) return '—';
	return group.charAt(0).toUpperCase() + group.slice(1);
}

/** Lily-token colour triple for a completeness percentage banner. */
export function completenessColor(percent: number): string {
	if (percent >= 80) return 'bg-success text-success-content border-success';
	if (percent >= 50) return 'bg-warning text-warning-content border-warning';
	return 'bg-error text-error-content border-error';
}

/** Lily-token colour triple for a flag priority chip. */
export function priorityColor(priority: FlagPriority): string {
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

/** Zero-pad an ADR number to four digits, or 'NNNN' if unset. */
export function pad4(n: string | number | null): string {
	if (n === null || n === undefined || n === '') return 'NNNN';
	return String(n).padStart(4, '0');
}
