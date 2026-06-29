import type { Severity } from './types';

/** Calculate age (whole years) from a date-of-birth string. */
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

/** Friendly label for a Severity value. */
export function severityLabel(s: Severity): string {
	switch (s) {
		case 'low':
			return 'Low Risk';
		case 'moderate':
			return 'Moderate Risk';
		case 'high':
			return 'High Risk';
		case 'critical':
			return 'Critical Risk';
	}
}

/** Lily token colour triple for a Severity badge / banner. */
export function severityColor(s: Severity): string {
	switch (s) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-warning text-warning-content border-warning';
		case 'critical':
			return 'bg-error text-error-content border-error';
	}
}

/** Lily token colour triple for a flag priority. */
export function priorityColor(priority: 'high' | 'medium' | 'low'): string {
	switch (priority) {
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Friendly label for a care-setting code. */
export function careSettingLabel(value: string): string {
	switch (value) {
		case 'inpatient':
			return 'Inpatient (hospital)';
		case 'outpatient':
			return 'Outpatient clinic';
		case 'community':
			return 'Community / home';
		case 'long-term-care':
			return 'Long-term care / nursing home';
		case 'rehab':
			return 'Rehabilitation unit';
		default:
			return value || '—';
	}
}
