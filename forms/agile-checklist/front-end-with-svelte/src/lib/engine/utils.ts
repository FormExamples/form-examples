import type { Band, Maturity } from './types.js';

/** Human-readable label for a composite agility maturity level. */
export function maturityLabel(maturity: Maturity): string {
	switch (maturity) {
		case 'optimising':
			return 'Optimising';
		case 'mature':
			return 'Mature';
		case 'developing':
			return 'Developing';
		case 'initial':
			return 'Initial';
		case 'ad-hoc':
			return 'Ad-hoc';
		default:
			return 'Insufficient data';
	}
}

/**
 * Lily token colour triple for a maturity level, used by the report banner and
 * dashboard. Higher maturity → success; lower → warning/error; unknown → base.
 */
export function maturityColor(maturity: Maturity): string {
	switch (maturity) {
		case 'optimising':
		case 'mature':
			return 'bg-success text-success-content border-success';
		case 'developing':
			return 'bg-warning text-warning-content border-warning';
		case 'initial':
		case 'ad-hoc':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Human-readable label for a section band. */
export function bandLabel(band: Band): string {
	switch (band) {
		case 'high':
			return 'High';
		case 'mid':
			return 'Mid';
		case 'low':
			return 'Low';
		default:
			return 'Unanswered';
	}
}

/** Lily token colour triple for a section band. */
export function bandColor(band: Band): string {
	switch (band) {
		case 'high':
			return 'bg-success text-success-content border-success';
		case 'mid':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily token colour triple for a flag priority. */
export function priorityColor(priority: 'low' | 'medium' | 'high'): string {
	switch (priority) {
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Format a section percentage, or an em-dash when undefined. */
export function pctOrDash(p: number | null): string {
	return p === null ? '—' : `${p.toFixed(0)}%`;
}
