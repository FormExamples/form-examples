import type { GradingResult } from './types';

/** Calculate completeness percentage. */
export function completenessPercent(completed: number, total: number): number {
	if (total === 0) return 100;
	return Math.round((completed / total) * 100);
}

/** Get validation status label from completeness percentage. */
export function validationStatus(completeness: number): 'Complete' | 'Incomplete' {
	return completeness === 100 ? 'Complete' : 'Incomplete';
}

/** Lily-token colour triple for a completeness status banner / badge. */
export function statusColor(status: GradingResult['status']): string {
	return status === 'Complete'
		? 'bg-success text-success-content border-success'
		: 'bg-warning text-warning-content border-warning';
}

/** Lily-token colour triple keyed off completeness percentage. */
export function completenessColor(completeness: number): string {
	if (completeness === 100) return 'bg-success text-success-content border-success';
	if (completeness >= 50) return 'bg-warning text-warning-content border-warning';
	return 'bg-error text-error-content border-error';
}

/** Completeness label for display. */
export function completenessLabel(completeness: number): string {
	return `${completeness}% Complete`;
}

/** Lily-token colour triple for a flag priority. */
export function priorityColor(priority: 'high' | 'medium' | 'low'): string {
	switch (priority) {
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}
