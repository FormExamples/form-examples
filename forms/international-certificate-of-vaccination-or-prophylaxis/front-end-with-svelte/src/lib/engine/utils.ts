import type { Disease, Severity } from './types';

/** Overall validity status derived from the validation report. */
export type ValidityStatus = 'valid' | 'invalid';

/** Human-readable label for a disease code. */
export function diseaseLabel(disease: Disease | string): string {
	switch (disease) {
		case 'yellow-fever':
			return 'Yellow fever';
		case 'polio':
			return 'Polio';
		case 'smallpox':
			return 'Smallpox';
		case 'cholera':
			return 'Cholera';
		case 'meningococcal':
			return 'Meningococcal';
		case 'covid-19':
			return 'COVID-19';
		case 'other':
			return 'Other';
		default:
			return '—';
	}
}

/** Human-readable label for the overall certificate validity. */
export function validityStatusLabel(status: ValidityStatus): string {
	return status === 'valid' ? 'Valid' : 'Invalid';
}

/** Lily-token colour triple for the overall certificate validity. */
export function validityStatusColor(status: ValidityStatus): string {
	return status === 'valid'
		? 'bg-success text-success-content border-success'
		: 'bg-error text-error-content border-error';
}

/** Human-readable label for a fired-rule severity. */
export function severityLabel(severity: Severity): string {
	switch (severity) {
		case 'error':
			return 'Error';
		case 'warning':
			return 'Warning';
		case 'info':
			return 'Info';
	}
}

/** Lily-token colour triple for a fired-rule severity. */
export function severityColor(severity: Severity): string {
	switch (severity) {
		case 'error':
			return 'bg-error text-error-content border-error';
		case 'warning':
			return 'bg-warning text-warning-content border-warning';
		case 'info':
			return 'bg-info text-info-content border-info';
	}
}

/** Derive the overall validity status from a list of fired-rule severities. */
export function overallValidityStatus(overallValid: boolean): ValidityStatus {
	return overallValid ? 'valid' : 'invalid';
}

/** Calculate age in whole years from a date-of-birth string. */
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
