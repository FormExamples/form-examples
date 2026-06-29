import type { Outcome, TriState } from './types';

/** Friendly label for an overall pass/fail Outcome. */
export function outcomeLabel(outcome: Outcome): string {
	switch (outcome) {
		case 'pass':
			return 'Pass';
		case 'fail':
			return 'Fail';
		default:
			return 'Not graded';
	}
}

/** Lily-token colour triple for the outcome badge / banner. */
export function outcomeColor(outcome: Outcome): string {
	switch (outcome) {
		case 'pass':
			return 'bg-success text-success-content border-success';
		case 'fail':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Friendly label for a tri-state checklist response. */
export function triStateLabel(status: TriState): string {
	switch (status) {
		case 'yes':
			return 'Performed';
		case 'no':
			return 'Not performed';
		case 'na':
			return 'Not applicable';
		default:
			return '—';
	}
}

/** Lily-token colour triple for a tri-state response pill. */
export function triStateColor(status: TriState): string {
	switch (status) {
		case 'yes':
			return 'bg-success text-success-content border-success';
		case 'no':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
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

/** Format a percentage to a whole-number string with a trailing `%`. */
export function formatPercent(percent: number): string {
	return `${Math.round(percent)}%`;
}

/** Full candidate display name, "Surname, Given". */
export function candidateName(firstName: string, lastName: string): string {
	const last = lastName.trim();
	const first = firstName.trim();
	if (last && first) return `${last}, ${first}`;
	return last || first || '';
}
