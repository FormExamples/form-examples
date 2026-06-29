import type { SeverityLevel } from './types';

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

/** Severity level label for display. */
export function severityLabel(level: string): string {
	switch (level) {
		case 'minimal':
			return 'Minimal';
		case 'mild':
			return 'Mild';
		case 'moderate':
			return 'Moderate';
		case 'moderately-severe':
			return 'Moderately Severe';
		case 'severe':
			return 'Severe';
		default:
			return level;
	}
}

/** Severity level colour class, mapped to Lily Design System tokens. */
export function severityColor(level: string): string {
	switch (level) {
		case 'minimal':
			return 'bg-success text-success-content border-success';
		case 'mild':
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'moderately-severe':
		case 'severe':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** PHQ-9 score colour class, mapped to Lily Design System tokens. */
export function phq9ScoreColor(score: number): string {
	if (score <= 4) return 'bg-success text-success-content border-success';
	if (score <= 9) return 'bg-warning text-warning-content border-warning';
	if (score <= 14) return 'bg-warning text-warning-content border-warning';
	return 'bg-error text-error-content border-error';
}

/** GAD-7 score colour class, mapped to Lily Design System tokens. */
export function gad7ScoreColor(score: number): string {
	if (score <= 4) return 'bg-success text-success-content border-success';
	if (score <= 9) return 'bg-warning text-warning-content border-warning';
	if (score <= 14) return 'bg-warning text-warning-content border-warning';
	return 'bg-error text-error-content border-error';
}

/** Map PHQ-9 score to severity level for use in severity-based display. */
export function phq9SeverityFromScore(score: number): SeverityLevel {
	if (score <= 4) return 'minimal';
	if (score <= 9) return 'mild';
	if (score <= 14) return 'moderate';
	if (score <= 19) return 'moderately-severe';
	return 'severe';
}

/** Map GAD-7 score to severity level for use in severity-based display. */
export function gad7SeverityFromScore(score: number): SeverityLevel {
	if (score <= 4) return 'minimal';
	if (score <= 9) return 'mild';
	if (score <= 14) return 'moderate';
	return 'severe';
}
