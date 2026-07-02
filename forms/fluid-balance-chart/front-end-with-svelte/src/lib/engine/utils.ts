import type { Category, ClinicianRole, Direction, FluidStatus, Priority } from './types';

/** Intake category values, in display order. */
export const INTAKE_CATEGORIES: Category[] = [
	'oral',
	'iv',
	'enteral',
	'blood-products',
	'other-intake'
];

/** Output category values, in display order. */
export const OUTPUT_CATEGORIES: Category[] = [
	'urine',
	'drains',
	'vomit-ng',
	'stool',
	'insensible-other'
];

/** Charting-clinician role label. */
export function clinicianRoleLabel(role: ClinicianRole): string {
	switch (role) {
		case 'nurse':
			return 'Nurse';
		case 'doctor':
			return 'Doctor';
		case 'healthcare-assistant':
			return 'Healthcare assistant';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Direction label. */
export function directionLabel(direction: Direction | ''): string {
	switch (direction) {
		case 'intake':
			return 'Intake';
		case 'output':
			return 'Output';
		default:
			return '';
	}
}

/** Fluid category label (covers both intake and output categories). */
export function categoryLabel(category: Category): string {
	switch (category) {
		case 'oral':
			return 'Oral';
		case 'iv':
			return 'Intravenous (IV)';
		case 'enteral':
			return 'Enteral';
		case 'blood-products':
			return 'Blood / products';
		case 'other-intake':
			return 'Other intake';
		case 'urine':
			return 'Urine';
		case 'drains':
			return 'Drains';
		case 'vomit-ng':
			return 'Vomit / NG';
		case 'stool':
			return 'Stool';
		case 'insensible-other':
			return 'Insensible / other';
		default:
			return '';
	}
}

/** Fluid-status label for display. */
export function fluidStatusLabel(status: FluidStatus): string {
	switch (status) {
		case 'balanced':
			return 'Balanced';
		case 'positive':
			return 'Positive';
		case 'negative':
			return 'Negative';
		case 'oliguria':
			return 'Oliguria';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the fluid-status badge/banner.
 * Balanced → success; Positive/Negative → warning; Oliguria → error.
 */
export function fluidStatusColor(status: FluidStatus): string {
	switch (status) {
		case 'balanced':
			return 'bg-success text-success-content border-success';
		case 'positive':
			return 'bg-warning text-warning-content border-warning';
		case 'negative':
			return 'bg-warning text-warning-content border-warning';
		case 'oliguria':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily-token colour utility classes for a flag priority. */
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

/** Flag-priority label. */
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

/** Format a signed millilitre value (e.g. +150 mL, -1400 mL). */
export function formatSignedMl(n: number): string {
	return `${n >= 0 ? '+' : ''}${n} mL`;
}
