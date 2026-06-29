import type { SatisfactionCategory } from './types';

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

/**
 * Normalize an array of Likert scores (1-5) to a 0-100 scale.
 * Ignores null values. Returns null if no valid scores.
 */
export function normalizeLikertScores(scores: (number | null)[]): number | null {
	const valid = scores.filter((s): s is number => s !== null && s >= 1 && s <= 5);
	if (valid.length === 0) return null;
	const sum = valid.reduce((a, b) => a + b, 0);
	const maxPossible = valid.length * 5;
	return Math.round((sum / maxPossible) * 100 * 10) / 10;
}

/** Get satisfaction category from normalized score. */
export function categorizeScore(score: number): SatisfactionCategory {
	if (score >= 85) return 'excellent';
	if (score >= 70) return 'good';
	if (score >= 50) return 'satisfactory';
	if (score >= 25) return 'poor';
	return 'very-poor';
}

/** Satisfaction category label. */
export function satisfactionCategoryLabel(category: SatisfactionCategory): string {
	switch (category) {
		case 'excellent':
			return 'Excellent';
		case 'good':
			return 'Good';
		case 'satisfactory':
			return 'Satisfactory';
		case 'poor':
			return 'Poor';
		case 'very-poor':
			return 'Very Poor';
	}
}

/** Satisfaction category colour class (Lily semantic tokens). */
export function satisfactionCategoryColor(category: SatisfactionCategory): string {
	switch (category) {
		case 'excellent':
			return 'bg-success text-success-content border-success';
		case 'good':
			return 'bg-info text-info-content border-info';
		case 'satisfactory':
			return 'bg-warning text-warning-content border-warning';
		case 'poor':
			return 'bg-warning text-warning-content border-warning';
		case 'very-poor':
			return 'bg-error text-error-content border-error';
	}
}

/** Score colour class based on normalized score (Lily semantic tokens). */
export function scoreColor(score: number | null): string {
	if (score === null) return 'bg-base-300 text-base-content border-base-300';
	if (score >= 85) return 'bg-success text-success-content border-success';
	if (score >= 70) return 'bg-info text-info-content border-info';
	if (score >= 50) return 'bg-warning text-warning-content border-warning';
	if (score >= 25) return 'bg-warning text-warning-content border-warning';
	return 'bg-error text-error-content border-error';
}

/** Severity label for grading badge. */
export function severityLabel(severity: number): string {
	switch (severity) {
		case 1:
			return 'Minor';
		case 2:
			return 'Moderate';
		case 3:
			return 'Significant';
		case 4:
			return 'Critical';
		default:
			return `Level ${severity}`;
	}
}

/** Severity colour class for grading badge (Lily semantic tokens). */
export function severityColor(severity: number): string {
	switch (severity) {
		case 1:
			return 'bg-success text-success-content border-success';
		case 2:
			return 'bg-warning text-warning-content border-warning';
		case 3:
			return 'bg-warning text-warning-content border-warning';
		case 4:
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Likert score label. */
export function likertLabel(score: number | null): string {
	if (score === null) return 'Not Rated';
	switch (score) {
		case 1:
			return 'Very Dissatisfied';
		case 2:
			return 'Dissatisfied';
		case 3:
			return 'Neutral';
		case 4:
			return 'Satisfied';
		case 5:
			return 'Very Satisfied';
		default:
			return `${score}/5`;
	}
}
