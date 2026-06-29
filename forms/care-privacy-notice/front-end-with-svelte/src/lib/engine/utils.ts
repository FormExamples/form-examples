/** Calculate completeness percentage. */
export function completenessPercent(completed: number, total: number): number {
	if (total === 0) return 100;
	return Math.round((completed / total) * 100);
}

/** Get validation status label from completeness percentage. */
export function validationStatus(completeness: number): 'Complete' | 'Incomplete' {
	return completeness === 100 ? 'Complete' : 'Incomplete';
}

/** Get colour class (Lily tokens) for completeness display. */
export function completenessColor(completeness: number): string {
	if (completeness === 100) return 'bg-success text-success-content border-success';
	if (completeness >= 50) return 'bg-warning text-warning-content border-warning';
	return 'bg-error text-error-content border-error';
}

/** Get colour class (Lily tokens) for a Complete/Incomplete status banner. */
export function statusColor(status: 'Complete' | 'Incomplete'): string {
	return status === 'Complete'
		? 'bg-success text-success-content border-success'
		: 'bg-warning text-warning-content border-warning';
}

/** Completeness label for display. */
export function completenessLabel(completeness: number): string {
	return `${completeness}% Complete`;
}
