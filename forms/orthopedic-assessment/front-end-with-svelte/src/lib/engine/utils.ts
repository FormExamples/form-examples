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
 * DASH score category label.
 *   0-20  = No disability
 *   21-40 = Mild disability
 *   41-60 = Moderate disability
 *   61-80 = Severe disability
 *   81-100 = Very severe disability
 */
export function dashCategory(score: number): string {
	if (score <= 20) return 'No disability';
	if (score <= 40) return 'Mild disability';
	if (score <= 60) return 'Moderate disability';
	if (score <= 80) return 'Severe disability';
	return 'Very severe disability';
}

/** DASH score label for display. */
export function dashScoreLabel(score: number): string {
	return `DASH ${score}/100 - ${dashCategory(score)}`;
}

/** DASH score colour class. */
export function dashScoreColor(score: number): string {
	if (score <= 20) return 'bg-success text-success-content border-success';
	if (score <= 40) return 'bg-info text-info-content border-info';
	if (score <= 60) return 'bg-warning text-warning-content border-warning';
	if (score <= 80) return 'bg-warning text-warning-content border-warning';
	return 'bg-error text-error-content border-error';
}

/** Side label for display. */
export function sideLabel(side: string): string {
	switch (side) {
		case 'left':
			return 'Left';
		case 'right':
			return 'Right';
		case 'bilateral':
			return 'Bilateral';
		default:
			return '';
	}
}

/** Onset type label for display. */
export function onsetTypeLabel(onset: string): string {
	switch (onset) {
		case 'acute':
			return 'Acute';
		case 'gradual':
			return 'Gradual';
		case 'traumatic':
			return 'Traumatic';
		case 'overuse':
			return 'Overuse';
		default:
			return '';
	}
}
