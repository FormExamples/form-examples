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
 * MMSE score category label.
 *   24-30 = Normal cognition
 *   18-23 = Mild cognitive impairment
 *   10-17 = Moderate cognitive impairment
 *    0-9  = Severe cognitive impairment
 */
export function mmseCategory(score: number): string {
	if (score >= 24) return 'Normal cognition';
	if (score >= 18) return 'Mild cognitive impairment';
	if (score >= 10) return 'Moderate cognitive impairment';
	return 'Severe cognitive impairment';
}

/** MMSE score label for display. */
export function mmseScoreLabel(score: number): string {
	return `MMSE ${score}/30 - ${mmseCategory(score)}`;
}

/** MMSE score colour class (Lily design-system tokens). */
export function mmseScoreColor(score: number): string {
	if (score >= 24) return 'bg-success text-success-content border-success';
	if (score >= 18) return 'bg-warning text-warning-content border-warning';
	if (score >= 10) return 'bg-warning text-warning-content border-warning';
	return 'bg-error text-error-content border-error';
}

/** Referral source label. */
export function referralSourceLabel(source: string): string {
	switch (source) {
		case 'gp':
			return 'GP';
		case 'neurologist':
			return 'Neurologist';
		case 'psychiatrist':
			return 'Psychiatrist';
		case 'geriatrician':
			return 'Geriatrician';
		case 'self':
			return 'Self';
		case 'family':
			return 'Family';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Referral reason label. */
export function referralReasonLabel(reason: string): string {
	switch (reason) {
		case 'memory-concern':
			return 'Memory concern';
		case 'confusion':
			return 'Confusion';
		case 'behavioural-change':
			return 'Behavioural change';
		case 'functional-decline':
			return 'Functional decline';
		case 'screening':
			return 'Screening';
		case 'follow-up':
			return 'Follow-up';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Education level label. */
export function educationLabel(level: string): string {
	switch (level) {
		case 'none':
			return 'No formal education';
		case 'primary':
			return 'Primary school';
		case 'secondary':
			return 'Secondary school';
		case 'university':
			return 'University/College';
		case 'postgraduate':
			return 'Postgraduate';
		default:
			return '';
	}
}

/** ADL independence label. */
export function adlLabel(level: string): string {
	switch (level) {
		case 'independent':
			return 'Independent';
		case 'needs-some-help':
			return 'Needs some help';
		case 'needs-significant-help':
			return 'Needs significant help';
		case 'fully-dependent':
			return 'Fully dependent';
		default:
			return '';
	}
}
