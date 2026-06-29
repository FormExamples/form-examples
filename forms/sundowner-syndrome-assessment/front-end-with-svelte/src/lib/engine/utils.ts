import type { Severity } from './types';

/** Classify a CMAI total (29-203) into a severity band. */
export function severityFromCMAI(cmai: number): Severity {
	if (cmai > 120) return 'critical';
	if (cmai >= 76) return 'severe';
	if (cmai >= 46) return 'moderate';
	return 'mild';
}

/** Friendly label for a Severity band. */
export function severityLabel(s: Severity): string {
	switch (s) {
		case 'mild':
			return 'Mild';
		case 'moderate':
			return 'Moderate';
		case 'severe':
			return 'Severe';
		case 'critical':
			return 'Critical';
	}
}

/** A short clinical description of the severity band. */
export function severityDescription(s: Severity): string {
	switch (s) {
		case 'mild':
			return 'Occasional restlessness, redirectable (CMAI 29-45)';
		case 'moderate':
			return 'Daily episodes, requires intervention (CMAI 46-75)';
		case 'severe':
			return 'Aggressive behaviour, safety risk (CMAI 76-120)';
		case 'critical':
			return 'Self-harm risk, requires constant supervision (CMAI >120)';
	}
}

/** Lily-token colour triple for a severity badge / banner. */
export function severityColor(s: Severity): string {
	switch (s) {
		case 'mild':
			return 'bg-success text-success-content border-success';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'severe':
			return 'bg-warning text-warning-content border-warning';
		case 'critical':
			return 'bg-error text-error-content border-error';
	}
}

/** Human-readable band label for an NPI total (0-144). */
export function npiBandLabel(npi: number): string {
	if (npi >= 48) return 'Markedly elevated';
	if (npi >= 24) return 'Moderately elevated';
	if (npi >= 12) return 'Mildly elevated';
	return 'Within normal limits';
}

/** Calculate age (years) from a date-of-birth string. */
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
