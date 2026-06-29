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

/** REBA risk level label. */
export function rebaRiskLevel(score: number): string {
	if (score <= 1) return 'Negligible risk';
	if (score <= 3) return 'Low risk';
	if (score <= 7) return 'Medium risk';
	if (score <= 10) return 'High risk';
	return 'Very high risk';
}

/** REBA score label with risk level. */
export function rebaScoreLabel(score: number): string {
	const risk = rebaRiskLevel(score);
	return `REBA ${score} - ${risk}`;
}

/** REBA score colour class (Lily token utilities). */
export function rebaScoreColor(score: number): string {
	if (score <= 1) return 'bg-success text-success-content border-success';
	if (score <= 3) return 'bg-info text-info-content border-info';
	if (score <= 7) return 'bg-warning text-warning-content border-warning';
	if (score <= 10) return 'bg-warning text-warning-content border-warning';
	return 'bg-error text-error-content border-error';
}

/** Action level description for a given REBA score. */
export function rebaActionLevel(score: number): string {
	if (score <= 1) return 'No action required';
	if (score <= 3) return 'Action may be necessary';
	if (score <= 7) return 'Action necessary';
	if (score <= 10) return 'Action necessary soon';
	return 'Immediate action required';
}
