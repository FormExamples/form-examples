import type { RiskLevel } from './types';

/** Friendly label for a genetic RiskLevel. */
export function riskLevelLabel(level: RiskLevel): string {
	switch (level) {
		case 'low':
			return 'Low Risk';
		case 'moderate':
			return 'Moderate Risk';
		case 'high':
			return 'High Risk';
		default:
			return 'Not classified';
	}
}

/** Lily-token colour class for a risk-level banner / badge. */
export function riskLevelColor(level: RiskLevel): string {
	switch (level) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Friendly label for a fired-rule severity. */
export function severityLabel(sev: RiskLevel): string {
	switch (sev) {
		case 'low':
			return 'Low';
		case 'moderate':
			return 'Moderate';
		case 'high':
			return 'High';
		default:
			return '';
	}
}

/** Lily-token colour class for a fired-rule severity badge. */
export function severityColor(sev: RiskLevel): string {
	switch (sev) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily-token colour class for an additional-flag priority. */
export function priorityColor(priority: 'high' | 'medium' | 'low'): string {
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

/** Order risk-level severities so the highest contributing rule wins. */
export function maxRiskLevel(a: RiskLevel, b: RiskLevel): RiskLevel {
	const order: Record<RiskLevel, number> = { '': 0, low: 1, moderate: 2, high: 3 };
	return order[a] >= order[b] ? a : b;
}

/** Calculate age (whole years) from a date-of-birth ISO string. */
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
