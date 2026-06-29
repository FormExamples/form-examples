/** NIHSS severity label based on total score. */
export function nihssSeverityLabel(score: number): string {
	if (score === 0) return 'No stroke symptoms';
	if (score <= 4) return 'Minor stroke';
	if (score <= 15) return 'Moderate stroke';
	if (score <= 20) return 'Moderate to severe stroke';
	return 'Severe stroke';
}

/** NIHSS severity colour class (Lily Design System tokens). */
export function nihssSeverityColor(score: number): string {
	if (score === 0) return 'bg-success text-success-content border-success';
	if (score <= 4) return 'bg-warning text-warning-content border-warning';
	if (score <= 15) return 'bg-warning text-warning-content border-warning';
	if (score <= 20) return 'bg-error text-error-content border-error';
	return 'bg-error text-error-content border-error';
}

/** Modified Rankin Scale (mRS) label. */
export function mrsLabel(score: number | null): string {
	if (score === null) return '';
	switch (score) {
		case 0:
			return 'mRS 0 - No symptoms';
		case 1:
			return 'mRS 1 - No significant disability';
		case 2:
			return 'mRS 2 - Slight disability';
		case 3:
			return 'mRS 3 - Moderate disability';
		case 4:
			return 'mRS 4 - Moderately severe disability';
		case 5:
			return 'mRS 5 - Severe disability';
		default:
			return `mRS ${score}`;
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
