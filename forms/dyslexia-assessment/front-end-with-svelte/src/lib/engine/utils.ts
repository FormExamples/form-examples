import type { Severity } from './types';

/**
 * Classify a single standardised score (mean 100, SD 15) into a severity band.
 * - 85+         → 'none'    (average or above)
 * - 70-84       → 'mild'    (below average)
 * - 55-69       → 'moderate'(well below average)
 * - <55         → 'severe'  (significantly below average)
 */
export function scoreSeverity(score: number | null | undefined): Severity {
	if (score === null || score === undefined || Number.isNaN(score)) return 'none';
	if (score >= 85) return 'none';
	if (score >= 70) return 'mild';
	if (score >= 55) return 'moderate';
	return 'severe';
}

/** Friendly standardised-score band label. */
export function scoreBandLabel(score: number | null | undefined): string {
	if (score === null || score === undefined || Number.isNaN(score)) return '';
	if (score >= 116) return 'Above average';
	if (score >= 85) return 'Average';
	if (score >= 70) return 'Below average';
	if (score >= 55) return 'Well below average';
	return 'Significantly below average';
}

/** Friendly label for an overall severity band. */
export function severityLabel(severity: Severity): string {
	switch (severity) {
		case 'none':
			return 'No dyslexia';
		case 'mild':
			return 'Mild dyslexia';
		case 'moderate':
			return 'Moderate dyslexia';
		case 'severe':
			return 'Severe dyslexia';
		default:
			return '';
	}
}

/** Lily token colour triple for a severity badge / banner. */
export function severityColor(severity: Severity): string {
	switch (severity) {
		case 'none':
			return 'bg-success text-success-content border-success';
		case 'mild':
			return 'bg-warning text-warning-content border-warning';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'severe':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Pick the most-severe of two severities. */
export function maxSeverity(a: Severity, b: Severity): Severity {
	const order: Record<Severity, number> = { none: 0, mild: 1, moderate: 2, severe: 3 };
	return order[a] >= order[b] ? a : b;
}

/** Calculate age from a date-of-birth string. Returns null if invalid. */
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
