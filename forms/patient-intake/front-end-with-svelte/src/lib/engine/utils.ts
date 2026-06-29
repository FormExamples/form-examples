import type { RiskLevel } from './types';

/** Risk level label. */
export function riskLevelLabel(level: RiskLevel): string {
	switch (level) {
		case 'low':
			return 'Low Risk - Healthy, minimal risk factors';
		case 'medium':
			return 'Medium Risk - Controlled chronic conditions, some risk factors';
		case 'high':
			return 'High Risk - Uncontrolled conditions, multiple comorbidities';
		default:
			return `Risk: ${level}`;
	}
}

/** Risk level colour class (Lily tokens). */
export function riskLevelColor(level: RiskLevel): string {
	switch (level) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Short title-cased risk level label for dashboard cells. */
export function riskLevelShort(level: RiskLevel): string {
	switch (level) {
		case 'low':
			return 'Low';
		case 'medium':
			return 'Medium';
		case 'high':
			return 'High';
		default:
			return String(level);
	}
}

/** Calculate age from date of birth string. */
export function calculateAge(dob: string): number | null {
	if (!dob) return null;
	const birth = new Date(dob);
	if (isNaN(birth.getTime())) return null;
	const today = new Date();
	let age = today.getFullYear() - birth.getFullYear();
	const m = today.getMonth() - birth.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
		age--;
	}
	return age;
}
