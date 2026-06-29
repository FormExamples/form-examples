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
 * NIHSS score category label.
 *   0     = No stroke symptoms
 *   1-4   = Minor stroke
 *   5-15  = Moderate stroke
 *   16-20 = Moderate to severe stroke
 *   21-42 = Severe stroke
 */
export function nihssCategory(score: number): string {
	if (score === 0) return 'No stroke symptoms';
	if (score <= 4) return 'Minor stroke';
	if (score <= 15) return 'Moderate stroke';
	if (score <= 20) return 'Moderate to severe stroke';
	return 'Severe stroke';
}

/** NIHSS score label for display. */
export function nihssScoreLabel(score: number): string {
	return `NIHSS ${score}/42 - ${nihssCategory(score)}`;
}

/** NIHSS score colour class (Lily design tokens). */
export function nihssScoreColor(score: number): string {
	if (score === 0) return 'bg-success text-success-content border-success';
	if (score <= 4) return 'bg-info text-info-content border-info';
	if (score <= 15) return 'bg-warning text-warning-content border-warning';
	if (score <= 20) return 'bg-warning text-warning-content border-warning';
	return 'bg-error text-error-content border-error';
}

/** Calculate time elapsed from onset. */
export function timeFromOnset(onsetTime: string): string {
	if (!onsetTime) return '';
	const onset = new Date(onsetTime);
	if (isNaN(onset.getTime())) return '';
	const now = new Date();
	const diffMs = now.getTime() - onset.getTime();
	if (diffMs < 0) return '';
	const hours = Math.floor(diffMs / (1000 * 60 * 60));
	const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
	if (hours === 0) return `${minutes}m ago`;
	return `${hours}h ${minutes}m ago`;
}
