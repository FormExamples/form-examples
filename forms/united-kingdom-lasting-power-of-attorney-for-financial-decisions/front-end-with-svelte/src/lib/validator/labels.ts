import type { CompositeRisk, DecisionMode, RulePriority, FlagPriority } from '$lib/types.js';

/** Human-readable label for an LP1F decision mode. */
export function decisionModeLabel(mode: string): string {
	switch (mode) {
		case 'single_attorney':
			return 'Single attorney';
		case 'jointly_and_severally':
			return 'Jointly and severally';
		case 'jointly':
			return 'Jointly';
		case 'mixed':
			return 'Mixed';
		default:
			return '—';
	}
}

/** Human-readable label for the when-attorneys-can-act choice. */
export function whenAttorneysCanActLabel(when: string): string {
	switch (when) {
		case 'as_soon_as_registered':
			return 'As soon as registered';
		case 'only_when_no_capacity':
			return 'Only when no capacity';
		default:
			return '—';
	}
}

/** Title-case a snake_case validity band or OPG status. */
export function bandLabel(band: string): string {
	if (!band) return '—';
	return band.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Human-readable composite-risk label. */
export function compositeRiskLabel(risk: CompositeRisk): string {
	switch (risk) {
		case 'low':
			return 'Low';
		case 'moderate':
			return 'Moderate';
		case 'high':
			return 'High';
		case 'critical':
			return 'Critical';
		default:
			return '—';
	}
}

/** Lily-token colour triple for a composite-risk banner. */
export function compositeRiskColor(risk: CompositeRisk): string {
	switch (risk) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-warning text-warning-content border-warning';
		case 'critical':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily-token colour triple for a fired-rule / flag priority badge. */
export function priorityColor(priority: RulePriority | FlagPriority): string {
	switch (priority) {
		case 'low':
			return 'bg-base-300 text-base-content border-base-300';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-warning text-warning-content border-warning';
		case 'critical':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}
