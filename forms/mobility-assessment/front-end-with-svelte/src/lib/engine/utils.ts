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
 * Tinetti total score category label.
 *   25-28 = Low fall risk
 *   19-24 = Moderate fall risk
 *   0-18  = High fall risk
 */
export function tinettiCategory(score: number): string {
	if (score >= 25) return 'Low fall risk';
	if (score >= 19) return 'Moderate fall risk';
	return 'High fall risk';
}

/** Tinetti score label for display. */
export function tinettiScoreLabel(score: number): string {
	return `Tinetti ${score}/28 - ${tinettiCategory(score)}`;
}

/** Tinetti score colour class. */
export function tinettiScoreColor(score: number): string {
	if (score >= 25) return 'bg-success text-success-content border-success';
	if (score >= 19) return 'bg-warning text-warning-content border-warning';
	return 'bg-error text-error-content border-error';
}

/**
 * TUG (Timed Up and Go) category.
 *   <10s   = Freely mobile
 *   10-14s = Mostly independent
 *   14-20s = Variable mobility
 *   >20s   = Impaired mobility
 */
export function tugCategory(timeSeconds: number | null): string {
	if (timeSeconds === null) return 'Not assessed';
	if (timeSeconds < 10) return 'Freely mobile';
	if (timeSeconds <= 14) return 'Mostly independent';
	if (timeSeconds <= 20) return 'Variable mobility';
	return 'Impaired mobility';
}

/** TUG score colour class. */
export function tugScoreColor(timeSeconds: number | null): string {
	if (timeSeconds === null) return 'bg-base-300 text-base-content border-base-300';
	if (timeSeconds < 10) return 'bg-success text-success-content border-success';
	if (timeSeconds <= 14) return 'bg-info text-info-content border-info';
	if (timeSeconds <= 20) return 'bg-warning text-warning-content border-warning';
	return 'bg-error text-error-content border-error';
}
