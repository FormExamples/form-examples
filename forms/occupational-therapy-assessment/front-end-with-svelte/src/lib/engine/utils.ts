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
 * COPM performance/satisfaction category label.
 *   < 5  = Significant issues
 *   5-7  = Moderate concerns
 *   > 7  = Good performance / satisfaction
 */
export function copmPerformanceCategory(score: number): string {
	if (score < 5) return 'Significant issues';
	if (score <= 7) return 'Moderate concerns';
	return 'Good performance';
}

/** COPM score label for display. */
export function copmScoreLabel(score: number, type: 'Performance' | 'Satisfaction'): string {
	return `COPM ${type} ${score}/10 - ${copmPerformanceCategory(score)}`;
}

/** COPM score colour class. */
export function copmScoreColor(score: number): string {
	if (score > 7) return 'bg-success text-success-content border-success';
	if (score >= 5) return 'bg-warning text-warning-content border-warning';
	return 'bg-error text-error-content border-error';
}

/** Difficulty level label. */
export function difficultyLabel(difficulty: string): string {
	switch (difficulty) {
		case 'none':
			return 'No difficulty';
		case 'some':
			return 'Some difficulty';
		case 'significant':
			return 'Significant difficulty';
		case 'unable':
			return 'Unable to perform';
		default:
			return '';
	}
}

/** Difficulty level colour class. */
export function difficultyColor(difficulty: string): string {
	switch (difficulty) {
		case 'none':
			return 'bg-success text-success-content';
		case 'some':
			return 'bg-warning text-warning-content';
		case 'significant':
			return 'bg-warning text-warning-content';
		case 'unable':
			return 'bg-error text-error-content';
		default:
			return 'bg-base-300 text-base-content';
	}
}
