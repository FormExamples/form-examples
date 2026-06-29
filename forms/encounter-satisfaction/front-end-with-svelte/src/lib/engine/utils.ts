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
 * Satisfaction score category.
 *   4.5 - 5.0 = Excellent
 *   3.5 - 4.4 = Good
 *   2.5 - 3.4 = Fair
 *   1.5 - 2.4 = Poor
 *   1.0 - 1.4 = Very Poor
 */
export function satisfactionCategory(score: number): string {
	if (score >= 4.5) return 'Excellent';
	if (score >= 3.5) return 'Good';
	if (score >= 2.5) return 'Fair';
	if (score >= 1.5) return 'Poor';
	return 'Very Poor';
}

/** Satisfaction score label for display. */
export function satisfactionScoreLabel(score: number): string {
	return `${score.toFixed(1)}/5.0 - ${satisfactionCategory(score)}`;
}

/** Satisfaction score colour class, mapped to Lily Design System tokens. */
export function satisfactionScoreColor(score: number): string {
	if (score >= 4.5) return 'bg-success text-success-content border-success';
	if (score >= 3.5) return 'bg-info text-info-content border-info';
	if (score >= 2.5) return 'bg-warning text-warning-content border-warning';
	if (score >= 1.5) return 'bg-warning text-warning-content border-warning';
	return 'bg-error text-error-content border-error';
}
