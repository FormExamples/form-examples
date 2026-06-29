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
 * Symptom Severity Score category label.
 *   0-5  = Minimal
 *   6-10 = Mild
 *   11-20 = Moderate
 *   21-30 = Severe
 */
export function severityCategory(score: number): string {
	if (score <= 5) return 'Minimal';
	if (score <= 10) return 'Mild';
	if (score <= 20) return 'Moderate';
	return 'Severe';
}

/** Symptom score label for display. */
export function scoreLabel(score: number): string {
	return `Symptom Score ${score}/30 - ${severityCategory(score)}`;
}

/** Symptom score colour class. */
export function scoreColor(score: number): string {
	if (score <= 5) return 'bg-success text-success-content border-success';
	if (score <= 10) return 'bg-info text-info-content border-info';
	if (score <= 20) return 'bg-warning text-warning-content border-warning';
	return 'bg-error text-error-content border-error';
}

/** Menopausal status display label. */
export function menopausalStatusLabel(status: string): string {
	switch (status) {
		case 'pre-menopausal':
			return 'Pre-menopausal';
		case 'peri-menopausal':
			return 'Peri-menopausal';
		case 'post-menopausal':
			return 'Post-menopausal';
		case 'unknown':
			return 'Unknown';
		default:
			return '';
	}
}
